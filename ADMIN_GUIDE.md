# Fox Orthotics Admin Dashboard - Complete Guide

## 📋 Table of Contents
1. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
2. [Dashboard Features](#dashboard-features)
3. [How to Use Each Feature](#how-to-use-each-feature)
4. [Troubleshooting](#troubleshooting)

---

## 🔐 Accessing the Admin Dashboard

### Prerequisites
- Firebase admin account
- Admin credentials set up in Firestore `admins` collection

### Step 1: Navigate to Admin Panel
```
https://your-site.com/admin
or locally: http://localhost:5173/admin
```

### Step 2: Login
1. Enter your **Email** (must be registered as admin in Firebase)
2. Enter your **Password**
3. Click "Login"

### Step 3: You're In!
Once logged in, you'll see the main dashboard with all metrics.

---

## 📊 Dashboard Features

### 1. **Dashboard Overview**
Main hub showing real-time statistics:
- **Total Products**: Count of all products in inventory
- **Total Orders**: All orders from customers
- **Total Revenue**: Sum of all order amounts
- **Total Users**: Registered customer accounts
- **Pending Orders**: Orders awaiting processing
- **Low Stock Items**: Products with stock < 10 units

Quick action buttons:
- ➕ Add New Product
- 📦 View All Orders
- 📊 View Analytics

---

### 2. **📦 Products Management**

#### View All Products
- See table of all products with SKU, name, category, price, stock, and rating
- Search by product name or SKU
- Filter by category

#### Add New Product
1. Click "Add New Product" button
2. Fill in the form:
   - **Product Name** * (required) - e.g., "Orthotic Insole"
   - **SKU** * (required) - e.g., "MDL-101"
   - **Price (₹)** * (required) - selling price
   - **Original Price (₹)** - MRP for discount calculation
   - **Category** - e.g., "Foot Care & Orthotics"
   - **Stock** - quantity in inventory
   - **Material** - e.g., "Memory Foam, Gel"
   - **Rating** - 0-5 stars (decimal allowed)
   - **Description** - detailed product info
   - **Image URLs** - comma-separated paths (e.g., `images/mdl-101.jpg, images/mdl-101-2.jpg`)
   - **Sizes** - comma-separated (e.g., `S, M, L, XL`)
   - **In Stock** - checkbox to mark availability
3. Click "Create Product"

#### Edit Product
1. Find product in table
2. Click "Edit" button
3. Update any fields
4. Click "Update Product"

#### Delete Product
1. Find product in table
2. Click "Delete" button
3. Confirm deletion

---

### 3. **📋 Orders Management**

#### View All Orders
Table showing:
- Order ID (shortened)
- Customer Name
- Email
- Total Amount (₹)
- Number of Items
- Current Status
- Order Date

#### Filter Orders
Filter by status:
- **Pending** (🟡 Yellow) - Not yet processed
- **Processing** (🔵 Blue) - Being prepared
- **Shipped** (🟣 Purple) - On the way
- **Delivered** (🟢 Green) - Completed
- **Cancelled** (🔴 Red) - Cancelled

#### Order Statistics
- Total Orders count
- Orders pending count
- Orders shipped count
- Orders delivered count
- Total Revenue from all orders

---

### 4. **📈 Analytics Dashboard**

Real-time analytics and insights:

#### Key Metrics
- Total Products in store
- Total Orders received
- Total Revenue generated
- Total Users registered
- Average Order Value
- Category breakdown with distribution chart

#### Category Breakdown
Visual bar chart showing:
- Number of products per category
- Percentage distribution

#### Quick Stats
- Products per category (average)
- Orders per user (average)
- Growth rate metrics

---

### 5. **👥 Users Management**

#### View All Users
Table showing:
- Email address
- Display name
- Number of orders placed
- Total amount spent (₹)
- Account creation date

#### Search Users
Search by:
- Email address
- Display name

#### User Statistics
- Total registered users
- New users (last 30 days)
- Active users (users with purchases)

---

### 6. **⚙️ Settings & Profile**

#### Profile Settings
- Update display name
- View email (cannot be changed directly)

#### Security Settings
- **Change Password**
  1. Enter new password (min 6 characters)
  2. Confirm password
  3. Click "Update Password"

#### Notification Preferences
Toggle notifications for:
- Email Notifications
- Order Notifications
- Product Alerts
- Weekly Report

#### Logout
Safely logout from admin panel

---

## 💡 How to Use Each Feature

### Adding Products Efficiently

**Best Practices:**
1. Use consistent SKU naming (MDL-001, MDL-002, etc.)
2. Always add primary product image first
3. Set correct stock levels to avoid overselling
4. Use clear, descriptive product names
5. Set accurate prices and MRP for discount visibility

**Image URL Format:**
```
images/mdl-101.jpg                 (single image)
images/mdl-101.jpg, images/mdl-101-2.jpg, images/mdl-101-3.jpg (multiple)
```

### Managing Orders

**Order Status Workflow:**
```
Pending → Processing → Shipped → Delivered
```

**How to Check Order Details:**
1. Click on order ID to see full details
2. View items, customer address
3. Update order status as it progresses

### Analyzing Business

**Key Metrics to Watch:**
- Revenue trends
- Best-selling categories
- Low-stock products needing reorder
- Customer growth rate

**Using Analytics:**
- Monitor category performance
- Identify product gaps
- Plan inventory based on trends
- Track revenue metrics

---

## 🔒 Security Notes

### Admin Access
- Only users with `role: "admin"` in Firestore can login
- Passwords are securely handled by Firebase
- Each admin login is tracked for security

### Data Protection
- All sensitive operations require authentication
- Order data is encrypted in transit
- User information is protected per Firebase policies

### Setting Up New Admins

**In Firebase Console:**
1. Go to **Firestore Database**
2. Create collection: `admins`
3. Add new document with:
   ```
   {
     "email": "admin@example.com",
     "role": "admin",
     "createdAt": timestamp,
     "name": "Admin Name"
   }
   ```
4. Create matching user in Firebase Auth

---

## 🐛 Troubleshooting

### Cannot Login
**Issue:** "Access denied. You are not an admin."
- **Solution:** Check if user is registered in `admins` collection in Firestore
- Verify `role` field is set to `"admin"`
- Try refreshing the page

### Products Not Appearing
**Issue:** Products added but not showing on storefront
- **Solution:** 
  1. Verify products are in Firestore `products` collection
  2. Check image URLs are correct and accessible
  3. Ensure `inStock` checkbox is enabled
  4. Clear browser cache and refresh

### Orders Not Loading
**Issue:** Orders page shows "No orders found"
- **Solution:**
  1. Check Firestore `orders` collection exists
  2. Verify order data has required fields
  3. Check Firebase connection

### Password Reset
**Issue:** Forgot admin password
- **Solution:**
  1. Use Firebase Console → Authentication
  2. Find user email
  3. Click three dots → Reset password
  4. Send password reset link to email

### Page Blank or Not Loading
**Issue:** Dashboard pages appear blank
- **Solution:**
  1. Check browser console for errors (F12)
  2. Verify Firebase credentials in `firebase.ts`
  3. Clear browser cache
  4. Try incognito/private window
  5. Check internet connection

### Images Not Showing
**Issue:** Product images show placeholder
- **Solution:**
  1. Verify image paths in product form
  2. Check `/public/images/` folder has files
  3. Ensure paths start with `/` or `images/`
  4. Check file formats (JPG, PNG supported)

---

## 📱 Mobile Access

The admin dashboard is **fully responsive**:
- Works on tablets
- Mobile-optimized interface
- All features accessible on smaller screens

---

## 🚀 Performance Tips

### For Better Speed
1. Limit products per page (use search)
2. Close unused browser tabs
3. Use Firefox or Chrome (better performance)
4. Clear browser cache regularly

### Database Optimization
1. Archive old orders monthly
2. Remove duplicate products
3. Maintain good image compression
4. Keep descriptions concise

---

## 📞 Support & Help

### Common Questions

**Q: Can I bulk upload products?**
A: Currently, add products individually. For bulk operations, contact development team.

**Q: How do I export reports?**
A: Use browser's print function (Ctrl+P) to save tables as PDF.

**Q: Can I schedule inventory notifications?**
A: Set up alerts when stock falls below threshold (coming soon).

**Q: How often is data synced?**
A: Real-time sync via Firebase. Updates appear instantly.

---

## 🔄 Regular Maintenance Checklist

**Daily:**
- ☐ Check pending orders
- ☐ Review low stock alerts
- ☐ Process new orders

**Weekly:**
- ☐ Review analytics
- ☐ Check user growth
- ☐ Update pricing if needed

**Monthly:**
- ☐ Audit inventory
- ☐ Review revenue trends
- ☐ Archive old orders
- ☐ Update product categories

---

## 📊 Dashboard Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search |
| `Esc` | Close modals |
| `Ctrl+S` | Save form |

---

**Last Updated:** December 4, 2025  
**Version:** 1.0  
**Admin Dashboard Build:** Complete with all CRUD operations
