const firebaseConfig = {
  apiKey: "AIzaSyDJt9EBrOhGJLF7d2jcG5pX508pOjvnR14",
  authDomain: "quiz-team-up.firebaseapp.com",
  projectId: "quiz-team-up",
  storageBucket: "quiz-team-up.appspot.com",
  messagingSenderId: "844802837758",
  appId: "1:844802837758:web:83e3603f05a5be30d129af",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


// FIREBASE AUTH

// registro de nuevos usuarios
const signForm = document.querySelector('#sign-form');



signForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const signEmail = document.querySelector('#sign-email').value;
  const signPassword1 = document.querySelector('#sign-password1').value;
  const signPassword2 = document.querySelector('#sign-password2').value;

  if (signEmail && signPassword1 && signPassword2) {
    if (signPassword1 === signPassword2) {
      firebase.auth().createUserWithEmailAndPassword(signEmail, signPassword1)
      .then((userCredential) => {
        var user = userCredential.user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    } else {
      // provisional
      alert("Los contraseñas no coiciden")
    }
  } else {
    // provisional
    alert("Todos los campos son obligatorios")
  }

  
})

// logeo de ususarios
const logForm = document.querySelector("#log-form");

logForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const logEmail = document.querySelector('#log-email').value;
  const logPassword = document.querySelector('#log-password').value;

  firebase.auth().signInWithEmailAndPassword(logEmail, logPassword)
  .then((userCredential) => {
    var user = userCredential.user;
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
})

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