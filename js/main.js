

const questionSec = document.querySelector(".questions form");
// nos conectamos a la api
async function printQuiz() {
    try {
        let res = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple");
        let data = await res.json();
        data.results.forEach(element=>{
            console.log(element);

        })
    } catch {
        console.log(`ERROR: ${error.stack}`);
    }
}
printQuiz();