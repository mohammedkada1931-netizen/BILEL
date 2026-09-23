import { getStore } from '@netlify/blobs';
import { studentKey } from './_lib/students.js';

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
    // Stockage strongly-consistent : évite toute ambiguïté quand des centaines d'élèves
    // écrivent en même temps.
    const store = getStore({ name: 'results', consistency: 'strong' });
    const key = studentKey(firstName, lastName);

    const existing = await store.get(key, { type: 'json' });
    if (existing) {
      return json(
        { error: 'Un résultat existe déjà pour ce nom. Chaque élève ne peut passer le test qu\'une seule fois.' },
        409
      );
    }

    const record = {
      firstName: firstName.trim().slice(0, 100),
      lastName: lastName.trim().slice(0, 100),
      age: ageNum,
      finalLevel,
      levelScores: levelScores && typeof levelScores === 'object' ? levelScores : {},
      date: new Date().toISOString(),
    };

    // Chaque élève écrit uniquement dans SA propre clé : aucune écriture concurrente
    // de deux élèves différents ne peut jamais entrer en conflit ni s'écraser.
    await store.setJSON(key, record);

    return json({ ok: true, finalLevel }, 200);
  } catch (err) {
    return json({ error: 'Erreur de sauvegarde', detail: String((err && err.message) || err) }, 500);
  }
};
