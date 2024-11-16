import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

// Elementos del DOM
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterForm = document.getElementById('show-register-form');
const showLoginForm = document.getElementById('show-login-form');

// Manejo del estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Si el usuario ya está autenticado, redirige a home.html
    window.location.replace('./home.html'); // Cambiamos a replace para asegurar una redirección efectiva
  } else {
    // Si no hay usuario autenticado, muestra el formulario de inicio de sesión
    toggleForms(false);
  }
});

// Función para mostrar el formulario de registro o el de inicio de sesión
function toggleForms(showRegister) {
  if (showRegister) {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
  } else {
    loginContainer.style.display = 'block';
    registerContainer.style.display = 'none';
  }
}

// Registro de usuario
async function registerUser(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuario registrado:", userCredential.user);

    // Guardar información adicional en Firestore
    await addDoc(collection(db, 'users'), {
      uid: userCredential.user.uid,
      name: name,
      email: email,
    });

    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    toggleForms(false); // Cambia al formulario de inicio de sesión
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    alert("Error al registrar usuario: " + error.message);
  }
}

// Inicio de sesión
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Inicio de sesión exitoso:", userCredential.user);

    // Redirigir a la página principal
    window.location.replace('./home.html'); // Cambiamos a replace para evitar volver a la página de login con el botón "Atrás"
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error al iniciar sesión: " + error.message);
  }
}

// Eventos
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  loginUser(email, password);
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  registerUser(name, email, password);
});

showRegisterForm.addEventListener('click', (e) => {
  e.preventDefault();
  toggleForms(true);
});

showLoginForm.addEventListener('click', (e) => {
  e.preventDefault();
  toggleForms(false);
});
