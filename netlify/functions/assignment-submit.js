import { getStore } from '@netlify/blobs';
import { studentKey } from './_lib/students.js';
import { json, errMsg, cleanCode, sanitizeAnswers, computeResult, correctionFor, isLate } from './_lib/homework.js';

function studentView(a, sub) {
  const result = computeResult(a, sub);
  return {
    score: result.score,
    max: result.max,
    pending: result.pending,
    comment: sub.comment || '',
    late: !!sub.late,
    date: sub.date,
    questions: a.showCorrection
      ? a.questions.map((q) => ({
          id: q.id,
          type: q.type,
          prompt: q.prompt,
          arabic: q.arabic,
          options: q.options,
          points: q.points,
          answer: sub.answers[q.id] ?? null,
          result: result.perQuestion[q.id],
          ...correctionFor(q),
        }))
      : null,
  };
}

// POST {code, firstName, lastName, answers}  → enregistre et corrige automatiquement
// GET ?code&firstName&lastName               → l'élève retrouve sa note et sa correction
export default async (req) => {
  const assignments = getStore({ name: 'assignments', consistency: 'strong' });
  const submissions = getStore({ name: 'submissions', consistency: 'strong' });

  try {
    if (req.method === 'GET') {
      const p = new URL(req.url).searchParams;
      const code = cleanCode(p.get('code'));
      if (!code || !(p.get('firstName') || '').trim() || !(p.get('lastName') || '').trim()) {
        return json({ error: 'Code, nom et prénom requis' }, 400);
      }
      const a = await assignments.get(code, { type: 'json' });
      if (!a || a.status === 'draft') return json({ error: 'Code de devoir inconnu' }, 404);
      const sub = await submissions.get(`${code}/${studentKey(p.get('firstName'), p.get('lastName'))}`, { type: 'json' });
      if (!sub) return json({ exists: false });
      return json({ exists: true, result: studentView(a, sub) });
    }

    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Requête invalide' }, 400);
    }
    const code = cleanCode(body.code);
    const firstName = String(body.firstName || '').trim().slice(0, 100);
    const lastName = String(body.lastName || '').trim().slice(0, 100);
    if (!code) return json({ error: 'Code du devoir requis' }, 400);
    if (!firstName || !lastName) return json({ error: 'Nom et prénom requis' }, 400);

    const a = await assignments.get(code, { type: 'json' });
    if (!a || a.status === 'draft') return json({ error: 'Code de devoir inconnu' }, 404);
    if (a.status === 'closed') return json({ error: 'Ce devoir est fermé, il n\'accepte plus de rendus.' }, 403);

    const key = `${code}/${studentKey(firstName, lastName)}`;
    if (await submissions.get(key, { type: 'json' })) {
      return json({ error: 'Tu as déjà rendu ce devoir. Demande à ton professeur si tu dois le refaire.' }, 409);
    }

    const date = new Date().toISOString();
    const sub = {
      firstName,
      lastName,
      answers: sanitizeAnswers(a, body.answers),
      manual: {},
      comment: '',
      late: isLate(a, date),
      date,
    };
    await submissions.setJSON(key, sub);
    return json({ ok: true, result: studentView(a, sub) });
  } catch (err) {
    return json({ error: 'Erreur de sauvegarde', detail: errMsg(err) }, 500);
  }
};
