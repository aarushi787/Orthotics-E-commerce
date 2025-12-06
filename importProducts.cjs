#!/usr/bin/env node
/**
 * importProducts.cjs
 *
 * Standalone script to import products from products-updated.json
 * into Firestore collection: "products"
 *
 * Run from project root:
 *   node importProducts.cjs
 */

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// 🔐 1. Load your service account key
// Adjust this path if your file is in a different place.
const serviceAccountPath = path.join(__dirname, "server", "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ serviceAccountKey.json not found at:", serviceAccountPath);
  console.error("→ Make sure the path is correct in importProducts.cjs");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

// 🚀 2. Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // If you use Storage bucket, you can also pass storageBucket here
  // storageBucket: "your-bucket-name",
});

const db = admin.firestore();

// 3️⃣ Helper: load products JSON
function loadProducts() {
  const jsonPath = path.join(__dirname, "products-updated.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error("products-updated.json not found at: " + jsonPath);
  }

  const raw = fs.readFileSync(jsonPath, "utf8");
  let products;
  try {
    products = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Failed to parse products-updated.json");
    throw err;
  }

  if (!Array.isArray(products)) {
    throw new Error("Expected products-updated.json to contain an array of products");
  }

  console.log(`✅ Loaded ${products.length} products from products-updated.json`);
  return products;
}

// 4️⃣ Main import function
async function importProducts() {
  const products = loadProducts();

  const collectionName = "products";
  const batchLimit = 400; // Firestore limit is 500, keep some safety margin

  let batch = db.batch();
  let counter = 0;
  let batchCount = 1;

  for (const product of products) {
    // Prefer SKU as the document ID; fallback to numeric id
    const docId = product.sku || String(product.id);

    if (!docId) {
      console.warn("⚠️ Skipping product without sku/id:", product);
      continue;
    }

    const docRef = db.collection(collectionName).doc(docId);

    // Optional cleanup/transform before writing
    const dataToSave = {
      ...product,
      // Ensure numeric types where useful
      price: typeof product.price === "string" ? Number(product.price) : product.price,
      originalPrice:
        typeof product.originalPrice === "string"
          ? Number(product.originalPrice)
          : product.originalPrice,
      rating:
        typeof product.rating === "string" ? Number(product.rating) : product.rating,
      moq: typeof product.moq === "string" ? Number(product.moq) : product.moq,

      // Ensure booleans
      inStock: Boolean(product.inStock),
      bulkAvailable: Boolean(product.bulkAvailable),

      // Add a timestamp field (helpful later in admin UI)
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(docRef, dataToSave, { merge: true });
    counter++;

    // Commit batch when limit is reached
    if (counter % batchLimit === 0) {
      console.log(`📦 Committing batch ${batchCount} (${batchLimit} docs)...`);
      await batch.commit();
      batch = db.batch();
      batchCount++;
    }
  }

  // Commit remaining docs
  if (counter % batchLimit !== 0) {
    console.log(`📦 Committing final batch ${batchCount} (${counter % batchLimit} docs)...`);
    await batch.commit();
  }

  console.log(`🎉 Import complete! Total products written: ${counter}`);
}

// 5️⃣ Run script
importProducts()
  .then(() => {
    console.log("✅ All done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error during import:");
    console.error(err);
    process.exit(1);
  });
