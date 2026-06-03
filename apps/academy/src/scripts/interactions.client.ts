// Client-side interactions for academy.wojciech.io.
// Loaded once from Layout via `is:inline` style import.
// Idempotent (each setup checks if already attached).

(() => {
  // --- 1. Reveal on scroll -----------------------------------------------
  // Handled entirely by the inline bootstrap in Layout.astro (runs without a
  // network fetch so above-the-fold content never flashes blank, with a 1.2s
  // safety force-reveal). Intentionally not duplicated here.

  // --- 2. Count-up numbers -----------------------------------------------
  const countEls = document.querySelectorAll<HTMLElement>('[data-count-target]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const fmt = (n: number) => n.toLocaleString('pl-PL');
    const tween = (el: HTMLElement, target: number, dur = 1200, prefix = '', suffix = '') => {
      const start = performance.now();
      const from = 0;
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.round(from + (target - from) * eased);
        el.textContent = prefix + fmt(v) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const target = parseInt(el.dataset.countTarget || '0', 10);
          const prefix = el.dataset.countPrefix || '';
          const suffix = el.dataset.countSuffix || '';
          tween(el, target, 1200, prefix, suffix);
          co.unobserve(el);
        }
      }
    }, { threshold: 0.4 });
    countEls.forEach(el => co.observe(el));
  }

  // --- 3. Pricing toggle -------------------------------------------------
  const toggle = document.querySelector<HTMLElement>('[data-pricing-toggle]');
  if (toggle && !toggle.dataset.bound) {
    toggle.dataset.bound = '1';
    const buttons = toggle.querySelectorAll<HTMLButtonElement>('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode || 'individual';
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll<HTMLElement>('[data-pricing-mode]').forEach(card => {
          card.style.display = card.dataset.pricingMode === mode || card.dataset.pricingMode === 'both' ? '' : 'none';
        });
      });
    });
  }

  // --- 4. Seat calculator ------------------------------------------------
  const calc = document.querySelector<HTMLInputElement>('#ac-seat-slider');
  if (calc && !calc.dataset.bound) {
    calc.dataset.bound = '1';
    const out  = document.querySelector<HTMLElement>('#ac-seat-price');
    const det  = document.querySelector<HTMLElement>('#ac-seat-detail');
    const seatLabel = document.querySelector<HTMLElement>('#ac-seat-count');
    const update = () => {
      const seats = parseInt(calc.value, 10);
      // Tier pricing: 1-5 → 1900 each, 6-10 → 9900 (team), 11-20 → 14900, 21+ enterprise
      let total = 0;
      let detail = '';
      if (seats <= 5) {
        total = seats * 1900;
        detail = `${seats} × indywidualne 1 900 zł`;
      } else if (seats <= 10) {
        total = 9900;
        detail = `Team license: 10 seatów (płacisz tyle samo od 6 do 10)`;
      } else if (seats <= 20) {
        total = 14900;
        detail = `Team license PLUS: do 20 seatów`;
      } else {
        total = -1; // enterprise
        detail = `Enterprise: porozmawiajmy o custom curriculum`;
      }
      if (seatLabel) seatLabel.textContent = String(seats);
      if (out) {
        out.textContent = total === -1
          ? 'Enterprise'
          : `${total.toLocaleString('pl-PL')} zł`;
      }
      if (det) det.textContent = detail;
    };
    calc.addEventListener('input', update);
    update();
  }

  // --- 4b. Terminal typing demo -----------------------------------------
  const term = document.querySelector<HTMLElement>('[data-ac-terminal]');
  const typed = term?.querySelector<HTMLElement>('[data-ac-typed]');
  const body  = term?.querySelector<HTMLElement>('[data-ac-terminal-body]');
  if (term && typed && body && !term.dataset.bound) {
    term.dataset.bound = '1';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cmd = 'score-leads --source=clay --icp=b2b-saas --window=7d';
    const out = [
      '<span class="ac-term-comment"># wzbogacam 248 rekordów, liczę ICP fit + sygnały…</span>',
      '<span class="ac-term-out">{ <span class="k">"sql_ready"</span>: <span class="n">12</span>, <span class="k">"nurture"</span>: <span class="n">34</span>, <span class="k">"drop"</span>: <span class="n">8</span> }</span>',
      '<span class="ac-term-comment"># top lead: <span class="s">"Head of Growth · B2B SaaS · 50-200"</span> &rarr; score <span class="n">90</span></span>',
      '<span class="ac-term-out"><span class="k">→</span> sekwencja outbound wygenerowana · personalizacja gotowa</span>',
    ];

    const cursor = body.querySelector('.ac-term-cursor') as HTMLElement | null;

    const writeOut = () => {
      out.forEach((line, i) => {
        const el = document.createElement('span');
        el.className = 'ac-term-line';
        el.style.opacity = '0';
        el.innerHTML = line;
        body.appendChild(el);
        setTimeout(() => {
          el.style.transition = 'opacity .3s';
          el.style.opacity = '1';
        }, reduce ? 0 : 380 * (i + 1));
      });
    };

    const run = () => {
      if (reduce) {
        typed.textContent = cmd;
        if (cursor) cursor.style.display = 'none';
        writeOut();
        return;
      }
      let i = 0;
      const tick = () => {
        typed.textContent = cmd.slice(0, i);
        if (i++ <= cmd.length) {
          setTimeout(tick, 34 + Math.random() * 40);
        } else {
          if (cursor) cursor.style.display = 'none';
          setTimeout(writeOut, 300);
        }
      };
      tick();
    };

    if ('IntersectionObserver' in window) {
      const to = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { run(); to.disconnect(); }
        }
      }, { threshold: 0.4 });
      to.observe(term);
    } else {
      run();
    }
  }

  // --- 4c. Landing audio sample -----------------------------------------
  document.querySelectorAll<HTMLElement>('[data-ac-audio]').forEach(player => {
    if (player.dataset.bound) return;
    player.dataset.bound = '1';
    const audio = player.querySelector<HTMLAudioElement>('audio');
    const toggle = player.querySelector<HTMLButtonElement>('[data-ac-audio-toggle]');
    const progress = player.querySelector<HTMLElement>('[data-ac-audio-progress]');
    const time = player.querySelector<HTMLElement>('[data-ac-audio-time]');
    const rate = player.querySelector<HTMLButtonElement>('[data-ac-audio-rate]');
    if (!audio || !toggle) return;

    const fmt = (sec: number) => {
      if (!Number.isFinite(sec) || sec < 0) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };
    const render = () => {
      const pct = audio.duration ? Math.min(100, (audio.currentTime / audio.duration) * 100) : 0;
      if (progress) progress.style.width = `${pct}%`;
      if (time) time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
      player.classList.toggle('is-playing', !audio.paused);
      toggle.setAttribute('aria-label', audio.paused ? 'Odtwórz próbkę' : 'Pauza');
    };

    toggle.addEventListener('click', async () => {
      if (audio.paused) {
        try { await audio.play(); } catch {}
      } else {
        audio.pause();
      }
      render();
    });
    player.querySelectorAll<HTMLButtonElement>('[data-ac-audio-skip]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = Number(btn.dataset.acAudioSkip || 0);
        audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + delta));
        render();
      });
    });
    rate?.addEventListener('click', () => {
      const next = audio.playbackRate >= 1.5 ? 1 : audio.playbackRate + 0.25;
      audio.playbackRate = next;
      rate.textContent = `${next.toFixed(2).replace(/\.00$/, '.0')}x`;
    });
    audio.addEventListener('loadedmetadata', render);
    audio.addEventListener('timeupdate', render);
    audio.addEventListener('play', render);
    audio.addEventListener('pause', render);
    audio.addEventListener('ended', render);
    render();
  });

  // --- 5. Enterprise + cohort form submit (Resend audience + email) ------
  document.querySelectorAll<HTMLFormElement>('form[data-ac-form]').forEach(form => {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    const status = form.querySelector<HTMLElement>('.ac-form-status');
    const submit = form.querySelector<HTMLButtonElement>('button[type=submit]');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (submit) { submit.disabled = true; submit.textContent = 'Wysyłam…'; }
      const body = Object.fromEntries(new FormData(form));
      try {
        const r = await fetch(form.action || '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (r.ok) {
          if (status) { status.className = 'ac-form-status ok'; status.textContent = 'Wysłane. Odezwę się w 48h.'; }
          form.reset();
        } else {
          if (status) { status.className = 'ac-form-status err'; status.textContent = 'Coś poszło nie tak. Napisz na hello@wojciech.io.'; }
        }
      } catch {
        if (status) { status.className = 'ac-form-status err'; status.textContent = 'Brak połączenia. Spróbuj jeszcze raz.'; }
      } finally {
        if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || 'Wyślij'; }
      }
    });
  });

  // --- 6. Stripe Checkout ------------------------------------------------
  document.querySelectorAll<HTMLFormElement>('form[data-checkout-form]').forEach(form => {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    const status = form.querySelector<HTMLElement>('.ac-form-status');
    const submit = form.querySelector<HTMLButtonElement>('button[type=submit]');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (submit) { submit.disabled = true; submit.textContent = 'Tworzę checkout…'; }
      const body = Object.fromEntries(new FormData(form));
      try {
        const r = await fetch(form.action || '/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await r.json() as Record<string, string>;
        if (r.ok && data.url) {
          window.location.href = data.url;
          return;
        }
        if (status) {
          status.className = 'ac-form-status err';
          status.textContent = data.error === 'stripe-not-configured'
            ? 'Stripe nie jest jeszcze skonfigurowany w Cloudflare.'
            : 'Nie udało się utworzyć checkoutu. Napisz na hello@wojciech.io.';
        }
      } catch {
        if (status) { status.className = 'ac-form-status err'; status.textContent = 'Brak połączenia. Spróbuj jeszcze raz.'; }
      } finally {
        if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || 'Przejdź do Stripe'; }
      }
    });
  });

  // --- 7. Magic-link login ----------------------------------------------
  document.querySelectorAll<HTMLFormElement>('form[data-login-form]').forEach(form => {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    const status = form.querySelector<HTMLElement>('.ac-form-status');
    const submit = form.querySelector<HTMLButtonElement>('button[type=submit]');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (submit) { submit.disabled = true; submit.textContent = 'Wysyłam…'; }
      const body = Object.fromEntries(new FormData(form));
      try {
        const r = await fetch(form.action || '/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await r.json() as Record<string, string | boolean>;
        if (r.ok) {
          if (status) {
            status.className = data.sent === false ? 'ac-form-status err' : 'ac-form-status ok';
            status.innerHTML = data.debug_link
              ? `Link testowy: <a href="${data.debug_link}">otwórz panel</a>`
              : data.sent === false
                ? 'Dostęp jest aktywny, ale wysyłka emaili nie jest jeszcze skonfigurowana. Napisz na hello@wojciech.io, aktywuję wejście ręcznie.'
                : 'Wysłane. Sprawdź email i kliknij link do panelu.';
          }
        } else if (status) {
          status.className = 'ac-form-status err';
          status.textContent = data.error === 'not-a-member'
            ? 'Nie widzę aktywnego dostępu dla tego emaila. Jeśli właśnie płaciłeś, odczekaj chwilę albo napisz na hello@wojciech.io.'
            : 'Nie udało się wysłać linku. Napisz na hello@wojciech.io.';
        }
      } catch {
        if (status) { status.className = 'ac-form-status err'; status.textContent = 'Brak połączenia. Spróbuj jeszcze raz.'; }
      } finally {
        if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || 'Wyślij'; }
      }
    });
  });

  // --- 8. Logout ---------------------------------------------------------
  document.querySelectorAll<HTMLButtonElement>('[data-logout]').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', async () => {
      await fetch('/api/auth', { method: 'DELETE' });
      window.location.href = '/login';
    });
  });
})();
