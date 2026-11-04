export const dynamic = 'force-dynamic';

const COUNTRY_HEADERS = [
  'x-vercel-ip-country',
  'cf-ipcountry',
  'cloudfront-viewer-country',
  'x-country-code',
  'x-appengine-country',
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const clientTz = url.searchParams.get('tz') || '';
  const clientLocale = url.searchParams.get('loc') || '';

  // 1. Detect country from edge / CDN headers
  const headerCountry = COUNTRY_HEADERS
    .map((header) => request.headers.get(header))
    .find((value) => value && value !== 'XX');

  const normalizedCountry = headerCountry ? headerCountry.toUpperCase() : null;

  // 2. Identify client timezone and locale signals
  const isColomboTimezone = clientTz.toLowerCase().includes('colombo') || clientTz === 'Asia/Colombo';
  const isSriLankanLocale = clientLocale.toLowerCase().endsWith('-lk') || clientLocale.toLowerCase().startsWith('si') || clientLocale.toLowerCase().startsWith('ta');

  let isSriLanka = false;
  let vpnDetected = false;
  let finalCountry = normalizedCountry || (isColomboTimezone ? 'LK' : 'US');

  // 3. Anti-VPN & Geo cross-referencing logic:
  if (normalizedCountry === 'LK') {
    // Edge IP says Sri Lanka:
    if (clientTz && !isColomboTimezone && clientTz !== 'UTC') {
      // Client's browser timezone belongs to another country (e.g., America, Europe, Australia).
      // They are an international user attempting to use a Sri Lankan VPN proxy.
      vpnDetected = true;
      isSriLanka = false;
      finalCountry = 'US'; // Route to international
    } else {
      isSriLanka = true;
      finalCountry = 'LK';
    }
  } else if (normalizedCountry) {
    // Edge IP says outside Sri Lanka:
    if (isColomboTimezone || isSriLankanLocale) {
      // Real user physically in Sri Lanka using a foreign corporate or travel VPN.
      vpnDetected = true;
      isSriLanka = true;
      finalCountry = 'LK';
    } else {
      isSriLanka = false;
    }
  } else {
    // Localhost or headers absent: use device timezone
    if (isColomboTimezone) {
      isSriLanka = true;
      finalCountry = 'LK';
    } else {
      isSriLanka = false;
      finalCountry = 'US';
    }
  }

  const region: 'LK' | 'INTERNATIONAL' = isSriLanka ? 'LK' : 'INTERNATIONAL';
  const currency: 'LKR' | 'USD' = isSriLanka ? 'LKR' : 'USD';

  return Response.json({
    country: finalCountry,
    region,
    isSriLanka,
    currency,
    vpnDetected,
  });
}
