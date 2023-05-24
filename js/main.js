const questionsSec = document.querySelector(".questions");
// función para barajar el array de respuestas
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
//función para imprimir un fieldset
function printFieldset(obj, i) {
  let question = `
                <section class="question-text">
                    <p>${obj.question}</p>
                </section>
                
                <section class="answers-section">
                    <div class="a">
                        <input type="radio" name="answer${i}" id="${obj.randomAnswers[0]}">
                        <label class="answer${i}" for="${obj.randomAnswers[0]}">${obj.randomAnswers[0]}</label>
                    </div>
                    <div class="b">
                        <input type="radio" name="answer${i}" id="${obj.randomAnswers[1]}">
                        <label class="answer${i}" for="${obj.randomAnswers[1]}">${obj.randomAnswers[1]}</label>
                    </div>
                    <div class="c">
                        <input type="radio" name="answer${i}" id="${obj.randomAnswers[2]}">
                        <label class="answer${i}" for="${obj.randomAnswers[2]}">${obj.randomAnswers[2]}</label>
                    </div>
                    <div class="d">
                        <input type="radio" name="answer${i}" id="${obj.randomAnswers[3]}">
                        <label class="answer${i}" for="${obj.randomAnswers[3]}">${obj.randomAnswers[3]}</label>
                    </div>
                </section>`;
  questionsSec.innerHTML = question;
}

// nos conectamos a la api
async function getQuiz() {
  try {
    let res = await fetch(
      "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple"
    );
    let data = await res.json();
    let { results } = data;
    // devolvemos el mapeo de results
    return results.map((element) => {
      const question = element.question;
      const correct = element.correct_answer;
      // creamos un array donde introducimos todas las respuestas
      // para luego desordenarlas
      let answers = [];
      answers.push(element.correct_answer);
      element.incorrect_answers.forEach((item) => {
        answers.push(item);
      });
      const randomAnswers = shuffle(answers);
      // devolvemos un objeto con la pregunta, la respuesta correcta
      // y todas las respuestas mezcladas
      return { question, correct, randomAnswers };
    });
  } catch (error) {
    console.log(`ERROR: ${error.stack}`);
  }
}
// invocamos la función y almacenamos la respuesta es una variable
// para no hacer varias diferentes llamadas en una sola partida
let quiz = getQuiz();
// pintamos la primera respuesta
quiz.then((data) => {
  printFieldset(data[0], 1);

  validation(data[0].correct, 1);
});
// empleamos el evento "hashchange" para movernos
// por las diferentes páginas
window.addEventListener("hashchange", () => {
  let hash = window.location.hash;
  questionsSec.innerHTML = "";
  // puesto que "quiz" es una promesa tenemos que acceder
  // a los datos a través de un then
  quiz.then((data) => {
    switch (hash) {
      case "#/question-1":
        printFieldset(data[0], 1);
        validation(data[0].correct, 1);
        break;
      case "#/question-2":
        printFieldset(data[1], 2);
        validation(data[1].correct, 2);
        break;
      case "#/question-3":
        printFieldset(data[2], 3);
        validation(data[2].correct, 3);
        break;
      case "#/question-4":
        printFieldset(data[3], 4);
        validation(data[3].correct, 4);
        break;
      case "#/question-5":
        printFieldset(data[4], 5);
        validation(data[4].correct, 5);
        break;
    }
  });
});

// VALIDACIOOON!!!!!

function validation(correct, i) {
  // almacenamos inputs para el checkeo y labels para modificar apariencia 
  const inputs = document.querySelectorAll(`input[name='answer${i}']`);
  const labels = document.querySelectorAll(`label[class='answer${i}']`);
  inputs.forEach((element, j) => {
    element.addEventListener("click", function(event) {
      event.preventDefault();
      if (event.target.id === correct) {
        // añadimos la clase "correct" a la label y lanzamos mensaje
        labels[j].classList.add("correct");
        Swal.fire({
          title: 'Correct!',
          text: `"${correct}" is the correct answer`,
          color: '#272d4b',
          icon: 'success',
          iconColor: '#0dde05',
          confirmButtonText: 'Continue!',
          confirmButtonColor: '#118ab2'
        }).then(() => {
          if (i < 5) {
            location.hash = `#/question-${i + 1}`;
          } else {
            window.location = './results.html';
          }
        })
        
      } else {
        // añadimos la clase "wrong" a la label y lanzamos mensaje
        labels[j].classList.add("wrong");
        Swal.fire({
          title: 'Wrong!',
          text: `The correct anser was: "${correct}"`,
          color: '#272d4b',
          icon: 'error',
          iconColor: '#ff0000',
          confirmButtonText: 'Cool',
          confirmButtonColor: '#118ab2'
        }).then(() => {
          if (i < 5) {
            location.hash = `#/question-${i + 1}`;
          } else {
            window.location = './results.html';
          }
        })
      }
    })
  })
}