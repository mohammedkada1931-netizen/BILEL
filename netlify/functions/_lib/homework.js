import crypto from 'node:crypto';

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export function errMsg(err) {
  return String((err && err.message) || err);
}

// Code court et lisible (sans 0/O/1/I) pour partager un devoir dans Classroom.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function newCode() {
  let c = '';
  for (let i = 0; i < 6; i++) c += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  return c;
}

export function cleanCode(code) {
  return String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
}

// Normalisation pour comparer une réponse courte. Par défaut on est tolérant :
// majuscules, accents français, voyelles brèves arabes (tashkîl), taṭwîl, variantes du alif.
// En mode strict (strict = true) on garde les voyelles arabes et les accents.
export function normalizeAnswer(s, strict = false) {
  let t = String(s ?? '').normalize('NFC').replace(/ـ/g, '');
  if (!strict) {
    t = t.normalize('NFD').replace(/\p{M}/gu, '').replace(/[أإآٱ]/g, 'ا').toLowerCase();
  }
  return t
    .replace(/[.,;:!?«»"'’`´،؛؟()\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const str = (v, max) => String(v ?? '').trim().slice(0, max);
const num = (v, min, max, def) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
};

export function sanitizeQuestion(q, i) {
  const type = ['qcm', 'short', 'free'].includes(q && q.type) ? q.type : null;
  if (!type) throw new Error(`Question ${i + 1} : type invalide`);
  const prompt = str(q.prompt, 1500);
  if (!prompt) throw new Error(`Question ${i + 1} : l'énoncé est vide`);
  const out = {
    id: /^[A-Za-z0-9_-]{1,24}$/.test(q.id || '') ? q.id : `q${i + 1}${crypto.randomBytes(2).toString('hex')}`,
    type,
    prompt,
    arabic: str(q.arabic, 400),
    points: Math.round(num(q.points, 0, 100, 1) * 4) / 4,
    explanation: str(q.explanation, 1500),
  };
  if (type === 'qcm') {
    const options = (Array.isArray(q.options) ? q.options : []).map((o) => str(o, 300));
    if (options.length < 2 || options.length > 6 || options.some((o) => !o)) {
      throw new Error(`Question ${i + 1} : il faut 2 à 6 choix, tous remplis`);
    }
    const correct = Number(q.correct);
    if (!Number.isInteger(correct) || correct < 0 || correct >= options.length) {
      throw new Error(`Question ${i + 1} : bonne réponse non définie`);
    }
    out.options = options;
    out.correct = correct;
  } else if (type === 'short') {
    const accepted = (Array.isArray(q.accepted) ? q.accepted : []).map((a) => str(a, 300)).filter(Boolean).slice(0, 20);
    if (!accepted.length) throw new Error(`Question ${i + 1} : indiquez au moins une réponse acceptée`);
    out.accepted = accepted;
    out.strict = !!q.strict;
  } else {
    out.modelAnswer = str(q.modelAnswer, 1500);
  }
  return out;
}

export function sanitizeAssignment(a, existing) {
  const title = str(a.title, 150);
  if (!title) throw new Error('Le titre est obligatoire');
  const questions = (Array.isArray(a.questions) ? a.questions : []).slice(0, 100).map(sanitizeQuestion);
  if (!questions.length) throw new Error('Ajoutez au moins une question');
  const ids = new Set();
  questions.forEach((q) => {
    while (ids.has(q.id)) q.id += 'x';
    ids.add(q.id);
  });
  const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(a.dueDate || '') ? a.dueDate : '';
  return {
    code: existing ? existing.code : newCode(),
    title,
    level: str(a.level, 60),
    instructions: str(a.instructions, 3000),
    dueDate,
    status: ['draft', 'open', 'closed'].includes(a.status) ? a.status : 'draft',
    showCorrection: a.showCorrection !== false,
    shuffle: a.shuffle !== false,
    questions,
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Version publique : sans aucune bonne réponse.
export function publicAssignment(a) {
  return {
    code: a.code,
    title: a.title,
    level: a.level,
    instructions: a.instructions,
    dueDate: a.dueDate,
    shuffle: a.shuffle,
    questions: a.questions.map((q) => ({
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      arabic: q.arabic,
      points: q.points,
      ...(q.type === 'qcm' ? { options: q.options } : {}),
    })),
  };
}

export function isLate(assignment, dateIso) {
  if (!assignment.dueDate) return false;
  return new Date(dateIso) > new Date(`${assignment.dueDate}T23:59:59+01:00`);
}

function gradeAuto(q, answer) {
  if (q.type === 'qcm') {
    if (answer === undefined || answer === null || answer === '') return 0;
    return Number(answer) === q.correct ? q.points : 0;
  }
  if (q.type === 'short') {
    const given = normalizeAnswer(answer, q.strict);
    if (!given) return 0;
    return q.accepted.some((a) => normalizeAnswer(a, q.strict) === given) ? q.points : 0;
  }
  return null; // free : correction manuelle
}

// Calcule la note à partir des réponses de l'élève et des corrections manuelles.
// Toujours recalculé à la lecture : si le professeur corrige une bonne réponse, tout se met à jour.
export function computeResult(assignment, sub) {
  const manual = sub.manual || {};
  const answers = sub.answers || {};
  let score = 0;
  let max = 0;
  let pending = false;
  const perQuestion = {};
  for (const q of assignment.questions) {
    max += q.points;
    const auto = gradeAuto(q, answers[q.id]);
    let points = auto;
    let source = 'auto';
    if (typeof manual[q.id] === 'number') {
      points = Math.min(q.points, Math.max(0, manual[q.id]));
      source = 'manual';
    }
    if (points === null) {
      pending = true;
      perQuestion[q.id] = { points: null, source: 'pending' };
    } else {
      score += points;
      perQuestion[q.id] = { points, source, correct: points >= q.points };
    }
  }
  return { score: Math.round(score * 100) / 100, max, pending, perQuestion };
}

export function correctionFor(q) {
  return {
    ...(q.type === 'qcm' ? { correct: q.correct } : {}),
    ...(q.type === 'short' ? { accepted: q.accepted } : {}),
    ...(q.type === 'free' ? { modelAnswer: q.modelAnswer } : {}),
    explanation: q.explanation,
  };
}

export function sanitizeAnswers(assignment, raw) {
  const out = {};
  const src = raw && typeof raw === 'object' ? raw : {};
  for (const q of assignment.questions) {
    const v = src[q.id];
    if (q.type === 'qcm') {
      const n = Number(v);
      if (v !== null && v !== undefined && v !== '' && Number.isInteger(n) && n >= 0 && n < q.options.length) out[q.id] = n;
    } else {
      const t = str(v, q.type === 'free' ? 5000 : 500);
      if (t) out[q.id] = t;
    }
  }
  return out;
}
