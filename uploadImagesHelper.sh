#!/bin/bash
# Firebase Storage Upload Helper
# ==============================
# This script helps upload images to Firebase Storage with proper authentication

set -e

echo "🔥 Firebase Storage Image Upload Helper"
echo "========================================"
echo ""

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "📝 Prerequisites:"
echo "   1. Actual product images in public/images/<SKU>/ folders"
echo "   2. Firebase credentials configured"
echo "   3. Storage bucket access permissions"
echo ""

# Option 1: Check current Firebase project
echo "🔍 Checking Firebase configuration..."
if [ -f "firebase.json" ]; then
    echo "✅ firebase.json found"
    PROJECT_ID=$(grep -o '"projectId": "[^"]*"' firebase.json | cut -d'"' -f4)
    echo "   Project ID: $PROJECT_ID"
else
    echo "❌ firebase.json not found"
    exit 1
fi

echo ""
echo "📤 Upload Methods:"
echo ""
echo "Method 1 - Firebase Console (Manual):"
echo "   1. Visit: https://console.firebase.google.com/"
echo "   2. Select project: $PROJECT_ID"
echo "   3. Go to Storage > Browse"
echo "   4. Upload folders from public/images/<SKU>/"
echo ""

echo "Method 2 - Using Firebase CLI (Recommended):"
echo "   Run: firebase login"
echo "   Then: firebase deploy --only storage"
echo ""

echo "Method 3 - Using Node Script:"
echo "   Run: node uploadImages.js"
echo ""

echo "🎯 To get started:"
echo "   1. Place product images in: public/images/<SKU>/image.jpg"
echo "   2. Run: firebase login"
echo "   3. Then choose your upload method above"
echo ""

echo "ℹ️  For 57 missing products, upload to:"
for SKU in MDL-074 MDL-126 MDL-075 MDL-122 MDL-078 MDL-110 MDL-133 MDL-134 MDL-007 MDL-095; do
    echo "   - products/$SKU/"
done
echo "   ... and 47 more SKUs (see MISSING_IMAGES_REPORT.md)"
echo ""
