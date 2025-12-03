// server/src/config/firebase.cjs
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Find service key file
const keyPath = path.join(__dirname, "../../serviceAccountKey.json");

if (!fs.existsSync(keyPath)) {
  throw new Error("❌ serviceAccountKey.json missing");
}

// Firebase Init CJS safe
admin.initializeApp({
  credential: admin.credential.cert(require(keyPath)),
  storageBucket: "e-commerce-61d74.firebasestorage.app",   // <-- correct working bucket
});

console.log("🔥 Firebase Admin Connected (CJS)");
module.exports = admin;
