import { getStore } from '@netlify/blobs';
import { json, errMsg, publicAssignment, cleanCode } from './_lib/homework.js';

// Public (élèves).
// GET            → liste des devoirs ouverts
// GET ?code=XXXX → énoncé d'un devoir (sans les bonnes réponses)
export default async (req) => {
  if (req.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });
  const assignments = getStore({ name: 'assignments', consistency: 'strong' });

  try {
    const code = cleanCode(new URL(req.url).searchParams.get('code'));
    if (code) {
      const a = await assignments.get(code, { type: 'json' });
      // Un brouillon n'est visible que par le professeur.
      if (!a || a.status === 'draft') return json({ error: 'Code de devoir inconnu' }, 404);
      return json({ assignment: publicAssignment(a), closed: a.status === 'closed' });
    }

    const { blobs } = await assignments.list();
    const list = (await Promise.all(blobs.map((b) => assignments.get(b.key, { type: 'json' }))))
      .filter((a) => a && a.questions && a.status === 'open')
      .map((a) => ({ code: a.code, title: a.title, level: a.level, dueDate: a.dueDate, questionCount: a.questions.length }))
      .sort((x, y) => (x.dueDate || '9999').localeCompare(y.dueDate || '9999'));
    return json({ assignments: list });
  } catch (err) {
    return json({ error: 'Erreur de lecture', detail: errMsg(err) }, 500);
  }
};
