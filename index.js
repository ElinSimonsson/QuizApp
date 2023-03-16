//const apiUrl = 'https://quizapi.io/api/v1/questions?apiKey=DCRondz5Ynv8tKQ1CTP7QIhIlDdTFa2cFRrtEUNj&category=code&difficulty=Hard&limit=10';

const baseUrl = 'https://quizapi.io/api/v1/questions?apiKey=DCRondz5Ynv8tKQ1CTP7QIhIlDdTFa2cFRrtEUNj'

const button = document.querySelector('#fetch');

button.addEventListener('click', async e => {
    const limit = '&limit=10'
    const category = '&category=code'
    const difficulty = '&difficulty=Hard'

    const apiUrl = `${baseUrl}${category}${difficulty}${limit}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
  
    const questions = [];

    data.forEach(q => {
        const question = {
            question: q.question,
            answers: q.answers,
            correctAnswer: q.correct_answer
        };
        if (question.correctAnswer != null) {
        questions.push(question);
        }
    });

    createQuestions(questions);
});

function createQuestions(questions) {
  // Hämta elementet där du vill lägga till frågorna
  const quizContainer = document.getElementById('questions');

  let currentQuestion = 0; // Variabel för att hålla reda på vilken fråga som visas

  function showQuestion() {
    // Hämta den aktuella frågan från questions-arrayen
    const question = questions[currentQuestion];

    // Skapa en ny div för frågan och lägg till den i quizContainer
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');

    // Skapa en ny div för frågetexten och lägg till den i questionContainer
    const questionTitle = document.createElement('h3');
    questionTitle.classList.add('question-title');
    questionTitle.innerText = `${currentQuestion + 1}. ${question.question}`;
    questionContainer.appendChild(questionTitle);

    // Skapa en ny div för svarsalternativen och lägg till dem i questionContainer
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer-div');

    // Loopa igenom varje svarsalternativ i frågan och lägg till dem i answerDiv
    for (const [key, value] of Object.entries(question.answers)) {
      if (value != null) {
        const optionElement = document.createElement('div');
        optionElement.classList.add('answer-option');
        optionElement.innerText += value;
        answerDiv.appendChild(optionElement);

        // Lägg till en click-eventlistener på svarsalternativet
        optionElement.addEventListener('click', () => {
          // Om användaren har svarat rätt
          if (key == question.correctAnswer) {
            optionElement.classList.add('correct-answer');
            setTimeout(() => {
              // Ta bort den aktuella frågan från quizContainer
              quizContainer.removeChild(questionContainer);

              // Öka currentQuestion-variabeln med 1
              currentQuestion++;

              // Om det finns fler frågor att visa, visa nästa fråga
              if (currentQuestion < questions.length) {
                showQuestion();
              }
            }, 1000); // Vänta en sekund innan nästa fråga visas
          } else {
            optionElement.classList.add('incorrect-answer');
          }
        });
      }
    }
    questionContainer.appendChild(answerDiv);
    quizContainer.appendChild(questionContainer);
  }

  showQuestion(); // Visa den första frågan
}
  
