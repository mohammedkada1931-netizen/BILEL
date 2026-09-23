export function normalize(s) {
  return (s || '').trim().toLowerCase();
}

// Une clé de stockage par élève (nom+prénom normalisés) : chaque élève écrit dans sa
// propre clé, donc les écritures simultanées de centaines d'élèves ne se marchent jamais
// dessus (pas de lecture-modification-écriture sur un tableau partagé). Ça sert aussi de
// verrou naturel contre le double passage du test.
export function studentKey(firstName, lastName) {
  return `${normalize(lastName)}--${normalize(firstName)}`;
}
