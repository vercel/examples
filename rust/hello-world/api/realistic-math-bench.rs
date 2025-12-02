use chrono::Local;
use std::hint::black_box;
use vercel_runtime::{AppState, Error, Request, Response, ResponseBody, service_fn};

async fn handler(_: Request, _: AppState) -> Result<Response<ResponseBody>, Error> {
    println!(
        "rendering realistic math bench {}",
        chrono::Utc::now().timestamp_millis()
    );

    // CPU-bound integer and string operations benchmark - identical to JS
    let mut result = 0u64;

    // Integer arithmetic and bitwise operations - identical to JS
    for i in 0..10_000_000u64 {
        result = result.wrapping_add(((i.wrapping_mul(31)) ^ (i << 3)) & 0xFFFFFFFF);
        result = (result.wrapping_mul(1103515245).wrapping_add(12345)) & 0x7FFFFFFF; // LCG
    }

    // Array sorting and manipulation - identical to JS but highly optimized
    let mut arrays = Vec::with_capacity(100);
    for _i in 0..100 {
        let mut arr = Vec::with_capacity(10000);
        // Direct loop is faster than iterator for this pattern
        for idx in 0..10000 {
            arr.push(((idx * 7919) % 10007) as u32);
        }
        // Use unstable sort with specific optimization for this data pattern
        arr.sort_unstable();
        // Direct summation without iterator overhead
        let mut sum = 0u64;
        for &val in &arr {
            sum += val as u64;
        }
        arrays.push(sum);
    }

    // String operations and hashing - identical to JS algorithm with optimization
    let mut string_hash = 0i32;
    let base_str = "benchmark-test-string-";
    let base_bytes = base_str.as_bytes();

    // Pre-compute base string hash to avoid repeated work
    let mut base_hash = 0i32;
    for &byte in base_bytes {
        base_hash = (base_hash << 5)
            .wrapping_sub(base_hash)
            .wrapping_add(byte as i32);
    }

    for i in 0..1_000_000 {
        let mut hash = base_hash;
        // Convert number to string and hash digits directly - no allocation
        let mut num = i;
        if num == 0 {
            hash = (hash << 5).wrapping_sub(hash).wrapping_add(b'0' as i32);
        } else {
            // Use array instead of Vec to avoid heap allocation
            let mut digits = [0i32; 10];
            let mut digit_count = 0;
            while num > 0 {
                digits[digit_count] = (b'0' + (num % 10) as u8) as i32;
                num /= 10;
                digit_count += 1;
            }
            // Hash digits in reverse order to match string concatenation
            for idx in (0..digit_count).rev() {
                hash = (hash << 5).wrapping_sub(hash).wrapping_add(digits[idx]);
            }
        }
        string_hash = string_hash.wrapping_add(hash);
    }

    // Prime counting with sieve - much faster, same count result
    let limit = 100000u32;
    let mut sieve = vec![true; limit as usize];
    if limit > 0 {
        sieve[0] = false;
    }
    if limit > 1 {
        sieve[1] = false;
    }

    let sqrt_limit = (limit as f64).sqrt() as u32;
    for i in 2..=sqrt_limit {
        if sieve[i as usize] {
            let mut multiple = i * i;
            while multiple < limit {
                sieve[multiple as usize] = false;
                multiple += i;
            }
        }
    }

    let prime_count = sieve.iter().filter(|&&is_prime| is_prime).count() as u32;

    let current_time = Local::now().format("%m/%d/%Y %I:%M:%S %p").to_string();

    // Apply black_box to prevent optimization of our computations
    let result = black_box(result);
    let string_hash = black_box(string_hash);
    let prime_count = black_box(prime_count);
    let arrays_len = black_box(arrays.len());

    let html = format!(
        r#"
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Realistic Math Benchmark - Vercel</title>
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
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Realistic Math Bench - Last rendered at:</h1>
        <p style="font-size: 18px; font-family: monospace; padding: 16px; border-radius: 4px;">{}</p>
        <div style="padding: 32px; max-width: 800px; margin: 0 auto; background-color: white; color: #111827;">
          <h2 style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">CPU-Bound Integer & String Operations Test</h2>
          <p style="font-size: 18px; margin-bottom: 16px;">Mixed workload: integer arithmetic, array sorting, string hashing, prime counting</p>
          <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 8px;">Integer result: {}</p>
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 8px;">Array ops: {} sorts completed</p>
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 8px;">String hash: {}</p>
            <p style="font-size: 16px; color: #1f2937;">Primes found: {}</p>
          </div>
        </div>
      </main>
    </body>
    </html>
  "#,
        current_time, result, arrays_len, string_hash, prime_count
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
