export function Navbar() {
  return `
    <nav class="navbar navbar-expand-lg site-navbar sticky-top">
      <div class="container nav-container">
        <a class="navbar-brand brand-mark" href="#home" aria-label="BluePlate home"><span class="brand-icon">b</span><span>blueplate<span class="brand-period">.</span></span></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav mx-auto align-items-lg-center gap-lg-2">
            <li class="nav-item"><a class="nav-link active" href="#home">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#restaurants">Restaurants</a></li>
            <li class="nav-item"><a class="nav-link" href="#menu">Discover food</a></li>
            <li class="nav-item"><a class="nav-link" href="#offers">Offers</a></li>
            <li class="nav-item"><button class="nav-link nav-orders-link" type="button" data-open-orders>My orders</button></li>
          </ul>
          <div class="nav-actions d-flex align-items-center gap-2">
            <button class="icon-button search-toggle" type="button" aria-label="Focus search" data-scroll-search><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg></button>
            <button class="icon-button favorite-nav-button" type="button" data-category-filter="saved" aria-label="Show your favourites"><span>♥</span><b id="favorite-count">0</b></button>
            <button class="profile-nav-button" type="button" data-open-profile aria-label="Your profile"><span>☺</span><span class="profile-nav-label" id="profile-nav-label">Profile</span></button>
            <button class="cart-nav-button" type="button" data-bs-toggle="offcanvas" data-bs-target="#cartDrawer" aria-controls="cartDrawer"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6"></path><circle cx="10" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle></svg><span>Cart</span><b id="nav-cart-count">0</b></button>
          </div>
        </div>
      </div>
    </nav>`;
}
