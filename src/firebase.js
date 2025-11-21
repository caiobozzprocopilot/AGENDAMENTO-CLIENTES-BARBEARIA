import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC8wHRbWK-Pxo-dVQ8CJYqGBAzNgpV6c0c",
  authDomain: "painel-de-controle-barbearia.firebaseapp.com",
  projectId: "painel-de-controle-barbearia",
  storageBucket: "painel-de-controle-barbearia.firebasestorage.app",
  messagingSenderId: "265229631509",
  appId: "1:265229631509:web:4c84766c49f1e95df67d24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
