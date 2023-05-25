import { db } from "./firebase.js";

document.querySelector(".results-final-result").innerHTML = `${JSON.parse(
  localStorage.getItem("counter")
)} out of 5`;

db.collection("users")
  .get()
  .then((item) => {
    var data = {
      labels: ["5 últimas partidas"],
      series: [],
    };
    item.forEach((ele) => {
      let resArray = ele.data().counter.map((item) => {
        if (item == null) {
          item = 0;
        }
        return +item;
      });
      data.series.push(resArray);
    });
    new Chartist.Bar(".results-chart", data, {
      axisY: { onlyInteger: true },
    });
  });
