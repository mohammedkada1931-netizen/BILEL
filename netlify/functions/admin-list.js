import { getStore } from '@netlify/blobs';
import { requireAdmin } from './_lib/auth.js';

function json(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  if (!requireAdmin(req)) {
    return json({ error: 'Non autorisé' }, 401);
  }

  try {
    const store = getStore('results');
    const results = (await store.get('all-results', { type: 'json' })) || [];
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    return json({ results }, 200);
  } catch (err) {
    return json({ error: 'Erreur de lecture', detail: String((err && err.message) || err) }, 500);
  }
};
