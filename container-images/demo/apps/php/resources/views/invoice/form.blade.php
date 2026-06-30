<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" href="/icon.png" />
    <link rel="apple-touch-icon" href="/apple-icon.png" />
    <title>PHP · /php</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #09090b; --bg-elev: #0c0c0e; --card: #0e0e11;
        --border: #1f1f23; --border-hover: #2e2e35;
        --fg: #fafafa; --muted: #a1a1aa; --subtle: #71717a;
        --accent: #777bb4; --radius: 12px;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0; min-height: 100vh; background: var(--bg); color: var(--fg);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased; display: flex; justify-content: center; padding: 2.5rem 1.5rem;
        background-image:
          radial-gradient(55rem 55rem at 50% -18rem, rgba(119, 123, 180, 0.1), transparent 70%),
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0);
        background-size: auto, 22px 22px;
      }
      main { width: min(1000px, 100%); }
      .back { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--subtle); text-decoration: none; font-size: 0.8rem; margin-bottom: 1.75rem; }
      .back:hover { color: var(--fg); }
      .head { display: flex; align-items: center; gap: 0.85rem; margin: 0.85rem 0; }
      .icon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-elev); }
      .icon svg { width: 24px; height: 24px; fill: var(--fg); }
      h1 { margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; }
      p.sub { margin: 0 0 1.5rem; color: var(--muted); font-size: 0.95rem; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      @media (max-width: 820px) { .grid { grid-template-columns: 1fr; } }
      .panel { border: 1px solid var(--border); border-radius: var(--radius); background: var(--card); padding: 1.25rem; }
      label.lbl { display: block; font-size: 0.72rem; color: var(--subtle); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.4rem; }
      .field { margin-bottom: 0.9rem; }
      .two { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      input, textarea {
        font: inherit; padding: 0.55rem 0.75rem; border-radius: 8px;
        border: 1px solid var(--border); background: var(--bg-elev); color: var(--fg); width: 100%;
      }
      textarea { resize: vertical; min-height: 64px; }
      input:focus, textarea:focus { outline: none; border-color: var(--border-hover); }
      table { width: 100%; border-collapse: collapse; margin-bottom: 0.6rem; }
      th { text-align: left; font-size: 0.7rem; color: var(--subtle); text-transform: uppercase; letter-spacing: 0.05em; padding: 0 0.4rem 0.4rem; font-weight: 500; }
      td { padding: 0.2rem 0.3rem; }
      td input { padding: 0.45rem 0.6rem; }
      .col-qty, .col-price { width: 90px; }
      .btn {
        font: inherit; font-weight: 600; cursor: pointer; text-align: center;
        padding: 0.6rem 0.9rem; border-radius: 9px; border: 1px solid var(--border);
        background: var(--bg-elev); color: var(--fg);
      }
      .btn:hover { border-color: var(--border-hover); }
      .btn.primary { background: var(--fg); color: #09090b; border: none; }
      .btn.primary:hover { opacity: 0.9; }
      .row-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
      .preview-box { width: 100%; aspect-ratio: 210 / 297; background: #fff; border-radius: 9px; border: 1px solid var(--border); overflow: hidden; }
      .preview-box iframe { width: 100%; height: 100%; border: 0; display: block; background: #fff; }
      .link { background: none; border: none; color: var(--accent); cursor: pointer; font: inherit; padding: 0; }
    </style>
  </head>
  <body>
    <main>
      <a class="back" href="/">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
        All services
      </a>
      <div class="head">
        <span class="icon">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Laravel</title><path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.327l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 01.024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 01.375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.226-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.04-.01-.011-.021-.02-.028-.033h-.001c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 01-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087l-1.58-.907v4.283l2.182 1.256 1.58.908zm-7.755 9.504l5.51-3.147 2.756-1.572-3.757-2.163-4.323 2.49-3.941 2.27z"/></svg>
        </span>
        <h1>Invoice generator</h1>
      </div>
      <p class="sub">A Laravel app rendering Blade templates to PDF with dompdf. Stateless: fill the form, get a PDF. Nothing is stored.</p>

      <form id="invoice-form" method="POST" action="/php/generate" autocomplete="off">
        @csrf
        <div class="grid">
          <section class="panel">
            <div class="two">
              <div class="field">
                <label class="lbl">From</label>
                <textarea name="from" placeholder="Your Company&#10;123 Street&#10;City">Acme Inc.
123 Market St
San Francisco, CA</textarea>
              </div>
              <div class="field">
                <label class="lbl">Bill to</label>
                <textarea name="to" placeholder="Client&#10;Address">Globex LLC
456 Industrial Ave
New York, NY</textarea>
              </div>
            </div>
            <div class="two">
              <div class="field"><label class="lbl">Invoice #</label><input name="number" value="0001" /></div>
              <div class="field"><label class="lbl">Currency</label><input name="currency" value="$" /></div>
            </div>
            <div class="two">
              <div class="field"><label class="lbl">Date</label><input name="date" value="{{ date('Y-m-d') }}" /></div>
              <div class="field"><label class="lbl">Due date</label><input name="due" value="" placeholder="Net 30" /></div>
            </div>

            <label class="lbl">Items</label>
            <table>
              <thead>
                <tr><th>Description</th><th class="col-qty">Qty</th><th class="col-price">Price</th></tr>
              </thead>
              <tbody id="items">
                <tr>
                  <td><input name="items[0][desc]" value="Design work" /></td>
                  <td><input class="col-qty" name="items[0][qty]" type="text" inputmode="decimal" value="10" /></td>
                  <td><input class="col-price" name="items[0][price]" type="text" inputmode="decimal" value="120" /></td>
                </tr>
                <tr>
                  <td><input name="items[1][desc]" value="Development" /></td>
                  <td><input class="col-qty" name="items[1][qty]" type="text" inputmode="decimal" value="20" /></td>
                  <td><input class="col-price" name="items[1][price]" type="text" inputmode="decimal" value="150" /></td>
                </tr>
              </tbody>
            </table>
            <button type="button" class="link" id="add-item">+ Add item</button>

            <div class="two" style="margin-top:0.9rem">
              <div class="field"><label class="lbl">Tax %</label><input name="tax" type="text" inputmode="decimal" value="8.5" /></div>
            </div>
            <div class="field"><label class="lbl">Notes</label><textarea name="notes" placeholder="Thank you for your business.">Thank you for your business.</textarea></div>

            <div class="row-actions">
              <button type="submit" class="btn primary" style="flex:1">Download PDF</button>
              <button type="button" class="btn" id="refresh">Refresh preview</button>
            </div>
          </section>

          <section class="panel">
            <label class="lbl">Live preview</label>
            <div class="preview-box"><iframe id="preview" name="preview"></iframe></div>
          </section>
        </div>
      </form>

      <script>
        const form = document.getElementById("invoice-form");
        const preview = document.getElementById("preview");
        const itemsBody = document.getElementById("items");
        let itemIndex = 2;

        document.getElementById("add-item").addEventListener("click", () => {
          const tr = document.createElement("tr");
          tr.innerHTML =
            '<td><input name="items[' + itemIndex + '][desc]" /></td>' +
            '<td><input class="col-qty" name="items[' + itemIndex + '][qty]" type="text" inputmode="decimal" value="1" /></td>' +
            '<td><input class="col-price" name="items[' + itemIndex + '][price]" type="text" inputmode="decimal" value="0" /></td>';
          itemsBody.appendChild(tr);
          itemIndex++;
        });

        // Render a live preview by posting the form with preview=1 and writing
        // the returned HTML into the iframe. On a validation error we keep the
        // last good preview instead of blanking it.
        let lastGood = "";
        async function renderPreview() {
          const data = new FormData(form);
          data.set("preview", "1");
          try {
            const res = await fetch("/php/generate", {
              method: "POST",
              body: data,
              headers: { "X-Requested-With": "XMLHttpRequest", "Accept": "text/html" },
            });
            if (!res.ok) return; // validation/other error: keep last good render
            const html = await res.text();
            lastGood = html;
            preview.srcdoc = html;
          } catch (e) {
            // network hiccup: leave the previous preview in place
          }
        }

        document.getElementById("refresh").addEventListener("click", renderPreview);
        form.addEventListener("input", debounce(renderPreview, 400));
        // Render once the page is ready.
        if (document.readyState === "complete") renderPreview();
        else window.addEventListener("load", renderPreview);

        function debounce(fn, ms) {
          let t;
          return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
        }
      </script>
    </main>
  </body>
</html>
