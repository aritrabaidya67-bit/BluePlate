# 🍽️ BluePlate — Good food, good mood.

**BluePlate** is a food ordering web application that I built as my university project. It simulates a real-world food delivery platform where users can browse restaurants, explore dishes, add items to a cart, apply coupon codes, and place orders — all from a clean, responsive, single-page interface.

I built the entire application using **vanilla JavaScript** (no React, no Angular, no Vue) with **Bootstrap 5** for layout and styling. The goal was to demonstrate how a fully functional, interactive web application can be created using core web technologies — HTML, CSS, and JavaScript — without relying on any heavy frameworks.

> 🔗 **Live Site:** [blueplate-blond.vercel.app](https://blueplate-blond.vercel.app/)

---

## 📌 Project Details

| | |
|---|---|
| **Project Title** | BluePlate — Food Ordering Web Application |
| **Student Name** | Aritra Kumar Baidya |
| **Student Code** | BWU/BCA/25/055 |
| **University** | Brainware University |
| **Department** | Bachelor of Computer Applications (BCA) |
| **Technologies** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, jQuery |
| **Deployment** | [blueplate-blond.vercel.app](https://blueplate-blond.vercel.app/) |
| **GitHub Repo** | [github.com/aritrabaidya67-bit/BluePlate](https://github.com/aritrabaidya67-bit/BluePlate) |

---

## 💡 What This Project Does

BluePlate is a single-page web application that works like a food delivery app (similar to Swiggy or Zomato, but simplified and running entirely in the browser). Here's what a user can do:

### 1. Create an Account & Sign In
- When you first open the app, you're greeted with a **login/registration screen**
- You can create an account with your name, email, and a password
- Passwords are **not stored in plain text** — I used the browser's Web Crypto API to hash them using PBKDF2 (120,000 iterations with SHA-256), so the app follows proper security practices even though it's a front-end project
- Once logged in, your session persists until you close the tab, so you won't need to log in again on page refresh
- Multiple accounts can be created on the same browser, and each user's data (cart, orders, favourites) is kept completely separate

### 2. Browse Restaurants
- The app features **6 fictional restaurants**, each with a different cuisine:

| Restaurant | Cuisine | Rating | Delivery Time |
|-----------|---------|:------:|:-------------:|
| The Pizza Atelier | Italian · Pizza · Pasta | ⭐ 4.8 | 25–35 min |
| Spice Route Kitchen | Indian · Biryani · Tandoor | ⭐ 4.7 | 30–40 min |
| Burger Society | Burgers · American | ⭐ 4.6 | 20–30 min |
| Wok & Roll | Chinese · Asian · Noodles | ⭐ 4.7 | 25–35 min |
| Green Fork | Healthy · Salads · Bowls | ⭐ 4.6 | 20–30 min |
| Sugar Theory | Desserts · Cakes · Shakes | ⭐ 4.9 | 20–30 min |

- Clicking on a restaurant opens a **detail modal** showing the restaurant's image, rating, reviews, delivery fee, speciality, an exclusive coupon offer, popular picks, and a full searchable menu

### 3. Explore the Food Menu
- There are **24 dishes** spread across the 6 restaurants, covering 7 categories:
  - 🍕 Pizza — 4 dishes
  - 🍔 Burgers — 3 dishes
  - 🍛 Indian — 6 dishes
  - 🍜 Asian — 4 dishes
  - 🥗 Healthy — 3 dishes
  - 🍰 Desserts — 4 dishes
  - ♥ Favourites — your saved dishes

- Each dish card shows:
  - A food photograph
  - The dish name and restaurant name
  - A rating (e.g., ★ 4.8)
  - The price (in ₹), with a strikethrough old price if there's a discount
  - A badge (e.g., "Fan favourite", "Bestseller", "Kitchen special")
  - A veg/non-veg indicator
  - A heart button to save it as a favourite
  - A "Details" button to view more info in a quick-view modal
  - An "Add" button to add it to the cart

### 4. Search & Filter
- There's a **search bar** in the hero section at the top of the page
- As you type, the food grid filters in real time, matching against dish names, restaurant names, categories, and descriptions
- A **suggestions dropdown** appears with matching dishes and restaurants — you can click one to jump straight to it
- Beyond search, there are several **filter options**:

| Filter | What It Does |
|--------|-------------|
| Category pills | Show only a specific category (Pizza, Indian, Desserts, etc.) |
| Vegetarian toggle | Show only vegetarian dishes |
| Max price dropdown | Show dishes under ₹200, ₹300, or ₹500 |
| Min rating dropdown | Show dishes rated 4.5+, 4.7+, or 4.8+ |
| Sort dropdown | Sort by Most Loved, Price (low/high), Name (A–Z), Ready Fastest, or Top Rated |
| Clear filters | Reset everything back to the default view |

### 5. Add to Cart & Manage Your Order
- Click "Add" on any food card to add it to your cart
- The **cart drawer** slides out from the right side and shows:
  - All your added items with photos, names, prices, and quantities
  - Quantity controls (+ / −) for each item, capped at 20 per item
  - A button to remove individual items, or clear the entire cart
  - A **free delivery progress bar** that fills up as your subtotal approaches ₹499
  - A **coupon code field** where you can apply discount codes
  - A live breakdown of subtotal, delivery fee, discount, taxes (5% GST), and the total payable amount

- The two available coupon codes are:

| Code | Discount | Max Saving | Min Order |
|------|----------|:----------:|:---------:|
| `WELCOME10` | 10% off | ₹100 | ₹199 |
| `BLUEPLATE15` | 15% off | ₹150 | ₹499 |

### 6. Checkout & Place an Order
- From the cart, click "Continue to checkout" to open the **checkout modal**
- Fill in your delivery details: name, phone, address, city, PIN code, and an optional delivery note
- If you've saved your profile before, the form **auto-fills** with your saved information
- The order summary is displayed inline so you can review everything before placing the order
- Payment method is **Cash on Delivery** (pre-selected)
- Click "Place my order" and you'll see a **success confirmation** with your order ID
- Your cart is automatically cleared after placing an order

### 7. View Order History & Reorder
- Click "My orders" in the navbar or footer to open the **orders modal**
- Every past order is displayed with the date, status, items, delivery location, and total amount
- You can expand any order to see the full item breakdown and delivery address
- Click "Order these again" to **add all items from that order back into your cart** — useful for quickly reordering a meal you liked

### 8. Save Favourites
- Every food card has a **heart button** — click it to save a dish to your favourites
- The navbar shows a live **favourite count badge**
- Click the "Favourites" category pill to filter the menu and see only your saved dishes
- You can also favourite/unfavourite from the quick-view modal and from inside restaurant menus

### 9. Manage Your Profile
- Click the profile button in the navbar to open the **profile modal**
- Save your name, phone number, address, city, and PIN code
- This information is used to auto-fill the checkout form
- You can also see which email you're signed in with
- There's a **delete account** option that permanently removes your account and all saved data

---

## 🛠️ Technologies I Used

| Technology | Why I Used It |
|-----------|--------------|
| **HTML5** | For the page structure, semantic elements, form validation attributes, and accessibility features (ARIA labels, skip links) |
| **CSS3** | For all the visual styling — I wrote 12 modular CSS files covering the navbar, hero, cards, cart, modals, footer, animations, and responsive breakpoints |
| **Bootstrap 5.3** | For the responsive grid system, modal dialogs, offcanvas drawer (cart), collapse (mobile nav), and form controls |
| **JavaScript (ES6+)** | For all the application logic — I used ES6 modules (`import`/`export`), arrow functions, template literals, destructuring, `async`/`await`, `Map`, `Set`, and `IntersectionObserver` |
| **jQuery 3.7** | For concise DOM manipulation and event delegation — all user interactions are handled via `$(document).on()` so they work even after the DOM is re-rendered |
| **Web Crypto API** | For secure password hashing (PBKDF2) — this is a native browser API, no external library needed |
| **localStorage** | For persisting each user's cart, orders, favourites, and profile data across page reloads |
| **sessionStorage** | For maintaining the active login session (cleared when the browser tab is closed) |
| **Google Fonts** | DM Sans for body text and Manrope for headings — gives the app a clean, modern feel |
| **Vercel** | For deploying the site — it's free for static sites and gives you HTTPS and a global CDN out of the box |

---

## 📂 How the Project is Organised

```
BluePlate/
├── index.html                      ← The single HTML page that loads everything
│
└── assets/
    ├── css/
    │   ├── main.css                ← Imports all 12 component stylesheets
    │   └── components/
    │       ├── auth.css            ← Login & registration screen
    │       ├── base.css            ← CSS variables, resets, global styles
    │       ├── cards.css           ← Food card & restaurant card styling
    │       ├── cart.css            ← Cart drawer, checkout, order history
    │       ├── footer.css          ← Footer layout
    │       ├── hero.css            ← Hero section with floating elements
    │       ├── interactions.css    ← Hover effects, scroll-reveal animations
    │       ├── navbar.css          ← Sticky navigation bar
    │       ├── responsive.css      ← Media queries for mobile/tablet/desktop
    │       ├── restaurant.css      ← Restaurant detail modal
    │       ├── sections.css        ← Category, offers, steps, CTA sections
    │       └── typography-fixes.css← Font rendering tweaks
    │
    ├── images/
    │   ├── favicon.svg             ← The "b" logo
    │   ├── food-fallback.svg       ← Shown when a food image fails to load
    │   └── food/                   ← 20 food & restaurant photos (JPG)
    │
    └── js/
        ├── app.js                  ← The main entry point — renders the UI,
        │                              wires event listeners, manages the app lifecycle
        ├── components/             ← 13 UI component files (each is a function
        │   ├── AuthScreen.js          returning an HTML string)
        │   ├── CartDrawer.js
        │   ├── CheckoutModal.js
        │   ├── FoodCard.js
        │   ├── Footer.js
        │   ├── Hero.js
        │   ├── Navbar.js
        │   ├── ProfileModal.js
        │   ├── QuickViewModal.js
        │   ├── RestaurantCard.js
        │   ├── RestaurantDishCard.js
        │   ├── RestaurantModal.js
        │   └── SearchSuggestions.js
        ├── data/
        │   └── menu.js             ← All the static data (categories, restaurants, dishes)
        ├── pages/
        │   └── HomePage.js         ← The main page layout
        ├── state/
        │   └── store.js            ← State management, auth logic, localStorage persistence
        └── utils/
            └── helpers.js          ← Utility functions (HTML escaping, currency formatting, ID generation)
```

---

## 🔧 How to Run This Project Locally

Since the project uses ES6 modules (`import`/`export`), you can't just open `index.html` by double-clicking it — browsers block module imports over the `file://` protocol. You need a local HTTP server.

**Step 1** — Clone the repository:
```bash
git clone https://github.com/aritrabaidya67-bit/BluePlate.git
cd BluePlate/BluePlate
```

**Step 2** — Start a local server (use any one of these):

| Method | Command | Opens at |
|--------|---------|----------|
| Python 3 | `python -m http.server 8000` | `http://localhost:8000` |
| Node.js | `npx serve .` | `http://localhost:3000` |
| PHP | `php -S localhost:8000` | `http://localhost:8000` |
| VS Code | Install "Live Server" extension → click **Go Live** | Opens automatically |

**Step 3** — Open the URL in your browser and create an account to start using the app.

---

## 🧠 How I Built It — Architecture Explained

I followed a **component-based architecture** — the same idea used by React and Vue, but implemented manually with plain JavaScript.

### The idea is simple:
- Every piece of the UI (the navbar, a food card, the cart, each modal) is a **JavaScript function** that takes some data and returns an HTML string
- The main `app.js` file calls all these functions, stitches the HTML together, and injects it into the page
- When the user interacts with something (clicks "Add", types in search, changes a filter), an **event listener** catches it, updates the **central state**, and the relevant parts of the page refresh automatically

### Here's how the data flows:

```
User clicks "Add to cart"
        ↓
Event listener in app.js catches the click
        ↓
Calls addToCart() in store.js
        ↓
store.js updates the state + saves to localStorage
        ↓
store.js notifies all subscribers
        ↓
app.js subscriber callback runs → updates cart badge, 
food card quantities, cart drawer contents
```

### Why I chose this approach:
- I wanted to prove I could build a complex, interactive app without depending on a framework
- Using ES6 modules kept the code modular and maintainable — each component is in its own file
- The pub/sub pattern in `store.js` gives me reactivity without needing React's virtual DOM or Vue's reactivity system
- Event delegation (`$(document).on(...)`) means I don't have to worry about re-attaching event listeners when the DOM changes

---

## 📱 Responsive Design

I designed the app **mobile-first** — the base styles are for small screens, and I added media queries for larger screens:

| Screen Size | What Changes |
|:-----------:|-------------|
| **Phones** (< 576px) | Single-column food grid, hamburger menu, compact hero |
| **Small tablets** (576px+) | Two-column food grid |
| **Tablets** (768px+) | Two-column restaurant grid, expanded filter bar |
| **Laptops** (992px+) | Full desktop navbar, three-column restaurant grid |
| **Desktops** (1200px+) | Four-column food grid, full-width sections |

---

## ⚠️ Important Notes

- **This is a front-end only project.** There is no backend server or database. All data (accounts, cart, orders, favourites) is stored in the browser's `localStorage`. If you clear your browser data, everything resets.
- **Payments are not real.** The checkout flow simulates placing an order, but no actual payment is processed. The only payment method shown is "Cash on Delivery."
- **The Web Crypto API requires HTTPS or localhost.** The password hashing won't work if you try to open the site over plain HTTP on a remote server. On localhost and on Vercel (which serves over HTTPS), it works perfectly.

---

## 👨‍💻 Created By

**Aritra Kumar Baidya**
Student Code: **BWU/BCA/25/055**

🎓 **Brainware University**
Department of Computer Applications (BCA)

GitHub: [github.com/aritrabaidya67-bit](https://github.com/aritrabaidya67-bit)

---

*BluePlate — Made with care as a university project. © 2026*
