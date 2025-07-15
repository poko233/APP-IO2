import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDV7N1yCLTmarc8AUHmehKv_2ablZsSVbs",
  authDomain: "app-io2-1d361.firebaseapp.com",
  projectId: "app-io2-1d361",
  storageBucket: "app-io2-1d361.firebasestorage.app",
  messagingSenderId: "341950038303",
  appId: "1:341950038303:web:b49f25abbbe872fc65302a",
  measurementId: "G-JTZV0BBNKR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
