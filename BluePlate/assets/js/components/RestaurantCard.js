import { escapeHTML } from "../utils/helpers.js";

export function RestaurantCard(restaurant, itemCount = 0) {
  return `
    <article class="restaurant-card reveal-up" data-restaurant-card data-open-restaurant="${escapeHTML(restaurant.id)}" role="button" data-restaurant-id="${escapeHTML(restaurant.id)}" data-search="${escapeHTML(`${restaurant.name} ${restaurant.cuisine}`.toLowerCase())}" tabindex="0" aria-label="Open ${escapeHTML(restaurant.name)} menu">
      <div class="restaurant-image">
        <img src="${escapeHTML(restaurant.image)}" alt="Food from ${escapeHTML(restaurant.name)}" loading="lazy">
        <span class="restaurant-tag">${escapeHTML(restaurant.tag)}</span>
        <span class="restaurant-time">◷ ${escapeHTML(restaurant.time)}</span>
      </div>
      <div class="restaurant-info">
        <div>
          <h3>${escapeHTML(restaurant.name)}</h3>
          <p>${escapeHTML(restaurant.cuisine)}</p>
        </div>
        <span class="restaurant-rating">★ ${restaurant.rating.toFixed(1)} <small>(${escapeHTML(restaurant.reviews)})</small></span>
      </div>
      <div class="restaurant-foot">
        <span>${itemCount} menu items · ${escapeHTML(restaurant.fee)}</span>
        <span class="restaurant-open-label">View menu <b>↗</b></span>
      </div>
    </article>`;
}
