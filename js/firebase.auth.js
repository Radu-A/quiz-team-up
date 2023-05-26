const firebaseConfig = {
  apiKey: "AIzaSyDJt9EBrOhGJLF7d2jcG5pX508pOjvnR14",
  authDomain: "quiz-team-up.firebaseapp.com",
  projectId: "quiz-team-up",
  storageBucket: "quiz-team-up.appspot.com",
  messagingSenderId: "844802837758",
  appId: "1:844802837758:web:83e3603f05a5be30d129af",
};

firebase.initializeApp(firebaseConfig);

// PINTAR PANTALLA

const welcome = document.createElement("section");
welcome.id = 'welcome';
const index = document.querySelector(".index");

// saber quien está logeado
var uid;
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    uid = user.uid;
    // ...
    console.log(user.email);
    console.log(uid);
  } else {
    // User is signed out
    // ...
  }
});

if (uid === '') {
  welcome.innerHTML = 
  `<h1>Welcome to the quiz!</h1>
    <h2>Log in and start the game</h2>
    <form action="" id="log-form">
      <input type="email" name="" id="log-email" placeholder="Email">
      <input type="password" name="" id="log-password" placeholder="Password">
      <button id="log-buton">Log-in</button>
    </form>
    <!-- <a href="./pages/questions.html" id="start-button">LOG IN</a> -->
    <P>...or register here</P>
    <form action="" id="sign-form">
      <input type="email" name="" id="sign-email" placeholder="Email">
      <input type="password" name="" id="sign-password1" placeholder="Password">
      <input type="password" name="" id="sign-password2" placeholder="Repete password">
      <button id="sign-buton">Sign-in</button>
    </form>`;
  index.appendChild(welcome);
} else {
  welcome.innerHTML = 
  `<h1>Welcome Mengano!</h1>
  <h2>Do you want to start again?</h2>
  <button id="again-button">Try again</button>`;
  index.appendChild(welcome);
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

  }


