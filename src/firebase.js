import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAWIxsDtVMP08zelp-J6Fsi-Y7NijsdsqE",
  authDomain: "painel-de-controle-barbearia.firebaseapp.com",
  projectId: "painel-de-controle-barbearia",
  storageBucket: "painel-de-controle-barbearia.firebasestorage.app",
  messagingSenderId: "183780407855",
  appId: "1:183780407855:web:71d40c9bcab5049db6e4da",
  measurementId: "G-9CDJCZ5TCE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
