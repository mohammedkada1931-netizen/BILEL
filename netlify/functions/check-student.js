import { getStore } from '@netlify/blobs';

function json(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function normalize(s) {
  return (s || '').trim().toLowerCase();
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
    const store = getStore('results');
    const existing = (await store.get('all-results', { type: 'json' })) || [];
    const match = existing.find(
      (r) => normalize(r.firstName) === normalize(firstName) && normalize(r.lastName) === normalize(lastName)
    );

    return json({ exists: !!match, finalLevel: match ? match.finalLevel : null }, 200);
  } catch (err) {
    return json({ error: 'Erreur de vérification', detail: String((err && err.message) || err) }, 500);
  }
};
