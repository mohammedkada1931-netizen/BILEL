import { getStore } from '@netlify/blobs';
import { requireAdmin } from './_lib/auth.js';
import { json, errMsg, sanitizeAssignment, computeResult, cleanCode } from './_lib/homework.js';

// GET            → liste de tous les devoirs (avec nombre de rendus et moyenne)
// GET ?code=XXXX → un devoir complet (avec les corrections)
// POST {assignment}              → crée ou met à jour (assignment.code présent = mise à jour)
// POST {action:'delete', code}   → supprime le devoir ET ses rendus
export default async (req) => {
  if (!requireAdmin(req)) return json({ error: 'Non autorisé' }, 401);

  const assignments = getStore({ name: 'assignments', consistency: 'strong' });
  const submissions = getStore({ name: 'submissions', consistency: 'strong' });

  try {
    if (req.method === 'GET') {
      const code = cleanCode(new URL(req.url).searchParams.get('code'));
      if (code) {
        const a = await assignments.get(code, { type: 'json' });
        return a ? json({ assignment: a }) : json({ error: 'Devoir introuvable' }, 404);
      }
      const { blobs } = await assignments.list();
      const list = (
        await Promise.all(
          blobs.map(async (b) => {
            const a = await assignments.get(b.key, { type: 'json' });
            if (!a || !a.questions) return null;
            const { blobs: subBlobs } = await submissions.list({ prefix: `${a.code}/` });
            const subs = (await Promise.all(subBlobs.map((s) => submissions.get(s.key, { type: 'json' })))).filter(Boolean);
            const results = subs.map((s) => computeResult(a, s));
            const graded = results.filter((r) => r.max > 0);
            const avg = graded.length ? graded.reduce((t, r) => t + r.score / r.max, 0) / graded.length : null;
            return {
              code: a.code,
              title: a.title,
              level: a.level,
              dueDate: a.dueDate,
              status: a.status,
              questionCount: a.questions.length,
              createdAt: a.createdAt,
              submissionCount: subs.length,
              pendingCount: results.filter((r) => r.pending).length,
              average: avg,
            };
          })
        )
      ).filter(Boolean);
      list.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
      return json({ assignments: list });
    }

    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Requête invalide' }, 400);
    }

    if (body.action === 'delete') {
      const code = cleanCode(body.code);
      if (!code) return json({ error: 'code requis' }, 400);
      const { blobs } = await submissions.list({ prefix: `${code}/` });
      await Promise.all(blobs.map((b) => submissions.delete(b.key)));
      await assignments.delete(code);
      return json({ ok: true });
    }

    const input = body.assignment || {};
    const existing = input.code ? await assignments.get(cleanCode(input.code), { type: 'json' }) : null;
    if (input.code && !existing) return json({ error: 'Devoir introuvable' }, 404);

    let record;
    try {
      record = sanitizeAssignment(input, existing);
    } catch (e) {
      return json({ error: errMsg(e) }, 400);
    }
    await assignments.setJSON(record.code, record);
    return json({ ok: true, assignment: record });
  } catch (err) {
    return json({ error: 'Erreur serveur', detail: errMsg(err) }, 500);
  }
};
