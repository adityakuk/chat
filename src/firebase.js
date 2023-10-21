import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqw019t1uS-CkAqXBk0xuzYEOX0-gLj2A",
  authDomain: "chat2-54b3a.firebaseapp.com",
  projectId: "chat2-54b3a",
  storageBucket: "chat2-54b3a.appspot.com",
  messagingSenderId: "198490994933",
  appId: "1:198490994933:web:8eed0c646ace1e69f12dbc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

