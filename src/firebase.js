import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase (Reemplaza estos valores)
const firebaseConfig = {
    apiKey: "AIzaSyCjlQjC5Z6XWZRijNCvrNWYY2IvDDsuUQ0",
    authDomain: "erp2-6d31e.firebaseapp.com",
    projectId: "erp2-6d31e",
    storageBucket: "erp2-6d31e.firebasestorage.app",
    messagingSenderId: "520058152534",
    appId: "1:520058152534:web:9771540704fa32dd59fdf7",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
