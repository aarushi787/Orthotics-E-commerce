// server/src/firebase.js
const admin = require('firebase-admin');
const fs = require('fs');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
} else {
  // fallback for local dev: try to load server/serviceAccountKey.json
  try {
    serviceAccount = require('../serviceAccountKey.json');
  } catch (e) {
    console.warn('No Firebase service account found, continuing without admin features.');
  }
}

const firebaseConfig = {
  credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '<your-bucket>.appspot.com'
};

admin.initializeApp(firebaseConfig);

const db = admin.firestore();
const storage = admin.storage().bucket(); // will use storageBucket above

module.exports = { admin, db, storage };
