import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            '@babel/plugin-proposal-record-and-tuple',
            { syntaxType: 'hash', importPolyfill: true },
          ],
        ],
      },
    }),
  ],
  server: {
    port: 7002,
  },
});
