/* ===================================================
   PAINAP — Scripts v3 (Redesign Final)
   Nav scroll, Reveal, Mobile Menu, Counters,
   Form submit, Mask
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  revealInit();
  navScroll();
  mobileMenu();
  counters();
  waMask();
  formSubmit();
  smoothScroll();
});

/* ------ Scroll Reveal ------ */
function revealInit() {
  const els = document.querySelectorAll('.rv');

  // Initial check
  const check = () => {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.classList.add('on');
      }
    });
  };

  check();
  window.addEventListener('scroll', check, { passive: true });

  // Use Observer for performance if available
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    els.forEach(el => obs.observe(el));
  }
}

/* ------ Sticky Nav ------ */
function navScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  
  const handler = () => {
    nav.classList.toggle('scrolled', window.pageYOffset > 50);
  };
  
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/* ------ Mobile Menu ------ */
function mobileMenu() {
  const burger = document.getElementById('burger');
  const mob    = document.getElementById('mob');
  const close  = document.getElementById('mob-close');
  const links  = document.querySelectorAll('[data-ml]');

  if (!burger || !mob) return;

  burger.addEventListener('click', () => {
    mob.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeMob = () => {
    mob.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (close) close.addEventListener('click', closeMob);
  links.forEach(l => l.addEventListener('click', closeMob));
}

/* ------ Counter Animation ------ */
function counters() {
  const items = document.querySelectorAll('[data-count]');
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(el => obs.observe(el));
}

function animCount(el) {
  const raw = el.getAttribute('data-count');
  const target = parseInt(raw.replace(/\D/g, ''));
  const prefix = raw.includes('+') ? '+' : (raw.includes('-') ? '-' : '');
  const suffix = raw.includes('%') ? '%' : '';
  
  const duration = 2000;
  const start = performance.now();

  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4); // Quart ease out
    const current = Math.floor(eased * target);
    
    el.textContent = prefix + current + suffix;
    
    if (p < 1) requestAnimationFrame(update);
  };
  
  requestAnimationFrame(update);
}

/* ------ WA Mask ------ */
function waMask() {
  const input = document.getElementById('wa');
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
      if (id === '#' || !id.startsWith('#')) return;
      const target = document.querySelector(id);
      if (!target) return;
      
      e.preventDefault();
      const offset = (document.getElementById('nav')?.offsetHeight || 80) + 20;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });
}

/* ------ Form Submit ------ */
function formSubmit() {
  const form = document.getElementById('cform');
  const btn  = document.getElementById('fsubmit');
  if (!form || !btn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const orig = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Simulate async
    setTimeout(() => {
      btn.textContent = '✓ Diagnóstico Solicitado';
      btn.style.background = '#2C6644';
      btn.style.color = '#fff';

      setTimeout(() => {
        form.reset();
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 4000);
    }, 1500);
  });
}
