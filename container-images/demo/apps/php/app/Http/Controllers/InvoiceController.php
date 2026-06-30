<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Show the invoice builder UI.
     */
    public function form()
    {
        return view('invoice.form');
    }

    /**
     * Render the invoice as a downloadable PDF (or inline HTML preview).
     *
     * This endpoint is fully stateless: it takes the posted invoice data,
     * renders a Blade template, and streams back a PDF. Nothing is persisted,
     * which makes it a clean fit for a serverless container.
     */
    public function generate(Request $request)
    {
        $data = $this->invoiceData($request);

        // ?preview=1 returns the rendered HTML so the UI can show a live preview.
        if ($request->boolean('preview')) {
            return view('invoice.document', $data);
        }

        $pdf = Pdf::loadView('invoice.document', $data)->setPaper('a4');

        $number = preg_replace('/[^A-Za-z0-9_-]/', '', $data['invoice']['number'] ?: 'invoice');

        return $pdf->download("invoice-{$number}.pdf");
    }

    /**
     * Normalize and validate the posted invoice payload.
     */
    private function invoiceData(Request $request): array
    {
        // Number inputs in locales that use a decimal comma (e.g. "8,5") submit
        // the comma form. Normalize numeric fields to a dot before validating.
        $normalizeNumber = function ($v) {
            if (is_string($v) && $v !== '') {
                return str_replace(',', '.', $v);
            }
            return $v;
        };

        $items = $request->input('items', []);
        if (is_array($items)) {
            foreach ($items as $i => $row) {
                if (isset($row['qty'])) {
                    $items[$i]['qty'] = $normalizeNumber($row['qty']);
                }
                if (isset($row['price'])) {
                    $items[$i]['price'] = $normalizeNumber($row['price']);
                }
            }
        }
        $request->merge([
            'tax'   => $normalizeNumber($request->input('tax')),
            'items' => $items,
        ]);

        $validated = $request->validate([
            'from'             => 'nullable|string|max:500',
            'to'               => 'nullable|string|max:500',
            'number'           => 'nullable|string|max:60',
            'date'             => 'nullable|string|max:40',
            'due'              => 'nullable|string|max:40',
            'currency'         => 'nullable|string|max:5',
            'notes'            => 'nullable|string|max:1000',
            'tax'              => 'nullable|numeric|min:0|max:100',
            'items'            => 'nullable|array|max:50',
            'items.*.desc'     => 'nullable|string|max:200',
            'items.*.qty'      => 'nullable|numeric|min:0',
            'items.*.price'    => 'nullable|numeric|min:0',
        ]);

        $currency = $validated['currency'] ?? '$';
        $taxRate = (float) ($validated['tax'] ?? 0);

        $items = [];
        $subtotal = 0.0;
        foreach ($validated['items'] ?? [] as $row) {
            $desc = trim($row['desc'] ?? '');
            if ($desc === '') {
                continue;
            }
            $qty = (float) ($row['qty'] ?? 0);
            $price = (float) ($row['price'] ?? 0);
            $lineTotal = $qty * $price;
            $subtotal += $lineTotal;
            $items[] = [
                'desc'  => $desc,
                'qty'   => $qty,
                'price' => $price,
                'total' => $lineTotal,
            ];
        }

        $taxAmount = $subtotal * ($taxRate / 100);
        $total = $subtotal + $taxAmount;

        return [
            'invoice' => [
                'from'     => $validated['from'] ?? '',
                'to'       => $validated['to'] ?? '',
                'number'   => $validated['number'] ?? '0001',
                'date'     => $validated['date'] ?? date('Y-m-d'),
                'due'      => $validated['due'] ?? '',
                'currency' => $currency,
                'notes'    => $validated['notes'] ?? '',
                'taxRate'  => $taxRate,
            ],
            'items'     => $items,
            'subtotal'  => $subtotal,
            'taxAmount' => $taxAmount,
            'total'     => $total,
        ];
    }
}
