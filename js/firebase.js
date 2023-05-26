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

export const setPoints = async () => {
  let points = localStorage.getItem("counter");
  let obj = {
    email: "",
    counter: [points],
  };
  await firebase.auth().onAuthStateChanged((user) => {
    obj.email = user.email;
  });

  db.collection("users")
    .get()
    .then((item) =>
      item.forEach(async (ele) => {
        if (ele.data().email === obj.email) {
          let prevPoints = ele.data().counter;
          await db
            .collection("users")
            .doc(ele.id)
            .update({
              ...ele.data(),
              counter: [...prevPoints, points],
            });
        } else {
          db.collection("users").add(obj);
        }
      })
    );
};

// FIREBASE AUTH
