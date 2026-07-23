const AUTH_URL = 'https://auth.edalnice.gov.cz/auth/connect/token';
const API_URL = 'https://eshop.edalnice.gov.cz/api/v3/charge_registrations';

// Public SPA credentials and country UUID for CZE
const BASIC_AUTH = 'Basic ZXNob3AuY2xpZW50OjVxejNYUXVBbV9fYkpVZ0FEVEN5UCo=';
const CZE_UUID = '3906ba89-153c-4038-8e36-0ca1deb76076';

async function checkVignette(plate) {
  const normalizedPlate = plate.replace(/[\s-]/g, '').toUpperCase();

  // Fetch access token
  const tokenRes = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      'Authorization': BASIC_AUTH,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://edalnice.gov.cz',
      'Referer': 'https://edalnice.gov.cz/'
    },
    body: 'grant_type=client_credentials&scope=eshop.api'
  });

  if (!tokenRes.ok) throw new Error(`Auth failed: ${tokenRes.status}`);
  const { access_token } = await tokenRes.json();

  // Query vignette status
  const apiRes = await fetch(`${API_URL}/${CZE_UUID}/${normalizedPlate}`, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Accept': 'application/json',
      'Origin': 'https://edalnice.gov.cz',
      'Referer': 'https://edalnice.gov.cz/'
    }
  });

  if (!apiRes.ok) throw new Error(`Lookup failed: ${apiRes.status}`);
  return await apiRes.json();
}

// Example usage
const plateInput = process.argv[2] || '1AB1234';

checkVignette(plateInput)
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch((err) => console.error(err.message));
