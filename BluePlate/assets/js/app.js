import { Navbar } from "./components/Navbar.js";
import { AuthScreen } from "./components/AuthScreen.js";
import { Hero } from "./components/Hero.js";
import { Footer } from "./components/Footer.js";
import { CartDrawer } from "./components/CartDrawer.js";
import { CheckoutModal } from "./components/CheckoutModal.js";
import { QuickViewModal } from "./components/QuickViewModal.js";
import { ProfileModal } from "./components/ProfileModal.js";
import { RestaurantModal } from "./components/RestaurantModal.js";
import { RestaurantDishCard } from "./components/RestaurantDishCard.js";
import { FoodCard } from "./components/FoodCard.js";
import { HomePage } from "./pages/HomePage.js";
import { dishes, restaurants } from "./data/menu.js";
import { SearchSuggestions } from "./components/SearchSuggestions.js";
import { addToCart, changeQuantity, clearCart, getCartTotals, getState, getCurrentAccount, removeFromCart, reorderItems, saveOrder, setCoupon, setProfile, subscribe, toggleFavorite, exportBackup, importBackup, resetAllData, getStorageUsage, validateCoupon, restoreSession, registerAccount, loginAccount, logoutAccount } from "./state/store.js";
import { createId, escapeHTML, formatCurrency } from "./utils/helpers.js";

const app = document.querySelector("#app");
const filters = { category: "all", query: "", vegetarian: false, maxPrice: "all", minRating: 0, sort: "popular" };
let quickViewQuantity = 1;
let selectedRestaurantId = "";

function OrdersModal() {
  return `<div class="modal fade" id="ordersModal" tabindex="-1" aria-labelledby="ordersModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content checkout-modal"><div class="modal-header"><div><span class="drawer-kicker">YOUR BLUEPLATE JOURNEY</span><h2 class="modal-title" id="ordersModalLabel">Your orders</h2></div><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body" id="orders-list"></div></div></div></div>`;
}

function render() {
  document.body.classList.remove("auth-active");
  app.innerHTML = `${Navbar()}${Hero()}${HomePage()}${Footer()}${CartDrawer()}${CheckoutModal()}${OrdersModal()}${QuickViewModal()}${ProfileModal()}${RestaurantModal()}`;
  updateCartBadge();
  updateProfileLabel();
  updateFavoriteCount();
  updateFoodCardQuantities();
  observeReveals();
  observeNavigation();
}

function updateCartBadge() {
  const count = getState().cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = $("#nav-cart-count");
  badge.text(count).toggleClass("has-items", count > 0).attr("aria-label", `${count} items in cart`);
}

function updateProfileLabel() {
  const profile = getState().profile;
  $("#profile-nav-label").text(profile.name ? `Hi, ${profile.name.split(" ")[0]}` : "Profile");
}

function updateFavoriteCount() {
  const count = getState().favorites.length;
  $("#favorite-count").text(count).toggleClass("has-items", count > 0);
}

function refreshFavoriteButtons() {
  const favorites = new Set(getState().favorites);
  $("[data-favorite]").each(function () {
    const id = String($(this).data("favorite"));
    const active = favorites.has(id);
    $(this).toggleClass("is-favorite", active).attr("aria-pressed", String(active));
    if ($(this).hasClass("favorite-button")) $(this).attr("aria-label", `${active ? "Remove from" : "Add to"} favourites`);
  });
}

function updateFoodCardQuantities() {
  const cart = new Map(getState().cart.map(item => [item.id, item.quantity]));
  $("[data-add]").each(function () {
    const id = String($(this).data("add"));
    const quantity = cart.get(id) || 0;
    $(this).toggleClass("has-cart-quantity", quantity > 0).attr("aria-label", `Add ${id} to cart`);
    $(this).find("[data-add-label]").text(quantity ? `Add (${quantity})` : "Add");
  });
}

function refreshCart() {
  const markup = document.createElement("div");
  markup.innerHTML = CartDrawer();
  const content = markup.querySelector("#cart-drawer-content");
  if (content) $("#cart-drawer-content").html(content.innerHTML);
  $("#drawer-item-count").text(markup.querySelector("#drawer-item-count")?.textContent || "(0)");
  updateCartBadge();
}

function showToast(message, type = "success") {
  const id = createId("toast");
  const icon = type === "error" ? "!" : "✓";
  const toast = $(`<div class="blueplate-toast ${type}" id="${id}" role="status"><span class="toast-mark">${icon}</span><span>${escapeHTML(message)}</span><button type="button" aria-label="Close">×</button></div>`);
  $("#toast-area").append(toast);
  requestAnimationFrame(() => toast.addClass("show"));
  window.setTimeout(() => toast.removeClass("show"), 3200);
  window.setTimeout(() => toast.remove(), 3600);
  toast.find("button").on("click", () => toast.remove());
}

function observeReveals() {
  const elements = document.querySelectorAll(".reveal-up:not(.is-visible), .reveal-scale:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
  elements.forEach(element => observer.observe(element));
}

function observeNavigation() {
  if (!("IntersectionObserver" in window)) return;
  const sections = ["home", "restaurants", "menu", "offers"].map(id => document.getElementById(id)).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $(".navbar-nav .nav-link").removeClass("active");
      $(`.navbar-nav a[href="#${entry.target.id}"]`).addClass("active");
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  sections.forEach(section => observer.observe(section));
}

function renderFoodGrid() {
  let result = [...dishes];
  const state = getState();
  if (filters.category === "saved") result = result.filter(dish => state.favorites.includes(dish.id));
  else if (filters.category !== "all") result = result.filter(dish => dish.category === filters.category);
  if (filters.query) result = result.filter(dish => `${dish.name} ${dish.restaurant} ${dish.category} ${dish.description}`.toLowerCase().includes(filters.query));
  if (filters.vegetarian) result = result.filter(dish => dish.vegetarian);
  if (filters.maxPrice !== "all") result = result.filter(dish => dish.price < Number(filters.maxPrice));
  if (filters.minRating) result = result.filter(dish => dish.rating >= filters.minRating);
  if (filters.sort === "price-low") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-high") result.sort((a, b) => b.price - a.price);
  if (filters.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
  if (filters.sort === "popular" || filters.sort === "rating") result.sort((a, b) => b.rating - a.rating);
  if (filters.sort === "fastest") result.sort((a, b) => Number.parseInt(a.prep, 10) - Number.parseInt(b.prep, 10));
  const cartQuantities = new Map(state.cart.map(item => [item.id, item.quantity]));
  $("#food-grid").html(result.map(dish => `<div class="col-sm-6 col-lg-3">${FoodCard(dish, state.favorites.includes(dish.id), cartQuantities.get(dish.id) || 0)}</div>`).join(""));
  $("#results-count").text(result.length);
  $("#filter-state-label").text(filters.query || filters.category !== "all" || filters.vegetarian || filters.maxPrice !== "all" || filters.minRating ? "· filters applied" : "· handpicked for you");
  $("#no-food-results").toggleClass("d-none", result.length > 0);
  $("[data-category-filter]").removeClass("active").filter(`[data-category-filter="${filters.category}"]`).addClass("active");
  observeReveals();
  updateFavoriteCount();
}

function renderRestaurantGrid() {
  const normalized = filters.query;
  let visible = 0;
  $("[data-restaurant-card]").each(function () {
    const show = !normalized || String($(this).data("search")).includes(normalized);
    $(this).toggleClass("d-none", !show);
    if (show) visible += 1;
  });
  $("#no-restaurant-results").toggleClass("d-none", visible > 0);
}

function applyFilters() {
  renderFoodGrid();
  renderRestaurantGrid();
}

function renderRestaurantMenu() {
  const restaurant = restaurants.find(item => item.id === selectedRestaurantId);
  if (!restaurant) return;

  let items = dishes.filter(item => item.restaurant === restaurant.name);
  const query = String($("#restaurant-menu-search").val() || "").trim().toLowerCase();
  const type = String($("#restaurant-menu-type").val() || "all");
  const sort = String($("#restaurant-menu-sort").val() || "popular");

  if (query) items = items.filter(item => `${item.name} ${item.description}`.toLowerCase().includes(query));
  if (type === "veg") items = items.filter(item => item.vegetarian);
  if (type === "nonveg") items = items.filter(item => !item.vegetarian);
  if (sort === "price-low") items.sort((a, b) => a.price - b.price);
  if (sort === "price-high") items.sort((a, b) => b.price - a.price);
  if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
  if (sort === "name") items.sort((a, b) => a.name.localeCompare(b.name));

  const state = getState();
  const quantities = new Map(state.cart.map(item => [item.id, item.quantity]));
  $("#restaurant-menu-count").text(`${items.length} items`);
  $("#restaurant-menu-grid").html(items.map(item => RestaurantDishCard(item, state.favorites.includes(item.id), quantities.get(item.id) || 0)).join(""));
  $("#restaurant-menu-empty").toggleClass("d-none", items.length > 0);
}

function openRestaurant(id) {
  const restaurant = restaurants.find(item => item.id === String(id));
  if (!restaurant) return;

  selectedRestaurantId = restaurant.id;
  const items = dishes.filter(item => item.restaurant === restaurant.name);
  const popular = [...items].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const state = getState();
  const quantities = new Map(state.cart.map(item => [item.id, item.quantity]));

  $("#restaurantModalTitle").text(restaurant.name);
  $("#restaurant-detail-content").html(`
    <section class="restaurant-detail-hero">
      <div class="restaurant-detail-image"><img src="${escapeHTML(restaurant.image)}" alt="${escapeHTML(restaurant.name)} restaurant" loading="eager"></div>
      <div class="restaurant-detail-copy">
        <span class="restaurant-detail-tag">${escapeHTML(restaurant.tag)}</span>
        <h3>${escapeHTML(restaurant.name)}</h3>
        <p>${escapeHTML(restaurant.description)}</p>
        <div class="restaurant-detail-meta">
          <span>★ ${restaurant.rating.toFixed(1)} <small>${escapeHTML(restaurant.reviews)} reviews</small></span>
          <span>◷ ${escapeHTML(restaurant.time)}</span>
          <span>⌁ ${escapeHTML(restaurant.fee)}</span>
        </div>
        <div class="restaurant-detail-speciality"><span>KNOWN FOR</span><strong>${escapeHTML(restaurant.speciality)}</strong></div>
      </div>
    </section>
    <section class="restaurant-offer-banner">
      <div><span>THIS KITCHEN'S OFFER</span><p>${escapeHTML(restaurant.offer)}</p></div>
      <button type="button" data-copy-coupon data-coupon-code="${escapeHTML(restaurant.offerCode)}">Copy code</button>
    </section>
    <section class="restaurant-featured-section">
      <div class="restaurant-modal-section-heading"><div><span class="section-kicker">POPULAR PICKS FROM THIS MENU</span><h3>Popular at ${escapeHTML(restaurant.name)}</h3></div><span class="restaurant-menu-count">${items.length} dishes</span></div>
      <div class="restaurant-featured-grid">${popular.map(item => RestaurantDishCard(item, state.favorites.includes(item.id), quantities.get(item.id) || 0)).join("")}</div>
    </section>
    <section class="restaurant-menu-section">
      <div class="restaurant-modal-section-heading"><div><span class="section-kicker">MADE FRESH TO ORDER</span><h3>Full menu</h3></div><span class="restaurant-menu-count" id="restaurant-menu-count">${items.length} items</span></div>
      <div class="restaurant-menu-tools">
        <input class="form-control" id="restaurant-menu-search" type="search" placeholder="Search this menu" aria-label="Search this restaurant menu">
        <select class="form-select" id="restaurant-menu-type" aria-label="Filter food type"><option value="all">All items</option><option value="veg">Vegetarian</option><option value="nonveg">Non-vegetarian</option></select>
        <select class="form-select" id="restaurant-menu-sort" aria-label="Sort restaurant menu"><option value="popular">Popular</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option><option value="name">Name: A to Z</option></select>
      </div>
      <div class="restaurant-menu-grid" id="restaurant-menu-grid">${items.map(item => RestaurantDishCard(item, state.favorites.includes(item.id), quantities.get(item.id) || 0)).join("")}</div>
      <div class="restaurant-menu-empty d-none" id="restaurant-menu-empty"><h4>No dishes found</h4><p>Try another search or change the menu filters.</p></div>
    </section>`);

  bootstrap.Modal.getOrCreateInstance(document.querySelector("#restaurantModal")).show();
}

function renderOrders() {
  const orders = getState().orders;
  const html = orders.length ? orders.map(order => `
    <article class="order-history-card"><div class="order-history-top"><div><small>ORDER ${escapeHTML(order.id)}</small><h3>${escapeHTML(new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }))}</h3></div><span class="order-status">${escapeHTML(order.status || "Placed")}</span></div><div class="order-history-items">${order.items.map(item => `<span>${item.quantity} × ${escapeHTML(item.name)}</span>`).join("")}</div><div class="order-history-bottom"><span>${escapeHTML(order.customer.city)} · ${escapeHTML(order.customer.pincode)}</span><strong>${formatCurrency(order.total)}</strong></div><div class="order-details-extra d-none" id="order-details-${escapeHTML(order.id)}"><div class="order-detail-lines">${order.items.map(item => `<div><span>${item.quantity} × ${escapeHTML(item.name)}</span><b>${formatCurrency(item.price * item.quantity)}</b></div>`).join("")}</div><p>Delivering to: ${escapeHTML(order.customer.address)}, ${escapeHTML(order.customer.city)} ${escapeHTML(order.customer.pincode)}</p>${order.customer.note ? `<p>Note: ${escapeHTML(order.customer.note)}</p>` : ""}<p>Payment: Cash on delivery</p></div><div class="order-card-actions"><button class="order-reorder-button" type="button" data-order-details="${escapeHTML(order.id)}" aria-expanded="false">View details <span>⌄</span></button><button class="order-reorder-button" type="button" data-reorder="${escapeHTML(order.id)}">Order these again <span>↗</span></button></div></article>`).join("") : `<div class="orders-empty"><span>⌑</span><h3>No orders yet.</h3><p>Your next good food moment starts with a favourite dish.</p><button class="btn btn-primary rounded-pill px-4" type="button" data-bs-dismiss="modal">Explore the menu</button></div>`;
  $("#orders-list").html(html);
}

function fillCheckoutProfile() {
  const profile = getState().profile;
  Object.entries({ name: "customer-name", phone: "customer-phone", address: "customer-address", city: "customer-city", pincode: "customer-pincode" }).forEach(([key, id]) => {
    const field = document.getElementById(id);
    if (field && !field.value) field.value = profile[key] || "";
  });
}

function renderCheckoutSummary() {
  const state = getState();
  const totals = getCartTotals();
  const items = state.cart.map(item => `<div><span>${item.quantity} × ${escapeHTML(item.name)}</span><b>${formatCurrency(item.price * item.quantity)}</b></div>`).join("");
  $("#checkout-summary").html(`<div class="checkout-summary-heading"><strong>Order summary</strong><span>${state.cart.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>${items}<div><span>Subtotal</span><b>${formatCurrency(totals.subtotal)}</b></div><div><span>Delivery</span><b>${totals.delivery ? formatCurrency(totals.delivery) : "Free"}</b></div>${totals.discount ? `<div class="discount-row"><span>Discount</span><b>−${formatCurrency(totals.discount)}</b></div>` : ""}<div><span>Taxes</span><b>${formatCurrency(totals.tax)}</b></div><div class="checkout-summary-total"><strong>Total payable</strong><strong>${formatCurrency(totals.total)}</strong></div>`);
}

function openCheckout() {
  if (!getState().cart.length) return showToast("Your cart is empty. Add a dish to get started.", "error");
  fillCheckoutProfile();
  renderCheckoutSummary();
  const drawerElement = document.querySelector("#cartDrawer");
  const checkout = bootstrap.Modal.getOrCreateInstance(document.querySelector("#checkoutModal"));
  const drawer = bootstrap.Offcanvas.getOrCreateInstance(drawerElement);
  drawerElement.addEventListener("hidden.bs.offcanvas", () => checkout.show(), { once: true });
  drawer.hide();
}

function placeOrder(form) {
  const formData = new FormData(form);
  const customer = {
    name: String(formData.get("name")).trim(),
    phone: String(formData.get("phone")).trim(),
    address: String(formData.get("address")).trim(),
    city: String(formData.get("city")).trim(),
    pincode: String(formData.get("pincode")).trim(),
    note: String(formData.get("note") || "").trim()
  };
  const totals = getCartTotals();
  const state = getState();
  if (!state.cart.length) throw new Error("Your cart is empty.");
  const order = {
    id: createId("BP"),
    createdAt: new Date().toISOString(),
    customer,
    items: state.cart.map(item => ({ ...item })),
    totals,
    total: totals.total,
    paymentMethod: "Cash on delivery",
    status: "Placed"
  };
  setProfile({ name: customer.name, phone: customer.phone, address: customer.address, city: customer.city, pincode: customer.pincode });
  saveOrder(order);
  $("#checkout-form").addClass("d-none");
  $("#order-success").removeClass("d-none");
  $("#success-order-message").text(`Order ${order.id} · ${formatCurrency(order.total)} · ${order.items.length} different dishes.`);
  refreshCart();
}

function openQuickView(id) {
  const dish = dishes.find(item => item.id === id);
  if (!dish) return;
  quickViewQuantity = 1;
  const favorite = getState().favorites.includes(dish.id);
  $("#quick-view-content").html(`<div class="quick-view-layout"><div class="quick-view-image"><img src="${escapeHTML(dish.image)}" alt="${escapeHTML(dish.name)}"></div><div class="quick-view-copy"><button type="button" class="btn-close quick-view-close" data-bs-dismiss="modal" aria-label="Close"></button><span class="section-kicker">${escapeHTML(dish.restaurant)}</span><h2 id="quickViewTitle">${escapeHTML(dish.name)}</h2><div class="quick-view-rating">★ ${dish.rating.toFixed(1)} <span>·</span> ${escapeHTML(dish.prep || "Freshly prepared")}</div><p>${escapeHTML(dish.description)}</p><div class="quick-view-facts"><span>${dish.vegetarian ? "Vegetarian" : "Non-vegetarian"}</span><span>${escapeHTML(dish.spicy || "Mild")}</span><span>${escapeHTML(dish.prep || "Fresh")}</span></div><div class="quick-view-bottom"><strong>${formatCurrency(dish.price)}</strong><div class="quick-view-order-controls"><div class="quantity-control"><button type="button" data-quick-quantity="-1" aria-label="Decrease quantity">−</button><span id="quick-view-quantity">1</span><button type="button" data-quick-quantity="1" aria-label="Increase quantity">+</button></div><button type="button" class="add-button" data-quick-view-add="${escapeHTML(dish.id)}"><span>+</span> Add</button></div></div><button class="quick-view-save ${favorite ? "is-favorite" : ""}" type="button" data-favorite="${escapeHTML(dish.id)}">${favorite ? "♥ Saved to favourites" : "♡ Save to favourites"}</button></div></div>`);
  bootstrap.Modal.getOrCreateInstance(document.querySelector("#quickViewModal")).show();
}

function openProfile() {
  const profile = getState().profile;
  const account = getCurrentAccount();
  Object.entries({ name: "profile-name", phone: "profile-phone", address: "profile-address", city: "profile-city", pincode: "profile-pincode" }).forEach(([key, id]) => $(`#${id}`).val(profile[key] || ""));
  $("#profile-account-email").text(account?.email || "");
  updateStorageMeter();
  bootstrap.Modal.getOrCreateInstance(document.querySelector("#profileModal")).show();
}

function updateStorageMeter() {
  const usage = getStorageUsage();
  const percent = Math.min(100, (usage.used / usage.limit) * 100);
  $("#storage-usage-label").text(`${(usage.used / 1024).toFixed(1)} KB of ${(usage.limit / 1024).toFixed(0)} KB used`);
  $("#storage-meter-fill").css("width", `${percent}%`).toggleClass("is-near-limit", percent >= 80);
}

function downloadBackup() {
  const blob = new Blob([exportBackup()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `blueplate-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  showToast("Your backup file is ready.");
}

function resetFilters() {
  filters.category = "all";
  filters.query = "";
  filters.vegetarian = false;
  filters.maxPrice = "all";
  filters.minRating = 0;
  filters.sort = "popular";
  $("#hero-search").val("");
  $("#search-suggestions").addClass("d-none").removeClass("is-open");
  $("#hero-search").attr("aria-expanded", "false");
  $("#veg-filter").prop("checked", false);
  $("#price-filter").val("all");
  $("#rating-filter").val("0");
  $("#menu-sort").val("popular");
  applyFilters();
}

function startApp() {
  render();
  subscribe(() => {
    refreshCart();
    updateProfileLabel();
    updateFavoriteCount();
    refreshFavoriteButtons();
    updateFoodCardQuantities();
    if (filters.category === "saved") renderFoodGrid();
    if ($("#restaurantModal").hasClass("show")) renderRestaurantMenu();
    if ($("#ordersModal").hasClass("show")) renderOrders();
    if ($("#checkoutModal").hasClass("show")) renderCheckoutSummary();
  });

  $(document).on("click", "[data-open-restaurant]", function (event) {
    event.stopPropagation();
    openRestaurant($(this).data("open-restaurant"));
  });

  $(document).on("keydown", "[data-restaurant-card]", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    if ($(event.target).is("button, a")) return;
    event.preventDefault();
    openRestaurant($(this).data("restaurant-id"));
  });

  $(document).on("click", "[data-search-open-restaurant]", function () {
    const id = $(this).data("search-open-restaurant");
    $("#search-suggestions").addClass("d-none").removeClass("is-open");
    $("#hero-search").attr("aria-expanded", "false");
    openRestaurant(id);
  });

  $(document).on("input", "#restaurant-menu-search", renderRestaurantMenu);
  $(document).on("change", "#restaurant-menu-type, #restaurant-menu-sort", renderRestaurantMenu);

  $(document).on("click", "[data-add]", function () {
    const dish = dishes.find(item => item.id === $(this).data("add"));
    if (!dish) return;
    try {
      addToCart(dish);
      showToast(`${dish.name} added to your cart.`);
      $(this).addClass("added");
      window.setTimeout(() => $(this).removeClass("added"), 700);
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-quantity]", function () {
    try {
      changeQuantity($(this).data("id"), Number($(this).data("quantity")));
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-clear-cart]", function () {
    if (!window.confirm("Remove every item from your cart?")) return;
    try {
      clearCart();
      showToast("Your cart has been cleared.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-remove]", function () {
    try {
      removeFromCart($(this).data("remove"));
      showToast("Item removed from your cart.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-remove-coupon]", function () {
    try {
      setCoupon("");
      showToast("The coupon has been removed.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-favorite]", function () {
    const id = $(this).data("favorite");
    try {
      toggleFavorite(id);
      const active = getState().favorites.includes(id);
      $(`[data-favorite="${id}"]`).toggleClass("is-favorite", active).attr("aria-pressed", active).attr("aria-label", `${active ? "Remove from" : "Add to"} favourites`);
      if ($("[data-category-filter].active").data("category-filter") === "saved") renderFoodGrid();
      if ($(this).closest("#quick-view-content").length) $(this).text(active ? "♥ Saved to favourites" : "♡ Save to favourites");
      showToast(active ? "Saved to your favourites." : "Removed from your favourites.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-category-filter]", function () {
    filters.category = $(this).data("category-filter");
    applyFilters();
    const nav = document.querySelector("#mainNav");
    if (nav?.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(nav).hide();
    if (filters.category === "saved") document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  });

  $(document).on("click", "[data-category-shortcut]", function () {
    filters.category = $(this).data("category-shortcut");
    filters.query = "";
    $("#hero-search").val("");
    applyFilters();
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  });

  $(document).on("click", "[data-reset-filters]", resetFilters);

  $(document).on("input", "#hero-search", function () {
    const query = String($(this).val()).trim();
    filters.query = query.toLowerCase();
    filters.category = "all";
    applyFilters();
    const suggestions = SearchSuggestions(query);
    $("#search-suggestions").html(suggestions).toggleClass("d-none", !suggestions).toggleClass("is-open", Boolean(suggestions));
    $(this).attr("aria-expanded", Boolean(suggestions));
  });

  $(document).on("focus", "#hero-search", function () {
    const suggestions = SearchSuggestions(this.value);
    if (suggestions) $("#search-suggestions").html(suggestions).removeClass("d-none").addClass("is-open").attr("aria-expanded", "true");
  });

  $(document).on("keydown", "#hero-search", function (event) {
    if (event.key === "Escape") {
      $("#search-suggestions").addClass("d-none").removeClass("is-open");
      $(this).attr("aria-expanded", "false");
    }
  });

  $(document).on("click", "[data-search-select]", function () {
    const value = String($(this).data("search-select"));
    $("#hero-search").val(value).trigger("input");
    $("#search-suggestions").addClass("d-none").removeClass("is-open");
    $("#hero-search").attr("aria-expanded", "false");
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".hero-search-wrap").length) {
      $("#search-suggestions").addClass("d-none").removeClass("is-open");
      $("#hero-search").attr("aria-expanded", "false");
    }
  });

  $("#hero-search-form").on("submit", function (event) {
    event.preventDefault();
    $("#search-suggestions").addClass("d-none").removeClass("is-open");
    $("#hero-search").attr("aria-expanded", "false");
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  });

  $(document).on("click", "[data-search-term]", function () {
    const term = $(this).data("search-term");
    $("#hero-search").val(term).trigger("input");
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  });

  $(document).on("click", "[data-scroll-search]", function () {
    document.querySelector("#home").scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => document.querySelector("#hero-search")?.focus(), 450);
  });

  $(document).on("change", "#menu-sort", function () {
    filters.sort = $(this).val();
    renderFoodGrid();
  });

  $(document).on("change", "#veg-filter", function () {
    filters.vegetarian = this.checked;
    renderFoodGrid();
  });

  $(document).on("change", "#price-filter", function () {
    filters.maxPrice = $(this).val();
    renderFoodGrid();
  });

  $(document).on("change", "#rating-filter", function () {
    filters.minRating = Number($(this).val()) || 0;
    renderFoodGrid();
  });

  $(document).on("click", "[data-quick-view]", function () {
    openQuickView($(this).data("quick-view"));
  });

  $(document).on("click", "[data-quick-quantity]", function () {
    quickViewQuantity = Math.max(1, Math.min(20, quickViewQuantity + Number($(this).data("quick-quantity"))));
    $("#quick-view-quantity").text(quickViewQuantity);
  });

  $(document).on("click", "[data-quick-view-add]", function () {
    const dish = dishes.find(item => item.id === $(this).data("quick-view-add"));
    if (!dish) return;
    try {
      addToCart(dish, quickViewQuantity);
      bootstrap.Modal.getOrCreateInstance(document.querySelector("#quickViewModal")).hide();
      showToast(`${dish.name} added to your cart.`);
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "#apply-coupon", function () {
    const code = String($("#coupon-code").val() || "").trim().toUpperCase();
    const validation = validateCoupon(code);
    if (!validation.valid) return showToast(validation.message, "error");
    try {
      setCoupon(code);
      showToast(validation.message);
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-open-checkout]", openCheckout);

  $("#checkout-form").on("submit", function (event) {
    event.preventDefault();
    if (!this.reportValidity()) return;
    try {
      placeOrder(this);
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $("#checkoutModal").on("show.bs.modal", renderCheckoutSummary);
  $("#checkoutModal").on("hidden.bs.modal", function () {
    $("#checkout-form").removeClass("d-none")[0].reset();
    $("#order-success").addClass("d-none");
  });

  $("#profile-form").on("submit", function (event) {
    event.preventDefault();
    if (!this.reportValidity()) return;
    const formData = new FormData(this);
    const profile = Object.fromEntries(["name", "phone", "address", "city", "pincode"].map(key => [key, String(formData.get(key)).trim()]));
    try {
      setProfile(profile);
      bootstrap.Modal.getOrCreateInstance(document.querySelector("#profileModal")).hide();
      showToast("Your details have been saved.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-open-profile]", openProfile);

  $("#ordersModal").on("show.bs.modal", renderOrders);
  $(document).on("click", "[data-open-orders]", function () {
    bootstrap.Modal.getOrCreateInstance(document.querySelector("#ordersModal")).show();
    const nav = document.querySelector("#mainNav");
    if (nav?.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(nav).hide();
  });

  $(document).on("click", "[data-order-details]", function () {
    const id = String($(this).data("order-details"));
    const panel = $(`#order-details-${id}`);
    const expanded = !panel.hasClass("d-none");
    panel.toggleClass("d-none", expanded);
    $(this).attr("aria-expanded", String(!expanded)).html(expanded ? "View details <span>⌄</span>" : "Hide details <span>⌃</span>");
  });

  $(document).on("click", "[data-reorder]", function () {
    try {
      reorderItems($(this).data("reorder"));
      const modalElement = document.querySelector("#ordersModal");
      modalElement.addEventListener("hidden.bs.modal", () => {
        bootstrap.Offcanvas.getOrCreateInstance(document.querySelector("#cartDrawer")).show();
      }, { once: true });
      bootstrap.Modal.getOrCreateInstance(modalElement).hide();
      showToast("Your previous items are back in the cart.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-export-data]", downloadBackup);

  $(document).on("click", "[data-import-data]", function () {
    $("#import-data-file").trigger("click");
  });

  $(document).on("change", "#import-data-file", async function () {
    const file = this.files?.[0];
    if (!file) return;
    if (file.size > 2097152) {
      this.value = "";
      return showToast("Backup files must be no larger than 2 MiB.", "error");
    }
    try {
      const backup = JSON.parse(await file.text());
      importBackup(backup);
      updateStorageMeter();
      this.value = "";
      showToast("Your BluePlate data has been restored.");
    } catch (error) {
      this.value = "";
      showToast(error.message || "This backup could not be restored.", "error");
    }
  });

  $(document).on("click", "[data-reset-local-data]", function () {
    if (!window.confirm("Reset your saved cart, favourites, orders and profile on this device? This cannot be undone.")) return;
    try {
      resetAllData();
      $("#profile-form")[0].reset();
      updateStorageMeter();
      showToast("Your saved BluePlate data has been reset.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  $(document).on("click", "[data-copy-coupon]", async function () {
    const code = String($(this).data("coupon-code") || "WELCOME10");
    try {
      await navigator.clipboard.writeText(code);
      showToast(`${code} copied. Enjoy your treat!`);
    } catch {
      showToast(`Use code ${code} at checkout.`);
    }
  });

  $(document).on("click", "[data-back-to-top]", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $(document).on("click", "a[href^='#']", function () {
    const nav = document.querySelector("#mainNav");
    if (nav?.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(nav).hide();
  });

  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      document.querySelector(".site-navbar")?.classList.toggle("is-scrolled", window.scrollY > 24);
      document.querySelector(".back-to-top")?.classList.toggle("is-visible", window.scrollY > 520);
      scrollTicking = false;
    });
  }, { passive: true });

  window.addEventListener("error", event => {
    if (event.target instanceof HTMLImageElement && !event.target.classList.contains("image-fallback")) {
      event.target.src = "assets/images/food-fallback.svg";
      event.target.classList.add("image-fallback");
    }
  }, true);
}

function renderAuthPage(mode = "login") {
  document.body.classList.add("auth-active");
  app.innerHTML = AuthScreen(mode);
}

function showAuthError(message) {
  $("#auth-message").text(message).removeClass("d-none");
}

$(document).on("click", "[data-auth-mode]", function () {
  renderAuthPage(String($(this).data("auth-mode")));
});

$(document).on("submit", "#login-form", async function (event) {
  event.preventDefault();
  if (!this.reportValidity()) return;
  const button = $(this).find("[type=submit]").prop("disabled", true);
  const data = new FormData(this);
  try {
    const account = await loginAccount({ email: data.get("email"), password: data.get("password") });
    startApp();
    showToast(`Welcome back, ${account.name.split(" ")[0]}.`);
  } catch (error) {
    showAuthError(error.message || "We could not sign you in. Please try again.");
    button.prop("disabled", false);
  }
});

$(document).on("submit", "#register-form", async function (event) {
  event.preventDefault();
  if (!this.reportValidity()) return;
  const data = new FormData(this);
  if (String(data.get("password")) !== String(data.get("confirmPassword"))) return showAuthError("Your passwords do not match.");
  const button = $(this).find("[type=submit]").prop("disabled", true);
  try {
    const account = await registerAccount({ name: data.get("name"), email: data.get("email"), phone: data.get("phone"), password: data.get("password") });
    startApp();
    showToast(`Welcome to BluePlate, ${account.name.split(" ")[0]}.`);
  } catch (error) {
    showAuthError(error.message || "We could not create your account. Please try again.");
    button.prop("disabled", false);
  }
});

$(document).on("click", "[data-logout]", function () {
  if (!window.confirm("Sign out of BluePlate on this device?")) return;
  logoutAccount();
  window.location.reload();
});

$(function () {
  if (restoreSession()) startApp();
  else renderAuthPage("login");
});
