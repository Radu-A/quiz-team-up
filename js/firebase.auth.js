const firebaseConfig = {
  apiKey: "AIzaSyDJt9EBrOhGJLF7d2jcG5pX508pOjvnR14",
  authDomain: "quiz-team-up.firebaseapp.com",
  projectId: "quiz-team-up",
  storageBucket: "quiz-team-up.appspot.com",
  messagingSenderId: "844802837758",
  appId: "1:844802837758:web:83e3603f05a5be30d129af",
};

firebase.initializeApp(firebaseConfig);

const welcome = document.createElement("section");
welcome.id = 'welcome';
const index = document.querySelector(".index");

// antes de pintar pantalla debemos saber si algún usuario logeado y quien es

firebase.auth().onAuthStateChanged((user) => {
  // si hay hay un ususario logeado pintamos la pantalla que ofrece jugar de nuevo o deslogearse
  if (user) {
    // pintamos pantalla
    welcome.innerHTML = 
    `<h1>Welcome ${user.displayName}!</h1>
    <h2>Do you want to start again?</h2>
    <button id="again-button">Try again</button>
    <a id='logout-link' href=''>...or just log out?</a>`;
    index.appendChild(welcome);
    // añadimos el evento para jugar de nuevo
    const againButton = document.querySelector('#again-button');
    againButton.addEventListener('click', function() {
      
      window.location = "./pages/questions.html";
    })
    // añadimos el evento para deslogearse
    const logoutLink = document.querySelector('#logout-link');
    logoutLink.addEventListener('click', function() {
      firebase.auth().signOut().then(() => {
        window.location.reload();
      }).catch((error) => {
        // An error happened.
      });
    })
  // si el usuario no está logeado pintamos la pantalla que ofre logearse o registrarse
  } else {
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
      <input type="text" name="" id="sign-name" placeholder="Name">
      <input type="email" name="" id="sign-email" placeholder="Email">
      <input type="password" name="" id="sign-password1" placeholder="Password">
      <input type="password" name="" id="sign-password2" placeholder="Repete password">
      <button id="sign-buton">Sign-in</button>
    </form>`;
    index.appendChild(welcome);
    const errorP = document.createElement("p");
    errorP.classList.add('error');
    // si ya se ha agregado un párrafo de error, se borrará al modificar un input
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input=> {
      input.addEventListener('click', function() {
        if (document.querySelector('p.error')) {
          document.querySelector('p.error').remove();
        }
      })
    })

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
            
            errorP.innerHTML = error.message;
            logForm.appendChild(errorP);
          });
      } else {
        errorP.innerHTML = 'All fields are required';
        logForm.appendChild(errorP);
      }
    });

    // registro de nuevos usuarios
    const signForm = document.querySelector("#sign-form");
    signForm.addEventListener("submit", function (event) {
      event.preventDefault();
      
      const signName = document.querySelector("#sign-name").value;
      const signEmail = document.querySelector("#sign-email").value;
      const signPassword1 = document.querySelector("#sign-password1").value;
      const signPassword2 = document.querySelector("#sign-password2").value;

      if (signName && signEmail && signPassword1 && signPassword2) {
        if (signPassword1 === signPassword2) {
          firebase.auth().createUserWithEmailAndPassword(signEmail, signPassword1)
          .then((userCredential) => {
            // Signed in
            const user = firebase.auth().currentUser;
            user.updateProfile({
              displayName: signName
            }).catch((error) => {
              // An error occurred
              // ...
            });
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
          });
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
});