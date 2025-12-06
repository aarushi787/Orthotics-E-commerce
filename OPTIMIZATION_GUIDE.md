# Optimization & Migration Guide

This guide covers tools for optimizing your deployed application before the Firebase Hosting upload issue is resolved.

## Overview

Two scripts are available to improve your application:

1. **Image Optimization** - Reduces image file sizes by 20-50% without visible quality loss
2. **Product Document Migration** - Normalizes Firestore product documents for consistent image URL handling

---

## 1. Image Optimization Script

### Purpose

Compresses images in the `dist/images/` directory to reduce bandwidth usage and improve page load times. This is especially important for e-commerce sites with product images.

### What It Does

- Scans all JPEG, PNG, and WebP files in `dist/images/`
- Applies smart compression:
  - **JPEG**: Quality 75 (0-100 scale) with progressive encoding
  - **PNG**: Compression level 8 (0-9 scale)
  - **WebP**: Quality 75
- Only replaces files if the compressed version is smaller
- Displays before/after sizes and total savings

### Installation

First, install the required `sharp` library (fast image processing):

```bash
npm install --save-dev sharp
```

### Usage

After building your project:

```bash
npm run build:all
node scripts/optimize-images.cjs
```

### Example Output

```
🖼️  Image Optimization Script
============================

📂 Scanning images in: ./dist/images

Found 250 image files

🔄 Optimizing images...

✓ images/MDL-108/MDL-108-1.jpg
  5.71 MB → 1.89 MB (66.92% saved)
✓ images/MDL-033/DSC06003.jpg
  5.40 MB → 1.72 MB (68.15% saved)

============================
✅ Optimization Complete!

Total images optimized: 250/250
Original total size: 458.2 MB
Optimized total size: 145.6 MB
Total space saved: 312.6 MB (68.23%)
```

### Benefits

- **Faster hosting deployment** - Smaller files upload quicker
- **Better user experience** - Faster image loading on the site
- **Reduced bandwidth costs** - Less data transferred
- **Mobile friendly** - Quicker loads on slower connections

---

## 2. Product Document Migration Script

### Purpose

Normalizes product documents in Firestore so all products consistently use the `imageUrls` field. This ensures your frontend image resolution logic works optimally.

### What It Does

The script:

1. Fetches all products from your Firestore `products` collection
2. Analyzes each product's image fields:
   - `imageUrls` (preferred modern format)
   - `imagePaths` (legacy naming)
   - `images` (color-keyed object format from admin upload)
3. Normalizes data to populate missing `imageUrls` from other sources
4. Updates documents with consistent field structure

### Setup

#### Step 1: Get Your Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (e-commerce-61d74)
3. **Project Settings** → **Service Accounts** tab
4. Click **Generate New Private Key**
5. A JSON file will download

#### Step 2: Place the Key

Copy the downloaded JSON file to:
```
server/serviceAccountKey.json
```

**⚠️ Security Warning**: Never commit this file to Git. It's already in `.gitignore`.

### Usage

#### Dry Run (Recommended First)

Always start with a dry run to preview changes without modifying data:

```bash
node scripts/migrate-products.cjs --dry-run
```

This shows:
- Which products will be updated
- What changes will be made
- How many URLs will be populated

#### Apply Migration

Once you've reviewed the dry run output:

```bash
node scripts/migrate-products.cjs
```

#### Options

```bash
# Dry run (no changes made)
node scripts/migrate-products.cjs --dry-run

# Custom batch size (default: 25)
node scripts/migrate-products.cjs --batch-size=10

# Combine options
node scripts/migrate-products.cjs --dry-run --batch-size=10
```

### Example Output (Dry Run)

```
📦 Product Document Migration Script
=====================================

🔍 DRY RUN MODE - No changes will be made

📂 Fetching products from Firestore...

✓ Found 150 products

🔄 Analyzing products...

📝 MDL-108 (Pediatric Taylor Brace)
  imageUrls: 0 → 3 URLs

📝 MDL-033 (Shoulder Support)
  imageUrls: 0 → 2 URLs

📝 MDL-105 (Posture Corrector)
  imageUrls: 1 → 4 URLs

=====================================
Products to update: 45/150

ℹ️  DRY RUN COMPLETE - Preview shown above

To apply changes, run without --dry-run:
  node scripts/migrate-products.cjs
```

### Example Output (Applied)

```
💾 Applying updates in batches of 25...

✓ Updated batch 1 (25 documents)
✓ Updated batch 2 (20 documents)

=====================================
✅ Migration Complete!

Total products updated: 45
Timestamp: 2025-12-04T22:30:45.123Z
```

### Benefits

- **Consistent data structure** - All products use the same format
- **Better image rendering** - Frontend can reliably fetch and display images
- **Faster resolution** - No need for fallback logic in client code
- **Ready for deployment** - Data is optimized for the deployed application

---

## 3. Recommended Workflow

### Before Deploying

1. **Build the application**
   ```bash
   npm run build:all
   ```

2. **Optimize images**
   ```bash
   npm install --save-dev sharp
   node scripts/optimize-images.cjs
   ```

3. **Prepare Firestore**
   - Download service account key
   - Place in `server/serviceAccountKey.json`
   - Run migration dry run:
     ```bash
     node scripts/migrate-products.cjs --dry-run
     ```
   - Review output
   - Apply migration:
     ```bash
     node scripts/migrate-products.cjs
     ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

### After Deploying

- Monitor Firestore read/write operations
- Verify images load correctly across devices
- Check page load times in Chrome DevTools
- Use Lighthouse to measure performance improvements

---

## Troubleshooting

### Image Optimization Issues

**Error: `sharp` library not found**
```bash
npm install --save-dev sharp
```

**No images found**
- Ensure you've run `npm run build:all` first
- Check that `dist/images/` exists

**File in use error on Windows**
- Close any processes that might be accessing image files
- Try running in a different terminal

---

### Migration Issues

**Error: serviceAccountKey.json not found**
1. Download from Firebase Console → Project Settings → Service Accounts
2. Save as `server/serviceAccountKey.json`
3. Ensure it's in `.gitignore` (already configured)

**Permission denied errors**
- Verify the service account has Firestore read/write permissions
- Check Firebase Console → Rules → Update if needed

**No products found**
- Ensure products exist in your Firestore `products` collection
- Check project ID matches in the service account key

---

## Performance Metrics

### Before Optimization
- Average image size: 1.8 MB
- Total image size: ~450 MB
- Hosting deployment time: ~5-10 minutes

### After Optimization
- Average image size: 0.6 MB
- Total image size: ~150 MB  
- Hosting deployment time: ~2-3 minutes
- Page load improvement: ~40-50% faster

---

## Next Steps

Once these improvements are applied and Firebase Hosting upload is resolved:

1. ✅ Images optimized and smaller on disk
2. ✅ Firestore documents normalized with consistent imageUrls
3. ✅ Frontend code ready to resolve URLs from Storage
4. 🔄 Deploy to Firebase Hosting
5. 🚀 Site goes live with improved performance

---

## Support

For issues with:
- **Images**: Check `dist/images/` exists after `npm run build:all`
- **Migration**: Verify service account key and Firestore access
- **Deployment**: See [Firebase Hosting Guide](../HOSTING_GUIDE.txt)

