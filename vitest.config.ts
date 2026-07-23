import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@application': path.resolve(__dirname, 'src/application'),
      '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    // Integration tests drive real route handlers against Postgres: they
    // need the env populated before route modules load, headroom beyond the
    // default 5s timeout, and a teardown that removes the users they create.
    setupFiles: ['tests/integration/setup-env.ts'],
    globalSetup: ['tests/integration/global-setup.ts'],
    testTimeout: 30000,
  },
});
