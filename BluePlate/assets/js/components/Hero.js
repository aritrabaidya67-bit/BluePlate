export function Hero() {
  return `
    <section class="hero-section" id="home">
      <div class="hero-orb hero-orb-one"></div><div class="hero-orb hero-orb-two"></div>
      <div class="container hero-container">
        <div class="row align-items-center gy-5">
          <div class="col-lg-6 hero-copy-wrap">
            <div class="eyebrow reveal-up"><span class="eyebrow-spark">✦</span> GOOD FOOD. ZERO FUSS.</div>
            <h1 class="hero-title reveal-up delay-1">A little joy,<br><span>delivered daily.</span></h1>
            <p class="hero-description reveal-up delay-2">From comfort-food classics to something new, find your next favourite bite right around the corner.</p>
            <div class="hero-search-wrap reveal-up delay-3">
              <form class="hero-search" id="hero-search-form" role="search">
                <span class="search-pin">⌕</span><input id="hero-search" type="search" placeholder="Dishes, restaurants, cravings..." aria-label="Search food or restaurants" autocomplete="off" aria-controls="search-suggestions" aria-expanded="false"><button type="submit" aria-label="Search">Find food <span>→</span></button>
              </form>
              <div class="search-suggestions d-none" id="search-suggestions" role="listbox"></div>
            </div><div class="search-hint reveal-up delay-3"><span>Popular:</span><button type="button" data-search-term="pizza">Pizza</button><button type="button" data-search-term="biryani">Biryani</button><button type="button" data-search-term="burger">Burgers</button><button type="button" data-search-term="dessert">Desserts</button></div>
            <div class="hero-meta reveal-up delay-3"><div class="avatar-stack"><span>👩🏽</span><span>👨🏻</span><span>👩🏼</span></div><div><strong>Loved by food people</strong><small>Fresh choices. Happy customers.</small></div><div class="hero-rating"><b>★ 4.8</b><small>average rating</small></div></div>
          </div>
          <div class="col-lg-6 hero-visual-wrap">
            <div class="hero-visual reveal-scale">
              <div class="hero-image-frame"><img src="assets/images/food/restaurant-interior.jpg" alt="A warmly lit restaurant dining room" fetchpriority="high"></div>
              <div class="hero-image-shade"></div>
              <div class="floating-note note-delivery"><span class="note-icon">↗</span><span><strong>On its way</strong><small>Something delicious</small></span><i></i></div>
              <div class="floating-note note-time"><span class="time-icon">◷</span><span><strong>25–35 min</strong><small>Average delivery</small></span></div>
              <div class="hero-sticker"><span>made with</span><b>♥</b><span>goodness</span></div>
            </div>
            <div class="hero-caption"><span>01 / 04</span><span class="caption-line"></span><span>THE GOOD FOOD EDIT</span></div>
          </div>
        </div>
      </div>
      <div class="hero-bottom-line"></div>
    </section>`;
}
