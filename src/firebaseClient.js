// src/firebaseClient.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWhPaX_8p_gjkHWVLWC8tL4kHDymJHkLY",
  authDomain: "e-commerce-61d74.firebaseapp.com",
  projectId: "e-commerce-61d74",
  storageBucket: "e-commerce-61d74.firebasestorage.app",
  messagingSenderId: "198190809332",
  appId: "1:198190809332:web:acb53523a6474abbb3dea1",
  measurementId: "G-QWN40JJ986"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
