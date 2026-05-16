/* ============================================================
   SIZZLE & SEAR – menu.js
   ============================================================ */

'use strict';

/* ---------- Navbar scroll ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---------- Hamburger ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    })
  );
}

/* ---------- Toast ---------- */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ---------- Cart ---------- */
let cartCount = 0;
const cartCountEl = document.querySelector('.cart-count');
function updateCart() {
  cartCount++;
  cartCountEl.textContent = cartCount;
  cartCountEl.style.transform = 'scale(1.5)';
  setTimeout(() => { cartCountEl.style.transform = ''; }, 250);
}

/* ---------- Category Tabs → smooth scroll ---------- */
const tabs = document.querySelectorAll('.tab-btn');
const tabsWrap = document.getElementById('menu-tabs-wrap');

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    const target = document.getElementById(btn.dataset.target);
    if (!target) return;

    const offset = tabsWrap.offsetHeight + navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Highlight active tab on scroll ---------- */
const sections = document.querySelectorAll('.menu-section');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tabs.forEach(t => t.classList.remove('active'));
      const match = document.querySelector(`.tab-btn[data-target="${entry.target.id}"]`);
      if (match) {
        match.classList.add('active');
        /* scroll tab into view horizontally */
        match.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
      }
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => sectionObs.observe(s));

/* ---------- Add to cart – burger cards ---------- */
document.querySelectorAll('.burger-card, .side-card, .drink-card').forEach(card => {
  /* inject button */
  const name  = card.dataset.name;
  const price = card.dataset.price;
  if (!name) return;

  /* Para drink-cards con overlay, añadir botón al overlay */
  const overlay = card.querySelector('.drink-card__overlay, .drink-card__flat-body');
  const body    = card.querySelector('.burger-card__body, .side-card__body');
  const target  = overlay || body;
  if (!target) return;

  const btn = document.createElement('button');
  btn.className = 'btn btn-outline btn-sm add-cart-menu';
  btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Agregar`;
  btn.style.marginTop = '10px';
  btn.style.width = 'auto';
  btn.style.justifyContent = 'center';
  target.appendChild(btn);

  btn.addEventListener('click', () => {
    updateCart();
    showToast(`🍔 "${name}" agregado al carrito`);
    btn.disabled = true;
    btn.textContent = '✓ Listo';
    btn.style.background = '#27ae60';
    btn.style.borderColor = '#27ae60';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Agregar`;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 1500);
  });
});

/* ---------- Float Order button ---------- */
const floatOrder = document.getElementById('floatOrder');
if (floatOrder) {
  floatOrder.addEventListener('click', () => {
    showToast('¡Visita una de nuestras sedes para ordenar! 🔥');
  });
}

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const idx = [...reveals].indexOf(entry.target);
      entry.target.style.transitionDelay = `${(idx % 3) * 90}ms`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObs.observe(el));
