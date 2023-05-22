

const quizForm = document.querySelector("#quiz-form");
const correct = [];
// función para barajar el array de respuestas
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
//función para imprimir un fieldset
function printFieldset(question, answers, i) {
    const myDiv = document.createElement("div");
            myDiv.innerHTML = `<fieldset id="fieldset${i}">
                <div>
                    <legend>${question}</legend>
                </div>
                
                <div class="a">
                    <input type="radio" name="answer${i}" id="${answers[0]}">
                    <label for="${answers[0]}">${answers[0]}</label>
                </div>
                <div class="b">
                    <input type="radio" name="answer${i}" id="${answers[1]}">
                    <label for="${answers[1]}">${answers[1]}</label>
                </div>
                <div class="c">
                    <input type="radio" name="answer${i}" id="${answers[2]}">
                    <label for="${answers[2]}">${answers[2]}</label>
                </div>
                <div class="d">
                    <input type="radio" name="answer${i}" id="${answers[3]}">
                    <label for="${answers[2]}">${answers[2]}</label>
                </div>
            </fieldset>`
            quizForm.appendChild(myDiv);
}
// nos conectamos a la api
async function printQuiz() {
    try {
        let res = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple");
        let data = await res.json();
        data.results.forEach((element, i)=>{
            const question = element.question;
            let answers = [];
            correct.push(element.correct_answer);
            answers.push(element.correct_answer);
            element.incorrect_answers.forEach(item=> {
                answers.push(item);
            });
            const randomAnswers = shuffle(answers);
            
            printFieldset(question, randomAnswers, i);
        })
    } catch {
        console.log(`ERROR: ${error.stack}`);
    }
}
printQuiz();