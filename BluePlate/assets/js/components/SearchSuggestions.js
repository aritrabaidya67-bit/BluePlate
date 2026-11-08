import { dishes, restaurants } from "../data/menu.js";
import { escapeHTML } from "../utils/helpers.js";

export function SearchSuggestions(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (normalized.length < 2) return "";
  const dishMatches = dishes.filter(item => `${item.name} ${item.restaurant} ${item.category}`.toLowerCase().includes(normalized)).slice(0, 4);
  const restaurantMatches = restaurants.filter(item => `${item.name} ${item.cuisine}`.toLowerCase().includes(normalized)).slice(0, 2);
  if (!dishMatches.length && !restaurantMatches.length) {
    return `<div class="search-suggestions-empty">No close matches. Press Enter to see all results.</div>`;
  }
  return `<div class="search-suggestions-heading">QUICK MATCHES</div>${dishMatches.map(item => `<button class="search-suggestion" type="button" data-search-select="${escapeHTML(item.name)}"><span class="search-suggestion-icon">${item.vegetarian ? "✳" : "✦"}</span><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.restaurant)} · ₹${item.price}</small></span><span class="search-suggestion-type">Dish</span></button>`).join("")}${restaurantMatches.map(item => `<button class="search-suggestion" type="button" data-search-open-restaurant="${escapeHTML(item.id)}"><span class="search-suggestion-icon">⌂</span><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.cuisine)}</small></span><span class="search-suggestion-type">Kitchen</span></button>`).join("")}`;
}
