const fs = require("fs");
const path = require("path");

const products = JSON.parse(fs.readFileSync("./products.json", "utf8"));
const imagesPath = path.join("./public/images");

// Create folder if missing
if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}

function sanitizeName(name = "") {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-"); // safe slug
}

products.forEach((product) => {
  const name = product.name || product.namace || null;

  if (!name) {
    console.log(`❌ Product ID ${product.id} has no name field. Skipping.`);
    return;
  }

  const sku = product.sku || `sku-${product.id}`;
  const fileBase = `${sanitizeName(sku)}.jpg`;

  const oldPath = path.join(imagesPath, `${product.imageUrls?.[0] || ""}`);
  const newPath = path.join(imagesPath, fileBase);

  if (!fs.existsSync(oldPath)) {
    console.log(`⚠️ Image missing for: ${product.id} (${oldPath})`);
    return;
  }

  fs.renameSync(oldPath, newPath);
  console.log(`✅ Renamed → ${newPath}`);
});
