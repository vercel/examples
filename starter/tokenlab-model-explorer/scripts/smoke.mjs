import { access, readFile } from 'node:fs/promises';

await access(new URL('../src/widget.html', import.meta.url));
const server = await readFile(new URL('../src/server.ts', import.meta.url), 'utf8');

for (const token of [
  'open_tokenlab_model_explorer',
  'compare_tokenlab_models',
  'generate_tokenlab_endpoint_example',
  'registerAppTool',
  'registerAppResource',
]) {
  if (!server.includes(token)) {
    throw new Error(`Missing ${token}`);
  }
}

console.log('smoke ok');
