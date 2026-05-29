# Wzorce optymalizacji landing page

## 1. Naprawianie hover kolor CTA button

```css
/* PRZED */
.btn-accent:hover { background: #b15634; }

/* PO — ciemniejsza wersja koloru accent */
.btn-accent:hover { background: #c9a030; }
```

## 2. Mobile menu — drawer z backdrop

```html
<!-- Przycisk hamburger -->
<button class="hamburger" id="hamburger-btn" aria-label="Otwórz menu" aria-expanded="false" aria-controls="mobile-drawer">
  <i data-lucide="menu"></i>
</button>

<!-- Drawer -->
<div class="mobile-drawer" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu nawigacyjne" hidden>
  <div class="drawer-backdrop" id="drawer-backdrop"></div>
  <nav class="drawer-nav">
    <button class="drawer-close" id="drawer-close" aria-label="Zamknij menu">
      <i data-lucide="x"></i>
    </button>
    <ul class="drawer-links">
      <!-- linki nawigacyjne -->
    </ul>
    <div class="drawer-cta">
      <a href="tel:..." class="btn btn-outline">Zadzwoń</a>
      <a href="..." class="btn btn-accent">Umów wizytę</a>
    </div>
  </nav>
</div>
```

```css
.mobile-drawer { position: fixed; inset: 0; z-index: 200; display: none; }
.mobile-drawer:not([hidden]) { display: block; }
.drawer-backdrop {
  position: absolute; inset: 0;
  background: rgba(26, 39, 51, 0.5);
  backdrop-filter: blur(4px);
  animation: backdropIn .3s ease;
}
.drawer-nav {
  position: absolute; right: 0; top: 0; bottom: 0;
  width: min(320px, 90vw);
  background: var(--cream);
  padding: 24px;
  display: flex; flex-direction: column; gap: 24px;
  animation: drawerIn .35s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
}
@keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
```

```js
const hamburger = document.getElementById('hamburger-btn');
const drawer = document.getElementById('mobile-drawer');
const drawerClose = document.getElementById('drawer-close');
const backdrop = document.getElementById('drawer-backdrop');

function openDrawer() {
  drawer.hidden = false;
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.querySelector('i').setAttribute('data-lucide', 'x');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
  drawerClose.focus();
}

function closeDrawer() {
  drawer.hidden = true;
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.querySelector('i').setAttribute('data-lucide', 'menu');
  document.body.style.overflow = '';
  lucide.createIcons();
  hamburger.focus();
}

hamburger.addEventListener('click', () => drawer.hidden ? openDrawer() : closeDrawer());
drawerClose.addEventListener('click', closeDrawer);
backdrop.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });
// Zamknij drawer po kliknięciu linka nawigacyjnego
drawer.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeDrawer));
```

## 3. Form success state (bez alert())

```html
<form class="contact-form" id="contact-form" action="#" method="POST">
  <!-- pola formularza -->
  <button type="submit" class="btn btn-primary">Wyślij <i data-lucide="send"></i></button>
</form>
<div class="form-success" id="form-success" hidden>
  <div class="form-success-icon"><i data-lucide="circle-check-big"></i></div>
  <h3>Wiadomość wysłana!</h3>
  <p>Odpowiem tego samego dnia roboczego. Jeśli sprawa pilna — zadzwoń.</p>
  <a href="tel:+48789565658" class="btn btn-outline">Zadzwoń teraz</a>
</div>
```

```css
.form-success {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center;
  padding: 48px 32px; gap: 16px; min-height: 320px;
}
.form-success[hidden] { display: none; }
.form-success-icon { color: var(--accent); }
.form-success-icon i { width: 56px; height: 56px; }
.form-success h3 { color: var(--primary); }
.form-success p { color: var(--ink-soft); }
```

```js
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  // Tu podepnij fetch do Formspree: fetch('https://formspree.io/f/XXXXXX', {method:'POST', body: new FormData(this)})
  this.hidden = true;
  document.getElementById('form-success').hidden = false;
  lucide.createIcons();
});
```

## 4. IntersectionObserver scroll reveal

```css
.is-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .55s ease, transform .55s ease;
}
.is-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
/* Stagger dla dzieci (feature-card, service-card, review-card) */
.is-reveal:nth-child(1) { transition-delay: 0ms; }
.is-reveal:nth-child(2) { transition-delay: 100ms; }
.is-reveal:nth-child(3) { transition-delay: 200ms; }
.is-reveal:nth-child(4) { transition-delay: 100ms; }
.is-reveal:nth-child(5) { transition-delay: 200ms; }
.is-reveal:nth-child(6) { transition-delay: 300ms; }
```

```js
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card, .service-card, .review-card, .step, .section-head, .about-grid, .office-grid, .contact-grid').forEach(el => {
  el.classList.add('is-reveal');
  revealObserver.observe(el);
});
```

## 5. Counter-up animacja

```js
function animateCounter(el) {
  const target = parseInt(el.dataset.count || el.textContent.replace(/\D/g, ''));
  const suffix = el.dataset.suffix || el.textContent.replace(/[0-9]/g, '');
  if (!target) return;
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Ustaw data-count i data-suffix przed obserwacją
document.querySelectorAll('.trust-num').forEach(el => {
  const numMatch = el.textContent.match(/\d+/);
  if (numMatch) {
    el.dataset.count = numMatch[0];
    el.dataset.suffix = el.textContent.replace(/\d+/, '');
    counterObserver.observe(el);
  }
});
```

## 6. Scrollspy

```js
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));
```

```css
.nav-menu a.active::after { width: 100%; }
```

## 7. Gallery lightbox

```html
<!-- Overlay lightbox -->
<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="Podgląd zdjęcia">
  <button class="lightbox-close" id="lightbox-close" aria-label="Zamknij">
    <i data-lucide="x"></i>
  </button>
  <img class="lightbox-img" id="lightbox-img" src="" alt="">
</div>
```

```css
.lightbox {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(26, 39, 51, 0.9);
  backdrop-filter: blur(8px);
  display: grid; place-items: center;
  padding: 24px;
  cursor: zoom-out;
  animation: backdropIn .25s ease;
}
.lightbox[hidden] { display: none; }
.lightbox-img { max-width: 100%; max-height: 90vh; border-radius: 8px; object-fit: contain; }
.lightbox-close {
  position: absolute; top: 20px; right: 20px;
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(245, 239, 230, 0.15);
  color: var(--cream); display: grid; place-items: center;
  cursor: pointer;
}
```

```js
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.office-gallery a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    lightboxImg.src = a.href;
    lightboxImg.alt = a.querySelector('img').alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
    document.getElementById('lightbox-close').focus();
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });
```

## 8. Preload hero image

```html
<!-- W <head>, zaraz po <link rel="preconnect"> -->
<link rel="preload" as="image" href="assets/img/hero-portrait.jpg" fetchpriority="high">
```

## 9. Pinned Lucide version

```html
<!-- PRZED -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>

<!-- PO -->
<script src="https://unpkg.com/lucide@0.484.0/dist/umd/lucide.min.js"
        integrity="sha256-placeholder-dodaj-po-pobraniu-lokalnie"
        crossorigin="anonymous" defer></script>
<!-- LUB lokalnie: <script src="assets/js/lucide.min.js" defer></script> -->
```

## 10. Godziny pracy — meta-item

```html
<div class="meta-item">
  <div class="meta-icon"><i data-lucide="clock"></i></div>
  <div>
    <h4>Godziny przyjęć</h4>
    <p>Pon.–Pt.: 8:00–16:00<br>Niedz./święta: ograniczone terminy</p>
  </div>
</div>
```
