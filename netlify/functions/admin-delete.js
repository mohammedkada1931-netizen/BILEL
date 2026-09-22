const { getStore } = require('@netlify/blobs');
const { requireAdmin } = require('./_lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!requireAdmin(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Non autorisé' }) };
  }

  let id;
  try {
    ({ id } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Requête invalide' }) };
  }
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'id requis' }) };
  }

  const store = getStore('results');
  const existing = (await store.get('all-results', { type: 'json' })) || [];
  const filtered = existing.filter((r) => r.id !== id);
  await store.setJSON('all-results', filtered);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, removed: existing.length !== filtered.length }),
  };
};
