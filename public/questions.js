// Banque de questions du test de placement — École Arabe de la Mosquée
// Chaque niveau est un test indépendant. Seuil de réussite : 70%.
// L'élève commence toujours par "Débutant" et progresse tant qu'il réussit.

export const PASS_THRESHOLD = 0.7;

export const LEVEL_ORDER = ['debutant', 'niveau1', 'niveau2', 'niveau3'];

export const LEVEL_LABELS = {
  debutant: 'Débutant',
  niveau1: 'Niveau 1',
  niveau2: 'Niveau 2',
  niveau3: 'Niveau 3',
  niveau4: 'Niveau 4',
};

export const LEVELS = {
  debutant: {
    label: 'Débutant',
    description: 'Reconnaissance des lettres et des sons de base',
    questions: [
      {
        prompt: 'Quelle est cette lettre ؟',
        arabic: 'ا',
        options: ['أَلِف', 'بَاء', 'تَاء', 'ثَاء'],
        correct: 0,
      },
      {
        prompt: 'Quelle est cette lettre ؟',
        arabic: 'م',
        options: ['نُون', 'مِيم', 'لَام', 'رَاء'],
        correct: 1,
      },
      {
        prompt: 'Quel mot commence par la lettre "ب" ؟',
        options: ['بَيْت', 'شَمْس', 'قَمَر', 'مَاء'],
        correct: 0,
      },
      {
        prompt: 'Quelle lettre fait le son "س" ؟',
        options: ['ش', 'ص', 'س', 'ز'],
        correct: 2,
      },
      {
        prompt: 'Sur la lettre "بَ", quelle voyelle est écrite ؟',
        options: ['فَتْحَة (a)', 'كَسْرَة (i)', 'ضَمَّة (ou)', 'سُكُون'],
        correct: 0,
      },
      {
        prompt: 'Sur la lettre "بِ", quelle voyelle est écrite ؟',
        options: ['فَتْحَة (a)', 'كَسْرَة (i)', 'ضَمَّة (ou)', 'سُكُون'],
        correct: 1,
      },
      {
        prompt: 'Quel mot veut dire "soleil" ؟',
        options: ['شَمْس', 'قَمَر', 'بَيْت', 'مَاء'],
        correct: 0,
      },
      {
        prompt: 'Que signifie le mot "قَمَر" ؟',
        options: ['Soleil', 'Lune', 'Étoile', 'Ciel'],
        correct: 1,
      },
      {
        prompt: 'Quelle est cette lettre ؟',
        arabic: 'ع',
        options: ['غَيْن', 'عَيْن', 'حَاء', 'خَاء'],
        correct: 1,
      },
      {
        prompt: 'Quel mot se lit "بَاب" (porte) ؟',
        options: ['بَاب', 'بَيْت', 'بَاز', 'تَاب'],
        correct: 0,
      },
    ],
  },

  niveau1: {
    label: 'Niveau 1',
    description: 'Lecture de mots simples et vocabulaire de base',
    questions: [
      {
        prompt: 'Lisez : "الْوَلَدُ يَلْعَبُ". Que fait le garçon ؟',
        options: ['Il mange', 'Il joue', 'Il dort', 'Il lit'],
        correct: 1,
      },
      {
        prompt: 'Que signifie le mot "أُمّ" ؟',
        options: ['Père', 'Mère', 'Frère', 'Sœur'],
        correct: 1,
      },
      {
        prompt: 'Complétez : "أَنَا ___ الطَّعَامَ" (je mange la nourriture)',
        options: ['أَذْهَبُ', 'آكُلُ', 'أَشْرَبُ', 'أَلْعَبُ'],
        correct: 1,
      },
      {
        prompt: 'Quel mot signifie "maison" ؟',
        options: ['مَدْرَسَة', 'بَيْت', 'شَجَرَة', 'سَيَّارَة'],
        correct: 1,
      },
      {
        prompt: 'Quelle est l\'orthographe correcte du mot "école" ؟',
        options: ['مدرصة', 'مدرسه', 'مدرسة', 'مدرصه'],
        correct: 2,
      },
      {
        prompt: 'Lisez : "هَذَا وَلَدٌ صَغِير". De qui parle-t-on ؟',
        options: ['Un garçon', 'Une fille', 'Un chat', 'Un livre'],
        correct: 0,
      },
      {
        prompt: 'Suite logique : وَاحِد، اِثْنَان، ثَلَاثَة، ___',
        options: ['خَمْسَة', 'أَرْبَعَة', 'سِتَّة', 'سَبْعَة'],
        correct: 1,
      },
      {
        prompt: 'Quelle couleur est "أَحْمَر" ؟',
        options: ['Bleu', 'Vert', 'Rouge', 'Jaune'],
        correct: 2,
      },
      {
        prompt: 'Quel mot signifie "eau" ؟',
        options: ['نَار', 'مَاء', 'هَوَاء', 'أَرْض'],
        correct: 1,
      },
      {
        prompt: 'Lisez : "الْبِنْتُ تَقْرَأُ". Que fait la fille ؟',
        options: ['Elle écrit', 'Elle court', 'Elle lit', 'Elle chante'],
        correct: 2,
      },
    ],
  },

  niveau2: {
    label: 'Niveau 2',
    description: 'Lecture de phrases simples',
    questions: [
      {
        prompt: 'Lisez : "ذَهَبَتْ فَاطِمَةُ إِلَى الْمَدْرَسَةِ صَبَاحًا." Qui est allé(e) à l\'école ؟',
        options: ['Le frère', 'Fatima', 'Le père', 'La maîtresse'],
        correct: 1,
      },
      {
        prompt: 'Quel mot veut dire "des filles" ؟',
        options: ['بِنْت', 'بَنَات', 'وَلَد', 'أَوْلَاد'],
        correct: 1,
      },
      {
        prompt: 'Ajoutez "le/la" (اَل) correctement à "كِتَاب" (livre) :',
        options: ['أَلكِتَاب', 'الْكِتَاب', 'كِتَابَال', 'لْكِتَاب'],
        correct: 1,
      },
      {
        prompt: 'Complétez : "هُوَ ___ إِلَى السُّوقِ" (il va au marché)',
        options: ['ذَهَبَ', 'يَذْهَبُ', 'اِذْهَبْ', 'ذَاهِب'],
        correct: 1,
      },
      {
        prompt: 'Quel est le contraire de "كَبِير" (grand) ؟',
        options: ['طَوِيل', 'صَغِير', 'قَصِير', 'جَمِيل'],
        correct: 1,
      },
      {
        prompt: 'Lisez : "سَافَرَ أَخِي إِلَى تُونِس." Où est parti le frère ؟',
        options: ['En Tunisie', 'Au Maroc', 'En Égypte', 'En France'],
        correct: 0,
      },
      {
        prompt: 'Lisez : "أَكَلَ الْوَلَدُ التُّفَّاحَةَ." Qu\'est-ce que le garçon a mangé ؟',
        options: ['Du pain', 'Une pomme', 'Une orange', 'Du riz'],
        correct: 1,
      },
      {
        prompt: 'Complétez : "نَحْنُ ___ فِي الْحَدِيقَةِ" (nous jouons dans le jardin)',
        options: ['يَلْعَبُ', 'تَلْعَبُ', 'نَلْعَبُ', 'أَلْعَبُ'],
        correct: 2,
      },
      {
        prompt: 'Que signifie "مُعَلِّم" ؟',
        options: ['Élève', 'Enseignant', 'Docteur', 'Voisin'],
        correct: 1,
      },
      {
        prompt: 'Lisez : "الْبَيْتُ كَبِيرٌ وَجَمِيلٌ." Comment est la maison ؟',
        options: ['Petite et laide', 'Grande et belle', 'Vieille', 'Vide'],
        correct: 1,
      },
    ],
  },

  niveau3: {
    label: 'Niveau 3',
    description: 'Lecture de petits textes et conjugaison simple',
    questions: [
      {
        prompt:
          'Lisez : "فِي الصَّبَاحِ، اسْتَيْقَظَ سَامِي بَاكِرًا، ثُمَّ ذَهَبَ إِلَى الْمَسْجِدِ لِصَلَاةِ الْفَجْرِ." Que fait Sami en premier ؟',
        options: ['Il va au marché', 'Il se réveille tôt', 'Il prie le Maghreb', 'Il mange'],
        correct: 1,
      },
      {
        prompt: 'Mettez le verbe "كَتَبَ" (il a écrit) au présent :',
        options: ['يَكْتُبُ', 'كَاتِب', 'مَكْتُوب', 'اُكْتُبْ'],
        correct: 0,
      },
      {
        prompt: 'Lisez : "قَرَأَ الطَّالِبُ الدَّرْسَ بِاِنْتِبَاهٍ." Qu\'est-ce que l\'élève a lu ؟',
        options: ['Une lettre', 'La leçon', 'Un journal', 'Un message'],
        correct: 1,
      },
      {
        prompt: 'Quel est le pluriel de "رَجُل" (homme) ؟',
        options: ['رَجُلُون', 'رِجَال', 'رَجُلَات', 'أَرْجُل'],
        correct: 1,
      },
      {
        prompt: 'Quel verbe est au passé (une action déjà terminée) ؟',
        options: ['يَذْهَبُ', 'اِذْهَبْ', 'ذَهَبَ', 'ذَاهِب'],
        correct: 2,
      },
      {
        prompt: 'Complétez avec le bon mot : "ذَهَبْتُ ___ الْبَيْتِ" (je suis allé à la maison)',
        options: ['فِي', 'إِلَى', 'عَلَى', 'مَعَ'],
        correct: 1,
      },
      {
        prompt:
          'Lisez : "تَعْمَلُ سَلْمَى بِجِدٍّ فِي دُرُوسِهَا، وَهِيَ تُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ كَثِيرًا." Pourquoi Salma travaille dur ؟',
        options: [
          'Elle aime le sport',
          "Elle aime la langue arabe et ses leçons",
          'Elle n\'aime pas l\'école',
          'Non précisé',
        ],
        correct: 1,
      },
      {
        prompt: 'Quelle phrase est correctement écrite ؟',
        options: ['الْوَلَدُ ذَهَبَ', 'ذَهَبَ الْوَلَدُ', 'ذَهَبَ إِلَى الْوَلَدُ', 'الْوَلَدُ إِلَى ذَهَبَ'],
        correct: 1,
      },
      {
        prompt: 'Le mot "يَلْعَبُونَ" parle de :',
        options: ['Une seule personne', 'Deux personnes', 'Plusieurs garçons', 'Plusieurs filles'],
        correct: 2,
      },
      {
        prompt: 'Comment dit-on "Lis !" (ordre donné à quelqu\'un) ؟',
        options: ['يَقْرَأُ', 'اِقْرَأْ', 'قَارِئ', 'مَقْرُوء'],
        correct: 1,
      },
    ],
  },
};
