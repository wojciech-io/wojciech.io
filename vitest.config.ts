import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      // Unit-testable modules: pure data and the public middleware headers export.
      // functions/api/* and functions/_utils/crypto.ts require CF Workers runtime mocks
      // (out of scope for unit tests; covered by E2E + security workflow instead).
      include: ['src/data/**', 'functions/_middleware.ts'],
      reporter: ['text', 'lcov'],
    },
  },
});
