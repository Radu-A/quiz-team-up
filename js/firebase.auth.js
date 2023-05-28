// CONFIGURACIÓN FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDJt9EBrOhGJLF7d2jcG5pX508pOjvnR14",
  authDomain: "quiz-team-up.firebaseapp.com",
  projectId: "quiz-team-up",
  storageBucket: "quiz-team-up.appspot.com",
  messagingSenderId: "844802837758",
  appId: "1:844802837758:web:83e3603f05a5be30d129af",
};

firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GoogleAuthProvider();

// VARIABLES DE ÁMBITO GLOBAL
const welcome = document.createElement("section");
welcome.id = 'welcome';
const index = document.querySelector(".index");
const errorP = document.createElement("p");
errorP.classList.add('error');
const emailRe = /^(\w)(\w+-?_?.?)+@(\w+)\.([a-z]{2,4})$/gi;
const passRe = /^[\w\-\.]{6,12}$/g;

// FUNCIONES

function printStartAgain(user) {
  welcome.innerHTML = 
    `<h1>Welcome ${user.displayName}!</h1>
    <h2>Do you want to start again?</h2>
    <button id="again-button">Play</button>
    <a id='logout-link' href=''>...or just log out?</a>`;
    index.appendChild(welcome);
}
function printLogin() {
  welcome.innerHTML = 
  `<h1>Welcome to the quiz!</h1>
  <h2>Log in and start the game</h2>
  <form action="" id="log-form">
    <input type="text" name="" id="log-email" placeholder="Email">
    <input type="password" name="" id="log-password" placeholder="Password">
    <button id="log-button">Log in</button>
    </form>
    <button id="google-button"><img id="google-icon" src="./assets/images/google-logos-idvNIQR3p7.svg" alt="">Continue with Google</button>
  <!-- <a href="./pages/questions.html" id="start-button">LOG IN</a> -->
  <p>...or register here</p>
  <form action="" id="sign-form">
    <input type="text" name="" id="sign-name" placeholder="Name">
    <input type="text" name="" id="sign-email" placeholder="Email">
    <input type="password" name="" id="sign-password1" placeholder="Password">
    <input type="password" name="" id="sign-password2" placeholder="Repete password">
    <button id="sign-button">Sign up</button>
  </form>`;
  index.appendChild(welcome);
}
function printSignin() {

}
function logout() {
  const logoutLink = document.querySelector('#logout-link');
    logoutLink.addEventListener('click', function() {
      firebase.auth().signOut().then(() => {
        window.location.reload();
      }).catch((error) => {
        // An error happened.
      });
    })
}
function logIn() {
  const logForm = document.querySelector("#log-form");
    
  logForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const logEmail = document.querySelector("#log-email").value;
    const logPassword = document.querySelector("#log-password").value;
    
    if (logEmail && logPassword) {
      if (logEmail.match(emailRe)) {
        firebase
        .auth()
        .signInWithEmailAndPassword(logEmail, logPassword)
        .then((userCredential) => {
          var user = userCredential.user;
          Swal.fire({
            title: `Hi again ${user.displayName}`,
            text: "Are you ready for the challenge" ,
            color: "#9b1fbe",
            icon: "success",
            iconColor: "#9b1fbe",
            confirmButtonText: "Let's go!",
            confirmButtonColor: "#9b1fbe",
          }).then(() => window.location = "./pages/questions.html")
        })
        .catch((error) => {
          var errorCode = error.code;
          
          errorP.innerHTML = error.message;
          logForm.appendChild(errorP);
        });
      } else {
        errorP.innerHTML = "Email doesn't have the correct format";
        logForm.appendChild(errorP);
      }
    } else {
      errorP.innerHTML = 'All fields are required';
      logForm.appendChild(errorP);
    }
  });
}
function signUp() {
  const signForm = document.querySelector("#sign-form");
    signForm.addEventListener("submit", function (event) {
      event.preventDefault();
      
      const signName = document.querySelector("#sign-name").value;
      const signEmail = document.querySelector("#sign-email").value;
      const signPassword1 = document.querySelector("#sign-password1").value;
      const signPassword2 = document.querySelector("#sign-password2").value;

      if (signName && signEmail && signPassword1 && signPassword2) {
        if (signPassword1 === signPassword2) {
          if (signPassword1.match(passRe)) {
            firebase.auth().createUserWithEmailAndPassword(signEmail, signPassword1)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              user.updateProfile({
                displayName: signName
              }).catch((error) => {
                // An error occurred
                // ...
                errorP.innerHTML = error;
                signForm.appendChild(errorP);
              });
            })
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              errorP.innerHTML = errorMessage;
              signForm.appendChild(errorP);
            });
          } else {
            errorP.innerHTML = 'Password should have between 6-12 alphanumeric characters or: / . - _';
            signForm.appendChild(errorP);
          }
        } else {
          errorP.innerHTML = "The passwords doesn't match";
          signForm.appendChild(errorP);
        }
      } else {
        errorP.innerHTML = 'All fields are required';
        signForm.appendChild(errorP);
      }
    });
}
function passwordValidation() {
  const signForm = document.querySelector("#sign-form");
  const inputPassword1 = document.querySelector('#sign-password1');
    inputPassword1.addEventListener('change', function() {
      if (!inputPassword1.value.match(passRe)) {
        errorP.innerHTML = 'Password should have between 6-12 alphanumeric characters and / . - _';
        signForm.appendChild(errorP);
      }
    })
}

// VALIDACIÓN USUARIOS

// antes de pintar pantalla debemos saber si hay algún usuario logeado y quien es
firebase.auth().onAuthStateChanged((user) => {
  firebase.auth()
  .getRedirectResult()
  .then((result) => {
    if (result.credential) {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // ...
    }
    // The signed-in user info.
    var user = result.user;
    // IdP data available in result.additionalUserInfo.profile.
      // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
  // si hay hay un ususario logeado pintamos la pantalla que ofrece jugar de nuevo o deslogearse
  if (user) {
    printStartAgain(user)
    // añadimos el evento para jugar de nuevo
    const againButton = document.querySelector('#again-button');
    againButton.addEventListener('click', function() {
      window.location = "./pages/questions.html";
    })
    logout()
  // si el usuario no está logeado pintamos la pantalla que ofre logearse o registrarse
  } else {
    printLogin()
    // si ya se ha agregado un párrafo de error, se borrará al modificar un input
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input=> {
      input.addEventListener('click', function() {
        if (document.querySelector('p.error')) {
          document.querySelector('p.error').remove();
        }
      })
    })
    // login con Google
    const googleButton = document.querySelector('#google-button');
    googleButton.addEventListener('click', function(event) {
      event.preventDefault();

      firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // IdP data available in result.additionalUserInfo.profile.
          // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    })
    
    // login de ususarios
    logIn()
    // validación del primer input de contraseña
    passwordValidation()
    // registro de nuevos usuarios
    signUp()
  }
});