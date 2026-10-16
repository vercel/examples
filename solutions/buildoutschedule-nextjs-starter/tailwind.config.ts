import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 reads design tokens from the `@theme` block in
 * `src/app/globals.css`. This file is loaded through the `@config` directive
 * there and only pins the content paths.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
};

export default config;
