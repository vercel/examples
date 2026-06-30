<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: DejaVu Sans, Helvetica, Arial, sans-serif;
        color: #18181b;
        margin: 0;
        padding: 40px;
        font-size: 13px;
        line-height: 1.5;
      }
      .header { width: 100%; margin-bottom: 36px; }
      .header td { vertical-align: top; }
      .title { font-size: 30px; font-weight: bold; letter-spacing: -0.5px; }
      .muted { color: #71717a; }
      .meta { text-align: right; }
      .meta strong { display: inline-block; min-width: 70px; text-align: left; color: #71717a; font-weight: normal; }
      .parties { width: 100%; margin-bottom: 28px; }
      .parties td { vertical-align: top; width: 50%; }
      .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; margin-bottom: 4px; }
      .addr { white-space: pre-line; }
      table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      table.items th {
        text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
        color: #a1a1aa; border-bottom: 2px solid #18181b; padding: 8px 6px;
      }
      table.items th.num, table.items td.num { text-align: right; }
      table.items td { padding: 9px 6px; border-bottom: 1px solid #e4e4e7; }
      .totals { width: 100%; }
      .totals td { padding: 4px 6px; }
      .totals .t-label { text-align: right; color: #71717a; }
      .totals .t-val { text-align: right; width: 120px; }
      .totals .grand td { font-size: 16px; font-weight: bold; border-top: 2px solid #18181b; padding-top: 10px; }
      .notes { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e4e4e7; color: #52525b; }
      .badge { display: inline-block; background: #18181b; color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 11px; }
    </style>
  </head>
  <body>
    @php($c = $invoice['currency'])
    @php($money = fn ($n) => $c . number_format($n, 2))

    <table class="header">
      <tr>
        <td>
          <div class="title">Invoice</div>
          <div class="muted">#{{ $invoice['number'] }}</div>
        </td>
        <td class="meta">
          <div><strong>Date</strong> {{ $invoice['date'] }}</div>
          @if ($invoice['due'])
            <div><strong>Due</strong> {{ $invoice['due'] }}</div>
          @endif
          <div style="margin-top:8px"><span class="badge">{{ $money($total) }}</span></div>
        </td>
      </tr>
    </table>

    <table class="parties">
      <tr>
        <td>
          <div class="label">From</div>
          <div class="addr">{{ $invoice['from'] }}</div>
        </td>
        <td>
          <div class="label">Bill to</div>
          <div class="addr">{{ $invoice['to'] }}</div>
        </td>
      </tr>
    </table>

    <table class="items">
      <thead>
        <tr>
          <th>Description</th>
          <th class="num">Qty</th>
          <th class="num">Unit price</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        @forelse ($items as $item)
          <tr>
            <td>{{ $item['desc'] }}</td>
            <td class="num">{{ rtrim(rtrim(number_format($item['qty'], 2), '0'), '.') }}</td>
            <td class="num">{{ $money($item['price']) }}</td>
            <td class="num">{{ $money($item['total']) }}</td>
          </tr>
        @empty
          <tr><td colspan="4" class="muted">No line items.</td></tr>
        @endforelse
      </tbody>
    </table>

    <table class="totals">
      <tr>
        <td class="t-label">Subtotal</td>
        <td class="t-val">{{ $money($subtotal) }}</td>
      </tr>
      @if ($invoice['taxRate'] > 0)
        <tr>
          <td class="t-label">Tax ({{ rtrim(rtrim(number_format($invoice['taxRate'], 2), '0'), '.') }}%)</td>
          <td class="t-val">{{ $money($taxAmount) }}</td>
        </tr>
      @endif
      <tr class="grand">
        <td class="t-label">Total</td>
        <td class="t-val">{{ $money($total) }}</td>
      </tr>
    </table>

    @if ($invoice['notes'])
      <div class="notes">{{ $invoice['notes'] }}</div>
    @endif
  </body>
</html>
