import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4001,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/test-setup.ts',
  },
});
