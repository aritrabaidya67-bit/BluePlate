export function RestaurantModal() {
  return `
    <div class="modal fade" id="restaurantModal" tabindex="-1" aria-labelledby="restaurantModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div class="modal-content restaurant-detail-modal">
          <div class="modal-header restaurant-modal-header">
            <div>
              <span class="drawer-kicker">EXPLORE THE KITCHEN</span>
              <h2 class="modal-title" id="restaurantModalTitle">Restaurant menu</h2>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="restaurant-detail-content"></div>
        </div>
      </div>
    </div>`;
}
