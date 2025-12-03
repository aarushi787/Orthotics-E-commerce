// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWhPaX_8p_gjkHWVLWC8tL4kHDymJHkLY",
  authDomain: "e-commerce-61d74.firebaseapp.com",
  projectId: "e-commerce-61d74",
  storageBucket: "e-commerce-61d74.appspot.com",   // ✅ FIXED
  messagingSenderId: "198190809332",
  appId: "1:198190809332:web:acb53523a6474abbb3dea1",
  measurementId: "G-QWN40JJ986"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
