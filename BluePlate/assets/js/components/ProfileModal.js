export function ProfileModal() {
  return `
    <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content checkout-modal">
          <div class="modal-header">
            <div><span class="drawer-kicker">YOUR DETAILS</span><h2 class="modal-title" id="profileModalTitle">Your profile</h2></div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="profile-account-email"><span>Signed in as</span><strong id="profile-account-email"></strong></div>
            <form id="profile-form" class="row g-3">
              <div class="col-12"><label class="form-label" for="profile-name">Full name</label><input class="form-control" id="profile-name" name="name" maxlength="70" autocomplete="name" required></div>
              <div class="col-12"><label class="form-label" for="profile-phone">Phone number</label><input class="form-control" id="profile-phone" name="phone" type="tel" pattern="[0-9 +\(\)\-]{8,16}" autocomplete="tel" required></div>
              <div class="col-12"><label class="form-label" for="profile-address">Delivery address</label><textarea class="form-control" id="profile-address" name="address" rows="2" maxlength="240" autocomplete="street-address" required></textarea></div>
              <div class="col-md-7"><label class="form-label" for="profile-city">City</label><input class="form-control" id="profile-city" name="city" maxlength="60" autocomplete="address-level2" required></div>
              <div class="col-md-5"><label class="form-label" for="profile-pincode">PIN code</label><input class="form-control" id="profile-pincode" name="pincode" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="postal-code" required></div>
              <div class="col-12"><button class="checkout-button w-100" type="submit">Save my details <span>→</span></button></div>
            </form>
            <details class="data-management-panel">
              <summary>Manage saved data</summary>
              <div class="data-management-content">
                <div class="data-management-actions">
                  <button type="button" class="data-delete-button" data-delete-account>Delete account &amp; clear all data</button>
                </div>
              </div>
            </details>
            <button class="profile-logout-button" type="button" data-logout>Sign out of BluePlate</button>
          </div>
        </div>
      </div>
    </div>`;
}
