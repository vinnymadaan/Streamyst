import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],

  format: ['cjs'],

  target: 'es2022',

  clean: true,

  splitting: false,

  sourcemap: false,

  bundle: true,

  noExternal: [
    '@repo/database',
    '@repo/logger',
    '@repo/schemas',
    '@repo/services',
    '@repo/trpc',
  ],
});
