let score = 0;
let timer = 15;
let timerInterval;
let currentQuestionIndex = 0;
let quizData = [];

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("but");
    if (startButton) {
        startButton.addEventListener("click", fetchQuiz);
    }
});

async function fetchQuiz() {
    const number = document.getElementById("num_qst").value;
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;

    if (!number || number <= 0) {
        alert("Veuillez entrer un nombre valide de questions.");
        return;
    }

    const url = `https://opentdb.com/api.php?amount=${number}&category=${category}&difficulty=${difficulty}&type=multiple`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des questions.");
        }
        const data = await response.json();
        quizData = data.results;
        startQuiz();
    } catch (error) {
        console.error(' Erreur API:', error);
        alert("Une erreur est survenue lors du chargement du quiz.");
    }
}

function startQuiz() {
    document.getElementById("quiz-config").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
    if (!quizData[index]) return;

    const question = quizData[index];
    const quizForm = document.getElementById("quiz-form");
    quizForm.innerHTML = "";

    const options = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

    let questionHTML = `<h2>${question.question}</h2><div class='options'>`;
    options.forEach((answer, i) => {
        const safeAnswer = answer.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        questionHTML += `
            <div class='option' onclick="checkAnswer(${index}, '${safeAnswer}')">
                ${String.fromCharCode(65 + i)}) ${answer}
            </div>`;
    });
    questionHTML += `</div><button onclick="nextQuestion()">Suivant</button>`;

    quizForm.innerHTML = questionHTML;
    resetTimer();
}

function checkAnswer(index, answer) {
    const correctAnswer = quizData[index].correct_answer;
    if (answer === correctAnswer) {
        score++;
    }
    updateScore();
    nextQuestion();
}

function updateScore() {
    document.getElementById("scr").textContent = score;
}

function nextQuestion() {
    clearInterval(timerInterval);
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion(currentQuestionIndex);
    } else {
        endQuiz();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timer = 15;
    document.getElementById("timer").textContent = timer;
    timerInterval = setInterval(() => {
        if (timer <= 0) {
            clearInterval(timerInterval);
            nextQuestion();
        } else {
            document.getElementById("timer").textContent = timer;
            timer--;
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerInterval);
    alert(`Quiz terminé ! Votre score final est : ${score}/${quizData.length}`);
    document.getElementById("quiz-form").innerHTML = `<button onclick='resetQuiz()'>Recommencer</button>`;
}

function resetQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    updateScore();
    document.getElementById("quiz-config").style.display = "block";
    document.getElementById("quiz-container").style.display = "none";
}
