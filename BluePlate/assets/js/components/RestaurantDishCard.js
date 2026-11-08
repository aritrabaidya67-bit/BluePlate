import { escapeHTML, formatCurrency } from "../utils/helpers.js";

export function RestaurantDishCard(dish, favorite = false, cartQuantity = 0) {
  return `
    <article class="restaurant-menu-item" data-restaurant-dish-card data-search="${escapeHTML(`${dish.name} ${dish.description}`.toLowerCase())}" data-price="${dish.price}" data-rating="${dish.rating}">
      <div class="restaurant-menu-item-image">
        <img src="${escapeHTML(dish.image)}" alt="${escapeHTML(dish.name)}" loading="lazy">
        <span class="food-diet ${dish.vegetarian ? "veg" : "nonveg"}" aria-label="${dish.vegetarian ? "Vegetarian" : "Non vegetarian"}"></span>
        <button class="restaurant-menu-favorite ${favorite ? "is-favorite" : ""}" type="button" data-favorite="${escapeHTML(dish.id)}" aria-label="${favorite ? "Remove from" : "Add to"} favourites" aria-pressed="${favorite}">♥</button>
      </div>
      <div class="restaurant-menu-item-info">
        <div class="restaurant-menu-item-heading">
          <h4>${escapeHTML(dish.name)}</h4>
          <span class="restaurant-menu-rating">★ ${dish.rating.toFixed(1)}</span>
        </div>
        <p>${escapeHTML(dish.description)}</p>
        <div class="restaurant-menu-item-bottom">
          <strong>${formatCurrency(dish.price)}</strong>
          <button class="add-button ${cartQuantity ? "has-cart-quantity" : ""}" type="button" data-add="${escapeHTML(dish.id)}">
            <span>+</span><span data-add-label>${cartQuantity ? `Add (${cartQuantity})` : "Add"}</span>
          </button>
        </div>
      </div>
    </article>`;
}
