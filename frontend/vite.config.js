import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const removeCrossorigin = () => {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/\s+crossorigin(="anonymous"|="use-credentials"|"")?/gi, '');
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), removeCrossorigin()],
  server: {
    port: 3000,
    host: true
  }
});
