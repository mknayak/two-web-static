let questions = [];
let currentIndex = 0;
let score = 0;
const userAnswers = [];

function loadQuestions() {
  
  questionSource.forEach(qEl => {
    const q = qEl.question;
    const a = qEl.options;
    const c = parseInt(qEl.correctIndex);
    questions.push({ q, a, c });
  });
    // Shuffle questions
    questions.sort(() => Math.random() - 0.5);
  delete questionSource;
}

function showQuestion(index) {
  document.getElementById("quizResult").innerHTML = '';
  const q = questions[index];
  document.getElementById("question").innerText = q.q;
  document.getElementById("status").innerText = `Question ${index + 1} of ${questions.length} (${questions.length - index - 1} remaining)`;
  const form = document.getElementById("optionsForm");
  form.innerHTML = '';
  q.a.forEach((opt, i) => {
    const id = `q${index}_${i}`;
    form.innerHTML += `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="q" id="${id}" value="${i}">
        <label class="form-check-label" for="${id}">${opt}</label>
      </div>`;
  });
}

function nextQuestion() {
  const selected = document.querySelector('input[name="q"]:checked');
  if (!selected) {
    alert("Please select an answer.");
    return;
  }
  const userAnswer = parseInt(selected.value);
  userAnswers.push(userAnswer);
  if (userAnswer === questions[currentIndex].c) score++;

  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion(currentIndex);
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quizCard").style.display = "none";
  document.getElementById("status").style.display = "none";

  document.getElementById("quizResult").innerHTML =
    `✅ You scored <strong>${score}</strong> out of <strong>${questions.length}</strong>!`;

  const reviewDiv = document.getElementById("reviewSection");
  reviewDiv.innerHTML = "<h4 class='mt-4'>📋 Review Your Answers</h4>";
  questions.forEach((q, i) => {
    const userAns = userAnswers[i];
    const correctAns = q.c;
    let answerHTML = "";

    q.a.forEach((opt, idx) => {
      const isCorrect = idx === correctAns;
      const isSelected = idx === userAns;

      const labelClass = isCorrect ? 'text-success' : isSelected && !isCorrect ? 'text-danger' : '';
      const prefix = isCorrect ? "✅" : isSelected && !isCorrect ? "❌" : "⬜";

      answerHTML += `<div class="${labelClass}">${prefix} ${opt}</div>`;
    });

    reviewDiv.innerHTML += `
      <div class="mt-3 p-3 border rounded">
        <p><strong>Q${i + 1}: ${q.q}</strong></p>
        ${answerHTML}
      </div>`;
  });
}

window.onload = () => {
  loadQuestions();
  showQuestion(currentIndex);
};
