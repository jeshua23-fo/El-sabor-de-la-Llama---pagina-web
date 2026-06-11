/* ============================================================
   SIZZLE & SEAR – locations.js
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
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 110}ms`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

/* ---------- Hero parallax ---------- */
const heroBg = document.querySelector('.loc-hero__img');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${y * 0.15}px)`;
  }
}, { passive: true });

/* ---------- Reservation Modal ---------- */
const backdrop  = document.getElementById('modalBackdrop');
const bookBtn   = document.getElementById('bookBtn');
const closeBtn  = document.getElementById('modalClose');
const resForm   = document.getElementById('reservationForm');

function openModal() {
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Set min date to today
  const dateInput = document.getElementById('m-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
}

function closeModal() {
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

bookBtn?.addEventListener('click', openModal);
closeBtn?.addEventListener('click', closeModal);

// Close on backdrop click
backdrop?.addEventListener('click', e => {
  if (e.target === backdrop) closeModal();
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
});

// Form submit
resForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name     = document.getElementById('m-name').value.trim();
  const email    = document.getElementById('m-email').value.trim();
  const location = document.getElementById('m-location').value;

  if (!name) {
    showToast('⚠️ Please enter your name.');
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ Please enter a valid email.');
    return;
  }

  const locationNames = {
    district: 'The District',
    neon:     'Neon Junction',
    sky:      'Sky Grill'
  };

  closeModal();
  resForm.reset();
  showToast(`🔥 Table booked at ${locationNames[location]}! See you soon, ${name.split(' ')[0]}.`);
});

/* ---------- Directions buttons feedback ---------- */
document.querySelectorAll('.btn-directions').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.loc-card');
    const name = card?.querySelector('.loc-card__name')?.textContent || 'location';
    showToast(`📍 Opening directions to ${name}...`);
  });
});

/* ---------- Map pin hover labels ---------- */
document.querySelectorAll('.map-pin').forEach(pin => {
  pin.addEventListener('mouseenter', () => {
    pin.querySelector('.map-pin__label').style.opacity = '1';
  });
});
