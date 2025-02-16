const answers = {
    1: "qst1_ans2", 
    2: "qst2_ans1", 
    3: "qst3_ans1", 
    4: "qst4_ans2", 
    5: "qst5_ans1", 
    6: "qst6_ans1", 
    7: "qst7_ans1" 
  };
  
  let score = 0;
  let currentQuestionIndex = 0; 
  const questionsArray = ["qst1", "qst2", "qst3", "qst4", "qst5", "qst6", "qst7"];
  let userAnswers = {};
  let timers = {};

  function checkQuestion(qstNumber, ansId) {
    let currentQstId = "qst" + qstNumber;
  
    if (questionsArray[currentQuestionIndex] !== currentQstId) return;
    
    if (userAnswers[currentQstId]) return;
    
    userAnswers[currentQstId] = ansId;
    
    let selectedOption = document.getElementById(ansId);
    let correctOption = document.getElementById(answers[qstNumber]);
    
    if (answers[qstNumber] === ansId) {
      selectedOption.style.backgroundColor = "green";
      score++;
    } else {
      selectedOption.style.backgroundColor = "red";
      correctOption.style.backgroundColor = "blue";
    }

    clearInterval(timers[currentQstId]);
    

    disableOptions(currentQstId);
  }

  function startTimer(qst) {
    let timeLeft = 15;
    let timerDisplay = document.createElement('div');
    timerDisplay.id = `timer-${qst}`;
    timerDisplay.textContent = `Temps restant : ${timeLeft}s`;
    document.getElementById(qst).appendChild(timerDisplay);
    
    timers[qst] = setInterval(function() {
      timeLeft--;
      timerDisplay.textContent = `Temps restant : ${timeLeft}s`;
      
      if (timeLeft <= 0) {
        clearInterval(timers[qst]);
        timerDisplay.textContent = "Temps écoulé !";
        

        let qstNumber = parseInt(qst.replace("qst", ""));
        let correctOption = document.getElementById(answers[qstNumber]);
        correctOption.style.backgroundColor = "blue";
        
        disableOptions(qst);
      }
    }, 1000);
  }
  
 
  function disableOptions(qst) {
    let options = document.querySelectorAll(`#${qst} .option`);
    options.forEach(option => {
      option.style.pointerEvents = "none";
    });
  }
  

  function valider() {
    let currentQstId = questionsArray[currentQuestionIndex];
    let currentQstElem = document.getElementById(currentQstId);
    if (currentQstElem) {
      currentQstElem.style.display = "none";
    }
    
    clearInterval(timers[currentQstId]);
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questionsArray.length) {
      let nextQstId = questionsArray[currentQuestionIndex];
      let nextQstElem = document.getElementById(nextQstId);
      if (nextQstElem) {
        nextQstElem.style.display = "block";
        startTimer(nextQstId);
      }
    } else {
      document.getElementById("tit").style.display = "block";
      let scr = document.getElementById("scr");
      scr.textContent = score;
      scr.style.display = "block";
      
      let but = document.getElementById("but");
      but.textContent = "Terminé";
      but.onclick = function () {
        window.close();
      };
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    startTimer(questionsArray[currentQuestionIndex]);
  });
  