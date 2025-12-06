import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration - hardcoded for admin dashboard
const firebaseConfig = {
  apiKey: "AIzaSyBWhPaX_8p_gjkHWVLWC8tL4kHDymJHkLY",
  authDomain: "e-commerce-61d74.firebaseapp.com",
  projectId: "e-commerce-61d74",
  storageBucket: "e-commerce-61d74.appspot.com",
  messagingSenderId: "198190809332",
  appId: "1:198190809332:web:acb53523a6474abbb3dea1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
