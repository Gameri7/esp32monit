document.addEventListener("DOMContentLoaded", function(){
// escuche los cambios de estado de autenticación
auth.onAuthStateChanged(user => {
    if (user) {
          console.log("user logged in");
          console.log(user);
          setupUI(user);
          let uid = user.uid;
          console.log(uid);
        } else {
          console.log("user logged out");
          setupUI();
          }
});
// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // obtener información del usuario
    const email = loginForm['input-email'].value;
    const password = loginForm['input-password'].value;
    // Inicia sesión en el usuario
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // cierre el formulario de inicio de sesión y reinicio
        loginForm.reset();
        console.log(email);
    })
        .catch((error) =>{
            const errorCode = error.code;
            const errorMessage = error.message;
            document.getElementById("error-message").innerHTML = errorMessage;
            console.log(errorMessage);
        });
});
// logout
const logout = document.querySelector('#logout-link');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    });
}); 