const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

const VALID_LEVELS = ['Débutant', 'Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4'];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Requête invalide' }) };
  }

  const { firstName, lastName, age, finalLevel, levelScores } = data;

  if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Nom et prénom requis' }) };
  }
  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum < 3 || ageNum > 25) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Âge invalide' }) };
  }
  if (!VALID_LEVELS.includes(finalLevel)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Niveau invalide' }) };
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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, finalLevel }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Erreur de sauvegarde', detail: String(err && err.message || err) }),
    };
  }
};
