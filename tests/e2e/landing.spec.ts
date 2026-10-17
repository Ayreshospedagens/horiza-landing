import { test, expect } from '@playwright/test';

const CADASTRO = 'https://app.usehoriza.com.br/auth?modo=cadastro';

test('título, fonte e botões do topo', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Horiza/);
  expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toContain('Archivo');
  await expect(page.locator('h1')).toContainText('Veja o seu dinheiro lá na frente');
  await expect(page.locator('#topo a[data-track="cta_teste_click"]')).toHaveAttribute('href', CADASTRO);
  await expect(page.locator('#topo a[href="#demonstracao"]')).toHaveCount(1);
});

test('ordem das seções', async ({ page }) => {
  await page.goto('/');
  const ordem = await page.locator('main > section').evaluateAll((s) => s.map((e) => e.id));
  expect(ordem).toEqual(['topo', 'dores', 'como-funciona', 'telas', 'demonstracao', 'diferenciais', 'sobre', 'planos', 'perguntas', 'final']);
});

test('360 px sem rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('telas com 5 abas que trocam o print', async ({ page }) => {
  await page.goto('/');
  const abas = page.locator('#telas [role="tab"]');
  await expect(abas).toHaveCount(5);
  for (const alt of await page.locator('#telas img').evaluateAll((i) => i.map((e) => (e as HTMLImageElement).alt))) {
    expect(alt.length).toBeGreaterThan(10);
  }
  await abas.nth(2).click();
  await expect(abas.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#telas [role="tabpanel"]:visible')).toHaveCount(1);
  await expect(page.locator('#telas [role="tabpanel"]:visible')).toContainText('meta');
});

test('demonstração: WhatsApp com mensagem e sem vídeo enquanto não houver', async ({ page }) => {
  await page.goto('/');
  const wa = page.locator('#demonstracao a[data-track="cta_whatsapp_click"]');
  await expect(wa).toHaveAttribute('href', /^https:\/\/wa\.me\/5521971585795\?text=Oi%2C%20Joel/);
  await expect(page.locator('#demonstracao a[data-track="cta_teste_click"]')).toHaveAttribute('href', CADASTRO);
  await expect(page.locator('#video-demo')).toHaveCount(0);
});

test('Joel com foto e sem depoimentos vazios', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sobre img')).toHaveCount(1);
  await expect(page.locator('#sobre')).toContainText('Joel Ayres');
  await expect(page.locator('#sobre blockquote')).toHaveCount(0);
});

test('planos com os dois preços', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#planos article')).toHaveCount(2);
  await expect(page.locator('#planos')).toContainText('R$ 14,90');
  await expect(page.locator('#planos')).toContainText('R$ 129,90');
  await expect(page.locator('#planos a[data-track="cta_teste_click"]')).toHaveCount(2);
});

test('perguntas frequentes em JSON-LD', async ({ page }) => {
  await page.goto('/');
  const json = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent())!);
  expect(json['@type']).toBe('FAQPage');
  expect(json.mainEntity).toHaveLength(7);
  await expect(page.locator('#perguntas details')).toHaveCount(7);
});

test('recusar cookies não carrega Meta nem Google', async ({ page }) => {
  const externos: string[] = [];
  page.on('request', (r) => { if (/facebook|googletagmanager/.test(r.url())) externos.push(r.url()); });
  await page.goto('/');
  await expect(page.locator('#aviso-cookies')).toBeVisible();
  await page.getByRole('button', { name: 'Recusar' }).click();
  await expect(page.locator('#aviso-cookies')).toBeHidden();
  await page.reload();
  await expect(page.locator('#aviso-cookies')).toBeHidden();
  expect(externos).toEqual([]);
});

test('UTM vai para o cadastro, mesmo depois de navegar', async ({ page }) => {
  await page.goto('/?utm_source=instagram&utm_medium=bio');
  await expect(page.locator('#topo a[data-track="cta_teste_click"]')).toHaveAttribute('href', /utm_source=instagram/);
  await page.goto('/privacidade');
  await page.goto('/');
  await expect(page.locator('#planos a[data-track="cta_teste_click"]').first()).toHaveAttribute('href', /modo=cadastro&utm_source=instagram/);
});

test('barra fixa aparece depois do topo e não cobre o rodapé', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular');
  await page.goto('/');
  await page.getByRole('button', { name: 'Recusar' }).click();
  await expect(page.locator('#barra-fixa')).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('#barra-fixa')).toBeVisible();
  const ultimo = await page.locator('footer a, footer button').last().boundingBox();
  const barra = await page.locator('#barra-fixa').boundingBox();
  expect(ultimo!.y + ultimo!.height).toBeLessThanOrEqual(barra!.y);
});

test('termos e privacidade abrem e estão no rodapé', async ({ page }) => {
  for (const rota of ['/termos', '/privacidade']) {
    const r = await page.goto(rota);
    expect(r!.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  }
  await page.goto('/');
  await expect(page.locator('footer a[href="/termos"]')).toHaveCount(1);
  await expect(page.locator('footer a[href="/privacidade"]')).toHaveCount(1);
});
