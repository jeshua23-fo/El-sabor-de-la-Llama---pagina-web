/* ============================================================
   SIZZLE & SEAR – contact.js
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
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 90}ms`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

/* ---------- Hero parallax ---------- */
const heroBg = document.querySelector('.ct-hero__img');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${y * 0.15}px)`;
  }
}, { passive: true });

/* ---------- Contact Form ---------- */
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', e => {
  e.preventDefault();

  const name    = document.getElementById('c-name').value.trim();
  const email   = document.getElementById('c-email').value.trim();
  const message = document.getElementById('c-message').value.trim();
  const subject = document.getElementById('c-subject').value;

  // Validation
  if (!name) {
    highlight('c-name');
    showToast('⚠️ Por favor ingresa tu nombre.');
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    highlight('c-email');
    showToast('⚠️ Por favor ingresa un correo válido.');
    return;
  }
  if (!message) {
    highlight('c-message');
    showToast('⚠️ Por favor escribe un mensaje antes de enviar.');
    return;
  }

  const btn = contactForm.querySelector('.btn-send');
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  btn.style.opacity = '0.8';

  addContactRecord({
    name,
    email,
    subject,
    message,
    date: new Date().toISOString(),
  })
    .then(() => {
      btn.textContent = '✓ Mensaje enviado';
      btn.style.background = '#27ae60';
      btn.style.borderColor = '#27ae60';
      showToast(`🔥 Gracias ${name.split(' ')[0]}! Tu mensaje ya está en la base de datos.`);

      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'ENVIAR MENSAJE';
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.opacity = '';
        btn.disabled = false;
      }, 2500);
    })
    .catch(error => {
      console.error('SheetDB submit error:', error);
      btn.textContent = 'ENVIAR MENSAJE';
      btn.disabled = false;
      btn.style.opacity = '';
      showToast('⚠️ No se pudo conectar con la base de datos. Intenta de nuevo.');
    });
});

function highlight(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#e74c3c';
  el.focus();
  setTimeout(() => { el.style.borderColor = ''; }, 2000);
}

/* ---------- Social buttons feedback ---------- */
document.querySelectorAll('.ct-social-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.querySelector('span')?.textContent || 'red social';
    showToast(`Abriendo ${name}...`);
  });
});

/* ---------- FAQ accordion (optional expand on mobile) ---------- */
const faqItems = document.querySelectorAll('.ct-faq__item');
faqItems.forEach(item => {
  item.addEventListener('click', () => {
    // Simple visual feedback — highlight question
    item.querySelector('.ct-faq__q').style.color = 'var(--yellow)';
    setTimeout(() => {
      item.querySelector('.ct-faq__q').style.color = '';
    }, 600);
  });
});
