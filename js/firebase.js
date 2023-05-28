const firebaseConfig = {
  apiKey: "AIzaSyDJt9EBrOhGJLF7d2jcG5pX508pOjvnR14",
  authDomain: "quiz-team-up.firebaseapp.com",
  projectId: "quiz-team-up",
  storageBucket: "quiz-team-up.appspot.com",
  messagingSenderId: "844802837758",
  appId: "1:844802837758:web:83e3603f05a5be30d129af",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const showChart = async () => {
  const resultsChart = document.querySelector(".results-chart");
  const loader = document.createElement("div");
  loader.className = "lds-dual-ring";
  resultsChart.appendChild(loader);
  setTimeout(() => {
    firebase.auth().onAuthStateChanged((user) => {
      resultsChart.innerHTML = "";
      let email = user.email;
      db.collection("users")
        .doc(email)
        .get()
        .then((item) => {
          let data = {
            labels: [],
            series: [],
          };
          let results = item.data().counter.map((ele) => {
            if (ele == "null") {
              ele = 0;
            }
            return +ele;
          });
          if (results.length <= 5) {
            data.labels = [1, 2, 3, 4, 5];
            switch (results.length) {
              case 1:
                results = [...results, 0, 0, 0, 0];
                break;
              case 2:
                results = [...results, 0, 0, 0];
                break;
              case 3:
                results = [...results, 0, 0];
                break;
              case 4:
                results = [...results, 0];
                break;
              case 5:
                results = [...results];
                break;
            }
            data.series.push(results);
          } else {
            let resArray = results.slice(results.length - 5);
            data.series.push(resArray);
            for (let i = results.length - 5; i < results.length; i++) {
              data.labels.push(i + 1);
            }
          }
          new Chartist.Bar(".ct-chart", data, {
            axisY: { onlyInteger: true },
            high: 5,
            chartPadding: {
              right: 20,
              top: 40,
              bottom: 20,
            },
          });
        });
      const labelY = document.createElement("div");
      labelY.innerHTML = "Puntuación";
      labelY.className = "labelY";
      const labelX = document.createElement("div");
      labelX.innerHTML = "Últimas 5 partidas";
      labelX.className = "labelX";
      resultsChart.appendChild(labelY);
      resultsChart.appendChild(labelX);
    });
  }, 2000);
};

const createReg = async (user, data) => {
  await db.collection("users").doc(user.email).set(data);
};

export const setPoints = async () => {
  // Obtenemos los puntos del usuario almacenados en localStorage
  let points = localStorage.getItem("counter");
  // Creamos un objeto con la clave "counter" para almacenar los puntos
  let obj = {
    counter: [points],
  };

  await firebase.auth().onAuthStateChanged((user) => {
    let email = user.email;
    db.collection("users")
      .get()
      .then((item) =>
        item.forEach(async (ele) => {
          if (ele.id === email) {
            let prevPoints = await ele.data().counter;
            await db
              .collection("users")
              .doc(ele.id)
              .update({ counter: [...prevPoints, points] });
          } else {
            await createReg(user, obj);
          }
          await showChart();
        })
      );
  });
};
