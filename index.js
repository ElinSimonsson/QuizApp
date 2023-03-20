//const apiUrl = 'https://quizapi.io/api/v1/questions?apiKey=DCRondz5Ynv8tKQ1CTP7QIhIlDdTFa2cFRrtEUNj&category=code&difficulty=Hard&limit=10';

const baseUrl = 'https://quizapi.io/api/v1/questions?apiKey=DCRondz5Ynv8tKQ1CTP7QIhIlDdTFa2cFRrtEUNj';
let selectedCorrectAnswers = 0;

const button = document.querySelector('#fetch');

const form = document.querySelector('#form-hide');
const submitBtn = document.querySelector('#submit');

submitBtn.addEventListener('click', async function(event) {

  form.classList.add('hide');
  event.preventDefault();
  
  const apiUrl = createApiUrl();

  const response = await fetch(apiUrl);
  const data = await response.json();
  console.log(data);

  const questions = [];

  data.forEach(q => {
      const question = {
          question: q.question,
          answers: q.answers,
          correctAnswer: q.correct_answer,
          multipleCorrectAnswers: q.multiple_correct_answers,
          correct_answers: q.correct_answers
      };
      console.log(question);
      questions.push(question);
  });

  
  createQuestions(questions);
});

const createApiUrl = () => {
  let apiUrl = ''
  let selectedCategory = document.getElementById('category').value;
  let selectedDifficulty = document.getElementById('level').value;
  let selectedNumQuestions = document.getElementById('num-questions').value;

  console.log(selectedCategory, selectedDifficulty, selectedNumQuestions);

  let baseLimit = '&limit=';
  let baseCategory = '&category=';
  let baseDifficulty = '&difficulty='
  
  if (selectedCategory == 'none') {
    selectedCategory = '';
    baseCategory = '';
    console.log('none valdes');
  }

  if (selectedDifficulty == 'none') {
    selectedDifficulty = '';
    baseDifficulty = '';
  }

  const limit = '&limit=10'
  const category = '&category=code'
  const difficulty = '&difficulty=Hard'

  const apiUrlTest = `${baseUrl}${baseCategory}${selectedCategory}${baseDifficulty}${selectedDifficulty}${baseLimit}${selectedNumQuestions}`;

  apiUrl = `${baseUrl}${category}${difficulty}${limit}`;

  console.log('test', apiUrlTest, 'den verkliga apiurl', apiUrl);

  return apiUrlTest;
} 


// button.addEventListener('click', async e => {
//     const limit = '&limit=10'
//     const category = '&category=code'
//     const difficulty = '&difficulty=Hard'

//     const apiUrl = `${baseUrl}${category}${difficulty}${limit}`;

//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     console.log(data);
  
//     const questions = [];

//     data.forEach(q => {
//         const question = {
//             question: q.question,
//             answers: q.answers,
//             correctAnswer: q.correct_answer
//         };
//         if (question.correctAnswer != null) {
//         questions.push(question);
//         }
//     });

//     createQuestions(questions);
// });

function createQuestions(questions) {
  const quizContainer = document.getElementById('questions');
  let currentQuestion = 0;

  function showQuestion() {
    const question = questions[currentQuestion];
    const questionContainer = createQuestionContainer();
    const headerDiv = createHeaderDiv();
    const numOfQuestionDiv = createNumQuestionDiv();
    const questionTitle = createQuestionTitle(question);
    const answerDiv = createAnswerDiv();
    const optionElements = createOptionElements(question, answerDiv);
    createElementsInHeader(question, headerDiv, numOfQuestionDiv);

    optionElements.forEach(optionElement => {
      optionElement.addEventListener('click', () => {
        handleAnswerClick(optionElement, question, questionContainer);
      });
    });

    appendElementsToQuestionContainer( headerDiv, answerDiv, questionContainer);
    appendQuestionContainerToQuizContainer(questionContainer);
    countTotalAnswerOptions(question);
  }

  function createQuestionContainer() {
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');
    return questionContainer;
  }

  function createNumQuestionDiv () {
  
    const div = document.createElement('div');
    div.classList.add('question-counter');
    
    return div;
  }

  function createHeaderDiv () {
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('header-div');
    return headerDiv;
  }

  function createElementsInHeader(question, headerDiv) {

    const div = document.createElement('div');
    div.classList.add('question-counter');

    let selectedNumQuestions = document.getElementById('num-questions').value;
    const numberOfQuestionElement = document.createElement('h3');
    numberOfQuestionElement.classList.add('number-of-question');
    numberOfQuestionElement.innerText = `${currentQuestion + 1} of ${selectedNumQuestions}`;
    div.appendChild(numberOfQuestionElement);

    const countCorrectAnswers = getNumCorrectAnswers(question);
    const counterCorrectAnswersElement = document.createElement('h4');
    counterCorrectAnswersElement.classList.add('counter-correct-answers');
    
    counterCorrectAnswersElement.innerHTML = `<i>This question has <b>${countCorrectAnswers}</b> correct answer options</i>`;

    div.appendChild(counterCorrectAnswersElement);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title-div');

     const questionTitle = document.createElement('h3');
     questionTitle.classList.add('question-title');
     questionTitle.innerText = `${currentQuestion + 1}. ${question.question}`;
     titleDiv.appendChild(questionTitle);

    headerDiv.appendChild(div);
    headerDiv.appendChild(titleDiv);

    return numberOfQuestionElement;
  }

  function createQuestionTitle(question) {
    const questionTitle = document.createElement('h3');
    questionTitle.classList.add('question-title');
    questionTitle.innerText = `${currentQuestion + 1}. ${question.question}`;
    return questionTitle;
  }

  function createAnswerDiv() {
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer-div');
    return answerDiv;
  }

  function createOptionElements(question, answerDiv) {
    const optionElements = [];
    for (const [key, value] of Object.entries(question.answers)) {
      if (value != null) {
        const optionElement = document.createElement('div');
        optionElement.classList.add('answer-option');
        optionElement.innerText += value;
        optionElements.push(optionElement);
        answerDiv.appendChild(optionElement);
      }
    }
    return optionElements;
  }

  function handleAnswerClick(optionElement, question, questionContainer) {
      for (const [key, value] of Object.entries(question.answers)) {
        if (value === optionElement.innerText) {
          const answerKey = `${key}_correct`;
          const isCorrectAnswer = question.correct_answers[answerKey] === 'true';
          if (isCorrectAnswer) {
            selectedCorrectAnswers++;
            optionElement.classList.add('correct-answer');
          } else {
            optionElement.classList.add('incorrect-answer');
          }
        }
      }

      const numCorrectAnswers = getNumCorrectAnswers(question);

      console.log('selectedCorrectAnswer: ', selectedCorrectAnswers, 'antal rätt svar: ', numCorrectAnswers);
      if (selectedCorrectAnswers === numCorrectAnswers) {
        setTimeout(() => {
          quizContainer.removeChild(questionContainer);
          currentQuestion++;
          if (currentQuestion < questions.length) {
            showQuestion();
            selectedCorrectAnswers = 0;
          }
        }, 1000);
      }
  }

  function countTotalAnswerOptions (question) {
    const questionContainer = document.querySelector('.question-container');
    console.log(questionContainer);
    let totalOptions = 0;
    for (i in question.answers) {
      if (question.answers[i] != null) {
        totalOptions++;
      }
    }

    if (totalOptions <=2 ) {
      console.log('mindre eller lika med 2');
      questionContainer.style.height = '350px';
    } else if (totalOptions <= 4) {
      console.log('mindre eller lika med 4');
      questionContainer.style.height = '500px';
    } else if (totalOptions <= 6) {
      console.log('mindre eller lika med 6');
      questionContainer.style.height = '750px';
    }
  }
  
  function getNumCorrectAnswers (question) {
    let numOfCorrectAnswers = 0
      for (const property in question.correct_answers) {
        if (question.correct_answers[property] === 'true') {
          console.log(`sant: ${property}: ${question.correct_answers[property]}`);
          numOfCorrectAnswers++;
        }
      }
      return numOfCorrectAnswers;
  }

  function appendElementsToQuestionContainer(headerDiv, answerDiv, questionContainer) {
    questionContainer.appendChild(headerDiv);
    questionContainer.appendChild(answerDiv);
  }

  function appendQuestionContainerToQuizContainer(questionContainer) {
    quizContainer.appendChild(questionContainer);
  }

  showQuestion();
}

  