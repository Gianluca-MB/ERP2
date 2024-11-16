import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

// Elementos del DOM
const loginContainer = document.getElementById('login-container');
const homeContainer = document.getElementById('home-container');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');

// Verifica si el usuario ya está autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Si el usuario está autenticado, muestra la página principal
    showHome(user);
  } else {
    // Si no hay usuario autenticado, muestra el formulario de inicio de sesión
    showLogin();
  }
});

// Función para mostrar la página principal
function showHome(user) {
  loginContainer.classList.add('hidden');
  homeContainer.classList.remove('hidden');
  document.getElementById('user-name').textContent = user.displayName || user.email;
}

// Función para mostrar el formulario de inicio de sesión
function showLogin() {
  loginContainer.classList.remove('hidden');
  homeContainer.classList.add('hidden');
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
    showLogin();
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
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error al iniciar sesión: " + error.message);
  }
}

// Cierre de sesión
async function logoutUser() {
  try {
    await signOut(auth);
    alert('Cierre de sesión exitoso');
    showLogin();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    alert('Hubo un error al cerrar sesión');
  }
}

// Eventos
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  loginUser(email, password);
});

if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
  });
}
