import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Served from https://lunev.github.io/parents-reminder/, so assets need the repo name as base.
export default defineConfig({
  base: '/parents-reminder/',
  plugins: [react(), tailwindcss()],
});
