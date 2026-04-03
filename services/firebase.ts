import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2N5p04gSdfrWG3BqEMiBwR4gzLf3NUzg",
  authDomain: "remi-todo-cf255.firebaseapp.com",
  projectId: "remi-todo-cf255",
  storageBucket: "remi-todo-cf255.firebasestorage.app",
  messagingSenderId: "926057949438",
  appId: "1:926057949438:web:f402ea4faac4f1747f9daf",
  measurementId: "G-FH6LTKTRYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export default app;
