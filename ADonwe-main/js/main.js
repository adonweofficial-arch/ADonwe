// =============================================
// ADONME – MAIN JAVASCRIPT
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-loaded');

  // === NAVBAR SCROLL ===
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // === HAMBURGER MENU Hello! How may we help you?===
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    // Lock body scroll — prevents page scrolling behind the overlay
    document.body.style.overflow = 'hidden';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    // Restore body scroll
    document.body.style.overflow = '';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Close on any nav link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hamburger.classList.contains('active')) closeMenu();
    });
  }

  // === ACTIVE NAV LINK ===
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // === COUNTER ANIMATION ===
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
      }, 16);
    });
  }

  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) startCounters(); });
    }, { threshold: 0.3 });
    observer.observe(counters[0]);
  }

  // === SCROLL REVEAL ===
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((el, i) => {
    el.dataset.delay = i % 4 * 100;
    revealObserver.observe(el);
  });

  // === AUTO-ADD REVEAL TO SECTION CHILDREN ===
  // NOTE: services-grid, clients-grid, cities-grid, and team-grid are excluded — they use real images.
  document.querySelectorAll('.values-grid > *').forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.delay = i * 100;
    revealObserver.observe(el);
  });

  // === SMOOTH ANCHOR SCROLLING ===
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // === HERO PARTICLE EFFECT ===
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: ${Math.random() > 0.5 ? '#6C3DE8' : '#F59E0B'};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.1};
        animation: particleFloat ${Math.random() * 10 + 8}s ease infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      particleContainer.appendChild(p);
    }

    // Add keyframe
    if (!document.getElementById('particleStyles')) {
      const style = document.createElement('style');
      style.id = 'particleStyles';
      style.textContent = `
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          25% { transform: translate(${Math.random()*60-30}px, ${Math.random()*60-30}px) scale(1.5); opacity: 0.5; }
          50% { transform: translate(${Math.random()*80-40}px, ${Math.random()*80-40}px) scale(0.8); opacity: 0.3; }
          75% { transform: translate(${Math.random()*60-30}px, ${Math.random()*60-30}px) scale(1.2); opacity: 0.4; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // === HOVER TILT EFFECT ON CARDS ===
  document.querySelectorAll('.service-card, .client-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // === WHATSAPP WIDGET ===
  const createWhatsAppWidget = () => {
    const phoneNumber = '91xxxxxxxxxx'; // Note: Omit the + for the wa.me link

    const widget = document.createElement('div');
    widget.className = 'whatsapp-widget';
    widget.innerHTML = `
      <div class="wa-bubble" id="waBubble">
       How can ADonWe help you?
        <div class="wa-close" id="waClose" aria-label="Close" title="Close"><i class="fas fa-times"></i></div>
      </div>
      <a href="https://wa.me/${phoneNumber}" target="_blank" class="wa-btn" id="waBtn" aria-label="Chat on WhatsApp">
        <i class="fab fa-whatsapp"></i>
      </a>
    `;
    document.body.appendChild(widget);

    const waBubble = document.getElementById('waBubble');
    const waClose = document.getElementById('waClose');

    // Show bubble automatically when page loads (1.5s delay for smooth entrance)
    setTimeout(() => {
      waBubble.classList.add('show');
    }, 1500);

    // When user clicks the cross
    waClose.addEventListener('click', (e) => {
      e.preventDefault();
      // Hide the bubble immediately
      waBubble.classList.remove('show');
      
      // Remove the entire WhatsApp logo/widget after 5 seconds
      setTimeout(() => {
        widget.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(30px) scale(0.8)';
        
        // Remove from DOM after fade out completes
        setTimeout(() => {
          widget.remove();
        }, 600);
      }, 5000);
    });
  };

  createWhatsAppWidget();

  console.log('ADonMe – Take Your Idea to ADonMe ✨');
});
