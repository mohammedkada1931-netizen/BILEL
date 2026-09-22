import { getStore } from '@netlify/blobs';
import { requireAdmin } from './_lib/auth.js';

function json(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  if (!requireAdmin(req)) {
    return json({ error: 'Non autorisé' }, 401);
  }

  let id;
  try {
    ({ id } = await req.json());
  } catch {
    return json({ error: 'Requête invalide' }, 400);
  }
  if (!id) {
    return json({ error: 'id requis' }, 400);
  }

  try {
    const store = getStore('results');
    const existing = (await store.get('all-results', { type: 'json' })) || [];
    const filtered = existing.filter((r) => r.id !== id);
    await store.setJSON('all-results', filtered);

    return json({ ok: true, removed: existing.length !== filtered.length }, 200);
  } catch (err) {
    return json({ error: 'Erreur de suppression', detail: String((err && err.message) || err) }, 500);
  }
};
