import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcOQ4GAfxvOJWmfbe9SXA63_WNAqUBMzE",
  authDomain: "hyl1a-plaza.firebaseapp.com",
  projectId: "hyl1a-plaza",
  storageBucket: "hyl1a-plaza.firebasestorage.app",
  messagingSenderId: "74246669403",
  appId: "1:74246669403:web:0a7d62be23c73823fbeb7e",
  measurementId: "G-KLLS1L9S2V"
};

const app = initializeApp(firebaseConfig);
// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);

window.FirebaseApp = app;
window.FirebaseAuth = auth;
window.FirebaseDB = db;

window.Firestore = { doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc };
