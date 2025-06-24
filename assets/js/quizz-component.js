
function getEncryptedQuiz(quizId) {
  const script = document.querySelector(`.question-container[data-questions="${quizId}"] script[data-quiz-id="${quizId}"]`);
  return script ? script.textContent.trim() : null;
}

function decryptQuiz(encryptedBase64, key) {
    try {
        // Decode base64 to byte array (WordArray)
        const encryptedWA = CryptoJS.enc.Base64.parse(encryptedBase64);

        // Extract IV (first 16 bytes = 4 words)
        const iv = CryptoJS.lib.WordArray.create(encryptedWA.words.slice(0, 4), 16);

        // Extract Ciphertext (rest)
        const cipherText = CryptoJS.lib.WordArray.create(
            encryptedWA.words.slice(4),
            encryptedWA.sigBytes - 16
        );

        // Normalize key to 32 bytes (AES-256)
        const keyBytes = CryptoJS.enc.Utf8.parse(key.padEnd(32, '\0').slice(0, 32));

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: cipherText },
            keyBytes,
            { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)
            .replace(/\r?\n|\r/g, '') 
        return JSON.parse(decryptedText);
    } catch (e) {
        console.error("❌ Decryption failed:", e);
        return [];
    }
}

function renderQuiz(container, quizData, welcome, completion) {
  let current = 0;
  let score = 0;
  let answered = false;

  const card = document.createElement('div');
  card.className = 'card shadow p-4';
  container.appendChild(card);

  const heading = document.createElement('h5');
  heading.className = 'mb-3 text-primary';
  heading.textContent = welcome || 'Welcome!';
  card.appendChild(heading);

  const qTitle = document.createElement('h6');
  qTitle.className = 'mb-3';
  card.appendChild(qTitle);

  const optionBox = document.createElement('div');
  optionBox.className = 'mb-3';
  card.appendChild(optionBox);

  const navBox = document.createElement('div');
  navBox.className = 'd-flex justify-content-between';
  navBox.innerHTML = `
    <button class="btn btn-secondary" disabled>Previous</button>
    <button class="btn btn-primary">Next</button>
  `;
  card.appendChild(navBox);
  const [prevBtn, nextBtn] = navBox.querySelectorAll('button');

  const resultBox = document.createElement('div');
  resultBox.className = 'text-center mt-4 d-none';
  resultBox.innerHTML = `
    <h5>🎯 Quiz Completed!</h5>
    <p class="score-text"></p>
    <p class="final-msg text-success fw-bold mt-2"></p>
    <button class="btn btn-success mt-3">Restart</button>
  `;
  card.appendChild(resultBox);
  const scoreText = resultBox.querySelector('.score-text');
  const finalMsg = resultBox.querySelector('.final-msg');
  const restartBtn = resultBox.querySelector('button');

  function loadQuestion() {
    nextBtn.disabled = true; // disable next initially
    answered = false;
    const q = quizData[current];
    qTitle.textContent = `${current + 1}. ${q.question}`;
    optionBox.innerHTML = '';

    q.options.forEach((opt, idx) => {
      const wrapper = document.createElement('div');
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline-dark d-block w-100 text-start my-2 option-btn';
      btn.textContent = opt.text;
      btn.onclick = () => selectAnswer(idx, btn, opt.reason, q.correctIndex);
      wrapper.appendChild(btn);
      optionBox.appendChild(wrapper);
    });

    prevBtn.disabled = current === 0;
    nextBtn.textContent = current === quizData.length - 1 ? 'Finish' : 'Next';
  }

  function selectAnswer(index, btn, reasonText, correctIndex) {
    if (answered) return;
    answered = true;
    nextBtn.disabled = false;

    const btns = optionBox.querySelectorAll('.option-btn');
    btns.forEach((b, i) => {
      b.disabled = true;
      b.classList.remove('btn-outline-dark');
      if (i === correctIndex) b.classList.add('btn-outline-success');
      if (i === index && i !== correctIndex) b.classList.add('btn-outline-danger');
      
    });

    if (index === correctIndex) score++;

    const reason = document.createElement('div');
    
    reason.innerHTML = reasonText;
    reason.className = 'reason-box text-sm';
    if (index === correctIndex) {
      reason.classList.add("text-success"); // Green
    } else {
      reason.classList.add("text-danger"); // Red
    }
    btn.parentNode.appendChild(reason);
  }

  prevBtn.onclick = () => { if (current > 0) { current--; loadQuestion(); } };
  nextBtn.onclick = () => {
    if (current < quizData.length - 1) {
      current++;
      loadQuestion();
    } else showResult();
  };
  restartBtn.onclick = () => {
    current = 0;
    score = 0;
    loadQuestion();
    resultBox.classList.add('d-none');
    heading.classList.remove('d-none');
    qTitle.classList.remove('d-none');
    optionBox.classList.remove('d-none');
    navBox.classList.remove('d-none');
  };

  function showResult() {
    heading.classList.add('d-none');
    qTitle.classList.add('d-none');
    optionBox.classList.add('d-none');
    navBox.classList.add('d-none');
    scoreText.textContent = `You scored ${score} out of ${quizData.length}`;
    finalMsg.textContent = completion || 'Thanks for completing!';
    resultBox.classList.remove('d-none');
  }

  loadQuestion();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.question-container').forEach(container => {
    const quizId = container.dataset.questions;
    const secret = container.dataset.secretKey;
    const welcome = container.dataset.welcomeMessage;
    const complete = container.dataset.completeMessage;

    const encrypted = getEncryptedQuiz(quizId);
    if (encrypted) {
      const quizData = decryptQuiz(encrypted, secret);
      renderQuiz(container, quizData, welcome, complete);
    } else {
      container.innerHTML = `<div class="alert alert-danger">Quiz "${quizId}" not found or encrypted.</div>`;
    }
  });
});
