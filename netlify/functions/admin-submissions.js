import { getStore } from '@netlify/blobs';
import { requireAdmin } from './_lib/auth.js';
import { json, errMsg, computeResult, cleanCode } from './_lib/homework.js';

// GET ?code=XXXX → devoir + tous les rendus, notes déjà calculées + statistiques par question
// POST {action:'grade', code, key, manual:{qid:points}, comment}
// POST {action:'delete', code, key}   → supprime un rendu (l'élève pourra refaire le devoir)
export default async (req) => {
  if (!requireAdmin(req)) return json({ error: 'Non autorisé' }, 401);

  const assignments = getStore({ name: 'assignments', consistency: 'strong' });
  const submissions = getStore({ name: 'submissions', consistency: 'strong' });

  try {
    if (req.method === 'GET') {
      const code = cleanCode(new URL(req.url).searchParams.get('code'));
      const a = code && (await assignments.get(code, { type: 'json' }));
      if (!a) return json({ error: 'Devoir introuvable' }, 404);

      const { blobs } = await submissions.list({ prefix: `${code}/` });
      const rows = (
        await Promise.all(
          blobs.map(async (b) => {
            const s = await submissions.get(b.key, { type: 'json' });
            if (!s || !s.answers) return null;
            return { key: b.key, ...s, result: computeResult(a, s) };
          })
        )
      ).filter(Boolean);
      rows.sort((x, y) => `${x.lastName} ${x.firstName}`.localeCompare(`${y.lastName} ${y.firstName}`, 'fr'));

      const stats = a.questions.map((q) => {
        const answered = rows.filter((r) => r.result.perQuestion[q.id].points !== null);
        const right = answered.filter((r) => r.result.perQuestion[q.id].correct).length;
        const distribution = {};
        if (q.type === 'qcm') {
          rows.forEach((r) => {
            const v = r.answers[q.id];
            const k = v === undefined ? '—' : String(v);
            distribution[k] = (distribution[k] || 0) + 1;
          });
        }
        return { id: q.id, answered: answered.length, right, distribution };
      });

      return json({ assignment: a, submissions: rows, stats });
    }

    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Requête invalide' }, 400);
    }
    const code = cleanCode(body.code);
    const key = String(body.key || '');
    if (!code || !key.startsWith(`${code}/`)) return json({ error: 'Paramètres invalides' }, 400);

    if (body.action === 'delete') {
      await submissions.delete(key);
      return json({ ok: true });
    }

    if (body.action === 'grade') {
      const a = await assignments.get(code, { type: 'json' });
      const s = await submissions.get(key, { type: 'json' });
      if (!a || !s) return json({ error: 'Introuvable' }, 404);
      const manual = {};
      const input = body.manual && typeof body.manual === 'object' ? body.manual : {};
      for (const q of a.questions) {
        const v = input[q.id];
        if (v === '' || v === null || v === undefined) continue;
        const n = Number(v);
        if (Number.isFinite(n)) manual[q.id] = Math.min(q.points, Math.max(0, n));
      }
      s.manual = manual;
      s.comment = String(body.comment || '').slice(0, 2000);
      s.gradedAt = new Date().toISOString();
      await submissions.setJSON(key, s);
      return json({ ok: true, result: computeResult(a, s) });
    }

    return json({ error: 'Action inconnue' }, 400);
  } catch (err) {
    return json({ error: 'Erreur serveur', detail: errMsg(err) }, 500);
  }
};
