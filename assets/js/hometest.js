document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------
  // SETTINGS 
  // ----------------------------
  const QUESTIONS_PER_ROW = 3;

  // ----------------------------
  // QUESTION POOL — FRANCE (14)
  // ----------------------------
  const INLINE_TEST_QUESTIONS = [
    {
      q: "Un chauffeur de bus met de la musique religieuse dans le véhicule. Est-ce conforme?",
      a: ["Non, le service public doit rester neutre.", "Oui, si les passagers apprécient.", "Oui, si c’est une fête religieuse."],
      correct: 0
    },
    {
      q: "Un citoyen apprend un crime grave et garde le silence « pour éviter des ennuis ». Est-ce légal?",
      a: ["Non, la non-dénonciation de crime est punie par la loi.", "Oui, s’il ne connaît pas les auteurs.", "Oui, si le crime ne le concerne pas."],
      correct: 0
    },
    {
      q: "Un patient refuse un traitement vital pour des raisons religieuses. Que peut faire le médecin?",
      a: ["Respecter son refus après information claire et loyale.", "L’obliger à être soigné.", "Le signaler à la police."],
      correct: 0
    },
    {
      q: "Un restaurant refuse un client en fauteuil roulant pour « raisons de place ». Est-ce légal?",
      a: ["Non, refuser un client en raison de son handicap est interdit.", "Oui, si le restaurant est petit.", "Oui, si le client vient seul."],
      correct: 0
    },
    {
      q: "Un donneur est refusé parce qu’il est homosexuel. Est-ce légal?",
      a: ["Non, les critères doivent reposer uniquement sur la sécurité sanitaire.", "Oui, pour des raisons morales.", "Oui, car le personnel choisit librement."],
      correct: 0
    },
    { q: "En quelle année Napoléon Ier est-il devenu empereur?", a: ["1804", "1799", "1815", "1789"], correct: 0 },
    {
      q: "Depuis quand les Français élisent-ils le président de la République au suffrage universel direct?",
      a: ["1962", "1958", "1946", "1981"],
      correct: 0
    },
    {
      q: "En 1944, qu'est-ce qui a changé pour les femmes?",
      a: ["Elles ont obtenu le droit de vote", "Elles ont obtenu le droit de travailler", "Elles ont obtenu l’égalité salariale", "Elles ont accédé à la présidence"],
      correct: 0
    },
    { q: "Quelle île française se trouve dans l'océan Indien?", a: ["La Réunion", "La Corse", "La Martinique", "La Guadeloupe"], correct: 0 },
    {
      q: "Qui était Auguste Renoir?",
      a: ["Un peintre impressionniste français", "Un écrivain réaliste", "Un sculpteur moderne", "Un architecte"],
      correct: 0
    },
    { q: "La peine de mort est:", a: ["Abolie en France", "Suspendue temporairement", "Appliquée dans certains cas", "Réservée aux crimes graves"], correct: 0 },
    {
      q: "Qu'est-ce que l'Hôtel de Matignon?",
      a: ["La résidence officielle du Premier ministre", "Le palais présidentiel", "Le siège du Parlement", "Un ministère"],
      correct: 0
    },
    {
      q: "En cas de divorce, qui exerce l'autorité parentale?",
      a: ["Les deux parents en principe", "Un seul parent automatiquement", "La famille proche", "Le juge uniquement"],
      correct: 0
    },
    { q: "À quel âge commence l'instruction obligatoire des enfants ?", a: ["À 3 ans", "À 6 ans", "À 5 ans", "À 7 ans"], correct: 0 }
  ];

  // ----------------------------
  // REQUIRED DOM 
  // ----------------------------
  const container = document.getElementById("inline-test-questions");
  const progressText = document.getElementById("inline-progress-text");
  const progressBar = document.getElementById("inline-progressbar");

  if (!container || !progressText || !progressBar) {
    console.error("[hometest] Missing required IDs:", {
      container: !!container,
      progressText: !!progressText,
      progressBar: !!progressBar
    });
    return;
  }

  // ----------------------------
  // STATE
  // ----------------------------
  let correctCount = 0;
  let answeredCount = 0;
  const totalQuestions = INLINE_TEST_QUESTIONS.length;
  let currentRow = 0;

  function updateProgress() {
    progressText.textContent = `Progression : ${answeredCount} / ${totalQuestions} questions`;
    progressBar.style.width = (answeredCount / totalQuestions) * 100 + "%";
  }

  function shuffleAnswers(q) {
    const zipped = q.a.map((t, i) => ({ t, c: i === q.correct }));
    for (let i = zipped.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [zipped[i], zipped[j]] = [zipped[j], zipped[i]];
    }
    q.a = zipped.map(x => x.t);
    q.correct = zipped.findIndex(x => x.c);
  }

  INLINE_TEST_QUESTIONS.forEach(shuffleAnswers);

  function createDonut() {
    const pct = Math.round((correctCount / totalQuestions) * 100);
    const C = 2 * Math.PI * 40;

    return `
      <div class="donut-wrapper">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="#ebe6ff" stroke-width="12" fill="none"></circle>
          <circle cx="50" cy="50" r="40" stroke="#6d4aff" stroke-width="12" fill="none"
            stroke-dasharray="${(pct / 100) * C} ${(1 - pct / 100) * C}"
            transform="rotate(-90 50 50)" stroke-linecap="round"></circle>
        </svg>
        <div class="donut-center">${pct}%</div>
      </div>
    `;
  }

  function createEndCard() {
    const pct = Math.round((correctCount / totalQuestions) * 100);
    const card = document.createElement("div");
    card.className = "inline-question-card end-card";

    const title =
      pct >= 80 ? "Excellent !" :
      pct >= 50 ? "Très bien !" :
      pct >= 25 ? "Bon début" :
      "À améliorer";

    card.innerHTML = `
      <h3>${title}</h3>
      ${createDonut()}
      <p>
        Vous avez terminé les questions gratuites.
        La préparation complète couvre l’ensemble des thèmes de l’examen civique.
      </p>
      <a href="https://civiclearn.com/france/checkout.html" class="hero-primary-btn">
        Accéder à la préparation complète
      </a>
    `;
    return card;
  }

  // ----------------------------
  // BUILD ROWS
  // ----------------------------
  const rows = [];
  for (let i = 0; i < totalQuestions; i += QUESTIONS_PER_ROW) {
    rows.push(INLINE_TEST_QUESTIONS.slice(i, i + QUESTIONS_PER_ROW));
  }

  function renderRow(rowIndex) {
    if (!rows[rowIndex]) return;

    rows[rowIndex].forEach((q, offset) => {
      const absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
      container.appendChild(createQuestionCard(q, absoluteIndex));
    });
  }

  function createQuestionCard(q, absoluteIndex) {
    const card = document.createElement("div");
    card.className = "inline-question-card";

    const title = document.createElement("h3");
    title.textContent = q.q;
    card.appendChild(title);

    const feedback = document.createElement("div");
    feedback.className = "inline-feedback";

    q.a.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "inline-option-btn";
      btn.textContent = opt;

      btn.onclick = () => {
        answeredCount++;
        updateProgress();

        if (i === q.correct) {
          correctCount++;
          feedback.textContent = "Bonne réponse.";
          feedback.classList.add("inline-correct");
        } else {
          feedback.textContent = "Réponse correcte : " + q.a[q.correct];
          feedback.classList.add("inline-wrong");
        }

        card.querySelectorAll("button").forEach(b => (b.disabled = true));
        card.appendChild(feedback);

        const isLastQuestion = absoluteIndex === totalQuestions - 1;
        const isLastInRow = (absoluteIndex + 1) % QUESTIONS_PER_ROW === 0;

        if (isLastQuestion) {
          setTimeout(() => container.appendChild(createEndCard()), 300);
        } else if (isLastInRow) {
          currentRow++;
          renderRow(currentRow);
        }
      };

      card.appendChild(btn);
    });

    return card;
  }

  // ----------------------------
  // INIT
  // ----------------------------
  container.innerHTML = "";
  renderRow(0);
  updateProgress();
});
