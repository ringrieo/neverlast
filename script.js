
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

document.getElementById('start-button').addEventListener('click', startQuiz);

function startQuiz() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('quiz-screen').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  resetState();
  timeLeft = 30;
  startTimer();

  const q = questions[currentQuestionIndex];
  document.getElementById('question-number').innerText = `문제 ${currentQuestionIndex + 1}/${questions.length}`;
  document.getElementById('question-text').innerText = q.question;

  if (q.type === 'ox') {
    ['⭕', '❌'].forEach((label, i) => {
      const btn = document.createElement('button');
      btn.innerText = label;
      btn.addEventListener('click', () => selectAnswer(i === 0 ? '⭕' : '❌', q));
      document.getElementById('answer-buttons').appendChild(btn);
    });
  } else {
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.innerText = opt;
      btn.addEventListener('click', () => selectAnswer(opt, q));
      document.getElementById('answer-buttons').appendChild(btn);
    });
  }
}

function resetState() {
  document.getElementById('answer-buttons').innerHTML = '';
  document.getElementById('explanation').classList.add('hidden');
  document.getElementById('explanation').innerText = '';
}

function startTimer() {
  document.getElementById('timer').innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleWrong(null); // 시간초과
    }
  }, 1000);
}

function selectAnswer(selected, question) {
  clearInterval(timer);
  const isCorrect = selected === question.answer;
  const buttons = document.getElementById('answer-buttons').children;

  Array.from(buttons).forEach(btn => {
    if (btn.innerText === question.answer) {
      btn.classList.add('correct');
    } else if (btn.innerText === selected) {
      btn.classList.add('wrong');
    }
    btn.disabled = true;
  });

  if (isCorrect) score++;
  showExplanation(question.explanation);

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 3000);
}

function handleWrong(question) {
  const buttons = document.getElementById('answer-buttons').children;
  Array.from(buttons).forEach(btn => {
    if (btn.innerText === (question ? question.answer : '')) {
      btn.classList.add('correct');
    } else {
      btn.classList.add('wrong');
    }
    btn.disabled = true;
  });
  showExplanation(question ? question.explanation : '시간 초과!');

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 3000);
}

function showExplanation(text) {
  const explanation = document.getElementById('explanation');
  explanation.innerText = text;
  explanation.classList.remove('hidden');
}

function showResult() {
  document.getElementById('quiz-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  document.getElementById('final-score').innerText = `당신의 점수는 ${score}점 / ${questions.length}점입니다.`;
}
