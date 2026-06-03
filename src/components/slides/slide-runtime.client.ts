/**
 * Slide deck runtime: keyboard navigation, fullscreen, presenter notes.
 * Loaded as a client-side script in SlideLayout.astro.
 */

const slides = document.querySelectorAll<HTMLElement>('[data-slide]');
const counter = document.getElementById('slide-counter');
const notesPanel = document.getElementById('notes-panel');
const notesContent = document.getElementById('notes-content');
const btnPrev = document.getElementById('btn-prev') as HTMLButtonElement | null;
const btnNext = document.getElementById('btn-next') as HTMLButtonElement | null;
const progressBar = document.getElementById('deck-progress');
const totalSlides = slides.length;
let current = 0;

function updateNav() {
  if (btnPrev) btnPrev.disabled = current === 0;
  if (btnNext) btnNext.disabled = current === totalSlides - 1;
  if (progressBar) {
    const pct = totalSlides > 1 ? ((current + 1) / totalSlides) * 100 : 100;
    progressBar.style.width = `${pct}%`;
  }
}

function go(index: number) {
  if (index < 0 || index >= totalSlides) return;
  slides[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  if (counter) counter.textContent = `${current + 1} / ${totalSlides}`;
  updateNav();

  // Update notes
  const note = slides[current].getAttribute('data-note');
  if (notesContent) notesContent.textContent = note || '';
}

function next() { go(current + 1); }
function prev() { go(current - 1); }

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleNotes() {
  notesPanel?.classList.toggle('visible');
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
    case 'PageDown':
      e.preventDefault();
      next();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'PageUp':
      e.preventDefault();
      prev();
      break;
    case 'Home':
      e.preventDefault();
      go(0);
      break;
    case 'End':
      e.preventDefault();
      go(totalSlides - 1);
      break;
    case 'f':
      e.preventDefault();
      toggleFullscreen();
      break;
    case 'n':
      e.preventDefault();
      toggleNotes();
      break;
    case 'Escape':
      if (notesPanel?.classList.contains('visible')) {
        notesPanel.classList.remove('visible');
      }
      break;
  }
});

// Nav button clicks
btnPrev?.addEventListener('click', prev);
btnNext?.addEventListener('click', next);

// Touch swipe support
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
});

// Initialise first slide
go(0);
