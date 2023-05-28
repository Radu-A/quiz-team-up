import { setPoints } from "./firebase.js";

document.querySelector(".results-final-result").innerHTML = `${JSON.parse(
  localStorage.getItem("counter")
)} out of 5`;

await setPoints();
