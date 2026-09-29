// LEÇON 1 : JavaScript, les 4 idées de base
//
// 1) Aller chercher un élément de la page  -> document.getElementById("...")
// 2) Lire ce que l'utilisateur a saisi     -> element.value
// 3) Réagir à un clic                      -> addEventListener("click", ...)
// 4) Écrire un résultat dans la page       -> element.textContent = "..."

// Étape 1 : on récupère les éléments du HTML grâce à leur id
const champSurface = document.getElementById("surface");
const choixMateriau = document.getElementById("materiau");
const caseDemolition = document.getElementById("demolition");
const bouton = document.getElementById("calculer");
const resultat = document.getElementById("resultat");

// Prix par m² pour retirer l'ancienne toiture (modifie-le si tu veux)
const PRIX_DEMOLITION = 15;

// Étape 2 : on décrit ce qui se passe quand on clique sur le bouton
bouton.addEventListener("click", function () {
  // .value est toujours du texte, donc on le convertit en nombre
  const surface = Number(champSurface.value);
  const prixMateriau = Number(choixMateriau.value);

  // Vérification : si la surface est vide ou négative, on arrête
  if (!surface || surface <= 0) {
    resultat.textContent = "Entre une surface valide.";
    resultat.className = "resultat erreur";
    return;
  }

  // Calcul du prix par m²
  let prixParM2 = prixMateriau;
  if (caseDemolition.checked) {
    prixParM2 = prixParM2 + PRIX_DEMOLITION;
  }

  const total = surface * prixParM2;

  // Étape 3 : on affiche le résultat, formaté en euros
  resultat.textContent = "Estimation : " + total.toLocaleString("fr-FR") + " €";
  resultat.className = "resultat";
});
