import { PayoutService } from './payout.service';
import { AdminService } from '../admin/admin.service';

describe('Monthly student earnings and reservations', () => {
  const earnings = [{ id: 'one', studentId: 's1', region: 'LK', amountLkr: 1500, student: { fullName: 'Local' } }, { id: 'two', studentId: 's2', region: 'INTERNATIONAL', amountLkr: 3000, student: { fullName: 'International' } }];
  const tx = { $queryRaw: jest.fn(), monthlyLecturerEarning: { findMany: jest.fn(), updateMany: jest.fn() }, sessionBlock: { updateMany: jest.fn() }, payout: { create: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn() } };
  const prisma = { monthlyLecturerEarning: tx.monthlyLecturerEarning, $transaction: jest.fn() };
  const service = new PayoutService(prisma as any);
  const admin = new AdminService(prisma as any);
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-03T00:00:00Z'));
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation(fn => fn(tx));
    tx.monthlyLecturerEarning.findMany.mockResolvedValue(earnings);
    tx.monthlyLecturerEarning.updateMany.mockResolvedValue({ count: 2 });
    tx.payout.create.mockResolvedValue({ id: 'request' });
  });
  afterEach(() => jest.useRealTimers());
  it('reserves students atomically with a permanent itemized snapshot', async () => {
    await service.requestPayout('lecturer', 4500, 'bank_transfer', '2026-10');
    expect(tx.$queryRaw).toHaveBeenCalled();
    expect(tx.payout.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ periodMonth: '2026-10', amountLkr: 4500, earningsSnapshot: [{ studentId: 's1', name: 'Local', region: 'LK', amountLkr: 1500 }, { studentId: 's2', name: 'International', region: 'INTERNATIONAL', amountLkr: 3000 }] }) }));
    expect(tx.monthlyLecturerEarning.updateMany).toHaveBeenCalledWith({ where: { id: { in: ['one', 'two'] }, payoutId: null }, data: { payoutId: 'request' } });
    tx.monthlyLecturerEarning.findMany.mockResolvedValue([]);
    await expect(service.requestPayout('lecturer', 4500, 'bank_transfer', '2026-10')).rejects.toThrow('No unpaid');
    expect(tx.payout.create).toHaveBeenCalledTimes(1);
  });
  it.each([0, -1, NaN, 1500, 4500.01])('rejects invalid or partial monthly request %s', async amount => {
    await expect(service.requestPayout('lecturer', amount, 'bank_transfer', '2026-10')).rejects.toThrow();
    expect(tx.payout.create).not.toHaveBeenCalled();
  });
  it.each(['2026-11', '2026-12', '2026-13', undefined])('rejects current, future or invalid month %s', async month => {
    await expect(service.requestPayout('lecturer', 4500, 'bank_transfer', month as string)).rejects.toThrow();
    expect(tx.payout.create).not.toHaveBeenCalled();
  });
  it('releases monthly earnings after a failed external payout', async () => {
    tx.payout.findUnique.mockResolvedValue({ lecturerId: 'lecturer', sessionBlocksIncluded: [] });
    tx.payout.updateMany.mockResolvedValue({ count: 1 });
    await admin.updatePayoutStatus('request', 'FAILED');
    expect(tx.monthlyLecturerEarning.updateMany).toHaveBeenCalledWith({ where: { payoutId: 'request' }, data: { payoutId: null } });
  });
  it('does not release paid earnings and blocks repeated processing', async () => {
    tx.payout.findUnique.mockResolvedValue({ lecturerId: 'lecturer', sessionBlocksIncluded: [] });
    tx.payout.updateMany.mockResolvedValue({ count: 1 });
    await admin.updatePayoutStatus('request', 'SUCCESSFUL');
    expect(tx.monthlyLecturerEarning.updateMany).not.toHaveBeenCalled();
    tx.payout.updateMany.mockResolvedValue({ count: 0 });
    await expect(admin.updatePayoutStatus('request', 'FAILED')).rejects.toThrow('Only pending');
  });
  it('separates accruing, available and reserved earnings', async () => {
    tx.monthlyLecturerEarning.findMany.mockResolvedValue([
      { periodMonth: '2026-10', amountLkr: 1500, payoutId: null },
      { periodMonth: '2026-11', amountLkr: 3000, payoutId: null },
      { periodMonth: '2026-10', amountLkr: 3000, payoutId: 'pending' },
    ]);
    await expect(service.getBalance('lecturer')).resolves.toMatchObject({ availableLkr: 1500, currentMonthLkr: 3000 });
  });
});
