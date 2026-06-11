/* ==========================================================
   ALEX RIVERA — PORTFOLIO  |  script.js
   Features: Canvas constellation · Typing effect · Dark/Light
   toggle · Mobile nav · Scroll reveal · Skill bars · Form
   validation · Scroll progress · Loader · Back-to-top
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   UTILITY
   ---------------------------------------------------------- */

/** Query helper */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ----------------------------------------------------------
   1. LOADING SCREEN
   ---------------------------------------------------------- */
(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  // Hide after CSS animation finishes (~1.5s) + small buffer
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });

  // Safety fallback — always remove after 3s
  setTimeout(() => loader.classList.add('hidden'), 3000);
})();

/* ----------------------------------------------------------
   2. SCROLL PROGRESS BAR
   ---------------------------------------------------------- */
(function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ----------------------------------------------------------
   3. NAVBAR — scroll class + active link highlight
   ---------------------------------------------------------- */
(function initNavbar() {
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  function onScroll() {
    // Sticky glass style
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link tracking
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ----------------------------------------------------------
   4. MOBILE HAMBURGER MENU
   ---------------------------------------------------------- */
(function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobLinks   = $$('.mob-link');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on link click
  mobLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();

/* ----------------------------------------------------------
   5. DARK / LIGHT MODE TOGGLE
   ---------------------------------------------------------- */
(function initThemeToggle() {
  const btn   = $('#theme-toggle');
  const root  = document.documentElement;
  const KEY   = 'portfolio-theme';

  // Restore saved preference, default to dark
  const saved = localStorage.getItem(KEY);
  if (saved) {
    root.setAttribute('data-theme', saved);
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();

/* ----------------------------------------------------------
   6. TYPING EFFECT (Hero role text)
   ---------------------------------------------------------- */
(function initTypingEffect() {
  const el = $('#typed-text');
  if (!el) return;

  const words = [
    'Frontend Developer',
    'UI Enthusiast',
    'Creative Coder',
    'Web Designer',
    'Problem Solver',
  ];

  let wordIdx    = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let isPaused   = false;

  function type() {
    const word    = words[wordIdx];
    const display = isDeleting ? word.substring(0, charIdx - 1) : word.substring(0, charIdx + 1);

    el.textContent = display;

    // Adjust speed
    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && display === word) {
      // Finished typing — pause then delete
      isPaused = true;
      setTimeout(() => {
        isPaused   = false;
        isDeleting = true;
        type();
      }, 1800);
      return;
    }

    if (isDeleting && display === '') {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      charIdx = 0;
      setTimeout(type, 300);
      return;
    }

    charIdx = isDeleting ? charIdx - 1 : charIdx + 1;
    setTimeout(type, speed);
  }

  type();
})();

/* ----------------------------------------------------------
   7. HERO CANVAS — Interactive Particle Constellation
   ---------------------------------------------------------- */
(function initHeroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Mouse position
  let mouse = { x: -1000, y: -1000 };

  // Particle configuration
  const CONFIG = {
    count:       120,
    maxRadius:   2.2,
    minRadius:   0.6,
    speed:       0.35,
    linkDist:    150,
    mouseRadius: 120,
    mouseForce:  2.5,
  };

  let particles = [];
  let W, H;

  /* Resize */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  /* Get theme-aware colours */
  function getColour() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      particle: isDark ? 'rgba(159, 103, 255,' : 'rgba(124, 58, 237,',
      link:     isDark ? 'rgba(6, 182, 212,'   : 'rgba(6, 182, 212,',
    };
  }

  /* Create a single particle */
  function createParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r:  CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
      opacity: 0.3 + Math.random() * 0.6,
    };
  }

  /* Initialise */
  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  /* Distance helper */
  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  /* Animation loop */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const c = getColour();

    particles.forEach((p, i) => {
      // Mouse repulsion
      const dm = dist(p, mouse);
      if (dm < CONFIG.mouseRadius) {
        const force  = (CONFIG.mouseRadius - dm) / CONFIG.mouseRadius * CONFIG.mouseForce;
        const angle  = Math.atan2(p.y - mouse.y, p.x - mouse.x);
        p.vx += Math.cos(angle) * force * 0.05;
        p.vy += Math.sin(angle) * force * 0.05;
      }

      // Speed cap
      const spd = Math.hypot(p.vx, p.vy);
      if (spd > CONFIG.speed * 3) {
        p.vx = (p.vx / spd) * CONFIG.speed * 3;
        p.vy = (p.vy / spd) * CONFIG.speed * 3;
      }

      // Slow drift back
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = c.particle + p.opacity + ')';
      ctx.fill();

      // Draw links
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const d = dist(p, other);
        if (d < CONFIG.linkDist) {
          const alpha = (1 - d / CONFIG.linkDist) * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = c.link + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  /* Events */
  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  });

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Touch support
  canvas.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const rect  = canvas.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }, { passive: true });

  init();
  draw();
})();

/* ----------------------------------------------------------
   8. SCROLL REVEAL ANIMATION (Intersection Observer)
   ---------------------------------------------------------- */
(function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el, i) => {
    // Stagger delay based on DOM order within parent
    const siblings  = $$('.reveal', el.parentElement);
    const siblIdx   = siblings.indexOf(el);
    el.style.transitionDelay = (siblIdx * 0.08) + 's';
    observer.observe(el);
  });
})();

/* ----------------------------------------------------------
   9. SKILL BARS — animate when visible
   ---------------------------------------------------------- */
(function initSkillBars() {
  const bars = $$('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const fill  = bar.querySelector('.skill-fill');
          const width = bar.getAttribute('data-width') || '0';
          fill.style.width = width + '%';
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

/* ----------------------------------------------------------
   10. SMOOTH SCROLL for anchor links
   ---------------------------------------------------------- */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const target = $(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* ----------------------------------------------------------
   11. CONTACT FORM VALIDATION
   ---------------------------------------------------------- */
(function initContactForm() {
  const form    = $('#contact-form');
  if (!form) return;

  const nameInput    = $('#name');
  const emailInput   = $('#email');
  const messageInput = $('#message');
  const submitBtn    = $('#submit-btn');
  const successMsg   = $('#form-success');

  /* Error helpers */
  function showError(input, errorEl, msg) {
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = msg;
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    if (errorEl) errorEl.textContent = '';
  }

  /* Individual validators */
  function validateName() {
    const val = nameInput.value.trim();
    const err = $('#name-error');
    if (!val)           { showError(nameInput, err, 'Name is required.'); return false; }
    if (val.length < 2) { showError(nameInput, err, 'Name must be at least 2 characters.'); return false; }
    clearError(nameInput, err);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    const err = $('#email-error');
    const re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val)          { showError(emailInput, err, 'Email is required.'); return false; }
    if (!re.test(val)) { showError(emailInput, err, 'Please enter a valid email address.'); return false; }
    clearError(emailInput, err);
    return true;
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    const err = $('#message-error');
    if (!val)            { showError(messageInput, err, 'Message is required.'); return false; }
    if (val.length < 10) { showError(messageInput, err, 'Please write at least 10 characters.'); return false; }
    clearError(messageInput, err);
    return true;
  }

  /* Live validation on blur */
  nameInput.addEventListener('blur',    validateName);
  emailInput.addEventListener('blur',   validateEmail);
  messageInput.addEventListener('blur', validateMessage);

  /* Clear error on input */
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      const errId = input.id + '-error';
      const err   = $('#' + errId);
      if (input.classList.contains('error')) clearError(input, err);
    });
  });

  /* Submit */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const isValid = [validateName(), validateEmail(), validateMessage()].every(Boolean);
    if (!isValid) return;

    // Simulate submission
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 1800)); // fake network delay

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;

    // Show success
    successMsg.hidden = false;
    form.reset();

    // Hide success after 6s
    setTimeout(() => { successMsg.hidden = true; }, 6000);
  });
})();

/* ----------------------------------------------------------
   12. BACK-TO-TOP BUTTON
   ---------------------------------------------------------- */
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
})();

/* ----------------------------------------------------------
   13. FOOTER — current year
   ---------------------------------------------------------- */
(function setYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ----------------------------------------------------------
   14. KEYBOARD NAVIGATION FOCUS TRAP (mobile menu)
   ---------------------------------------------------------- */
(function initFocusTrap() {
  const menu = $('#mobile-menu');
  if (!menu) return;

  document.addEventListener('keydown', e => {
    if (!menu.classList.contains('open')) return;
    if (e.key !== 'Tab') return;

    const focusable = $$('a, button', menu).filter(el => !el.disabled);
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();

/* ----------------------------------------------------------
   15. HERO CARDS — 3D tilt on mouse move (desktop only)
   ---------------------------------------------------------- */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  const cards = $$('.project-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -6; // degrees
      const tiltY  = dx *  6;

      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();