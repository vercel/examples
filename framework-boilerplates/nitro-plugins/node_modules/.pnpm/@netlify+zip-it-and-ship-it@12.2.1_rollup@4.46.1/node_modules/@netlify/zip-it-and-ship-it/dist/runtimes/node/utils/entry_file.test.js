import { test, expect } from 'vitest';
import { getTelemetryFile, kebabCase } from './entry_file.js';
test('kebab-case', () => {
    expect(kebabCase('hello-world')).toBe('hello-world');
    expect(kebabCase('hello World')).toBe('hello-world');
    expect(kebabCase('--Hello--World--')).toBe('hello-world');
    expect(kebabCase('Next.js Runtime')).toBe('next-js-runtime');
    expect(kebabCase('@netlify/plugin-nextjs@14')).toBe('netlify-plugin-nextjs-14');
    expect(kebabCase('CamelCaseShould_Be_transformed')).toBe('camel-case-should-be-transformed');
    expect(kebabCase('multiple   spaces')).toBe('multiple-spaces');
});
test('getTelemetryFile should handle no defined generator', () => {
    const telemetryFile = getTelemetryFile();
    expect(telemetryFile.filename).toBe('___netlify-telemetry.mjs');
    expect(telemetryFile.contents).toContain('var SERVICE_NAME = undefined;');
    expect(telemetryFile.contents).toContain('var SERVICE_VERSION = undefined;');
});
test('getTelemetryFile should handle internalFunc generator', () => {
    const telemetryFile = getTelemetryFile('internalFunc');
    expect(telemetryFile.filename).toBe('___netlify-telemetry.mjs');
    expect(telemetryFile.contents).toContain('var SERVICE_NAME = "internal-func";');
    expect(telemetryFile.contents).toContain('var SERVICE_VERSION = undefined;');
});
test('getTelemetryFile should handle generator with version', () => {
    const telemetryFile = getTelemetryFile('@netlify/plugin-nextjs@14.13.2');
    expect(telemetryFile.filename).toBe('___netlify-telemetry.mjs');
    expect(telemetryFile.contents).toContain('var SERVICE_NAME = "netlify-plugin-nextjs";');
    expect(telemetryFile.contents).toContain('var SERVICE_VERSION = "14.13.2";');
});
test('getTelemetryFile should handle generator without version', () => {
    const telemetryFile = getTelemetryFile('@netlify/plugin-nextjs');
    expect(telemetryFile.filename).toBe('___netlify-telemetry.mjs');
    expect(telemetryFile.contents).toContain('var SERVICE_NAME = "netlify-plugin-nextjs";');
    expect(telemetryFile.contents).toContain('var SERVICE_VERSION = undefined;');
});
