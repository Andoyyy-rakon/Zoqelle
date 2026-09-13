# 🎂 Zoqelle (ALCakes) — Luxury Artisanal Bakery E-Commerce Platform

**Zoqelle** is a full-stack, modern e-commerce web platform designed for a luxury boutique cake bakery. Built with an editorial aesthetic, high-craft typography, and a warm color palette, Zoqelle provides a premium shopping experience for customers and a full-featured management dashboard for store administrators.

---

## 🎯 Purpose of the Application

The main purpose of **Zoqelle** is to bridge artisanal baking with a state-of-the-art digital storefront:

1. **For Customers (Shop Front):**
   - **Artisanal Discovery:** Browse handcrafted cakes categorized by occasions (Signature, Birthday, Wedding, Cupcakes, Pastries).
   - **Real-Time Stock & Customization:** View live product availability, detailed ingredients, pricing in PHP (₱), and customer reviews.
   - **Seamless Shopping & Checkout:** Add items to a persistent cart, apply auto-calculated shipping progress, pre-fill delivery details from user profiles, and place orders effortlessly.
   - **Order Tracking:** Track the status of active and past orders from confirmation through baking, dispatch, and delivery.

2. **For Administrators (Admin Dashboard):**
   - **Order Lifecycle Management:** Monitor incoming customer orders and update states (*Pending*, *Confirmed*, *Preparing*, *Ready for Delivery*, *Delivered*, *Cancelled*).
   - **Catalog & Inventory Control:** Add new cake listings, edit details, upload high-res images, set stock counts, and organize categories.
   - **Business Analytics:** Monitor revenue metrics and sales breakdown.

---

## 🛠️ Tech Stack & Architecture

### **Frontend & Admin Applications**
- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool & Dev Server:** [Vite](https://vitejs.dev/)
- **Styling & Design System:** Custom [Tailwind CSS v4](https://tailwindcss.com/) design system featuring:
  - **Typography:** *Fraunces* (Display Headlines), *Playfair Display* (Editorial Accents), *Inter* (UI Body)
  - **Color Palette:** Deep Burgundy (`#451420`), Soft Cream (`#faf5ec`), Muted Gold (`#b1813f`), and Warm Rose (`#f7e8e8`)
- **Routing:** [React Router v6](https://reactrouter.com/) (Public, Protected, and Admin routes)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Toast Notifications:** [React Hot Toast](https://react-hot-toast.com/)

### **Backend & Infrastructure**
- **Database & Auth (BaaS):** [Supabase](https://supabase.com/)
  - **PostgreSQL Database:** Relational schema with `products`, `categories`, `profiles`, `orders`, and `order_items` tables.
  - **Supabase Authentication:** Secure Email/Password sign-up and Google OAuth integration.
  - **Supabase Storage:** Public bucket for hosting high-resolution product images.
  - **Row Level Security (RLS):** Granular access policies ensuring customers only access their own data while admins hold storewide management permissions.

---

## 📂 Project Structure

```
ALCakes/
├── frontend/                # Customer Storefront Web Application
│   ├── src/
│   │   ├── components/      # Luxury UI Navbar, Footer, ProductCard, Skeleton, etc.
│   │   ├── context/         # AuthContext & CartContext providers
│   │   ├── hooks/           # Custom React hooks (useAuth, useCart)
│   │   ├── lib/             # Supabase client setup
│   │   ├── pages/           # Home, Shop, ProductDetail, Cart, Checkout, Profile, Orders, Login, Register
│   │   ├── types/           # TypeScript interfaces & types
│   │   ├── App.tsx          # Main router layout setup
│   │   └── index.css        # Core Tailwind CSS design system tokens
│   ├── package.json
│   └── vite.config.ts
│
├── admin/                   # Admin Management Dashboard Application
│   ├── src/
│   │   ├── components/      # Admin Navbar, Sidebar, Modals, Tables
│   │   ├── pages/           # Dashboard, Orders, Products, Categories, Settings
│   │   ├── lib/             # Supabase client setup
│   │   └── index.css        # Shared luxury theme tokens for Admin
│   ├── package.json
│   └── vite.config.ts
│
└── README.md                # Project Documentation
```

---

## 🚀 Getting Started

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or `pnpm` / `yarn`
- A [Supabase](https://supabase.com/) project set up with the required PostgreSQL tables and environment variables.

---

### **1. Clone & Environment Configuration**

Create a `.env` file inside both `frontend/` and `admin/` folders with your Supabase credentials:

**`frontend/.env` & `admin/.env`:**
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

### **2. Running the Customer Storefront (`frontend`)**

```bash
cd frontend
npm install
npm run dev
```
The storefront will run locally at `http://localhost:5173`.

---

### **3. Running the Admin Dashboard (`admin`)**

```bash
cd admin
npm install
npm run dev
```
The admin dashboard will run locally at `http://localhost:5174`.

---

### **4. Building for Production**

To verify type safety and generate production bundles for deployment:

```bash
# Build Frontend
npm --prefix frontend run build

# Build Admin
npm --prefix admin run build
```

---

## ✨ Key Features Overview

- 🛍️ **Editorial Shop & Filtering:** Pre-select categories directly via URL query parameters (`/shop?category=Wedding`) with real-time price sorting.
- 🛒 **Smart Cart & Checkout:** Modal removal confirmation, free shipping tracker, stock validation, and automatic profile address pre-filling.
- 📦 **Order Tracking:** Detailed receipt breakdown with product thumbnail fallbacks and live order status step tracking.
- 🔒 **Role-Based Protection:** Secure routing restricting admin routes to validated `admin` profile roles.
- 🎨 **Luxury Aesthetic:** Micro-animations, responsive dark/light elevated surface cards, glassmorphism badges, and custom typography.
