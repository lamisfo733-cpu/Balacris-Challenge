// Firebase Configuration
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQF8tA2w41g62xExTUfYbH9Ad7dlbj-SI",
  authDomain: "balacris-2025challenge.firebaseapp.com",
  projectId: "balacris-2025challenge",
  storageBucket: "balacris-2025challenge.firebasestorage.app",
  messagingSenderId: "701391814240",
  appId: "1:701391814240:web:43b94a43b61487c1ff0d05",
  measurementId: "G-45P8WRR2MZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export Firebase services
export { db, analytics, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, orderBy, limit };
