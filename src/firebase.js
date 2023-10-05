import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC-OXQpuzuaIB1nxiltrGU7QTHy8S1Q7WY",
  authDomain: "chatapp-727e3.firebaseapp.com",
  projectId: "chatapp-727e3",
  storageBucket: "chatapp-727e3.appspot.com",
  messagingSenderId: "611845855092",
  appId: "1:611845855092:web:b400753192424e6774be21"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
