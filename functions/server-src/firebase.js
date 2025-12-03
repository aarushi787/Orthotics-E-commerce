// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWhPaX_8p_gjkHWVLWC8tL4kHDymJHkLY",
  authDomain: "e-commerce-61d74.firebaseapp.com",
  projectId: "e-commerce-61d74",
  storageBucket: "e-commerce-61d74.firebasestorage.app",
  messagingSenderId: "198190809332",
  appId: "1:198190809332:web:acb53523a6474abbb3dea1",
  measurementId: "G-QWN40JJ986"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only works in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
