var questions = [];
var currentIndex = 0;
var score = 0;
var userAnswers = [];
var selectedAnswer = null;
var visitorName = "";

// Cookie management functions
function setCookie(name, value, days) {
  if (typeof days === 'undefined') days = 30;
  var expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Welcome modal functions
function showWelcomeModal() {
  console.log('showWelcomeModal called');
  var savedName = getCookie('visitorName');
  var welcomeModal = document.getElementById('welcomeModal');
  var newVisitorContent = document.getElementById('newVisitorContent');
  var returningVisitorContent = document.getElementById('returningVisitorContent');
  
  if (!welcomeModal) {
    console.error('welcomeModal element not found! Starting quiz directly.');
    startQuiz();
    return;
  }
  
  if (savedName && savedName.trim() !== '') {
    // Returning visitor
    visitorName = savedName;
    document.getElementById('returningVisitorName').textContent = 'Hello ' + visitorName + '! 👋';
    newVisitorContent.style.display = 'none';
    returningVisitorContent.style.display = 'block';
    console.log('Showing returning visitor modal for:', visitorName);
  } else {
    // New visitor
    newVisitorContent.style.display = 'block';
    returningVisitorContent.style.display = 'none';
    console.log('Showing new visitor modal');
  }
  
  welcomeModal.style.display = 'flex';
  
  // Focus on name input for new visitors
  if (!savedName) {
    setTimeout(function() {
      document.getElementById('visitorName').focus();
    }, 500);
  }
}

function saveNameAndStart() {
  var nameInput = document.getElementById('visitorName');
  var inputName = nameInput.value.trim();
  
  if (inputName === '') {
    nameInput.style.borderColor = '#dc3545';
    nameInput.placeholder = 'Please enter your name';
    nameInput.focus();
    return;
  }
  
  if (inputName.length < 2) {
    nameInput.style.borderColor = '#dc3545';
    nameInput.value = '';
    nameInput.placeholder = 'Name must be at least 2 characters';
    nameInput.focus();
    return;
  }
  
  visitorName = inputName;
  setCookie('visitorName', visitorName, 30); // Store for 30 days
  
  document.getElementById('welcomeModal').style.display = 'none';
  setTimeout(startQuiz, 300);
}

function startQuizAfterWelcome() {
  console.log('startQuizAfterWelcome called');
  document.getElementById('welcomeModal').style.display = 'none';
  setTimeout(startQuiz, 300);
}

function resetName() {
  deleteCookie('visitorName');
  visitorName = '';
  const newVisitorContent = document.getElementById('newVisitorContent');
  const returningVisitorContent = document.getElementById('returningVisitorContent');
  
  newVisitorContent.style.display = 'block';
  returningVisitorContent.style.display = 'none';
  
  setTimeout(function() {
    document.getElementById('visitorName').focus();
  }, 100);
}

// Add Enter key support for name input
function handleNameInput(event) {
  if (event.key === 'Enter') {
    saveNameAndStart();
  }
}

// Navigation functions
function navigateToBlogGroup() {
  // Navigate to the blog group landing page
  window.location.href = '/Blogs';
}

function navigateToSpecificBlog() {
  // Navigate to a specific blog related to this quiz
  // Use quiz metadata to determine the best blog to navigate to
  let blogPath = '/Blogs';
  
  if (typeof quizMetadata !== 'undefined' && quizMetadata.id) {
    // Map quiz IDs to blog paths (customize as needed)
    const quizToBlogMap = {
      'solid-principles': '/Blogs/Details/solid-principles-overview',
      'single-responsibility-principle': '/Blogs/Details/single-responsibility-principle',
      'open-closed-principle': '/Blogs/Details/open-closed-principle',
      'liskov-substitution-principle': '/Blogs/Details/liskov-substitution-principle',
      'interface-segregation-principle': '/Blogs/Details/interface-segregation-principle',
      'dependency-inversion-principle': '/Blogs/Details/dependency-inversion-principle',
      'developer-fundamentals': '/Blogs/Details/developer-101-fundamentals',
      'developer-101-mastering-the-fundamentals': '/Blogs/Details/developer-101-fundamentals'
    };
    
    blogPath = quizToBlogMap[quizMetadata.id] || quizToBlogMap[quizMetadata.name.toLowerCase().replace(/\s+/g, '-')] || '/Blogs';
  } else {
    // Fallback: try to get from current URL
    const currentUrl = window.location.pathname;
    const quizName = currentUrl.split('/').pop();
    
    const urlToBlogMap = {
      'solid-principles': '/Blogs/Details/solid-principles-overview',
      'single-responsibility-principle': '/Blogs/Details/single-responsibility-principle',
      'open-closed-principle': '/Blogs/Details/open-closed-principle',
      'liskov-substitution-principle': '/Blogs/Details/liskov-substitution-principle',
      'interface-segregation-principle': '/Blogs/Details/interface-segregation-principle',
      'dependency-inversion-principle': '/Blogs/Details/dependency-inversion-principle',
      'developer-fundamentals': '/Blogs/Details/developer-101-fundamentals'
    };
    
    blogPath = urlToBlogMap[quizName] || '/Blogs';
  }
  
  window.location.href = blogPath;
}

function loadQuestions() {
  console.log('loadQuestions called');
  console.log('questionSource:', typeof questionSource, questionSource);
  
  if (typeof questionSource === 'undefined') {
    console.error('questionSource is undefined! Questions cannot be loaded.');
    return;
  }
  
  if (!Array.isArray(questionSource)) {
    console.error('questionSource is not an array:', questionSource);
    return;
  }
  
  if (questionSource.length === 0) {
    console.error('questionSource is empty!');
    return;
  }
  
  questionSource.forEach(function(qEl) {
    var q = qEl.question;
    var a = qEl.options;
    var c = parseInt(qEl.correctIndex);
    var e = qEl.explanation;
    var language = qEl.language;
    var snippet = qEl.snippet;
    questions.push({ q: q, a: a, c: c, e: e, language: language, snippet: snippet });
  });
  
  console.log('Loaded questions:', questions.length);
  
  // Shuffle questions
  questions.sort(function() { return Math.random() - 0.5; });
  delete questionSource;
  
  // Initialize progress bar segments
  initializeProgressBar();
}

function initializeProgressBar() {
  const progressTrack = document.getElementById("progressTrack");
  if (!progressTrack) {
    console.error("Progress track element not found!");
    return;
  }
  
  progressTrack.innerHTML = '';
  
  for (let i = 0; i < questions.length; i++) {
    const segment = document.createElement('div');
    segment.className = 'quiz-progress-segment';
    segment.id = 'progress-segment-' + i;
    progressTrack.appendChild(segment);
  }
}

function updateProgressBar() {
  for (var i = 0; i < questions.length; i++) {
    var segment = document.getElementById('progress-segment-' + i);
    if (!segment) continue; // Skip if segment doesn't exist
    
    segment.classList.remove('completed', 'current');
    
    if (i < currentIndex) {
      segment.classList.add('completed');
    } else if (i === currentIndex) {
      segment.classList.add('current');
    }
  }
}

function showQuestion(index) {
  selectedAnswer = null;
  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");
  
  nextBtn.disabled = true;
  nextBtn.textContent = index === questions.length - 1 ? "View Results" : "Next →";
  
  // Update back button state
  backBtn.disabled = index === 0;
  
  const q = questions[index];
  
  // Update status
  var statusEl = document.getElementById("status");
  var baseStatus = "Question " + (index + 1) + " of " + questions.length + " (" + (questions.length - index - 1) + " remaining)";
  var personalizedStatus = visitorName && index === 0 ? 
    visitorName + ", " + baseStatus : 
    baseStatus;
  statusEl.textContent = personalizedStatus;
  
  // Update question
  var questionElement = document.getElementById("question");
  var questionContent = q.q;
  
  // Add code snippet if available
  if (q.snippet && q.language) {
    questionContent += '<div class="code-snippet-container mt-3 mb-3">' +
      '<pre class="language-' + q.language + '" tabindex="0">' +
      '<code class="language-' + q.language + '">' + 
      q.snippet.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + 
      '</code></pre></div>';
    questionElement.innerHTML = questionContent;
  } else {
    questionElement.textContent = questionContent;
  }
  
  // Update progress bar
  updateProgressBar();
  
  // Generate options with faster loading
  var form = document.getElementById("optionsForm");
  form.innerHTML = '';
  
  q.a.forEach(function(opt, i) {
    var id = 'q' + index + '_' + i;
    var optionDiv = document.createElement('div');
    optionDiv.className = 'quiz-option';
    optionDiv.innerHTML = '<input type="radio" name="q" id="' + id + '" value="' + i + '">' +
      '<label for="' + id + '">' + opt + '</label>';
    
    // Add click event listener to the entire option div
    optionDiv.addEventListener('click', function(e) {
      e.preventDefault();
      selectAnswer(i);
      // Also check the radio button
      const radio = optionDiv.querySelector('input[type="radio"]');
      radio.checked = true;
    });
    
    form.appendChild(optionDiv);
  });
}

function selectAnswer(answerIndex) {
  selectedAnswer = answerIndex;
  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled = false;
  
  // Update option styling
  const options = document.querySelectorAll('.quiz-option');
  options.forEach((option, index) => {
    option.classList.remove('selected');
    if (index === answerIndex) {
      option.classList.add('selected');
    }
  });
}

function nextQuestion() {
  if (selectedAnswer === null) {
    var personalizedMessage = visitorName ? 
      visitorName + ", please select an answer to continue." : 
      "Please select an answer.";
    showNotification(personalizedMessage, "warning");
    return;
  }
  
  // Store user answer
  userAnswers[currentIndex] = selectedAnswer;
  
  // Update score
  if (selectedAnswer === questions[currentIndex].c) {
    score++;
  }
  
  currentIndex++;
  
  if (currentIndex < questions.length) {
    showQuestion(currentIndex);
  } else {
    showResult();
  }
}

function previousQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion(currentIndex);
    
    // Restore previous answer if exists
    if (userAnswers[currentIndex] !== undefined) {
      selectAnswer(userAnswers[currentIndex]);
      document.querySelector('input[value="' + userAnswers[currentIndex] + '"]').checked = true;
    }
  }
}

function showNotification(message, type) {
  if (typeof type === 'undefined') type = "info";
  // Create a modern notification instead of alert
  var notification = document.createElement('div');
  notification.className = 'alert alert-' + type + ' alert-dismissible fade show position-fixed';
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; max-width: 300px;';
  notification.innerHTML = message + 
    '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(function() {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Helper function to get result message based on performance
function getResultMessage(percentage) {
  if (percentage >= 80) {
    return {
      icon: "🎉",
      greeting: "Great job",
      message: "Excellent! You've mastered this topic.",
      cssClass: "result-excellent",
      backgroundColor: "#d4edda", // Light green
      borderColor: "#c3e6cb",
      textColor: "#155724"
    };
  } else if (percentage >= 60) {
    return {
      icon: "📈",
      greeting: "Good effort",
      message: "Can be better - Keep practicing to improve your understanding.",
      cssClass: "result-good",
      backgroundColor: "#fff3cd", // Light yellow/orange
      borderColor: "#ffeaa7",
      textColor: "#856404"
    };
  } else {
    return {
      icon: "📚",
      greeting: "Keep learning",
      message: "Revise the topic and try again - Don't give up, you've got this!",
      cssClass: "result-needs-improvement",
      backgroundColor: "#f8d7da", // Light red
      borderColor: "#f5c6cb",
      textColor: "#721c24"
    };
  }
}

function showResult() {
  const quizCard = document.getElementById("quizCard");
  const status = document.getElementById("status");
  const quizResult = document.getElementById("quizResult");
  const reviewSection = document.getElementById("reviewSection");
  
  if (quizCard) quizCard.style.display = "none";
  if (status) status.style.display = "none";
  
  // Update all progress segments to completed
  for (let i = 0; i < questions.length; i++) {
    const segment = document.getElementById(`progress-segment-${i}`);
    if (segment) {
      segment.classList.remove('current');
      segment.classList.add('completed');
    }
  }

  if (quizResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    // Get appropriate message and styling based on performance
    const resultData = getResultMessage(percentage);
    
    const personalizedMessage = visitorName ? 
      `${resultData.icon} ${resultData.greeting}, ${visitorName}! You scored <strong>${score}</strong> out of <strong>${questions.length}</strong>!` :
      `${resultData.icon} You scored <strong>${score}</strong> out of <strong>${questions.length}</strong>!`;
    
    // Create result content with appropriate styling and background color
    let resultContent = `
      <div class="quiz-score-display ${resultData.cssClass}" style="background-color: ${resultData.backgroundColor}; border-color: ${resultData.borderColor}; color: ${resultData.textColor}; padding: 20px; border-radius: 8px; border: 2px solid;">
        ${personalizedMessage}
        <div class="score-percentage" style="font-size: 1.2em; font-weight: bold; margin: 10px 0;">${percentage}% Correct</div>
        <div class="performance-message" style="margin-top: 10px;">${resultData.message}</div>
      </div>
    `;
      // Add navigation options based on performance
    if (percentage >= 80) {
      const congratsMessage = visitorName ?
        `Excellent work, ${visitorName}! You've mastered this topic.` :
        'Excellent work! You\'ve mastered this topic.';
        
      resultContent += `
        <div class="success-celebration" style="background-color: white; color: #333; padding: 20px; margin-top: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h5 style="color: #28a745; margin-bottom: 15px;">🏆 Well Done!</h5>
          <p style="margin-bottom: 20px; color: #333;">${congratsMessage}</p>
          <div class="navigation-options">
            <button class="nav-btn primary-btn" onclick="navigateToBlogGroup()">
              🚀 Explore More Topics
            </button>
            <button class="nav-btn secondary-btn" onclick="navigateToSpecificBlog()">
              📖 Dive Deeper into Details
            </button>
          </div>
        </div>
      `;
    } else if (percentage >= 60) {
      const improvementMessage = visitorName ? 
        `${visitorName}, you're on the right track! A little more practice will help you master this topic.` :
        'You\'re on the right track! A little more practice will help you master this topic.';
        
      resultContent += `
        <div class="improvement-suggestion" style="background-color: white; color: #333; padding: 20px; margin-top: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h5 style="color: #fd7e14; margin-bottom: 15px;">📈 Keep Improving!</h5>
          <p style="margin-bottom: 20px; color: #333;">${improvementMessage}</p>
          <div class="navigation-options">
            <button class="nav-btn primary-btn" onclick="navigateToSpecificBlog()">
              🎯 Study This Topic
            </button>
            <button class="nav-btn secondary-btn" onclick="navigateToBlogGroup()">
              📖 Review All Topics
            </button>
          </div>
        </div>
      `;
    } else {
      const encouragementMessage = visitorName ? 
        `${visitorName}, don't worry! Everyone learns at their own pace. Let's review the material and try again.` :
        'Don\'t worry! Everyone learns at their own pace. Let\'s review the material and try again.';
        
      resultContent += `
        <div class="learning-suggestion" style="background-color: white; color: #333; padding: 20px; margin-top: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h5 style="color: #dc3545; margin-bottom: 15px;">📚 Keep Learning!</h5>
          <p style="margin-bottom: 20px; color: #333;">${encouragementMessage}</p>
          <div class="navigation-options">
            <button class="nav-btn primary-btn" onclick="navigateToSpecificBlog()">
              🎯 Study This Topic in Detail
            </button>
            <button class="nav-btn secondary-btn" onclick="navigateToBlogGroup()">
              📖 Review All Topics
            </button>
          </div>
        </div>
      `;
    }
    
    quizResult.innerHTML = resultContent;
    quizResult.style.display = "block";
  }

  if (reviewSection) {
    // Calculate incorrect answers count
    const incorrectCount = questions.filter((q, i) => userAnswers[i] !== q.c).length;
    
    // Create review header with filter options
    let reviewHeader = `
      <div class="review-header">
        <h4 class="review-title">📋 Review Your Answers</h4>
        <div class="answer-filter-options">
          <button id="showAllBtn" class="filter-btn active" onclick="filterAnswers('all')">
            All Answers (${questions.length})
          </button>
          <button id="showIncorrectBtn" class="filter-btn" onclick="filterAnswers('incorrect')">
            Incorrect Only (${incorrectCount})
          </button>
        </div>
      </div>
    `;
    
    reviewSection.innerHTML = reviewHeader;
    
    // Create answers container
    const answersContainer = document.createElement('div');
    answersContainer.id = 'answersContainer';
    reviewSection.appendChild(answersContainer);
    
    // Generate all answers initially
    generateAnswerReview('all');
  }
}

function generateAnswerReview(filterType) {
  const answersContainer = document.getElementById('answersContainer');
  if (!answersContainer) return;
  
  let answersHTML = '';
  
  questions.forEach((q, i) => {
    const userAns = userAnswers[i];
    const correctAns = q.c;
    const isCorrect = userAns === correctAns;
    
    // Apply filter
    if (filterType === 'incorrect' && isCorrect) {
      return; // Skip correct answers when showing only incorrect
    }
    
    let answerHTML = "";
    q.a.forEach((opt, idx) => {
      const isCorrectOption = idx === correctAns;
      const isSelected = idx === userAns;

      const labelClass = isCorrectOption ? 'text-success' : isSelected && !isCorrectOption ? 'text-danger' : '';
      const prefix = isCorrectOption ? "✅" : isSelected && !isCorrectOption ? "❌" : "⬜";

      answerHTML += `<div class="${labelClass} mb-1">${prefix} ${opt}</div>`;
    });

    // Add status indicator
    const statusIcon = isCorrect ? "✅" : "❌";
    const statusClass = isCorrect ? "correct-status" : "incorrect-status";

    answersHTML += `
      <div class="review-item ${isCorrect ? 'correct-answer' : 'incorrect-answer'}">
        <div class="question-header">
          <span class="question-status ${statusClass}">${statusIcon}</span>
          <p class="review-question">Q${i + 1}: ${q.q}</p>
        </div>
        <div class="answer-options">
          ${answerHTML}
        </div>
        ${q.e ? `<div class="review-explanation">💡 <strong>Explanation:</strong> ${q.e}</div>` : ''}
      </div>`;
  });
  
  // Add empty state if no answers match filter
  if (filterType === 'incorrect' && answersHTML === '') {
    answersHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎉</div>
        <h5>Perfect Score!</h5>
        <p>You answered all questions correctly. Great job!</p>
      </div>
    `;
  }
  
  answersContainer.innerHTML = answersHTML;
  
  // Add final call-to-action
  const percentage = Math.round((score / questions.length) * 100);
  const ctaMessage = percentage < 80 ? 
    "📚 Continue learning to master these concepts!" : 
    "🚀 Ready to explore more advanced topics?";
    
  answersContainer.innerHTML += `
    <div class="final-cta">
      <h5>${ctaMessage}</h5>
      <div class="navigation-options">
        <button class="nav-btn primary-btn" onclick="navigateToBlogGroup()">
          Explore All Topics
        </button>
      </div>
    </div>
  `;
}

function filterAnswers(filterType) {
  // Update button states
  const allBtn = document.getElementById('showAllBtn');
  const incorrectBtn = document.getElementById('showIncorrectBtn');
  
  if (allBtn && incorrectBtn) {
    allBtn.classList.toggle('active', filterType === 'all');
    incorrectBtn.classList.toggle('active', filterType === 'incorrect');
  }
  
  // Regenerate answers with filter
  generateAnswerReview(filterType);
}

function startQuiz() {
  console.log('startQuiz called');
  
  // Ensure DOM elements exist before proceeding
  const requiredElements = [
    'quizLoading', 'quizProgressContainer', 'status', 'quizCard'
  ];
  
  for (const elementId of requiredElements) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Required element ${elementId} not found!`);
      return;
    }
    console.log(`Element ${elementId} found:`, element);
  }
  
  // Hide loading, show quiz elements
  document.getElementById("quizLoading").style.display = "none";
  document.getElementById("quizProgressContainer").style.display = "block";
  document.getElementById("status").style.display = "block";
  document.getElementById("quizCard").style.display = "block";
  
  console.log('Quiz elements visibility updated');
  
  // Load and show first question
  loadQuestions();
  
  if (questions.length > 0) {
    console.log('Showing first question');
    showQuestion(currentIndex);
  } else {
    console.error('No questions loaded!');
  }
}

function generateAnswerReview(filterType) {
  const answersContainer = document.getElementById('answersContainer');
  if (!answersContainer) return;
  
  let answersHTML = '';
  
  questions.forEach((q, i) => {
    const userAns = userAnswers[i];
    const correctAns = q.c;
    const isCorrect = userAns === correctAns;
    
    // Apply filter
    if (filterType === 'incorrect' && isCorrect) {
      return; // Skip correct answers when showing only incorrect
    }
    
    let answerHTML = "";
    q.a.forEach((opt, idx) => {
      const isCorrectOption = idx === correctAns;
      const isSelected = idx === userAns;

      const labelClass = isCorrectOption ? 'text-success' : isSelected && !isCorrectOption ? 'text-danger' : '';
      const prefix = isCorrectOption ? "✅" : isSelected && !isCorrectOption ? "❌" : "⬜";

      answerHTML += `<div class="${labelClass} mb-1">${prefix} ${opt}</div>`;
    });

    // Add status indicator
    const statusIcon = isCorrect ? "✅" : "❌";
    const statusClass = isCorrect ? "correct-status" : "incorrect-status";

    answersHTML += `
      <div class="review-item ${isCorrect ? 'correct-answer' : 'incorrect-answer'}">
        <div class="question-header">
          <span class="question-status ${statusClass}">${statusIcon}</span>
          <p class="review-question">Q${i + 1}: ${q.q}</p>
        </div>
        <div class="answer-options">
          ${answerHTML}
        </div>
        ${q.e ? `<div class="review-explanation">💡 <strong>Explanation:</strong> ${q.e}</div>` : ''}
      </div>`;
  });
  
  // Add empty state if no answers match filter
  if (filterType === 'incorrect' && answersHTML === '') {
    answersHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎉</div>
        <h5>Perfect Score!</h5>
        <p>You answered all questions correctly. Great job!</p>
      </div>
    `;
  }
  
  answersContainer.innerHTML = answersHTML;
  
  // Add final call-to-action
  const percentage = Math.round((score / questions.length) * 100);
  const ctaMessage = percentage < 80 ? 
    "📚 Continue learning to master these concepts!" : 
    "🚀 Ready to explore more advanced topics?";
    
  answersContainer.innerHTML += `
    <div class="final-cta">
      <h5>${ctaMessage}</h5>
      <div class="navigation-options">
        <button class="nav-btn primary-btn" onclick="navigateToBlogGroup()">
          Explore All Topics
        </button>
      </div>
    </div>
  `;
}

function filterAnswers(filterType) {
  // Update button states
  const allBtn = document.getElementById('showAllBtn');
  const incorrectBtn = document.getElementById('showIncorrectBtn');
  
  if (allBtn && incorrectBtn) {
    allBtn.classList.toggle('active', filterType === 'all');
    incorrectBtn.classList.toggle('active', filterType === 'incorrect');
  }
  
  // Regenerate answers with filter
  generateAnswerReview(filterType);
}

// Navigation functions for blog links
function navigateToBlogGroup() {
  // Navigate to blog group listing page
  window.location.href = '/blogs';
}

function navigateToSpecificBlog() {
  // Try to navigate to related blog if available
  // For now, navigate to blogs page - can be enhanced with specific routing
  window.location.href = '/blogs';
}

window.onload = function() {
  // Add event listener for name input
  const nameInput = document.getElementById('visitorName');
  if (nameInput) {
    nameInput.addEventListener('keypress', handleNameInput);
  }
  
  // Show welcome modal first
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(showWelcomeModal, 500);
    });
  } else {
    // DOM is already loaded
    setTimeout(showWelcomeModal, 500);
  }
};
