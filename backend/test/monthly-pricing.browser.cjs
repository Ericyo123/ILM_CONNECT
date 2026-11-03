const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
process.env.NODE_ENV = 'test';
const { chromium } = require(process.env.QA_PLAYWRIGHT_PATH || '/Users/humaid/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
if (!process.env.DATABASE_URL || !['localhost', '127.0.0.1'].includes(new URL(process.env.DATABASE_URL).hostname)) throw new Error('Use a disposable local DATABASE_URL');
const { PrismaService } = require('../dist/src/prisma/prisma.service');
const output = path.resolve(__dirname, '../../output/monthly-pricing');
const base = process.env.QA_FRONTEND_URL || 'http://localhost:3019';
const results = [];
let browser;
let db;

async function main() {
  const fixture = JSON.parse(await fs.readFile(path.join(output, 'fixture.json'), 'utf8'));
  db = new PrismaService();
  const browserStudent = await db.user.create({ data: { email: `browser-monthly-${crypto.randomUUID()}@example.test`, passwordHash: 'unused-qa-account', role: 'STUDENT', status: 'ACTIVE', studentProfile: { create: { fullName: 'QA Browser Tuition', phone: '', country: 'Sri Lanka', timezone: 'Asia/Colombo', preferredLanguage: 'English', learningGoals: '', assignedLecturerId: fixture.lecturer.id } } } });
  browser = await chromium.launch({ channel: 'chrome' });
  async function test(name, run, person, width = 1440) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce', timezoneId: 'Asia/Colombo' });
    if (person) await context.addInitScript(({ person }) => { localStorage.setItem('ilm_user', JSON.stringify(person)); localStorage.setItem('ilm_token', person.token); }, { person });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await run(page);
      assert.deepEqual(errors, [], name + ' page errors');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name + ' horizontal overflow');
      results.push({ name, passed: true, pageErrors: errors });
      await page.screenshot({ path: path.join(output, name + '.png'), fullPage: true });
    } catch (error) {
      results.push({ name, passed: false, error: error.message, pageErrors: errors });
      await page.screenshot({ path: path.join(output, name + '-failed.png'), fullPage: true });
      throw error;
    } finally { await fs.writeFile(path.join(output, 'browser-results.json'), JSON.stringify(results, null, 2)); await context.close(); }
  }
  async function text(locator, value) { await locator.filter({ hasText: value }).first().waitFor(); }
  async function chooseTuition(page, calculator, label, option) {
    await calculator.getByRole('combobox', { name: label }).click();
    await page.getByRole('option', { name: option, exact: true }).click();
  }
  for (const width of [320, 390, 768, 1100, 1440]) await test('pricing-' + width, async page => {
    await page.goto(base + '/pricing');
    const calculator = page.getByRole('region', { name: 'Your monthly tuition' });
    await calculator.getByRole('combobox', { name: 'Student location' }).waitFor();
    await fs.writeFile(path.join(output, 'pricing-' + width + '.aria.txt'), await calculator.ariaSnapshot());
    await chooseTuition(page, calculator, 'Student location', 'Sri Lanka');
    await chooseTuition(page, calculator, 'Tuition package', 'Trio');
    await text(calculator.locator('dd'), 'LKR 14,025.00');
    await chooseTuition(page, calculator, 'Tuition package', 'Duo');
    await text(calculator.locator('dd'), 'LKR 9,900.00');
    await chooseTuition(page, calculator, 'Student location', 'International');
    await chooseTuition(page, calculator, 'Course and pace', 'Noorani Qaida · Fast Track');
    await text(calculator.locator('dd'), 'USD 124.20');
    await chooseTuition(page, calculator, 'Tuition package', 'Trio');
    await text(calculator.locator('dd'), 'USD 175.95');
    const location = calculator.getByRole('combobox', { name: 'Student location' });
    await location.focus(); await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('role')), 'combobox');
    const targets = await calculator.getByRole('combobox').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
    assert.equal(targets.length, 3);
    assert(targets.every(height => height >= 44));
    const fastTrack = page.getByRole('button', { name: /Fast Track Plans 3 sessions/ });
    await fastTrack.click(); assert.equal(await fastTrack.getAttribute('aria-expanded'), 'true');
    await fastTrack.click(); assert.equal(await fastTrack.getAttribute('aria-expanded'), 'false');
    await calculator.scrollIntoViewIfNeeded();
  });
  await test('admin-tuition-and-payout-workflow', async page => {
    await page.goto(base + '/admin/finance');
    const panel = page.getByRole('region', { name: 'Record monthly tuition' });
    await panel.getByRole('combobox', { name: 'Student 1', exact: true }).waitFor();
    await fs.writeFile(path.join(output, 'admin-before.aria.txt'), await panel.ariaSnapshot());
    await panel.getByRole('combobox', { name: 'Course and pace' }).selectOption('beginner-qaida-standard');
    await panel.getByRole('combobox', { name: 'Student 1', exact: true }).selectOption(fixture.local.id);
    await panel.getByRole('textbox', { name: 'External payment reference' }).fill('duplicate-browser-check');
    await panel.getByRole('button', { name: 'Record received payment' }).click();
    await text(panel.getByRole('alert'), 'already recorded');
    await panel.getByLabel('Billing month (Sri Lanka)').fill(fixture.previous);
    await panel.getByRole('combobox', { name: 'Student 1', exact: true }).selectOption(browserStudent.id);
    await panel.getByRole('textbox', { name: 'External payment reference' }).fill('browser-receipt-' + crypto.randomUUID());
    await text(panel.locator('dd'), 'LKR 4,000.00');
    await panel.getByRole('button', { name: 'Record received payment' }).click();
    await text(panel.getByRole('status'), 'Tuition recorded');
    await page.getByRole('button', { name: 'Prepare monthly payouts', exact: true }).click();
    await page.getByText('1 monthly payout requests prepared.', { exact: false }).waitFor();
    const pendingRow = page.getByRole('article').filter({ has: page.getByRole('button', { name: 'Mark paid externally' }) }).filter({ hasText: 'QA lecturer' }).first();
    await pendingRow.getByRole('button', { name: 'Mark failed', exact: true }).click();
    await page.getByRole('button', { name: 'Prepare monthly payouts', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Prepare monthly payouts', exact: true }).click();
    const retriedRow = page.getByRole('article').filter({ has: page.getByRole('button', { name: 'Mark paid externally' }) }).filter({ hasText: 'QA lecturer' }).first();
    await retriedRow.getByRole('button', { name: 'Mark paid externally' }).click();
    await page.getByText('Payout recorded', { exact: true }).waitFor();
    const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export CSV', exact: true }).click(); assert.equal((await download).suggestedFilename(), 'finance-summary.csv');
    const rates = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export rates & prices' }).click(); assert.equal((await rates).suggestedFilename(), 'exchange-rates-and-prices.csv');
  }, fixture.admin);
  for (const width of [320, 768, 1440]) await test('finance-reflow-' + width, async page => {
    await page.goto(base + '/admin/finance'); await page.getByRole('heading', { name: 'Record monthly tuition' }).waitFor();
    await page.getByRole('combobox', { name: 'Tuition package', exact: true }).selectOption('3');
    await page.getByRole('combobox', { name: 'Student 3', exact: true }).waitFor();
  }, fixture.admin, width);
  for (const width of [320, 768, 1440]) await test('lecturer-earnings-' + width, async page => {
    await page.goto(base + '/lecturer/earnings'); await page.getByRole('heading', { name: 'Monthly student earnings' }).waitFor();
    await fs.writeFile(path.join(output, 'lecturer-' + width + '.aria.txt'), await page.locator('body').ariaSnapshot());
    const details = page.locator('details').first(); await details.locator('summary').click(); assert(await details.getAttribute('open') !== null); await details.locator('summary').click();
    const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export earnings' }).click(); assert.equal((await download).suggestedFilename(), 'monthly-lecturer-earnings.csv');
  }, fixture.lecturer, width);
  await test('lecturer-monthly-request-and-dashboard-link', async page => {
    const pending = await db.user.create({ data: { email: `browser-payout-${crypto.randomUUID()}@example.test`, passwordHash: 'unused-qa-account', role: 'STUDENT', status: 'ACTIVE', studentProfile: { create: { fullName: 'QA Browser Payout', phone: '', country: 'Sri Lanka', timezone: 'Asia/Colombo', preferredLanguage: 'English', learningGoals: '', assignedLecturerId: fixture.lecturer.id } } } });
    const response = await fetch('http://localhost:3009/api/v1/subscriptions/monthly-payments', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${fixture.admin.token}` }, body: JSON.stringify({ studentIds: [pending.id], planId: 'beginner-qaida-standard', billingMonth: fixture.previous, reference: 'browser-payout-' + crypto.randomUUID(), expectedTotalLkr: 5500 }) });
    assert.equal(response.status, 201);
    await page.goto(base + '/lecturer/dashboard');
    await page.getByRole('link', { name: 'Monthly payouts', exact: true }).click();
    await page.getByRole('heading', { name: 'Request a monthly payout' }).waitFor();
    await page.getByRole('combobox', { name: 'Billing month', exact: true }).selectOption(fixture.previous);
    await page.getByRole('combobox', { name: 'Payout method' }).selectOption('wise_lkr');
    await page.getByRole('button', { name: 'Request monthly payout' }).click();
    await page.getByText('Monthly payout requested.', { exact: false }).waitFor();
  }, fixture.lecturer, 390);
  await test('student-billing-discount-snapshot', async page => {
    await page.goto(base + '/student/billing');
    await page.getByText('Tuition per student after discount:', { exact: false }).waitFor();
    await page.getByText('Billing month: ' + fixture.current, { exact: false }).waitFor();
  }, fixture.local, 390);
  await test('calculator-error-retry-and-empty', async page => {
    await page.route('**/subscriptions/quote', route => route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'QA quote unavailable' }) }));
    await page.goto(base + '/pricing');
    await page.getByRole('button', { name: 'Retry calculation' }).waitFor();
    await page.unroute('**/subscriptions/quote');
    await page.getByRole('button', { name: 'Retry calculation' }).click();
    await text(page.getByRole('region', { name: 'Your monthly tuition' }).locator('dd'), 'USD 49.00');
    await page.route('**/subscriptions/plans', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.reload(); await page.getByText('No tuition plans are configured yet.', { exact: true }).waitFor();
  });
  await test('lecturer-loading-error-retry-and-empty', async page => {
    let release;
    const paused = new Promise(resolve => { release = resolve; });
    await page.route('**/payouts/balance', async route => { await paused; await route.fulfill({ status: 500, contentType: 'application/json', body: '{"message":"QA unavailable"}' }); });
    await page.goto(base + '/lecturer/earnings');
    await page.getByText('Loading monthly earnings and payout history…', { exact: true }).waitFor();
    release();
    await page.getByRole('button', { name: 'Retry earnings' }).waitFor();
    await page.unroute('**/payouts/balance');
    await page.route('**/payouts/balance', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ currentMonth: fixture.current, currentMonthLkr: 0, availableLkr: 0, earnings: [] }) }));
    await page.route('**/payouts/me', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.getByRole('button', { name: 'Retry earnings' }).click();
    await page.getByText('No monthly tuition has been recorded for your students yet.', { exact: false }).waitFor();
  }, fixture.lecturer);
  await test('scoped-accessibility-and-zoom', async page => {
    for (const [route, titleId] of [['/admin/finance', 'monthly-payment-title'], ['/pricing', 'tuition-calculator-title']]) {
      await page.goto(base + route); await page.locator('#' + titleId).waitFor();
      await page.addScriptTag({ path: path.resolve(__dirname, '../../frontend/node_modules/axe-core/axe.min.js') });
      const violations = await page.evaluate(async titleId => (await axe.run(document.getElementById(titleId).closest('section'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(row => ({ id: row.id, impact: row.impact })), titleId);
      assert.deepEqual(violations, []);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
  }, fixture.admin);
  await test('config-policy', async page => { await page.goto(base + '/admin/config'); await page.getByRole('heading', { name: 'Internal lecturer payout policy' }).waitFor(); assert.equal(await page.getByRole('button', { name: 'Save all prices' }).count(), 0); }, fixture.admin);
  console.log(`PASS: ${results.length} browser workflows and responsive checks`);
  await browser.close(); await db.$disconnect();
}
main().catch(async error => { console.error(error); if (browser) await browser.close(); if (db) await db.$disconnect(); process.exitCode = 1; });
