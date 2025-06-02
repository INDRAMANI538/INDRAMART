import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKgicgOsV0FYVWCvDvV-hoA3OL9i7Jh8w",
  authDomain: "heaven-s-mart.firebaseapp.com",
  projectId: "heaven-s-mart",
  storageBucket: "heaven-s-mart.firebasestorage.app",
  messagingSenderId: "253433896804",
  appId: "1:253433896804:web:af75c71ef7adf928e9a471",
  measurementId: "G-ZCC4C0N1T0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, googleProvider, db, storage, analytics };