/**
 * Firebase Image Uploader for Missing Products
 * ============================================
 * This script uploads placeholder images to Firebase Storage for 57 missing products
 * Run: node uploadMissingImages.cjs
 */

const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const fs = require("fs");
const path = require("path");

const firebaseConfig = {
  apiKey: "AIzaSyALBJNVW7q1m2rAc0HFONw4917m4cdWPT8",
  authDomain: "fox-orthotics-e-commerce.firebaseapp.com",
  projectId: "fox-orthotics-e-commerce",
  storageBucket: "fox-orthotics-e-commerce.appspot.com",
  messagingSenderId: "973947058376",
  appId: "1:973947058376:web:800777c04e4f3b374d4dfd",
  measurementId: "G-P2MYC12NQN"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const missingProducts = [
  "MDL-074", "MDL-126", "MDL-075", "MDL-122", "MDL-078", "MDL-110", "MDL-133", "MDL-134", "MDL-007", "MDL-095",
  "MDL-009", "MDL-066", "MDL-136", "MDL-135", "MDL-137", "MDL-138", "MDL-100", "MDL-026", "MDL-042", "MDL-024",
  "MDL-014", "MDL-073", "MDL-019", "MDL-040-2", "MDL-069", "MDL-081", "MDL-006", "MDL-103", "MDL-001", "MDL-141",
  "MDL-112", "MDL-109", "MDL-39-B", "MDL-039", "MDL-91-B", "MDL-129", "MDL-079", "MDL-067", "MDL-028", "MDL-130",
  "MDL-017", "MDL-012", "MDL-011", "MDL-139", "MDL-139-B", "MDL-060", "MDL-132", "MDL-131", "MDL-140", "MDL-035",
  "MDL-087", "MDL-084", "MDL-085", "MDL-086", "MDL-027-2", "MDL-027-3", "MDL-010"
];

async function uploadMissingProductImages() {
  console.log("🚀 Starting Firebase upload for missing product images...\n");
  
  let uploaded = 0;
  let failed = 0;

  for (const sku of missingProducts) {
    const imageDir = path.join(process.cwd(), "public", "images", sku);
    const placeholderPath = path.join(imageDir, "placeholder.svg");

    if (!fs.existsSync(placeholderPath)) {
      console.log(`⚠️  Skipped ${sku}: placeholder not found`);
      failed++;
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(placeholderPath);
      const storagePath = `products/${sku}/placeholder.svg`;
      const fileRef = ref(storage, storagePath);

      console.log(`⬆️  Uploading: ${sku}/placeholder.svg`);
      await uploadBytes(fileRef, fileBuffer);
      
      const url = await getDownloadURL(fileRef);
      console.log(`✅ Success: ${sku}`);
      uploaded++;
    } catch (err) {
      console.error(`❌ Failed: ${sku} - ${err.message}`);
      failed++;
    }
  }

  console.log(`\n🎉 Upload Summary:`);
  console.log(`   ✅ Successfully uploaded: ${uploaded}/${missingProducts.length}`);
  console.log(`   ❌ Failed: ${failed}/${missingProducts.length}`);
}

uploadMissingProductImages().catch(console.error);
