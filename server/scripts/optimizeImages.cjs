// optimizeImages.cjs (CommonJS fully working)

const admin = require("../src/config/firebase.cjs");          // ← now valid
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const bucket = admin.storage().bucket();

// 📂 Path must exist: C:/Users/Aarushi/Desktop/Fox-Orthotics-ECommerce/images/<SKU folders>
const IMAGES_PATH = path.join(__dirname, "..", "images");

if (!fs.existsSync(IMAGES_PATH)) {
  console.log(`❌ images folder not found → ${IMAGES_PATH}`);
  process.exit(1);
}

console.log("\n🔥 Firebase Admin initialized\n==============================");
console.log("  B.R. Surgical Image Uploader");
console.log("==============================\n");

const folders = fs.readdirSync(IMAGES_PATH);

(async () => {
  for (const folder of folders) {
    const fullPath = path.join(IMAGES_PATH, folder);
    if (!fs.statSync(fullPath).isDirectory()) continue;

    console.log(`🔍 Processing SKU → ${folder}`);

    const images = fs.readdirSync(fullPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    if (!images.length) {
      console.log(`⚠ No images found → ${folder}`);
      continue;
    }

    for (const img of images) {
      const src = path.join(fullPath, img);
      const output = `${folder}/${img.replace(/\.(jpg|jpeg|png)$/i, ".webp")}`;
      const temp = path.join(IMAGES_PATH, "_cache", output);

      fs.mkdirSync(path.dirname(temp), { recursive: true });

      await sharp(src).resize({ width: 1024 }).webp({ quality: 80 }).toFile(temp);

      await bucket.upload(temp, {
        destination: `products/${output}`,
        metadata: { contentType: "image/webp" }
      });

      console.log(`   ✔ Uploaded → ${output}`);
    }

    console.log(`✔ Done → ${folder}\n`);
  }

  console.log("🎉 ALL IMAGES OPTIMIZED & UPLOADED SUCCESSFULLY");
})();
