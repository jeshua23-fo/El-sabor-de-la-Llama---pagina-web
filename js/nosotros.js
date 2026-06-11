/* ============================================================
   SIZZLE & SEAR – about.js
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

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 100}ms`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObs.observe(el));

/* ---------- Hero parallax ---------- */
const heroBg = document.querySelector('.ab-hero__img');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${y * 0.18}px)`;
  }
}, { passive: true });

/* ---------- Team cards: color reveal on hover ---------- */
// Already handled by CSS filter transition

/* ---------- Counters animation for stats (if any) ---------- */
function animateValue(el, start, end, duration) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    el.textContent = el.dataset.suffix ? value + el.dataset.suffix : value;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
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

/* ---------- Manifesto button ---------- */
document.querySelector('.roots__text .btn')?.addEventListener('click', e => {
  e.preventDefault();
  showToast('🔥 Manifesto coming soon — stay fired up!');
});

/* ---------- CTA Book button ---------- */
document.querySelector('.ab-cta__actions .btn-primary')?.addEventListener('click', e => {
  showToast('📅 Reservations opening soon — we\'ll sizzle when ready!');
});
