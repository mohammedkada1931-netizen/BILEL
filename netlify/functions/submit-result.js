import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';

const VALID_LEVELS = ['Débutant', 'Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4'];

function json(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return json({ error: 'Requête invalide' }, 400);
  }

  const { firstName, lastName, age, finalLevel, levelScores } = data;

  if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
    return json({ error: 'Nom et prénom requis' }, 400);
  }
  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum < 3 || ageNum > 25) {
    return json({ error: 'Âge invalide' }, 400);
  }
  if (!VALID_LEVELS.includes(finalLevel)) {
    return json({ error: 'Niveau invalide' }, 400);
  }

  try {
    const store = getStore('results');
    const existing = (await store.get('all-results', { type: 'json' })) || [];

    const record = {
      id: crypto.randomUUID(),
      firstName: firstName.trim().slice(0, 100),
      lastName: lastName.trim().slice(0, 100),
      age: ageNum,
      finalLevel,
      levelScores: levelScores && typeof levelScores === 'object' ? levelScores : {},
      date: new Date().toISOString(),
    };

    existing.push(record);
    await store.setJSON('all-results', existing);

    return json({ ok: true, finalLevel }, 200);
  } catch (err) {
    return json({ error: 'Erreur de sauvegarde', detail: String((err && err.message) || err) }, 500);
  }
};
