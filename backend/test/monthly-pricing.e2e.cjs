const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

if (!process.env.DATABASE_URL || !['localhost', '127.0.0.1'].includes(new URL(process.env.DATABASE_URL).hostname)) throw new Error('Use a disposable local DATABASE_URL');
process.env.NODE_ENV = 'test';
require('./qa-exchange-stub.cjs');
const { Test } = require('@nestjs/testing');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('../dist/src/app.module');
const { PrismaService } = require('../dist/src/prisma/prisma.service');
const { ExchangeRateService } = require('../dist/src/pricing/exchange-rate.service');
const { EmailNotificationService } = require('../dist/src/notification/email-notification.service');
const { WhatsAppNotificationService } = require('../dist/src/notification/whatsapp-notification.service');
const bcrypt = require('bcrypt');
const output = path.resolve(__dirname, '../../output/monthly-pricing');
let app;
let checks = 0;

async function main() {
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  module.get(EmailNotificationService).sendEmail = async () => ({ success: true });
  module.get(WhatsAppNotificationService).sendWhatsApp = async () => ({ success: true });
  app = module.createNestApplication({ logger: false });
  app.setGlobalPrefix('api/v1');
  app.use(require('cookie-parser')());
  app.enableCors({ origin: ['http://localhost:3019', 'http://localhost:3021'], credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  await app.listen(process.argv.includes('--serve') ? 3009 : 0, '127.0.0.1');
  const db = app.get(PrismaService);
  const base = (await app.getUrl()) + '/api/v1';
  const password = crypto.randomBytes(18).toString('hex');
  const prefix = 'monthly-qa-' + crypto.randomUUID();
  const current = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 7);
  const previous = new Date(Date.UTC(Number(current.slice(0, 4)), Number(current.slice(5)) - 2, 1)).toISOString().slice(0, 7);
  const planId = 'beginner-qaida-standard';

  async function call(endpoint, method = 'GET', body, token) {
    const response = await fetch(base + endpoint, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: response.status, data: await response.json() };
  }
  async function api(name, endpoint, method, body, token, status = 200, verify = () => {}) {
    const result = await call(endpoint, method, body, token);
    assert.equal(result.status, status, name + ': ' + JSON.stringify(result.data));
    await verify(result.data);
    checks++;
    return result.data;
  }
  async function person(role, suffix, country = 'Sri Lanka', lecturerId) {
    const user = await db.user.create({ data: {
      email: `${prefix}-${suffix}@example.test`, passwordHash: await bcrypt.hash(password, 4), role, status: 'ACTIVE',
      ...(role === 'LECTURER' ? { lecturerProfile: { create: { fullName: `QA ${suffix}`, bio: '', qualifications: '', specializations: [], languages: ['English'], hourlyAvailabilityJson: [], payoutMethod: 'bank_transfer', payoutDetails: '', status: 'ACTIVE' } } } : {}),
      ...(role === 'STUDENT' ? { studentProfile: { create: { fullName: `QA ${suffix}`, phone: '', country, timezone: 'Asia/Colombo', preferredLanguage: 'English', learningGoals: '', assignedLecturerId: lecturerId } } } : {}),
    } });
    const login = await api('login ' + suffix, '/auth/login', 'POST', { email: user.email, password }, undefined, 201);
    return { id: user.id, email: user.email, token: login.token, role };
  }
  const admin = await person('ADMIN', 'admin');
  const lecturer = await person('LECTURER', 'lecturer');
  const secondLecturer = await person('LECTURER', 'second-lecturer');
  const local = await person('STUDENT', 'local', 'Sri Lanka', lecturer.id);
  const concurrent = await person('STUDENT', 'concurrent', 'LK', lecturer.id);
  const international = await Promise.all([1, 2, 3].map(i => person('STUDENT', 'international-' + i, 'United Kingdom', lecturer.id)));
  const fast = await Promise.all([1, 2].map(i => person('STUDENT', 'fast-' + i, 'Australia', secondLecturer.id)));
  const trial = await person('STUDENT', 'trial', 'Sri Lanka', lecturer.id);
  const unassigned = await person('STUDENT', 'unassigned');
  const before = await api('read existing monthly totals', '/admin/finance', 'GET', undefined, admin.token);
  const plans = await api('catalog approved prices', '/subscriptions/plans', 'GET', undefined, undefined, 200, rows => {
    assert.equal(rows.length, 6);
    for (const row of rows) { assert.equal(row.monthlyUsd, row.tier === 'Fast Track' ? 69 : 49); assert.equal(row.monthlyLkr, row.tier === 'Fast Track' ? null : 5500); }
    assert.equal(rows.find(row => row.id === planId).prices.GBP, 36.75);
  });
  for (const [region, tier, size, each, total] of [
    ['LK', 'Standard', 1, 5500, 5500], ['LK', 'Standard', 2, 4950, 9900], ['LK', 'Standard', 3, 4675, 14025],
    ['INTERNATIONAL', 'Standard', 1, 49, 49], ['INTERNATIONAL', 'Standard', 2, 44.1, 88.2], ['INTERNATIONAL', 'Standard', 3, 41.65, 124.95],
    ['INTERNATIONAL', 'Fast Track', 1, 69, 69], ['INTERNATIONAL', 'Fast Track', 2, 62.1, 124.2], ['INTERNATIONAL', 'Fast Track', 3, 58.65, 175.95],
  ]) {
    await api(`quote ${region} ${tier} ${size}`, '/subscriptions/quote', 'POST', { planId: plans.find(row => row.tier === tier).id, region, packageSize: size }, undefined, 201, row => { assert.equal(row.feePerStudent, each); assert.equal(row.total, total); assert.equal(row.payoutPerStudentLkr, undefined); });
  }
  const solo = { studentIds: [local.id], planId, billingMonth: current, reference: prefix + '-solo', expectedTotalLkr: 5500 };
  await api('unauthenticated cannot record tuition', '/subscriptions/monthly-payments', 'POST', solo, undefined, 401);
  await api('student cannot record tuition', '/subscriptions/monthly-payments', 'POST', solo, local.token, 403);
  await api('lecturer cannot inspect internal margins', '/subscriptions/monthly-payments/quote', 'POST', solo, lecturer.token, 403);
  await api('tampered quote rejected', '/subscriptions/monthly-payments', 'POST', { ...solo, expectedTotalLkr: 1 }, admin.token, 409);
  assert.equal(await db.monthlyLecturerEarning.count({ where: { studentId: local.id } }), 0);
  await api('local payment records exact margin', '/subscriptions/monthly-payments', 'POST', solo, admin.token, 201, row => { assert.equal(row.payoutTotalLkr, 1500); assert.equal(row.remainingLkr, 4000); });
  await api('duplicate month rejected', '/subscriptions/monthly-payments', 'POST', solo, admin.token, 409);
  await api('paid student can access subscription', '/subscriptions/me', 'GET', undefined, local.token, 200, row => { assert.equal(row.lkrAmount, 5500); assert.equal(row.billingMonth, current); assert.equal(row.pricingSnapshot.discountPercent, 0); });
  await api('mixed region package rejected', '/subscriptions/monthly-payments/quote', 'POST', { ...solo, studentIds: [local.id, international[0].id] }, admin.token, 400);
  await api('duplicate package members rejected', '/subscriptions/monthly-payments/quote', 'POST', { ...solo, studentIds: [local.id, local.id] }, admin.token, 400);
  await api('unassigned student rejected', '/subscriptions/monthly-payments/quote', 'POST', { ...solo, studentIds: [unassigned.id] }, admin.token, 400);
  await api('local Fast Track rejected', '/subscriptions/quote', 'POST', { planId: 'beginner-qaida-fast-track', region: 'LK', packageSize: 1 }, undefined, 400);
  await api('invalid package rejected', '/subscriptions/quote', 'POST', { planId, region: 'LK', packageSize: 4 }, undefined, 400);
  await api('missing reference rejected', '/subscriptions/monthly-payments', 'POST', { ...solo, reference: '' }, admin.token, 400);
  await api('trial grants access but no earnings', '/subscriptions/trial', 'POST', {}, trial.token, 201);
  assert.equal(await db.monthlyLecturerEarning.count({ where: { studentId: trial.id } }), 0);
  const trio = { studentIds: international.map(row => row.id), planId, billingMonth: previous, reference: prefix + '-trio', expectedTotalLkr: 37485 };
  const exchange = app.get(ExchangeRateService);
  const snapshot = exchange.snapshot.bind(exchange);
  exchange.snapshot = async () => [{ code: 'USD', lkrPerUnit: 300, available: true, stale: true }];
  await api('stale FX blocks international recording', '/subscriptions/monthly-payments', 'POST', trio, admin.token, 400);
  exchange.snapshot = snapshot;
  await api('international Trio preserves fixed lecturer payouts', '/subscriptions/monthly-payments', 'POST', trio, admin.token, 201, row => { assert.equal(row.total, 124.95); assert.equal(row.totalLkr, 37485); assert.equal(row.payoutTotalLkr, 9000); assert.equal(row.remainingLkr, 28485); });
  await api('international Fast Track Duo', '/subscriptions/monthly-payments', 'POST', { studentIds: fast.map(row => row.id), planId: 'beginner-qaida-fast-track', billingMonth: previous, reference: prefix + '-fast', expectedTotalLkr: 37260 }, admin.token, 201, row => { assert.equal(row.payoutTotalLkr, 6000); assert.equal(row.remainingLkr, 31260); });
  const racing = { ...solo, studentIds: [concurrent.id], billingMonth: previous, reference: prefix + '-race' };
  const recorded = await Promise.all([call('/subscriptions/monthly-payments', 'POST', racing, admin.token), call('/subscriptions/monthly-payments', 'POST', racing, admin.token)]);
  assert.deepEqual(recorded.map(row => row.status).sort(), [201, 409]); checks++;
  await db.studentProfile.update({ where: { userId: international[0].id }, data: { assignedLecturerId: secondLecturer.id, country: 'Sri Lanka' } });
  await db.sessionBlock.create({ data: { studentId: local.id, lecturerId: lecturer.id, status: 'COMPLETED', payoutAmountLkr: 2500 } });
  await api('balance is monthly, unaffected by sessions or reassignment', '/payouts/balance', 'GET', undefined, lecturer.token, 200, row => { assert.equal(row.availableLkr, 10500); assert.equal(row.currentMonthLkr, 1500); });
  const payoutInput = { amountLkr: 10500, method: 'bank_transfer', periodMonth: previous };
  const reservations = await Promise.all([call('/payouts/request', 'POST', payoutInput, lecturer.token), call('/payouts/request', 'POST', payoutInput, lecturer.token)]);
  assert.deepEqual(reservations.map(row => row.status).sort(), [201, 400]); checks++;
  const firstPayout = reservations.find(row => row.status === 201).data;
  await api('reserved balance cannot be requested again', '/payouts/balance', 'GET', undefined, lecturer.token, 200, row => assert.equal(row.availableLkr, 0));
  await api('current month cannot be paid early', '/payouts/request', 'POST', { amountLkr: 1500, method: 'bank_transfer', periodMonth: current }, lecturer.token, 400);
  await api('student cannot prepare lecturer payouts', '/admin/payouts/monthly', 'POST', { periodMonth: previous }, local.token, 403);
  await api('admin prepares remaining lecturer only', '/admin/payouts/monthly', 'POST', { periodMonth: previous }, admin.token, 201, rows => { assert.equal(rows.length, 1); assert.equal(rows[0].amountLkr, 6000); });
  await api('repeated preparation is idempotent', '/admin/payouts/monthly', 'POST', { periodMonth: previous }, admin.token, 201, rows => assert.equal(rows.length, 0));
  await api('failure releases student earnings', `/admin/payouts/${firstPayout.id}/status`, 'PATCH', { status: 'FAILED' }, admin.token, 200);
  await api('failed payout keeps its student snapshot', '/payouts/me', 'GET', undefined, lecturer.token, 200, rows => assert.equal(rows.find(row => row.id === firstPayout.id).earningsSnapshot.length, 4));
  await api('failure restores exact balance', '/payouts/balance', 'GET', undefined, lecturer.token, 200, row => assert.equal(row.availableLkr, 10500));
  const retry = await api('retry reserves released earnings', '/payouts/request', 'POST', payoutInput, lecturer.token, 201);
  await api('successful external payout settles earnings', `/admin/payouts/${retry.id}/status`, 'PATCH', { status: 'SUCCESSFUL' }, admin.token, 200);
  await api('settled payout cannot fail later', `/admin/payouts/${retry.id}/status`, 'PATCH', { status: 'FAILED' }, admin.token, 400);
  await api('finance shows accrued margin without double-counting cash payout', '/admin/finance', 'GET', undefined, admin.token, 200, row => { assert.equal(row.monthlySummary.tuitionLkr, before.monthlySummary.tuitionLkr + 5500); assert.equal(row.monthlySummary.lecturerLkr, before.monthlySummary.lecturerLkr + 1500); assert.equal(row.monthlySummary.remainingLkr, before.monthlySummary.remainingLkr + 4000); });
  await api('fixed price editing is rejected', '/subscriptions/plans', 'PATCH', { prices: [] }, admin.token, 400);
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(path.join(output, 'fixture.json'), JSON.stringify({ admin, lecturer, secondLecturer, local, international, fast, concurrent, unassigned, password, current, previous }, null, 2), { mode: 0o600 });
  await fs.writeFile(path.join(output, 'api-results.json'), JSON.stringify({ passed: checks, database: 'disposable local PostgreSQL', concurrentTuition: 'one success, one conflict', concurrentPayout: 'one success, one rejection' }, null, 2));
  console.log(`PASS: ${checks} API and integration checks on local PostgreSQL`);
  if (process.argv.includes('--serve')) {
    console.log('QA API ready on http://localhost:3009/api/v1');
    for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await app.close(); process.exit(); });
  } else await app.close();
}
main().catch(async error => { console.error(error); if (app) await app.close(); process.exitCode = 1; });
