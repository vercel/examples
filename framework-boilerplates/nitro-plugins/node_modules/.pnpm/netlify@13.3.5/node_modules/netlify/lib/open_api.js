import { createRequire } from 'module';
// TODO: remove once Node.js supports JSON imports with pure ES modules without
// any experimental flags
const require = createRequire(import.meta.url);
export const openApiSpec = require('@netlify/open-api');
