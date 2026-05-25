'use strict';

// ——— DOM REFERENCES ———
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbClose   = document.getElementById('lbClose');
const enquiryForm = document.getElementById('enquiryForm');

// ——— NAVBAR: scroll + mobile toggle ———
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});
// ——— SMOOTH SCROLL for anchor links ———
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ——— SCROLL REVEAL ———
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Hero elements — trigger right away
document.querySelectorAll('.hero .reveal').forEach(el => revealObserver.observe(el));

// Service cards with staggered delay
document.querySelectorAll('.service-card').forEach(card => {
  const delay = card.dataset.delay || 0;
  card.style.transitionDelay = delay + 'ms';
  revealObserver.observe(card);
});

// Generic scroll-reveal: add .reveal to section children
const autoRevealSections = document.querySelectorAll(
  '.why-text, .step-item, .testi-card, .pillar, .gallery-item, .contact-info, .contact-form-wrap'
);
autoRevealSections.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ——— GALLERY LIGHTBOX ———

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
}
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ——— ENQUIRY FORM → WhatsApp ———
enquiryForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Basic validation
  const required = ['fullName', 'phone', 'eventType'];
  let valid = true;
  required.forEach(id => {
    const field = document.getElementById(id);
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    } else {
      field.classList.remove('error');
    }
  });

  if (!valid) {
    showToast('Please fill in the required fields (Name, Phone, Event Type).', 'error');
    return;
  }

  // Build WhatsApp message
  const data = {
    name:     document.getElementById('fullName').value.trim(),
    phone:    document.getElementById('phone').value.trim(),
    email:    document.getElementById('email').value.trim(),
    event:    document.getElementById('eventType').value,
    date:     document.getElementById('eventDate').value,
    location: document.getElementById('location').value.trim(),
    guests:   document.getElementById('guests').value.trim(),
    budget:   document.getElementById('budget').value,
    notes:    document.getElementById('notes').value.trim(),
  };

  const lines = [
    '🌸 *NEW EVENT ENQUIRY — Me Kanamma*',
    '',
    `👤 *Name:* ${data.name}`,
    `📞 *Phone:* ${data.phone}`,
    data.email    ? `✉️ *Email:* ${data.email}`         : null,
    `🎉 *Event Type:* ${data.event}`,
    data.date     ? `📅 *Date:* ${data.date}`           : null,
    data.location ? `📍 *Location:* ${data.location}`   : null,
    data.guests   ? `👥 *Guests:* ${data.guests}`       : null,
    data.budget   ? `💰 *Budget:* ${data.budget}`       : null,
    data.notes    ? `📝 *Notes:* ${data.notes}`         : null,
  ].filter(Boolean).join('\n');

  const waURL = `https://wa.me/919390266268?text=${encodeURIComponent(lines)}`;
  window.open(waURL, '_blank');

  showToast('Redirecting to WhatsApp…', 'success');
  enquiryForm.reset();
});

// Remove error class on input
enquiryForm.querySelectorAll('input, select').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

// ——— TOAST NOTIFICATION ———
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    background: type === 'success'
      ? 'linear-gradient(135deg, #C9972B, #E8C570)'
      : 'linear-gradient(135deg, #D32F2F, #E57373)',
    color: type === 'success' ? '#1A1008' : '#fff',
    padding: '14px 22px',
    borderRadius: '6px',
    fontFamily: "'Cinzel', serif",
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    fontWeight: '700',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    zIndex: '99999',
    transform: 'translateY(20px)',
    opacity: '0',
    transition: 'all 0.4s ease',
    maxWidth: '320px',
  });

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
  });

  // Animate out
  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ——— ACTIVE NAV LINK on scroll ———
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// ——— STEP ITEMS: stagger reveal ———
document.querySelectorAll('.step-item').forEach((item, i) => {
  item.classList.add('reveal');
  item.style.transitionDelay = (i * 120) + 'ms';
  revealObserver.observe(item);
});
