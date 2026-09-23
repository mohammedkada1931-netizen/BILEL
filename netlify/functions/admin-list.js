import { getStore } from '@netlify/blobs';
import { requireAdmin } from './_lib/auth.js';

const VALID_LEVELS = ['Débutant', 'Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4'];

function json(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function isValidRecord(data) {
  return (
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    typeof data.firstName === 'string' &&
    typeof data.lastName === 'string' &&
    VALID_LEVELS.includes(data.finalLevel)
  );
}

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  if (!requireAdmin(req)) {
    return json({ error: 'Non autorisé' }, 401);
  }

  try {
    // Cohérence forte : sans ça, la liste peut mettre jusqu'à 60s à refléter
    // un résultat qui vient d'être enregistré.
    const store = getStore({ name: 'results', consistency: 'strong' });
    const { blobs } = await store.list();

    const results = (
      await Promise.all(
        blobs.map(async (b) => {
          const data = await store.get(b.key, { type: 'json' });
          // Écarte les entrées invalides, notamment l'ancienne clé "all-results"
          // (un tableau) héritée de l'ancien format de stockage.
          return isValidRecord(data) ? { ...data, id: b.key } : null;
        })
      )
    ).filter(Boolean);

    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    return json({ results }, 200);
  } catch (err) {
    return json({ error: 'Erreur de lecture', detail: String((err && err.message) || err) }, 500);
  }
};
