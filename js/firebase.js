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
  setTimeout(async () => {
    await firebase.auth().onAuthStateChanged((user) => {
      resultsChart.innerHTML = "";
      let email = user.email;
      db.collection("users")
        .doc(email)
        .get()
        .then((item) => {
          let data = {
            labels: [1, 2, 3, 4, 5],
            series: [],
          };
          let results = item.data().counter.map((ele) => {
            if (ele == "null") {
              ele = 0;
            }
            return +ele;
          });
          data.series.push(results);
          new Chartist.Bar(".ct-chart", data, {
            axisY: { onlyInteger: true },
            high: 5,
          });
        });
    });
  }, 1000);
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
