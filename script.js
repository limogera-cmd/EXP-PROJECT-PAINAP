/* ============================================
   PAINAP — Scripts v2
   Nav scroll, Reveal, Mobile Menu, Counters,
   Phone mask, Form submit
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  revealInit();
  navScroll();
  mobileMenu();
  counters();
  phoneMask();
  formSubmit();
  smoothScroll();
});

/* ------ Scroll Reveal ------ */
function revealInit() {
  const els = document.querySelectorAll('.r');

  // Trigger hero elements immediately (above fold)
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setTimeout(() => el.classList.add('on'), 80);
    }
  });

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('on'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => {
    if (!el.classList.contains('on')) obs.observe(el);
  });
}

/* ------ Sticky Nav ------ */
function navScroll() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.pageYOffset > 50);
  }, { passive: true });
}

/* ------ Mobile Menu ------ */
function mobileMenu() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mob-menu');
  const close  = document.getElementById('mob-close');
  const links  = menu.querySelectorAll('[data-ml]');

  if (!burger) return;

  burger.addEventListener('click', () => {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMob() {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  close.addEventListener('click', closeMob);
  links.forEach(l => l.addEventListener('click', closeMob));
}

/* ------ Counter Animation ------ */
function counters() {
  const items = document.querySelectorAll('[data-count]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  items.forEach(el => obs.observe(el));
}

function animCount(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const prefix = el.textContent.trim().startsWith('-') ? '-' : '+';
  const duration = 1800;
  const start = performance.now();

  (function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(update);
  })(start);
}

/* ------ Phone Mask ------ */
function phoneMask() {
  const input = document.getElementById('whatsapp');
  if (!input) return;

  input.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length) v = `(${v}`;
    e.target.value = v;
  });
}

/* ------ Smooth Scroll ------ */
function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('nav').offsetHeight + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
    });
  });
}

/* ------ Form Submit ------ */
function formSubmit() {
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('form-submit');
  if (!form || !btn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const orig = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Simulate async (replace with real API call)
    setTimeout(() => {
      btn.textContent = '✓ Solicitação enviada!';
      btn.style.background = '#2C6644';

      setTimeout(() => {
        form.reset();
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
      }, 3500);
    }, 1400);
  });
}
