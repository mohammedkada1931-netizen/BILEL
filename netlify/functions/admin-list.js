const { getStore } = require('@netlify/blobs');
const { requireAdmin } = require('./_lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!requireAdmin(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Non autorisé' }) };
  }

  const store = getStore('results');
  const results = (await store.get('all-results', { type: 'json' })) || [];
  results.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results }),
  };
};
