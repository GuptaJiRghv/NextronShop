# ⚡ NEXTRON — Cyberpunk E-Commerce Platform

> **Bleeding-edge lifestyle & hardware ecosystem for modern digital nomads.**  
> A full-stack e-commerce web application featuring real-time cart state management, user telemetry dashboards, order cart re-ordering, admin inventory control, and a dark/light cyberpunk design system.

---

## 📋 Evaluation 1 Overview

This build is configured for **Evaluation 1**:
- **Zero Database Server Dependency:** Uses an optimized in-memory store pre-seeded with sample hardware products, demo users, and realistic inventory counts.
- **Production-Ready REST API:** Full Express API architecture with JWT authentication, middleware validation, and simulated stock reductions.
- **Plug & Play:** Runs out of the box on any machine with Node.js installed without setting up MongoDB, PostgreSQL, or Redis.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, GSAP |
| **Backend** | Node.js (ES Modules), Express 4.x, JSON Web Tokens (JWT), BcryptJS, CORS |
| **Styling & Design** | Custom Cyberpunk Design System, CSS Variables, Grain Overlay, Smooth Scroll Progress |
| **State Management** | React Context API (`StoreContext`) synchronized with LocalStorage & REST backend |

---

## ✨ Key Features

### 🛍️ Storefront & Shopping Experience
- **Interactive Catalogue:** Filter by category (Audio, Wearables, Computing, Gaming), live text search, and price sorting.
- **Product Details & Community Reviews:** High-resolution hardware previews, stock availability badges, feature breakdowns, and **Verified Customer Reviews** with live rating submissions.
- **Cart & Wishlist Drawers:** Slide-over overlays accessible from anywhere in the app with real-time price updates and quantity controls.

### 💳 Dedicated Checkout & Multi-Channel Payment Gateway (`/checkout`)
- **Step 1 — Shipping Destination:** Address and contact collection with auto-fill for logged-in accounts.
- **Step 2 — Payment Gateway Options:**
  - 📱 **QR Code Mobile Scan:** Displays an interactive dynamic QR code. When scanned with any smartphone camera on the local network, opens a dedicated mobile approval screen (`/pay/confirm`) where tapping "Confirm Payment" triggers real-time status polling on the PC to finalize the order. Includes a *Simulate Mobile Approval* button for single-device evaluation.
  - 💳 **Credit / Debit Card:** Realistic cyber credit card with auto-formatting, cardholder details, CVV, and instant authorization.
  - 💵 **Cash on Delivery (COD):** Express dispatch with payment upon parcel arrival.
- **Step 3 — Order Confirmation Receipt:** Instant order creation, line-item receipt, and direct link to the Profile Dashboard.

### 👤 User Dashboard & Profile
- **Top Bar Profile Menu:** Clickable avatar pill in the top navigation with user initials, order badge, and quick-action dropdown menu.
- **Lifetime Analytics:**
  - **Orders Placed:** Total count of completed transactions.
  - **Total Spent:** Cumulative dollar amount spent.
  - **Gear Procured:** Total units of items delivered.
- **Previous Order Carts:**
  - View all past orders with status badges (`Pending`, `Processing`, `Shipped`, `Delivered`).
  - **Inspect Cart:** Expand any order to inspect full line items, product thumbnails, unit prices, and delivery destination.
  - **Re-order Cart:** 1-click action to copy an entire past order back into the active shopping cart for immediate re-checkout.
- **Wishlist Management:** Move bookmarked items directly into the cart.

### 🛡️ Admin Command Center (`/admin`)
- **Operations Overview:** Gross revenue calculation, total order count, low-stock warnings, and order pipeline breakdowns.
- **Inventory Management:** Add new catalogue items, delete products, and manage live inventory.
- **Order Pipeline:** View all customer orders and update shipping statuses (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`).
- **User Directory:** Inspect registered user accounts and roles.
- **Support Messages:** Read transmissions submitted through the customer Contact Support form.

---

## 📂 Project Architecture

```text
NextronShop/
├── backend/
│   ├── src/
│   │   ├── config/              # Environment and port configurations
│   │   ├── controllers/         # Request handlers (auth, products, orders, admin, support)
│   │   ├── data/                # In-memory store and initial seed data
│   │   ├── middleware/          # JWT auth, admin authorization, schema validation
│   │   ├── models/              # Data access layers (user, product, order, support)
│   │   ├── routes/              # Express route definitions
│   │   ├── services/            # Business logic (order processing, price verification)
│   │   ├── utils/               # Error handling utilities and constants
│   │   ├── app.js               # Express application initialization
│   │   └── server.js            # HTTP server entry point
│   ├── .env.example             # Server configuration template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, CartSidebar, WishlistSidebar, CheckoutModal, Footer
│   │   ├── context/             # StoreContext (cart, wishlist, user auth, re-ordering)
│   │   ├── pages/               # Home, Products, ProductDetails, About, Contact,
│   │   │                        # MysteryDrop, Trending, Profile, AdminPanel, InfoPage
│   │   ├── pages/Auth/          # Login and Signup views
│   │   ├── services/            # Fetch API client (/api proxy wrapper)
│   │   ├── utils/               # Email domain validation
│   │   ├── index.css            # Tailwind + custom cyber theme tokens
│   │   └── App.jsx              # Client router and layout
│   ├── vite.config.js           # Vite dev server + proxy to backend port 5000
│   └── package.json
│
├── start-dev.bat                # Windows one-click launcher
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version **18.x** or higher recommended)
- `npm` (bundled with Node.js)

---

### Option A: One-Click Launch (Windows)

Simply double-click the **`start-dev.bat`** file in the project root, or execute:

```powershell
.\start-dev.bat
```

This launches both the **Backend API** and **Frontend Storefront** in separate console windows.

---

### Option B: Manual Two-Terminal Startup

#### 1. Start the Backend API:
```powershell
cd E:\Nextron_Main\NextronShop\backend
npm install
npm run dev
```
- **API URL:** `http://localhost:5000`

#### 2. Start the Frontend Storefront:
```powershell
cd E:\Nextron_Main\NextronShop\frontend
npm install
npm run dev
```
- **Storefront URL:** `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@nextron.com` | `admin` | Full store access + Admin Console (`/admin`) |
| **Customer** | *(Sign up at `/signup`)* | Any 6+ chars | Storefront, Cart, Wishlist, Order Dashboard |

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/auth/login` | Public | Authenticate user & return JWT token |
| **POST** | `/api/auth/signup` | Public | Register new user account |
| **GET** | `/api/products` | Public | Retrieve product catalogue with category & search queries |
| **GET** | `/api/products/:id` | Public | Retrieve specific product details |
| **POST** | `/api/orders` | User (JWT) | Place new order with stock verification |
| **GET** | `/api/user/data` | User (JWT) | Retrieve user's cart, wishlist, and order history |
| **PUT** | `/api/user/cart` | User (JWT) | Sync cart items to user session |
| **POST** | `/api/support/contact` | Public | Submit customer support inquiry |
| **POST** | `/api/support/newsletter` | Public | Subscribe email to news drops |
| **GET** | `/api/admin/stats` | Admin | Aggregate revenue, total orders, low-stock count |
| **GET** | `/api/admin/orders` | Admin | Retrieve all customer orders |
| **PATCH**| `/api/admin/orders/:id/status`| Admin | Update order status (`Pending` ➔ `Delivered`) |
| **POST** | `/api/products` | Admin | Create a new hardware product |
| **DELETE**| `/api/products/:id` | Admin | Delete a product from inventory |

---

## 📄 Evaluation Checklist

- [x] Backend runs independently with in-memory persistence (no DB server required).
- [x] Complete REST API with JWT security and middleware.
- [x] Modern cyberpunk UI with Theme Switcher (Dark & Light mode).
- [x] Interactive Top Navigation Profile pill with dropdown menu.
- [x] User Dashboard displaying lifetime orders count, total spent, and gear procured.
- [x] Expandable previous order carts with item inspection and 1-click **Re-order Cart**.
- [x] Full Admin Command Center for inventory, statistics, and orders management.
- [x] Automated one-click launcher (`start-dev.bat`) for easy evaluation.
