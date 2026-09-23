import { getStore } from '@netlify/blobs';
import { studentKey } from './_lib/students.js';

function json(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const url = new URL(req.url);
  const firstName = url.searchParams.get('firstName') || '';
  const lastName = url.searchParams.get('lastName') || '';

  if (!firstName.trim() || !lastName.trim()) {
    return json({ error: 'Nom et prénom requis' }, 400);
  }

  try {
    const store = getStore({ name: 'results', consistency: 'strong' });
    const key = studentKey(firstName, lastName);
    const match = await store.get(key, { type: 'json' });

    return json({ exists: !!match, finalLevel: match ? match.finalLevel : null }, 200);
  } catch (err) {
    return json({ error: 'Erreur de vérification', detail: String((err && err.message) || err) }, 500);
  }
};
