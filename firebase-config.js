// Firebase Configuration
// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDyaAtK5YBWpMedGCICayR-VJq2111SpgU",
  authDomain: "perforated-panel-designer.firebaseapp.com",
  projectId: "perforated-panel-designer",
  storageBucket: "perforated-panel-designer.firebasestorage.app",
  messagingSenderId: "203709637797",
  appId: "1:203709637797:web:544190529c7c874aaf994c"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
