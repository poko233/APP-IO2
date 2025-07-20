import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDV7N1yCLTmarc8AUHmehKv_2ablZsSVbs",
  authDomain: "app-io2-1d361.firebaseapp.com",
  projectId: "app-io2-1d361",
  storageBucket: "app-io2-1d361.firebasestorage.app",
  messagingSenderId: "341950038303",
  appId: "1:341950038303:web:b49f25abbbe872fc65302a",
  measurementId: "G-JTZV0BBNKR",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
