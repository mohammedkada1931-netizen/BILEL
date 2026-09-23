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
    const store = getStore({ name: 'results', consistency: 'strong' });
    await store.delete(id);

    return json({ ok: true }, 200);
  } catch (err) {
    return json({ error: 'Erreur de suppression', detail: String((err && err.message) || err) }, 500);
  }
};
