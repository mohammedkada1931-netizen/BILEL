# École Arabe de la Mosquée — Test de niveau

Site de test de placement pour les élèves de la section arabe de la mosquée.

## Fonctionnement

1. L'élève arrive sur la page d'accueil et **doit** renseigner son prénom, son nom et son âge pour pouvoir commencer.
2. Le test commence toujours par le niveau **Débutant** (10 questions : reconnaissance des lettres, sons, voyelles courtes).
3. S'il réussit un niveau (≥ 70% de bonnes réponses), il passe automatiquement au niveau suivant :
   `Débutant → Niveau 1 → Niveau 2 → Niveau 3`.
4. S'il échoue à un niveau, le test s'arrête et **ce niveau devient son niveau final** (c'est le niveau où il doit être inscrit pour progresser).
5. S'il réussit même le Niveau 3, il est classé **Niveau 4** (niveau avancé).
6. L'élève ne voit **que son niveau final** — jamais ses notes ni ses réponses.
7. Chaque résultat (nom, prénom, âge, niveau, détail des scores par niveau, date) est envoyé et sauvegardé côté serveur.
8. Vous seul (directeur), via `/admin.html` avec un mot de passe, pouvez consulter **tous** les résultats, filtrer, chercher, trier et exporter en CSV.

## Correspondance avec vos livres

D'après les manuels envoyés, la progression du test suit celle de vos supports :

- **Débutant** : alphabet, lettres isolées, voyelles courtes (harakat) — équivalent au tout début de *"تعلم اللغة العربية" (niveau 1)*.
- **Niveau 1** : lecture de mots simples, vocabulaire de base, chiffres, couleurs — correspond à *"لغتنا العربية - يسر لا عسر" niveau 1* et à la suite de *"تعلم اللغة العربية" niveau 1*.
- **Niveau 2** : lecture de phrases courtes, genre (مذكر/مؤنث), pluriel, article défini — correspond à *"لغتنا العربية - يسر لا عسر" niveau 2* et à *"تعلم اللغة العربية" niveau 2*.
- **Niveau 3** : lecture de petits textes, conjugaison passé/présent, analyse simple de phrase (فاعل/مفعول به) — correspond à *"تعلم اللغة العربية" niveau 3*.
- **Niveau 4** : élève qui maîtrise déjà tout le contenu du niveau 3 → prêt pour la suite du programme.

Les questions actuelles sont un premier jeu de test générique, basé sur une progression classique de l'arabe pour enfants. **Vous pourrez facilement les remplacer ou les enrichir** avec les vraies leçons de vos livres (voir plus bas).

## Configuration avant mise en ligne (Netlify)

Le site est prêt à être déployé sur Netlify (fichier `netlify.toml` déjà configuré, fonctions serverless + stockage Netlify Blobs pour les résultats — aucune base de données externe à payer/configurer).

Dans les paramètres du site Netlify → **Environment variables**, ajoutez :

| Variable | Description |
|---|---|
| `ADMIN_PASSWORD` | Le mot de passe pour accéder à `/admin.html` (à choisir, gardez-le secret). |
| `SESSION_SECRET` | Une chaîne aléatoire longue (ex: générée avec `openssl rand -hex 32`) utilisée pour sécuriser la session admin. |

Sans `ADMIN_PASSWORD`, la page admin refusera toute connexion (sécurité par défaut).

## Modifier les questions

Toutes les questions sont dans `public/questions.js`, organisées par niveau (`debutant`, `niveau1`, `niveau2`, `niveau3`). Chaque question a la forme :

```js
{
  prompt: 'Texte de la question (en français)',
  arabic: 'كلمة أو حرف بالعربية', // optionnel, affiché en grand
  options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'],
  correct: 0, // index (0 à 3) de la bonne réponse
}
```

Le seuil de réussite (`PASS_THRESHOLD`, actuellement 70%) est modifiable en haut du même fichier.

## Structure du projet

```
public/               Site (pages HTML, CSS, questions)
  index.html           Page d'accueil (formulaire élève)
  test.html            Déroulé du test
  admin.html           Tableau de bord direction
  questions.js         Banque de questions par niveau
  styles.css           Styles

netlify/functions/     API serverless
  submit-result.js     Enregistre le résultat d'un élève
  admin-login.js        Connexion admin (mot de passe)
  admin-list.js          Liste tous les résultats (protégé)
  admin-delete.js        Supprime un résultat (protégé)
```

## Développement local

Aucune étape de build n'est nécessaire pour le front (HTML/CSS/JS natifs). Pour tester avec les fonctions serverless en local, utilisez la CLI Netlify :

```bash
npm install
npx netlify dev
```
