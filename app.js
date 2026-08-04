// ── SIDEBAR TOGGLE ────────────────────────────────────────────────────────────
const sidebar    = document.getElementById('sidebar');
const hamburger  = document.getElementById('hamburger');
const sidebarClose = document.getElementById('sidebarClose');
const overlay    = document.getElementById('overlay');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburger)    hamburger.addEventListener('click', openSidebar);
if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
if (overlay)      overlay.addEventListener('click', closeSidebar);

// Close sidebar on nav link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) closeSidebar();
  });
});

// ── ACTIVE NAV ON SCROLL ──────────────────────────────────────────────────────
const sections = document.querySelectorAll('.content-section[id]');
const navLinks  = document.querySelectorAll('.nav-link[data-section]');

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -70% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === id) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ── ATTRACTIONS FILTER ────────────────────────────────────────────────────────
const filterBtns      = document.querySelectorAll('.filter-btn');
const attractionCards = document.querySelectorAll('.attraction-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    attractionCards.forEach(card => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        const types = card.getAttribute('data-type') || '';
        if (types.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      }
    });
  });
});

// ── SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const topbarHeight = window.innerWidth <= 900 ? 56 : 0;
    const offsetTop    = target.getBoundingClientRect().top + window.scrollY - topbarHeight - 20;

    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});

// ── PROGRESS INDICATOR ────────────────────────────────────────────────────────
// Adds a thin green progress bar at top of viewport as you scroll
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #52B788, #D4A017);
  z-index: 9999;
  width: 0%;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = Math.min(progress, 100) + '%';
}, { passive: true });

// ── CARD ENTRANCE ANIMATION ───────────────────────────────────────────────────
const animTargets = document.querySelectorAll(
  '.card, .attraction-card, .town-card, .fact-card, .route-card, .formula-step'
);

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = entry.target.style.transform.replace('translateY(18px)', 'translateY(0)');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

animTargets.forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(18px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s, transform 0.2s';
  animObserver.observe(el);
});

// ── KEYBOARD NAV ──────────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('open')) {
    closeSidebar();
  }
});

// ── TOUCH SWIPE TO CLOSE SIDEBAR ─────────────────────────────────────────────
let touchStartX = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (diff > 60 && sidebar.classList.contains('open')) {
    closeSidebar();
  }
}, { passive: true });

// ── READING PROGRESS PER SECTION (sidebar indicator dots) ────────────────────
// Adds subtle visited indicators to nav links
const visitedSections = new Set();

const visitObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      if (id && !visitedSections.has(id)) {
        visitedSections.add(id);
        const link = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (link) {
          const dot = document.createElement('span');
          dot.style.cssText = `
            display: inline-block;
            width: 6px; height: 6px;
            background: #52B788;
            border-radius: 50%;
            margin-left: auto;
            flex-shrink: 0;
            opacity: 0.7;
          `;
          // Only add dot if badge not already there
          if (!link.querySelector('.nav-badge') && !link.querySelector('span[style]')) {
            link.appendChild(dot);
          }
        }
      }
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => visitObserver.observe(section));
