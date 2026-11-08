export function AuthScreen(mode = "login") {
  const registerMode = mode === "register";
  return `
    <main class="auth-page">
      <section class="auth-visual">
        <a class="navbar-brand brand-mark auth-brand" href="#"><span class="brand-icon">b</span><span>blueplate<span class="brand-period">.</span></span></a>
        <div class="auth-visual-copy">
          <span class="auth-eyebrow">A BETTER WAY TO FIND YOUR NEXT MEAL</span>
          <h1>Good food<br><span>feels personal.</span></h1>
          <p>Discover neighbourhood kitchens, find something you love and make every meal a little more special.</p>
          <div class="auth-visual-note"><span>✦</span><div><strong>Your favourites, all in one place</strong><small>Sign in to pick up right where you left off.</small></div></div>
        </div>
        <div class="auth-visual-image"><img src="assets/images/food/peri-peri-paneer-burger.jpg" alt="Freshly prepared paneer burger"></div>
        <div class="auth-visual-bottom"><span>FRESHLY MADE</span><span>MADE TO BE ENJOYED</span></div>
      </section>
      <section class="auth-content">
        <div class="auth-card-wrap">
          <div class="auth-mobile-brand"><span class="brand-icon">b</span><span>blueplate<span class="brand-period">.</span></span></div>
          <div class="auth-card">
            <span class="auth-card-kicker">${registerMode ? "YOUR TABLE IS READY" : "WELCOME TO BLUEPLATE"}</span>
            <h2>${registerMode ? "Create your account" : "Welcome back"}</h2>
            <p class="auth-subtitle">${registerMode ? "A few details and you're ready to explore." : "Sign in to see your saved favourites and orders."}</p>
            <div class="auth-message d-none" id="auth-message" role="alert"></div>
            ${registerMode ? `
              <form id="register-form" class="auth-form">
                <div class="auth-field"><label for="register-name">Full name</label><input class="form-control" id="register-name" name="name" type="text" maxlength="70" autocomplete="name" placeholder="Enter your name" required></div>
                <div class="auth-field"><label for="register-email">Email address</label><input class="form-control" id="register-email" name="email" type="email" maxlength="120" autocomplete="email" placeholder="name@example.com" required></div>
                <div class="auth-field"><label for="register-phone">Phone number <span>Optional</span></label><input class="form-control" id="register-phone" name="phone" type="tel" maxlength="20" autocomplete="tel" placeholder="Your contact number"></div>
                <div class="auth-field"><label for="register-password">Create password</label><input class="form-control" id="register-password" name="password" type="password" minlength="8" autocomplete="new-password" placeholder="At least 8 characters" required></div>
                <div class="auth-field"><label for="register-confirm-password">Confirm password</label><input class="form-control" id="register-confirm-password" name="confirmPassword" type="password" minlength="8" autocomplete="new-password" placeholder="Enter your password again" required></div>
                <button class="auth-submit" type="submit">Create account <span>→</span></button>
              </form>
              <p class="auth-switch">Already have an account? <button type="button" data-auth-mode="login">Sign in</button></p>
            ` : `
              <form id="login-form" class="auth-form">
                <div class="auth-field"><label for="login-email">Email address</label><input class="form-control" id="login-email" name="email" type="email" maxlength="120" autocomplete="username" placeholder="name@example.com" required></div>
                <div class="auth-field"><label for="login-password">Password</label><input class="form-control" id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required></div>
                <button class="auth-submit" type="submit">Sign in <span>→</span></button>
              </form>
              <div class="auth-divider"><span>NEW TO BLUEPLATE?</span></div>
              <button class="auth-create-button" type="button" data-auth-mode="register">Create a new account <span>→</span></button>
            `}
            <p class="auth-local-note"><span>▣</span> Your profile and orders stay separate for each account on this browser.</p>
          </div>
          <div class="auth-footer">© 2026 BluePlate · Good food, good mood</div>
        </div>
      </section>
    </main>`;
}
