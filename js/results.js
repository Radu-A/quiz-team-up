import { db } from "./firebase.js";

document.querySelector(".results-final-result").innerHTML = `${JSON.parse(
  localStorage.getItem("counter")
)} out of 5`;

db.collection("users")
  .get()
  .then((item) => {
    let data = {
      labels: [],
      series: [],
    };
    item.forEach((ele) => {
      let resArray = ele.data().counter.map((item) => {
        if (item == null) {
          item = 0;
        }
        return +item;
      });
      let numPartidas = resArray.length;
      let ultimasPartidas = numPartidas - 5;
      for (let i = ultimasPartidas + 1; i <= numPartidas; i++) {
        data.labels.push(i);
      }
      data.series.push(resArray.slice(resArray.length - 5));
    });
    new Chartist.Bar(".ct-chart", data, {
      axisY: { onlyInteger: true },
      high: 5,
    });
  });
