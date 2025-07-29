import { fileURLToPath } from "node:url";
import { main as asc } from "assemblyscript/asc";

async function compile(name) {
  // https://www.assemblyscript.org/compiler.html#programmatic-usage
  const res = await asc([`${name}.asc.ts`, "-o", `${name}.wasm`], {});

  if (res.error) {
    console.log(`Compilation failed for ${name}:`, res.error);
    console.log(res.stderr.toString());
  } else {
    console.log(`Compiled: ${name}.wasm`);
    console.log(res.stdout.toString());
  }
}

process.chdir(fileURLToPath(new URL(".", import.meta.url)));

await compile("sum");
await compile("rand");
