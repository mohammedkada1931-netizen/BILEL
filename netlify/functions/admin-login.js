import { makeToken } from './_lib/auth.js';

function json(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let password;
  try {
    ({ password } = await req.json());
  } catch {
    return json({ error: 'Requête invalide' }, 400);
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return json({ error: "Le mot de passe admin n'est pas configuré côté serveur (ADMIN_PASSWORD)." }, 500);
  }

  if (!password || password !== expected) {
    return json({ error: 'Mot de passe incorrect' }, 401);
  }

  return json({ token: makeToken() }, 200);
};
