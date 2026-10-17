import { defineConfig, devices } from '@playwright/test';

// PLAYWRIGHT_BASE_URL=https://... roda os testes contra um site publicado, sem subir servidor local
const remoto = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: remoto ?? 'http://localhost:4321' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: remoto ? undefined : {
    command: 'npm run build && npm run preview -- --port 4321 --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
