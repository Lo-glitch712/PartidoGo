/* ============================================================
   USABILITY EVALUATION REPORT — MAIN JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV TOGGLE (mobile) ─────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  /* ── ACTIVE NAV LINK ─────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── ACCORDION ───────────────────────────────────────── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item   = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all items in this accordion
      const accordion = item.closest('.accordion');
      accordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

      // Toggle clicked item
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── SCROLL ANIMATIONS ───────────────────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('.fade-up')]
          : [];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* ── PROGRESS BARS (animate on view) ────────────────── */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill    = entry.target.querySelector('.progress-fill');
        const percent = fill ? fill.dataset.width : null;
        if (percent) fill.style.width = percent + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.progress-bar-wrap').forEach(wrap => {
    const fill = wrap.querySelector('.progress-fill');
    if (fill) {
      const targetWidth = fill.style.width;
      fill.dataset.width = parseInt(targetWidth);
      fill.style.width = '0%';
      barObserver.observe(wrap);
    }
  });

  /* ── SMOOTH SCROLL for anchor links ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── COUNTER ANIMATION ───────────────────────────────── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const target  = parseInt(el.dataset.count);
        const duration = 1200;
        const start   = performance.now();

        const step = (now) => {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease     = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── ACTIVE SECTION HIGHLIGHT (for long pages) ───────── */
  const sections = document.querySelectorAll('section[id]');
  const sideLinks = document.querySelectorAll('.side-nav a');

  if (sections.length && sideLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sideLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => sectionObserver.observe(s));
  }

});
