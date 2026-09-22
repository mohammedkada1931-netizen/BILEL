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
    description: "Reconnaissance des lettres et des sons de base",
    questions: [
      {
        prompt: 'Quelle est cette lettre ؟',
        arabic: 'ا',
        options: ['Alif', 'Bâ’', 'Tâ’', 'Thâ’'],
        correct: 0,
      },
      {
        prompt: 'Quelle est cette lettre ؟',
        arabic: 'م',
        options: ['Nûn', 'Mîm', 'Lâm', 'Râ’'],
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
        prompt: 'Sur la lettre "بَ", quelle voyelle (harakah) est écrite ؟',
        options: ['Fatha (a)', 'Kasra (i)', 'Damma (ou)', 'Soukoun'],
        correct: 0,
      },
      {
        prompt: 'Sur la lettre "بِ", quelle voyelle (harakah) est écrite ؟',
        options: ['Fatha (a)', 'Kasra (i)', 'Damma (ou)', 'Soukoun'],
        correct: 1,
      },
      {
        prompt: "Combien de lettres compte l'alphabet arabe ؟",
        options: ['24', '26', '28', '30'],
        correct: 2,
      },
      {
        prompt: 'Que signifie le mot "قَمَر" ؟',
        options: ['Soleil', 'Lune', 'Étoile', 'Ciel'],
        correct: 1,
      },
      {
        prompt: 'Quelle lettre est-ce ؟',
        arabic: 'ع',
        options: ['Ghayn', '‘Ayn', 'Hâ’', 'Khâ’'],
        correct: 1,
      },
      {
        prompt: 'Quel mot se lit "بَاب" (porte) ؟',
        options: ['باب', 'بيت', 'باز', 'تاب'],
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
        prompt: 'Quel est le pluriel de "كِتَاب" (livre) ؟',
        options: ['كُتُب', 'كِتَابَات', 'كَاتِب', 'مَكْتَب'],
        correct: 0,
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
        prompt: 'Dans la phrase "هَذَا وَلَدٌ", que signifie "هَذَا" ؟',
        options: ['Ceci (féminin)', 'Ceci (masculin)', 'Cela (féminin)', 'Ils'],
        correct: 1,
      },
      {
        prompt: 'Suite logique : واحد، اثنان، ثلاثة، ___',
        options: ['خمسة', 'أربعة', 'ستة', 'سبعة'],
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
    description: 'Lecture de phrases et grammaire de base',
    questions: [
      {
        prompt: 'Lisez : "ذَهَبَتْ فَاطِمَةُ إِلَى الْمَدْرَسَةِ صَبَاحًا." Qui est allé(e) à l\'école ؟',
        options: ['Le frère', 'Fatima', 'Le père', 'La maîtresse'],
        correct: 1,
      },
      {
        prompt: 'Le mot "الْبِنْتُ" est :',
        options: ['Masculin (مذكر)', 'Féminin (مؤنث)', 'Pluriel', 'Duel'],
        correct: 1,
      },
      {
        prompt: 'Quel est le pluriel de "مُعَلِّم" (enseignant) ؟',
        options: ['مُعَلِّمُون', 'مُعَلِّمَات فَقَط', 'مُعَلَّم', 'مَعَالِم'],
        correct: 0,
      },
      {
        prompt: 'Ajoutez l\'article défini "ال" correctement à "كتاب" :',
        options: ['أَلكتاب', 'الكتاب', 'كتابال', 'لكتاب'],
        correct: 1,
      },
      {
        prompt: 'Complétez au présent : "هُوَ ___ إِلَى السُّوقِ" (aller)',
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
        prompt: 'Dans "أَكَلَ الْوَلَدُ التُّفَّاحَةَ", quel est le sujet (الفاعل) ؟',
        options: ['أَكَلَ', 'الْوَلَدُ', 'التُّفَّاحَةَ', 'aucun'],
        correct: 1,
      },
      {
        prompt: 'Quel mot est correctement au pluriel de "بِنْت" (fille) ؟',
        options: ['بِنْتُون', 'بَنَات', 'بُنُوت', 'أَبْنَاء'],
        correct: 1,
      },
      {
        prompt: 'Complétez : "نَحْنُ ___ فِي الْحَدِيقَةِ" (jouer, nous)',
        options: ['يَلْعَبُ', 'تَلْعَبُ', 'نَلْعَبُ', 'أَلْعَبُ'],
        correct: 2,
      },
    ],
  },

  niveau3: {
    label: 'Niveau 3',
    description: 'Lecture de textes, conjugaison et analyse grammaticale',
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
        prompt: 'Dans "قَرَأَ الطَّالِبُ الدَّرْسَ", quel mot est le "مفعول به" (complément d\'objet) ؟',
        options: ['قَرَأَ', 'الطَّالِبُ', 'الدَّرْسَ', 'aucun'],
        correct: 2,
      },
      {
        prompt: 'Quel est le pluriel irrégulier (جمع تكسير) de "رَجُل" (homme) ؟',
        options: ['رَجُلُون', 'رِجَال', 'رَجُلَات', 'أَرْجُل'],
        correct: 1,
      },
      {
        prompt: 'Quel verbe est au passé (الماضي) ؟',
        options: ['يَذْهَبُ', 'اِذْهَبْ', 'ذَهَبَ', 'ذَاهِب'],
        correct: 2,
      },
      {
        prompt: 'Complétez avec la bonne préposition : "ذَهَبْتُ ___ الْبَيْتِ" (je suis allé à la maison)',
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
        prompt: 'Quelle phrase est correctement construite (ordre verbe-sujet) ؟',
        options: ['الولدُ ذهبَ', 'ذهبَ الولدُ', 'ذهبَ إلى الولدُ', 'الولدُ إلى ذهبَ'],
        correct: 1,
      },
      {
        prompt: 'Le mot "يَلْعَبُونَ" indique un sujet :',
        options: ['Singulier', 'Duel', 'Pluriel masculin', 'Pluriel féminin'],
        correct: 2,
      },
      {
        prompt: 'Quel est l\'impératif (الأمر) du verbe "قَرَأَ" (lire) ؟',
        options: ['يَقْرَأُ', 'اِقْرَأْ', 'قَارِئ', 'مَقْرُوء'],
        correct: 1,
      },
    ],
  },
};
