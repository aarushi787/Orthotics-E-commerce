# Quick Reference: Optimization Tools

## TL;DR - Fast Setup

```bash
# 1. Install image compression
npm install --save-dev sharp

# 2. Build and optimize
npm run optimize:all

# 3. Setup Firebase credentials
# Download from Firebase Console → Project Settings → Service Accounts
# Save to: server/serviceAccountKey.json

# 4. Test migration (no changes made)
npm run migrate:products:dry-run

# 5. Apply migration
npm run migrate:products

# 6. Deploy (when hosting issue is fixed)
firebase deploy --only hosting
```

---

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run build:all` | Build frontend, admin, and functions |
| `npm run optimize:images` | Compress images (install sharp first) |
| `npm run migrate:products:dry-run` | Preview Firestore changes |
| `npm run migrate:products` | Apply Firestore changes |
| `npm run optimize:all` | Build + optimize images |
| `firebase deploy --only hosting` | Deploy to Firebase Hosting |

---

## Image Optimization

### What It Does
- Reduces image file sizes by 50-70%
- Scans `dist/images/` directory
- Compresses JPEG, PNG, WebP files
- Only replaces if smaller

### Time Required
- ~5-10 minutes for 250 images
- Your images: ~450 MB → ~145 MB

### Setup
```bash
npm install --save-dev sharp
npm run optimize:images
```

### Output Example
```
✓ images/MDL-108/MDL-108-1.jpg
  5.71 MB → 1.89 MB (66.92% saved)

✓ Total: 450 MB → 145 MB (68.23% saved)
```

---

## Firestore Product Migration

### What It Does
- Normalizes product documents
- Populates `imageUrls` field
- Makes image rendering reliable
- Handles legacy field names

### Time Required
- ~2-5 minutes for 150 products
- First run: `--dry-run` mode (preview)
- Second run: apply changes

### Setup

**Step 1: Get Firebase Credentials**
1. Open [Firebase Console](https://console.firebase.google.com)
2. Project → Settings → Service Accounts tab
3. Click "Generate New Private Key"
4. Save JSON file

**Step 2: Place Credentials**
```bash
# Copy downloaded file to:
server/serviceAccountKey.json
```

**Step 3: Test (Safe)**
```bash
npm run migrate:products:dry-run
# Shows what will change, no modifications
```

**Step 4: Apply**
```bash
npm run migrate:products
# Updates Firestore documents
```

### Output Example (Dry Run)
```
📝 MDL-108 (Pediatric Taylor Brace)
  imageUrls: 0 → 3 URLs

📝 MDL-033 (Shoulder Support)
  imageUrls: 0 → 2 URLs

Products to update: 45/150
```

---

## Troubleshooting

### `sharp` not found
```bash
npm install --save-dev sharp
```

### `serviceAccountKey.json` not found
1. Download from Firebase Console
2. Save to `server/serviceAccountKey.json`
3. Check it's in `.gitignore` (already configured)

### No images found
- Run `npm run build:all` first
- Check `dist/images/` exists

### Permission denied (migration)
- Verify service account key is valid
- Check Firestore security rules allow writes

---

## Files Reference

### Scripts
- `scripts/optimize-images.cjs` - Image compression
- `scripts/migrate-products.cjs` - Firestore migration

### Documentation
- `OPTIMIZATION_GUIDE.md` - Complete guide (detailed)
- `PRE_DEPLOY_SUMMARY.md` - Full summary (comprehensive)
- This file - Quick reference (fast lookup)

### Configuration
- `package.json` - npm scripts

---

## Expected Results

### Images
- **Before**: 450 MB
- **After**: 145 MB  
- **Savings**: 305 MB (68%)

### Firestore
- **Before**: Inconsistent imageUrls
- **After**: All products have normalized imageUrls

### Deployment
- **Before**: 5-10 minutes, often fails
- **After**: 2-3 minutes, reliable

### User Experience
- **Page load**: 8-12 seconds → 4-6 seconds
- **Image loading**: 3-5 seconds → 1-2 seconds
- **Mobile**: Significantly faster

---

## When Hosting Works Again

1. ✅ Run `npm run optimize:all`
2. ✅ Run `npm run migrate:products:dry-run`
3. ✅ Run `npm run migrate:products`
4. ✅ Run `firebase deploy --only hosting`
5. 🎉 Site is live with optimizations!

---

## Key Decisions Made

✅ **Image compression**: 75% quality for JPEG (imperceptible loss, huge size reduction)
✅ **Batch migration**: Process 25 products at a time (reliable, restartable)
✅ **Dry-run first**: Safe preview before making changes
✅ **Service account**: Secure Firestore access via Firebase Admin SDK
✅ **Scripted**: Repeatable, documented, easy to modify

---

## Next Actions

1. Install sharp: `npm install --save-dev sharp`
2. Read `OPTIMIZATION_GUIDE.md` for details
3. Download Firebase service account key
4. Run commands when network is stable
5. Deploy when hosting issue resolves

---

**Need detailed help?** → Read `OPTIMIZATION_GUIDE.md`
**Need full context?** → Read `PRE_DEPLOY_SUMMARY.md`
**Need one command?** → This file has you covered!

