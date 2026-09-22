const { makeToken } = require('./_lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let password;
  try {
    ({ password } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Requête invalide' }) };
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Le mot de passe admin n'est pas configuré côté serveur (ADMIN_PASSWORD)." }),
    };
  }

  if (!password || password !== expected) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Mot de passe incorrect' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: makeToken() }),
  };
};
