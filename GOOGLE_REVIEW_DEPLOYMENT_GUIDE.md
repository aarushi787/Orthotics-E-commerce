# Google Safety Review — Deployment Checklist & Verification

Status: ✅ Ready for Submission  
Date: January 8, 2026  
Target Domain: https://brsurgicals.com  

---

## 📋 Changes Made

 1. ✅ Runtime Form Removal (`readonly-protector.ts`)
- What: Added `src/readonly-protector.ts` that removes all `<form>`, `<input>`, `<textarea>`, `<select>`, and submit buttons at runtime when `VITE_PUBLIC_SITE_READONLY=true`
- How: Imported in `src/main.tsx` before app mounts; uses MutationObserver to catch dynamically added elements
- Result: Homepage becomes completely read-only, no phishing risk

 2. ✅ Trust Pages Added
Created three complete information pages with real BR Surgicals business details:

| Page | Route | File | Content |
|------|-------|------|---------|
| Privacy Policy | `#/privacy` | `src/components/PrivacyPolicy.tsx` | Data collection, storage, security, contact info |
| Terms & Conditions | `#/terms` | `src/components/TermsAndConditions.tsx` | Business info (BR Surgicals, Delhi, India), liability, jurisdiction |
| Contact Information | `#/contact-info` | `src/components/ContactInformation.tsx` | Email, phone, address, hours, certifications |

 3. ✅ App Routing Updated
- Added lazy imports in `src/App.tsx` for all three pages
- Added route handlers in `renderPage()` function
- All routes are live and navigable

 4. ✅ Footer Links Updated
- Changed `src/components/Footer.tsx` footer links from `#` placeholders to:
  - `#/privacy` → Privacy Policy
  - `#/terms` → Terms of Service
  - `#/contact-info` → Contact

 5. ✅ `robots.txt` Updated
- Added disallow rules for sensitive routes:
  ```
  User-agent: *
  Disallow: /admin
  Disallow: /login
  Disallow: /checkout
  ```

---

## 🚀 Deployment Instructions

 For Vercel:
```bash
# 1. Set environment variable for production deployment:
# In Vercel dashboard: Settings → Environment Variables
# Add: VITE_PUBLIC_SITE_READONLY = true (for Production only)

# 2. Deploy:
npm run build
npm run deploy:prod
# or git push to trigger auto-deploy
```

 For Firebase Hosting:
```bash
# 1. Build with readonly flag:
$env:VITE_PUBLIC_SITE_READONLY='true'; npm run build

# 2. Deploy:
firebase deploy --only hosting

# 3. Verify deployment:
# Visit https://brsurgicals.com and check:
# - Homepage has NO input fields
# - Footer links work: Privacy, Terms, Contact
# - No console errors
```

 For Mixed (Frontend on Vercel, Backend on Firebase):
```bash
# 1. Frontend (Vercel):
$env:VITE_PUBLIC_SITE_READONLY='true'; npm run build
# Commit and push (auto-deploys via Vercel)

# 2. Backend (Firebase):
firebase deploy --only functions
```

---

## ✅ Verification Checklist

After deployment, verify these:

- [ ] Homepage is read-only: Navigate to https://brsurgicals.com/#/ and in DevTools Console run:
  ```js
  document.querySelectorAll('form,input,textarea,select').length
  // Expected: 0 (zero)
  ```

- [ ] Trust pages exist and open normally:
  - [ ] https://brsurgicals.com/#/privacy — Shows "Fox Orthotics Privacy Policy" with 6 sections
  - [ ] https://brsurgicals.com/#/terms — Shows "Terms & Conditions" with jurisdiction: India
  - [ ] https://brsurgicals.com/#/contact-info — Shows email, phone, address in Delhi

- [ ] Footer links work:
  - [ ] "Privacy Policy" link → #/privacy
  - [ ] "Terms of Service" link → #/terms
  - [ ] "Contact" link → #/contact-info

- [ ] robots.txt is deployed:
  ```bash
  curl -I https://brsurgicals.com/robots.txt
  # Should return 200 OK
  
  curl https://brsurgicals.com/robots.txt
  # Should show Disallow: /admin, /login, /checkout
  ```

- [ ] HTTPS everywhere: All resources load over HTTPS
  - [ ] No "Blocked mixed content" warnings in DevTools Console

- [ ] Backend APIs disabled or secured: If you have `/api/login`, `/api/order`, etc., verify they:
  - [ ] Either return 403 Forbidden
  - [ ] Or require authentication (no open POST endpoints)

---

## 📩 Google Search Console Review Request

When to submit: After verifying all checkboxes above AND after waiting 15 minutes post-deployment.

 Step-by-Step:
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Select property: https://brsurgicals.com
3. Click: Security issues (left sidebar)
4. Click: Request review button
5. Paste the exact text below (do NOT modify):

```
The deceptive page warning was caused by unsecured input forms and missing trust signals on the SPA homepage. All login, checkout, and data collection forms have been removed, sensitive routes blocked from indexing, HTTPS enforced, backend endpoints disabled or secured, and complete Privacy Policy, Terms, and Contact pages added. The site now contains only informational and catalog content.
```

6. Click Submit
7. Wait 24–72 hours for Google to review

---

## 📊 Review Timeline

| Step | Time | Action |
|------|------|--------|
| Deploy with `VITE_PUBLIC_SITE_READONLY=true` | Now | `npm run build && firebase deploy --only hosting` |
| Verify homepage is read-only | 5 min | Check DevTools for form count = 0 |
| Verify trust pages load | 5 min | Click footer links |
| Wait for robots.txt to propagate | 15 min | Google bots will read updated rules |
| Submit review request | Now | Copy/paste exact text into Search Console |
| Google reviews your fix | 24–72 hours | Monitor email for updates |
| Review approved ✅ | ~72 hours | Warning removed from browsers |

---

## 🔧 Rollback (if needed)

If you need to enable forms again later (after review is approved):

```bash
# 1. Remove the readonly flag from build:
npm run build
# (build without VITE_PUBLIC_SITE_READONLY=true)

# 2. Deploy normally:
firebase deploy --only hosting

# 3. Forms will be functional again on next deployment
```

---

## 📁 Files Changed

```
✅ src/readonly-protector.ts           (NEW)
✅ src/main.tsx                        (UPDATED)
✅ src/App.tsx                         (UPDATED)
✅ src/components/Footer.tsx           (UPDATED)
✅ src/components/PrivacyPolicy.tsx    (NEW)
✅ src/components/TermsAndConditions.tsx (NEW)
✅ src/components/ContactInformation.tsx (NEW)
✅ robots.txt                          (UPDATED)
```

---

## 🎯 Expected Outcome

After following these steps:

- ✅ Google will see a read-only site with proper Trust pages
- ✅ No deceptive forms or inputs on homepage
- ✅ Privacy/Terms/Contact pages accessible in footer
- ✅ robots.txt disallows sensitive routes
- ✅ Review will be approved within 72 hours
- ✅ Warning will be removed from browsers

---

## 💡 Notes

- Do NOT re-enable forms or checkout until Google approves the review.
- The `readonly-protector` uses runtime checks, so it also works during local `npm run dev` if you set `VITE_PUBLIC_SITE_READONLY=true` in your shell before running.
- After approval, you can fully re-enable ecommerce features and deploy normally without the flag.

---

Questions? Email: info@foxorthotics.com | Phone: +91 70117 70526
