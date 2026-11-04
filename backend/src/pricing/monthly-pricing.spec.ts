import { colomboMonth, monthPeriod, monthlyQuote, studentRegion } from './monthly-pricing';

describe('ILMBIT monthly tuition', () => {
  it.each([
    ['LK', 'Standard', 1, 5500, 5500],
    ['LK', 'Standard', 2, 4950, 9900],
    ['LK', 'Standard', 3, 4675, 14025],
    ['INTERNATIONAL', 'Standard', 1, 49, 49],
    ['INTERNATIONAL', 'Standard', 2, 44.1, 88.2],
    ['INTERNATIONAL', 'Standard', 3, 41.65, 124.95],
    ['INTERNATIONAL', 'Fast Track', 1, 69, 69],
    ['INTERNATIONAL', 'Fast Track', 2, 62.1, 124.2],
    ['INTERNATIONAL', 'Fast Track', 3, 58.65, 175.95],
  ])('%s %s package of %i has exact monetary totals', (region, tier, size, each, total) => {
    expect(monthlyQuote(tier as string, region as string, size as number)).toMatchObject({ feePerStudent: each, total });
  });
  it.each([0, 4, 1.5, '2', null, NaN, Infinity])('rejects invalid package size %s', size => {
    expect(() => monthlyQuote('Standard', 'LK', size as number)).toThrow();
  });
  it('rejects unconfigured regions, tiers and local Fast Track', () => {
    expect(() => monthlyQuote('Standard', 'USA', 1)).toThrow();
    expect(() => monthlyQuote('Group', 'LK', 1)).toThrow();
    expect(() => monthlyQuote('Fast Track', 'LK', 1)).toThrow();
  });
  it.each(['LK', ' LKA ', 'sri lanka', 'Sri Lanka'])('recognizes local country %s', country => expect(studentRegion(country)).toBe('LK'));
  it('requires a country and treats other countries as international', () => {
    expect(() => studentRegion('')).toThrow();
    expect(studentRegion('United Kingdom')).toBe('INTERNATIONAL');
  });
  it('uses Sri Lanka boundaries at month and year rollover', () => {
    expect(colomboMonth(new Date('2026-10-31T18:29:59Z'))).toBe('2026-10');
    expect(colomboMonth(new Date('2026-10-31T18:30:00Z'))).toBe('2026-11');
    expect(monthPeriod('2026-12')).toEqual({ start: new Date('2026-11-30T18:30:00Z'), end: new Date('2026-12-31T18:30:00Z') });
    expect(monthPeriod('2028-02').end).toEqual(new Date('2028-02-29T18:30:00Z'));
  });
  it.each(['2026-00', '2026-13', '2026-1', '2026-11-01', '', undefined])('rejects malformed month %s', month => expect(() => monthPeriod(month as string)).toThrow());
});
