import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

// Verifica si el usuario está autenticado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Mostrar el nombre del usuario en la página
      document.getElementById('user-name').textContent = user.displayName || user.email;
    } else {
      // Si no hay usuario autenticado, redirige al inicio de sesión
      window.location.replace('index.html');
    }
  });
});

// Manejar el evento de cierre de sesión
document.getElementById('logout-button').addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('Cierre de sesión exitoso');
    window.location.replace('index.html'); // Redirige al inicio de sesión
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    alert('Hubo un error al cerrar sesión');
  }
});
