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
  await db
    .collection("users")
    .get()
    .then(async (item) => {
      if (item.size === 0) {
        let doc = await db.collection("users").doc();
        doc.set({ counter: [points] });
      } else {
        let docRef = await db
          .collection("users")
          .get()
          .then((item) => {
            let id = "";
            item.forEach((ele) => (id = ele.id));
            return id;
          });

        let prevResult = await db
          .collection("users")
          .doc(docRef)
          .get()
          .then((item) => item.data().counter);
        await db
          .collection("users")
          .doc(docRef)
          .update({
            counter: [...prevResult, localStorage.getItem("counter")],
          });
      }
    });
};

// FIREBASE AUTH


  // registro de nuevos usuarios
const signForm = document.querySelector("#sign-form");

signForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const signEmail = document.querySelector("#sign-email").value;
  const signPassword1 = document.querySelector("#sign-password1").value;
  const signPassword2 = document.querySelector("#sign-password2").value;

  if (signEmail && signPassword1 && signPassword2) {
    if (signPassword1 === signPassword2) {
      firebase.auth().createUserWithEmailAndPassword(signEmail, signPassword1)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
    } else {
      // provisional
      alert("Los contraseñas no coiciden");
    }
  } else {
    // provisional
    alert("Todos los campos son obligatorios");
  }
});

// logeo de ususarios
const logForm = document.querySelector("#log-form");

logForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const logEmail = document.querySelector("#log-email").value;
  const logPassword = document.querySelector("#log-password").value;

  if (logEmail && logPassword) {
    firebase
      .auth()
      .signInWithEmailAndPassword(logEmail, logPassword)
      .then((userCredential) => {
        var user = userCredential.user;
        window.location = "./pages/questions.html";
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  } else {
    alert("Todos los campos son obligatorios");
  }
});

// mostrar usuario logeado

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log(user.email);
    var uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});


