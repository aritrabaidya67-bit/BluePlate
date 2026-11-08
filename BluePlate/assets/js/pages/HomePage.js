import { categories, dishes, restaurants } from "../data/menu.js";
import { FoodCard } from "../components/FoodCard.js";
import { RestaurantCard } from "../components/RestaurantCard.js";
import { getState } from "../state/store.js";

export function HomePage() {
  const favorites = getState().favorites;

  return `
    <main>
      <section class="container category-section" id="categories">
        <div class="category-heading">
          <div>
            <span class="section-kicker">WHAT ARE YOU IN THE MOOD FOR?</span>
            <h2 class="section-title">Follow your <span>craving.</span></h2>
          </div>
          <a class="text-link" href="#menu">Explore everything <span>↗</span></a>
        </div>

        <div class="category-list">
          ${categories.map(category => `
            <button
              class="category-pill ${category.id === "all" ? "active" : ""}"
              type="button"
              data-category-filter="${category.id}"
            >
              <span>${category.icon}</span>
              ${category.label}
            </button>
          `).join("")}
        </div>
      </section>

      <section class="section-block menu-section" id="menu">
        <div class="container">
          <div class="section-heading-row">
            <div>
              <span class="section-kicker">A FEW VERY GOOD IDEAS</span>
              <h2 class="section-title">The <span>crave list.</span></h2>
              <p class="section-subtitle">Big flavours, little moments. Find a new favourite or return to a classic.</p>
            </div>

            <div class="menu-controls">
              <span class="fresh-indicator"><i></i> Fresh picks</span>
              <select id="menu-sort" class="form-select form-select-sm" aria-label="Sort menu">
                <option value="popular">Most loved</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name: A to Z</option>
                <option value="fastest">Ready fastest</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>

          <div class="filter-toolbar">
            <div class="filter-result-count">
              <strong id="results-count">${dishes.length}</strong>
              delicious choices
              <span id="filter-state-label">· handpicked for you</span>
            </div>

            <div class="filter-options">
              <label class="veg-toggle">
                <input id="veg-filter" type="checkbox">
                <span class="toggle-track"></span>
                <span>Vegetarian only</span>
              </label>

              <select id="price-filter" class="form-select form-select-sm" aria-label="Filter by maximum price">
                <option value="all">Any price</option>
                <option value="200">Under ₹200</option>
                <option value="300">Under ₹300</option>
                <option value="500">Under ₹500</option>
              </select>

              <select id="rating-filter" class="form-select form-select-sm" aria-label="Filter by minimum rating">
                <option value="0">Any rating</option>
                <option value="4.5">4.5+ rating</option>
                <option value="4.7">4.7+ rating</option>
                <option value="4.8">4.8+ rating</option>
              </select>

              <button class="filter-clear" type="button" data-reset-filters>Clear filters</button>
            </div>
          </div>

          <div class="row g-4" id="food-grid">
            ${dishes.map(dish => `
              <div class="col-sm-6 col-lg-3">
                ${FoodCard(dish, favorites.includes(dish.id))}
              </div>
            `).join("")}
          </div>

          <div id="no-food-results" class="no-results d-none">
            <span>⌕</span>
            <h3>No bites found just yet.</h3>
            <p>Try another search or adjust your filters.</p>
            <button class="btn btn-outline-primary rounded-pill" type="button" data-reset-filters>Clear filters</button>
          </div>

          <div class="section-bottom-action">
            <button class="outline-cta" type="button" data-reset-filters>
              Explore all dishes <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <section class="offer-section" id="offers">
        <div class="container">
          <div class="offer-panel">
            <div class="offer-text">
              <span class="offer-eyebrow"><i></i> A LITTLE TREAT FROM US</span>
              <h2>Your next favourite<br>comes with <em>10% off.</em></h2>
              <p>Make room for one more delicious thing. Use the code below on your next order.</p>

              <div class="offer-code-row">
                <span class="offer-code">WELCOME10</span>
                <button type="button" data-copy-coupon data-coupon-code="WELCOME10">Copy code <span>⌁</span></button>
              </div>

              <div class="offer-code-secondary">
                <span>Order above ₹499? Use <strong>BLUEPLATE15</strong> for 15% off up to ₹150.</span>
                <button type="button" data-copy-coupon data-coupon-code="BLUEPLATE15">Copy offer</button>
              </div>
            </div>

            <div class="offer-art">
              <div class="offer-art-circle"></div>
              <img src="assets/images/food/pizza.jpg" alt="Freshly baked pizza topped with vegetables" loading="lazy">
              <span class="offer-stamp">A GOOD<br>DEAL <b>✦</b></span>
            </div>

            <div class="offer-footnote">*WELCOME10: up to ₹100 off. Minimum order ₹199.</div>
          </div>
        </div>
      </section>

      <section class="section-block restaurant-section" id="restaurants">
        <div class="container">
          <div class="section-heading-row">
            <div>
              <span class="section-kicker">THE NEIGHBOURHOOD FAVOURITES</span>
              <h2 class="section-title">Good places. <span>Great plates.</span></h2>
              <p class="section-subtitle">Meet the kitchens making your everyday a little more delicious.</p>
            </div>
            <a class="outline-cta desktop-only" href="#menu">Explore the menu <span>→</span></a>
          </div>

          <div class="row g-4" id="restaurant-grid">
            ${restaurants.map(restaurant => {
              const itemCount = dishes.filter(dish => dish.restaurant === restaurant.name).length;
              return `
                <div class="col-md-6 col-xl-4">
                  ${RestaurantCard(restaurant, itemCount)}
                </div>
              `;
            }).join("")}
          </div>

          <div id="no-restaurant-results" class="no-results d-none">
            <h3>No restaurants match that search.</h3>
            <p>Try a different name or cuisine.</p>
          </div>
        </div>
      </section>

      <section class="taste-section">
        <div class="container">
          <div class="taste-heading">
            <span class="section-kicker">A LITTLE SOMETHING FOR EVERYONE</span>
            <h2 class="section-title">Made for every <span>kind of craving.</span></h2>
          </div>

          <div class="taste-grid">
            <article class="taste-card taste-card-large">
              <img src="assets/images/food/restaurant-interior.jpg" alt="Warmly lit restaurant dining room" loading="lazy">
              <div>
                <span>THE EVERYDAY EDIT</span>
                <h3>Fresh choices,<br>full of flavour.</h3>
                <a href="#menu" data-category-shortcut="healthy">Find your fresh <b>↗</b></a>
              </div>
            </article>

            <article class="taste-card taste-card-small">
              <img src="assets/images/food/burger.jpg" alt="Juicy double burger" loading="lazy">
              <div>
                <span>THE COMFORT CLUB</span>
                <h3>Big bites.<br>Good times.</h3>
                <a href="#menu" data-category-shortcut="burger">Get your fix <b>↗</b></a>
              </div>
            </article>

            <article class="taste-card taste-card-small taste-card-dessert">
              <img src="assets/images/food/chocolate-cake.jpg" alt="Chocolate layer cake" loading="lazy">
              <div>
                <span>SAVE ROOM</span>
                <h3>Life is short.<br>Get dessert.</h3>
                <a href="#menu" data-category-shortcut="dessert">Treat yourself <b>↗</b></a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="steps-section" id="steps">
        <div class="container">
          <div class="steps-header">
            <span class="section-kicker">AS EASY AS ONE, TWO, EAT</span>
            <h2 class="section-title">Good food is <span>three taps away.</span></h2>
          </div>

          <div class="row g-4">
            <div class="col-md-4">
              <article class="step-card">
                <span class="step-number">01</span>
                <div class="step-icon step-icon-blue">⌕</div>
                <h3>Find your thing</h3>
                <p>Browse local favourites or search for exactly what you're craving.</p>
              </article>
            </div>

            <div class="col-md-4">
              <article class="step-card">
                <span class="step-number">02</span>
                <div class="step-icon step-icon-peach">＋</div>
                <h3>Make it yours</h3>
                <p>Pick your dishes, save favourites and build your perfect order.</p>
              </article>
            </div>

            <div class="col-md-4">
              <article class="step-card">
                <span class="step-number">03</span>
                <div class="step-icon step-icon-green">⌁</div>
                <h3>Enjoy the good bit</h3>
                <p>Choose how you would like to pay and keep your order details close.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="closing-cta">
        <div class="container">
          <div class="closing-card">
            <div>
              <span class="section-kicker">YOUR TABLE IS WAITING</span>
              <h2>Let the good food<br><span>find its way to you.</span></h2>
              <a class="closing-button" href="#menu">Explore the menu <span>→</span></a>
            </div>

            <div class="closing-decoration">
              <div class="closing-ring"></div>
              <span>GOOD<br>MOOD<br>FOOD.</span>
            </div>
          </div>
        </div>
      </section>
    </main>`;
}
