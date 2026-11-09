import { dishes } from "../data/menu.js";

const ACCOUNT_KEY = "blueplate_accounts_v1";
const SESSION_KEY = "blueplate_active_account_v1";
const LEGACY_STORAGE_KEY = "blueplate_customer_state_v1";
const MAX_STORAGE_BYTES = 2097152;
const dishImages = new Map(dishes.map(dish => [dish.id, dish.image]));
const initialState = { cart: [], favorites: [], orders: [], coupon: "", profile: { name: "", phone: "", address: "", city: "", pincode: "" } };
const coupons = {
  WELCOME10: { type: "percent", value: 10, maximum: 100, minimum: 199 },
  BLUEPLATE15: { type: "percent", value: 15, maximum: 150, minimum: 499 }
};

let activeUserId = "";
let state = clone(initialState);
const listeners = new Set();

try {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
} catch {
  activeUserId = "";
}

function clone(value) {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getUserStorageKey(userId) {
  return `blueplate_user_state_${userId}`;
}

function getLocalImage(item) {
  if (dishImages.has(item.id)) return dishImages.get(item.id);
  if (typeof item.image === "string" && item.image.startsWith("assets/images/")) return item.image;
  return "assets/images/food-fallback.svg";
}

function readAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "[]");
    if (!Array.isArray(accounts)) return [];
    return accounts.filter(account => isRecord(account) && typeof account.id === "string" && typeof account.email === "string" && typeof account.passwordHash === "string" && typeof account.salt === "string");
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  const serialized = JSON.stringify(accounts);
  if (new TextEncoder().encode(serialized).length > 262144) throw new Error("Too many local accounts have been created in this browser.");
  try {
    localStorage.setItem(ACCOUNT_KEY, serialized);
  } catch {
    throw new Error("Your browser could not save this account. Check available site storage and try again.");
  }
}

function getSafeAccount(account) {
  return account ? { id: account.id, name: account.name, email: account.email, phone: account.phone || "" } : null;
}

function createUserId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID().replaceAll("-", "");
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
}

function createSalt() {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return [...bytes].map(value => value.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(value) {
  return new Uint8Array(value.match(/.{1,2}/g).map(part => parseInt(part, 16)));
}

function bytesToHex(value) {
  return [...new Uint8Array(value)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) throw new Error("Account sign-in requires a secure browser connection. Open this website through HTTPS or localhost.");
  const key = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const result = await window.crypto.subtle.deriveBits({ name: "PBKDF2", salt: hexToBytes(salt), iterations: 120000, hash: "SHA-256" }, key, 256);
  return bytesToHex(result);
}

function normalizeProfile(profile) {
  const keys = Object.keys(initialState.profile);
  return Object.fromEntries(keys.map(key => [key, typeof profile?.[key] === "string" ? profile[key].slice(0, 240) : ""]));
}

function readUserState(userId) {
  try {
    const saved = JSON.parse(localStorage.getItem(getUserStorageKey(userId)) || "null");
    if (!isRecord(saved)) return clone(initialState);
    const cart = Array.isArray(saved.cart) ? saved.cart.filter(item =>
      isRecord(item) && typeof item.id === "string" && typeof item.name === "string" &&
      Number.isFinite(item.price) && item.price >= 0 && Number.isInteger(item.quantity) && item.quantity > 0
    ).map(item => ({ ...item, image: getLocalImage(item) })) : [];
    const favorites = Array.isArray(saved.favorites) ? saved.favorites.filter(item => typeof item === "string") : [];
    const orders = Array.isArray(saved.orders) ? saved.orders.filter(order =>
      isRecord(order) && typeof order.id === "string" && Array.isArray(order.items) &&
      isRecord(order.customer) && Number.isFinite(order.total)
    ).map(order => ({
      ...order,
      items: order.items.map(item => isRecord(item) ? { ...item, image: getLocalImage(item) } : item)
    })) : [];
    return { cart, favorites: [...new Set(favorites)], orders, coupon: Object.hasOwn(coupons, saved.coupon) ? saved.coupon : "", profile: normalizeProfile(saved.profile) };
  } catch {
    return clone(initialState);
  }
}

function persist(nextState) {
  if (!activeUserId) throw new Error("Please sign in to save your changes.");
  const serialized = JSON.stringify(nextState);
  const bytes = new TextEncoder().encode(serialized).length;
  if (bytes > MAX_STORAGE_BYTES) throw new Error("Your saved data has reached its 2 MiB limit. Remove some saved items or orders and try again.");
  try {
    localStorage.setItem(getUserStorageKey(activeUserId), serialized);
  } catch {
    throw new Error("Your browser could not save this change. Check available site storage and try again.");
  }
}

function notify() {
  listeners.forEach(listener => listener(clone(state)));
}

window.addEventListener("storage", event => {
  if (!activeUserId || event.key !== getUserStorageKey(activeUserId)) return;
  state = readUserState(activeUserId);
  notify();
});

export function restoreSession() {
  let userId = "";
  try {
    userId = sessionStorage.getItem(SESSION_KEY) || "";
  } catch {
    userId = "";
  }
  const account = readAccounts().find(item => item.id === userId);
  if (!account) {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      userId = "";
    }
    activeUserId = "";
    state = clone(initialState);
    return null;
  }
  activeUserId = account.id;
  state = readUserState(activeUserId);
  return getSafeAccount(account);
}

export async function registerAccount(details) {
  const name = String(details.name || "").trim().slice(0, 70);
  const email = String(details.email || "").trim().toLowerCase();
  const phone = String(details.phone || "").trim().slice(0, 20);
  const password = String(details.password || "");
  if (name.length < 2) throw new Error("Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (password.length < 8) throw new Error("Your password must contain at least 8 characters.");
  const accounts = readAccounts();
  if (accounts.some(account => account.email.toLowerCase() === email)) throw new Error("An account with this email already exists. Please sign in instead.");
  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  const account = { id: createUserId(), name, email, phone, salt, passwordHash, createdAt: new Date().toISOString() };
  saveAccounts([...accounts, account]);
  activeUserId = account.id;
  state = clone(initialState);
  state.profile.name = name;
  state.profile.phone = phone;
  try {
    persist(state);
    sessionStorage.setItem(SESSION_KEY, activeUserId);
  } catch (error) {
    localStorage.removeItem(getUserStorageKey(activeUserId));
    saveAccounts(accounts);
    activeUserId = "";
    state = clone(initialState);
    throw error;
  }
  notify();
  return getSafeAccount(account);
}

export async function loginAccount(details) {
  const email = String(details.email || "").trim().toLowerCase();
  const password = String(details.password || "");
  const account = readAccounts().find(item => item.email.toLowerCase() === email);
  if (!account) throw new Error("We could not find an account with that email address.");
  const passwordHash = await hashPassword(password, account.salt);
  if (passwordHash !== account.passwordHash) throw new Error("That password is incorrect. Please try again.");
  activeUserId = account.id;
  state = readUserState(activeUserId);
  try {
    sessionStorage.setItem(SESSION_KEY, activeUserId);
  } catch {
    activeUserId = "";
    state = clone(initialState);
    throw new Error("Your browser could not start a sign-in session. Check your browser privacy settings.");
  }
  notify();
  return getSafeAccount(account);
}

export function logoutAccount() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    activeUserId = "";
  }
  activeUserId = "";
  state = clone(initialState);
  notify();
}

export function getCurrentAccount() {
  if (!activeUserId) return null;
  return getSafeAccount(readAccounts().find(account => account.id === activeUserId));
}

export function getState() {
  return clone(state);
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateState(updater) {
  if (!activeUserId) throw new Error("Please sign in to save your changes.");
  const next = typeof updater === "function" ? updater(clone(state)) : clone(updater);
  if (!isRecord(next)) throw new Error("This change could not be saved.");
  persist(next);
  state = next;
  notify();
}

export function addToCart(dish, quantity = 1) {
  if (!dish || typeof dish.id !== "string" || !Number.isFinite(dish.price) || dish.price < 0) throw new Error("This item is unavailable right now.");
  const amount = Math.max(1, Math.min(20, Math.floor(Number(quantity) || 1)));
  updateState(current => {
    const existing = current.cart.find(item => item.id === dish.id);
    if (existing) existing.quantity = Math.min(20, existing.quantity + amount);
    else current.cart.push({ id: dish.id, name: dish.name, price: dish.price, image: dish.image, restaurant: dish.restaurant, quantity: amount });
    return current;
  });
}

export function changeQuantity(id, amount) {
  updateState(current => {
    const item = current.cart.find(entry => entry.id === id);
    if (!item || ![-1, 1].includes(amount)) return current;
    item.quantity = Math.max(0, Math.min(20, item.quantity + amount));
    current.cart = current.cart.filter(entry => entry.quantity > 0);
    return current;
  });
}

export function removeFromCart(id) {
  updateState(current => ({ ...current, cart: current.cart.filter(item => item.id !== id) }));
}

export function clearCart() {
  updateState(current => ({ ...current, cart: [], coupon: "" }));
}

export function toggleFavorite(id) {
  updateState(current => ({
    ...current,
    favorites: current.favorites.includes(id) ? current.favorites.filter(item => item !== id) : [...current.favorites, id]
  }));
}

export function validateCoupon(code) {
  const normalized = String(code || "").trim().toUpperCase();
  const coupon = coupons[normalized];
  if (!coupon) return { valid: false, message: "That code is not available. Try WELCOME10 or BLUEPLATE15." };
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (subtotal < coupon.minimum) return { valid: false, message: `Add at least ₹${coupon.minimum} to use ${normalized}.` };
  return { valid: true, code: normalized, message: `${coupon.value}% saving applied.` };
}

export function setCoupon(code) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return updateState(current => ({ ...current, coupon: "" }));
  const result = validateCoupon(normalized);
  if (!result.valid) throw new Error(result.message);
  updateState(current => ({ ...current, coupon: normalized }));
}

export function setProfile(profile) {
  updateState(current => ({ ...current, profile: { ...current.profile, ...normalizeProfile({ ...current.profile, ...profile }) } }));
}

export function saveOrder(order) {
  updateState(current => ({ ...current, orders: [order, ...current.orders], cart: [], coupon: "" }));
}

export function reorderItems(orderId) {
  const order = state.orders.find(entry => entry.id === orderId);
  if (!order) throw new Error("We could not find that order.");
  updateState(current => {
    order.items.forEach(item => {
      const existing = current.cart.find(entry => entry.id === item.id);
      if (existing) existing.quantity = Math.min(20, existing.quantity + item.quantity);
      else current.cart.push({ ...item, image: getLocalImage(item) });
    });
    return current;
  });
}

export function getCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 39;
  const activeCoupon = coupons[state.coupon];
  const discount = activeCoupon && subtotal >= activeCoupon.minimum ? Math.min(Math.round(subtotal * activeCoupon.value / 100), activeCoupon.maximum) : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  return { subtotal, delivery, discount, tax, total: subtotal + delivery + tax - discount };
}

export function deleteAccountData() {
  if (!activeUserId) throw new Error("Please sign in before deleting your account.");
  const userId = activeUserId;
  try {
    localStorage.removeItem(getUserStorageKey(userId));
  } catch {
    throw new Error("Your browser could not remove the saved data. Check your browser settings and try again.");
  }
  const accounts = readAccounts().filter(account => account.id !== userId);
  try {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
  } catch { }
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch { }
  activeUserId = "";
  state = clone(initialState);
  notify();
}
