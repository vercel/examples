use chrono::Local;
use std::hint::black_box;
use vercel_runtime::{AppState, Error, Request, Response, ResponseBody, service_fn};

#[inline(always)]
fn calculate_primes(limit: u32) -> Vec<u32> {
    if limit < 2 {
        return Vec::new();
    }

    // Sieve of Eratosthenes
    let mut sieve = vec![true; (limit + 1) as usize];
    sieve[0] = false;
    sieve[1] = false;

    let sqrt_limit = (limit as f64).sqrt() as u32;
    for i in 2..=sqrt_limit {
        if sieve[i as usize] {
            let mut multiple = i * i;
            while multiple <= limit {
                sieve[multiple as usize] = false;
                multiple += i;
            }
        }
    }

    let mut primes = Vec::with_capacity((limit as f64 / (limit as f64).ln()) as usize);
    for i in 2..=limit {
        if sieve[i as usize] {
            primes.push(i);
        }
    }
    primes
}

#[inline(always)]
fn generate_fibonacci_sequence(count: u32) -> Vec<u64> {
    let mut fibs = Vec::with_capacity(count as usize);
    if count == 0 {
        return fibs;
    }

    fibs.push(0);
    if count == 1 {
        return fibs;
    }

    fibs.push(1);
    if count == 2 {
        return fibs;
    }

    // Generate rest iteratively without function calls
    let mut a = 0u64;
    let mut b = 1u64;
    for _ in 2..count {
        let temp = a.wrapping_add(b);
        a = b;
        b = temp;
        fibs.push(b);
    }
    fibs
}

#[derive(Clone)]
struct ItemMetadata {
    timestamp: u64,
    hash: String,
    complexity: f64,
    extra_computation: Option<f64>,
}

#[derive(Clone)]
struct Item {
    id: usize,
    value: f64,
    description: String,
    metadata: ItemMetadata,
}

#[derive(Clone)]
struct Section {
    title: String,
    primes: Vec<u32>,
    fibonacci: Vec<u64>,
    items: Vec<Item>,
}

fn generate_slower_complex_data() -> Vec<Section> {
    // Calculate way more primes
    let primes = black_box(calculate_primes(500000));

    // Calculate more fibonacci numbers
    let fibs = generate_fibonacci_sequence(200);

    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64;

    // Generate much more complex nested data (3x sections, 3x items) - same as JS
    let mut complex_data = Vec::with_capacity(150);
    for i in 0..150 {
        let start_idx = i * 200;
        let end_idx = ((i + 1) * 200).min(primes.len());
        let section_primes = if start_idx < primes.len() {
            primes[start_idx..end_idx].to_vec()
        } else {
            Vec::new()
        };

        let mut items = Vec::with_capacity(60);
        for j in 0..60 {
            let i_f64 = i as f64;
            let j_f64 = j as f64;
            let value = (i_f64 * 1000.0 + j_f64).sqrt();
            let hash_val = format!("{:x}", (i * j * 12345) as u32);

            let complexity = i_f64.sin() * j_f64.cos();
            let extra_computation = if i + j > 0 {
                Some(((i + j) as f64).powi(2) * ((i + j + 1) as f64).ln())
            } else {
                None
            };

            items.push(Item {
                id: j,
                value,
                description: format!("Item {} in section {}", j, i),
                metadata: ItemMetadata {
                    timestamp,
                    hash: hash_val,
                    complexity,
                    extra_computation,
                },
            });
        }

        complex_data.push(Section {
            title: format!("Section {}", i + 1),
            primes: section_primes,
            fibonacci: fibs.clone(),
            items,
        });
    }

    complex_data
}

fn render_complex_component(data: &[Section]) -> String {
    let total_primes: usize = data.iter().map(|section| section.primes.len()).fold(0usize, |acc, len| acc.saturating_add(len));
    let average_fib = if !data.is_empty() && !data[0].fibonacci.is_empty() {
        data[0].fibonacci.iter().fold(0u64, |acc, &val| acc.saturating_add(val)) as f64 / data[0].fibonacci.len() as f64
    } else {
        0.0
    };

    let mut html = String::with_capacity(5_000_000); // Pre-allocate even larger capacity

    for section in data {
        let mut primes_html = String::with_capacity(section.primes.len() * 200);
        for prime in &section.primes {
            primes_html.push_str(&format!(
                r#"<div style="background-color: #e9d5ff; padding: 8px; text-align: center; border-radius: 4px; font-size: 14px; color: #581c87; border: 1px solid #d8b4fe;">{}</div>"#,
                prime
            ));
        }

        let mut fibs_html = String::with_capacity(section.fibonacci.len() * 150);
        for fib in &section.fibonacci {
            fibs_html.push_str(&format!(
                r#"<div style="background-color: #dcfce7; padding: 4px 12px; border-radius: 4px; font-size: 14px; color: #14532d; border: 1px solid #bbf7d0;">{}</div>"#,
                fib
            ));
        }

        let mut items_html = String::with_capacity(section.items.len() * 500);
        for item in &section.items {
            let extra_html = if let Some(extra) = item.metadata.extra_computation {
                format!("<p>Extra: {:.6}</p>", extra)
            } else {
                String::new()
            };

            items_html.push_str(&format!(
                r#"
      <div style="background-color: #f9fafb; padding: 16px; border-radius: 4px; border: 1px solid #d1d5db; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <h4 style="font-weight: 600; color: #111827;">Item {}</h4>
        <p style="font-size: 14px; color: #4b5563;">{}</p>
        <p style="font-size: 14px; color: #1f2937;">Value: {:.4}</p>
        <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
          <p>Hash: {}</p>
          <p>Complexity: {:.6}</p>
          {}
          <p>Timestamp: {}</p>
        </div>
      </div>
    "#,
                item.id,
                item.description,
                item.value,
                item.metadata.hash,
                item.metadata.complexity,
                extra_html,
                item.metadata.timestamp
            ));
        }

        html.push_str(&format!(
            r#"
      <div style="margin-bottom: 32px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; background-color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #111827;">{}</h2>

        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #6b21a8;">Prime Numbers (200 samples)</h3>
          <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 8px;">{}</div>
        </div>

        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #166534;">Fibonacci Sequence</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">{}</div>
        </div>

        <div>
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #1e40af;">Items ({})</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">{}</div>
        </div>
      </div>
    "#,
            section.title, primes_html, fibs_html, section.items.len(), items_html
        ));
    }

    // Additional computations - same as JS
    let mut additional_computations = String::with_capacity(100_000);
    for i in 0..300 {
        let n = i + 1;
        let factorial = (1..=(n.min(20))).fold(1u64, |acc, val| acc.saturating_mul(val));
        additional_computations.push_str(&format!(
            r#"
      <div style="background-color: white; padding: 12px; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <p style="font-family: monospace; font-size: 14px; color: #1f2937;">n={}, f={:.2e}</p>
      </div>
    "#,
            n, factorial as f64
        ));
    }

    format!(
        r#"
    <div style="padding: 32px; max-width: 1280px; margin: 0 auto; background-color: white; color: #111827;">
      <h1 style="font-size: 36px; font-weight: bold; margin-bottom: 24px;">Complex Server-Rendered Component (Vanilla - SLOWER)</h1>

      <div style="margin-bottom: 32px; padding: 16px; border-radius: 8px; background-color: #f3f4f6; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Statistics</h2>
        <p style="font-size: 18px;">Total Prime Numbers: {}</p>
        <p style="font-size: 18px;">Average Fibonacci Value: {:.2}</p>
        <p style="font-size: 18px;">Total Sections: {}</p>
      </div>

      {}

      <div style="margin-top: 32px; padding: 24px; background-color: #f3f4f6; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Additional Computations</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">{}</div>
      </div>
    </div>
  "#,
        total_primes,
        average_fib,
        data.len(),
        html,
        additional_computations
    )
}

async fn handler(_: Request, _: AppState) -> Result<Response<ResponseBody>, Error> {
    println!(
        "rendering slower bench {}",
        chrono::Utc::now().timestamp_millis()
    );

    // Much more expensive server-side computation - same as JS
    let data = black_box(generate_slower_complex_data());
    let current_time = Local::now().format("%m/%d/%Y %I:%M:%S %p").to_string();

    let component_html = black_box(render_complex_component(&data));

    let html = format!(
        r#"
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vanilla SSR Slower Benchmark - Vercel</title>
      <style>
        body {{
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }}
      </style>
    </head>
    <body>
      <main style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Slower Bench - Last rendered at:</h1>
        <p style="font-size: 18px; font-family: monospace; padding: 16px; border-radius: 4px;">{}</p>
        {}
      </main>
    </body>
    </html>
  "#,
        current_time, component_html
    );

    let html_bytes = html.as_bytes();
    Ok(Response::builder()
        .header("Content-Type", "text/html; charset=utf-8")
        .header("Content-Length", html_bytes.len())
        .status(200)
        .body(html.into())
        .unwrap())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let app = service_fn(handler);
    vercel_runtime::run(app).await
}
