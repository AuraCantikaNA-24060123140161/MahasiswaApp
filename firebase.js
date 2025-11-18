import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjFkqrmMQmA9Zl9v2szizYzHp0fClj4og",
  authDomain: "mahasiswaapp-ae6e2.firebaseapp.com",
  projectId: "mahasiswaapp-ae6e2",
  storageBucket: "mahasiswaapp-ae6e2.firebasestorage.app",
  messagingSenderId: "1025203018594",
  appId: "1:1025203018594:web:db0a99b0a9ada725fcaa3b",
  measurementId: "G-P4PCZTJ1EG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
