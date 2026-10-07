/**
 * SWEETY COLOUR DECORA — EDITORIAL MONOGRAPH INTERACTION CONTROLLER
 * Lightweight, robust vanilla JavaScript for scroll-spy, active navigation,
 * entrance reveals, mobile toggle, and enquiry form handling.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Proposal Dropdown Toggle
  const proposalDropdown = document.getElementById('proposalDropdown');
  const proposalDropBtn = document.getElementById('proposalDropBtn');

  if (proposalDropdown && proposalDropBtn) {
    proposalDropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = proposalDropdown.classList.toggle('is-open');
      proposalDropBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!proposalDropdown.contains(e.target)) {
        proposalDropdown.classList.remove('is-open');
        proposalDropBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when clicking a menu item
    proposalDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        proposalDropdown.classList.remove('is-open');
        proposalDropBtn.setAttribute('aria-expanded', 'false');
        if (navClusters) {
          navClusters.classList.remove('is-open');
          if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navClusters = document.getElementById('navClusters');

  if (mobileToggle && navClusters) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navClusters.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking a link
    navClusters.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navClusters.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Shadcn Navbar1 Mobile Drawer & Accordion Handlers ---
  const navbar1MobileTrigger = document.getElementById('navbar1MobileTrigger');
  const navbar1SheetClose = document.getElementById('navbar1SheetClose');
  const navbar1Backdrop = document.getElementById('navbar1Backdrop');
  const navbar1Sheet = document.getElementById('navbar1Sheet');

  function openNavbar1Sheet() {
    if (navbar1Backdrop) navbar1Backdrop.classList.add('active');
    if (navbar1Sheet) navbar1Sheet.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNavbar1Sheet() {
    if (navbar1Backdrop) navbar1Backdrop.classList.remove('active');
    if (navbar1Sheet) navbar1Sheet.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navbar1MobileTrigger) navbar1MobileTrigger.addEventListener('click', openNavbar1Sheet);
  if (navbar1SheetClose) navbar1SheetClose.addEventListener('click', closeNavbar1Sheet);
  if (navbar1Backdrop) navbar1Backdrop.addEventListener('click', closeNavbar1Sheet);

  if (navbar1Sheet) {
    navbar1Sheet.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNavbar1Sheet);
    });
  }

  // Mobile Accordion items
  document.querySelectorAll('.navbar1-accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.navbar1-accordion-item');
      if (item) {
        const wasOpen = item.classList.contains('active');
        document.querySelectorAll('.navbar1-accordion-item').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active', !wasOpen);
      }
    });
  });

  // Smooth Scroll with Header Offset

  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = document.querySelector('.site-nav')?.offsetHeight || 72;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (navHeight - 2);
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // IntersectionObserver for Scroll Spy (Active Nav Link)
  const trackedSections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link[href^="#"]');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = '#' + entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === currentId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  });

  trackedSections.forEach(section => scrollSpyObserver.observe(section));

  // Subtle Scroll Reveals for Sections
  const revealElements = document.querySelectorAll('.fade-in-section');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ==========================================================================
  // 3D COVERFLOW CAROUSEL CONTROLLER (Physically-derived exponential rake)
  // ==========================================================================
  const cfTrack = document.getElementById('cfTrack');
  if (cfTrack) {
    const cards = Array.from(cfTrack.querySelectorAll('.cf-card'));
    const prevBtn = document.getElementById('cfPrevBtn');
    const nextBtn = document.getElementById('cfNextBtn');
    const captionTitle = document.getElementById('cfCaptionTitle');
    const captionSub = document.getElementById('cfCaptionSub');
    const captionMeta = document.getElementById('cfCaptionMeta');
    const dots = Array.from(document.querySelectorAll('.cf-dot'));

    const count = cards.length;
    let pos = 0;
    let target = 0;
    let raf = null;
    let width = 0;
    let drag = null;

    const gap = 0.05;
    const rotate = 44;
    const depth = 0.6;
    const falloff = 0.56;
    const fade = 0.1;
    const loop = true;

    function measure() {
      if (cards[0]) {
        width = cards[0].offsetWidth;
        paint();
      }
    }

    function indexAt(p) {
      return ((Math.round(p) % count) + count) % count;
    }

    function updateCaption(index) {
      const activeCard = cards[index];
      if (!activeCard) return;
      if (captionTitle) captionTitle.textContent = activeCard.getAttribute('data-title') || '';
      if (captionSub) captionSub.textContent = activeCard.getAttribute('data-subtitle') || '';
      if (captionMeta) captionMeta.innerHTML = activeCard.getAttribute('data-meta') || '';

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    function paint() {
      if (!width) return;
      const pitch = width * (1 + gap);

      cards.forEach((card, index) => {
        let offset = index - pos;
        if (loop) {
          offset = ((offset % count) + count) % count;
          if (offset > count / 2) offset -= count;
        }

        const distance = Math.abs(offset);
        const ramp = Math.pow(distance, falloff);
        const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

        card.style.transform =
          'translateX(calc(-50% + ' + (offset * pitch) + 'px)) ' +
          'translateZ(' + (-depth * width * ramp) + 'px) rotateY(' + (-tilt) + 'deg)';

        const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
        card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
        card.style.zIndex = String(100 - Math.round(distance));
      });
    }

    function clamp(p) {
      return loop ? p : Math.max(0, Math.min(count - 1, p));
    }

    function settle(newTarget) {
      if (raf !== null) cancelAnimationFrame(raf);
      target = newTarget;
      updateCaption(indexAt(target));

      function step() {
        const remaining = target - pos;
        if (Math.abs(remaining) < 0.0004) {
          pos = target;
          paint();
          raf = null;
          return;
        }
        pos += remaining * 0.16;
        paint();
        raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }

    function goTo(index) {
      const t = loop
        ? index + Math.round((target - index) / count) * count
        : index;
      settle(clamp(t));
    }

    function nudge(by) {
      settle(clamp(Math.round(target) + by));
    }

    // Pointer Events (Mouse / Touch Drag)
    cfTrack.addEventListener('pointerdown', (e) => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      cfTrack.setPointerCapture(e.pointerId);
      target = pos;
      drag = {
        id: e.pointerId,
        x: e.clientX,
        pos: pos,
        v: 0,
        t: performance.now()
      };
    });

    cfTrack.addEventListener('pointermove', (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const pitch = width * (1 + gap);
      if (!pitch) return;

      const now = performance.now();
      const prevPos = pos;
      pos = clamp(drag.pos - (e.clientX - drag.x) / pitch);
      drag.v = ((pos - prevPos) / Math.max(now - drag.t, 1)) * 1000;
      drag.t = now;

      updateCaption(indexAt(pos));
      paint();
    });

    function endDrag(e) {
      if (!drag || drag.id !== e.pointerId) return;
      drag = null;
      const carried = Math.max(-2, Math.min(2, (drag ? drag.v : 0) * 0.18));
      settle(clamp(Math.round(pos + carried)));
    }

    cfTrack.addEventListener('pointerup', endDrag);
    cfTrack.addEventListener('pointercancel', endDrag);

    // Keyboard navigation
    cfTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nudge(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nudge(1);
      }
    });

    // Arrow Buttons
    if (prevBtn) prevBtn.addEventListener('click', () => nudge(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => nudge(1));

    // Dots
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
        goTo(idx);
      });
    });

    // Initial measurement
    measure();
    window.addEventListener('resize', measure);
    updateCaption(0);
  }

  // Transition Divider Special Entrance
  const transitionDivider = document.querySelector('.transition-divider');
  if (transitionDivider) {
    const dividerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.2
    });
    dividerObserver.observe(transitionDivider);
  }

  // Underline Form Handling
  const enquiryForm = document.getElementById('enquiryForm');
  const formStatusMsg = document.getElementById('formStatusMsg');

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Recording Enquiry...';

      setTimeout(() => {
        submitBtn.textContent = 'Enquiry Received';
        if (formStatusMsg) {
          formStatusMsg.textContent = 'Thank you. Your enquiry has been recorded for Sweety Colour Decora & Sweety SiteFlow.';
          formStatusMsg.classList.add('visible');
        }
        enquiryForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 5000);
      }, 700);
    });
  }


  // Architectural Theme Controller — Permanent Luxury Editorial Dark Theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme || 'dark');
    try {
      localStorage.setItem('scd_theme', theme || 'dark');
    } catch (e) {}
  }

  // Set whole website permanently to dark mode
  applyTheme('dark');

  // Global helper
  window.setTheme = applyTheme;




  // Dynamic Current Year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // ROCKET.NEW ULTRA-PROFESSIONAL PAGE TRANSITION & RUNNER CONTROLLER
  // =========================================================================
  const transitionBar = document.getElementById('pageTransitionBar');

  function triggerPageTransition(callback) {
    if (!transitionBar) {
      if (callback) callback();
      return;
    }
    transitionBar.style.width = '0%';
    transitionBar.classList.add('animating');
    
    requestAnimationFrame(() => {
      transitionBar.style.width = '70%';
      setTimeout(() => {
        transitionBar.style.width = '100%';
        if (callback) callback();
        setTimeout(() => {
          transitionBar.classList.remove('animating');
          transitionBar.style.width = '0%';
        }, 300);
      }, 200);
    });
  }

  // Intercept in-page anchor links for smooth professional transition
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        triggerPageTransition(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetEl.classList.remove('section-target-highlight');
          void targetEl.offsetWidth; // trigger reflow
          targetEl.classList.add('section-target-highlight');
        });
      }
    });
  });

  // =========================================================================
  // ROCKET.NEW QUICK-START PROMPT LAUNCHER
  // =========================================================================
  const quickstartInput = document.getElementById('quickstartInput');
  const quickstartSubmitBtn = document.getElementById('quickstartSubmitBtn');
  const quickstartPills = document.querySelectorAll('.quickstart-pill');

  function executeQuickstart(promptText) {
    if (!promptText) promptText = quickstartInput ? quickstartInput.value.trim() : '';
    if (!promptText) promptText = 'Modern luxury interior finishing and turnkey execution';

    triggerPageTransition(() => {
      const studioSection = document.getElementById('ai-design-studio');
      if (studioSection) {
        studioSection.style.display = 'block';
        studioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        studioSection.classList.remove('section-target-highlight');
        void studioSection.offsetWidth;
        studioSection.classList.add('section-target-highlight');

        // Pre-fill notes or prompt if present
        const customPromptInput = document.getElementById('customPrompt');
        if (customPromptInput) {
          customPromptInput.value = promptText;
        }
      }
    });
  }

  if (quickstartSubmitBtn) {
    quickstartSubmitBtn.addEventListener('click', () => {
      executeQuickstart();
    });
  }

  if (quickstartInput) {
    quickstartInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeQuickstart();
      }
    });
  }

  quickstartPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const prompt = pill.getAttribute('data-prompt') || pill.textContent;
      if (quickstartInput) quickstartInput.value = prompt;
      executeQuickstart(prompt);
    });
  });

  // =========================================================================
  // ROCKET.NEW "PICK YOUR STARTING POINT" TAB CONTROLLER
  // =========================================================================
  const spTabBtns = document.querySelectorAll('.sp-tab-btn');
  const spTabPanels = document.querySelectorAll('.sp-tab-panel');

  spTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');
      if (!targetTabId) return;

      spTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      spTabPanels.forEach(panel => {
        if (panel.id === targetTabId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // =========================================================================
  // ROCKET.NEW ACCORDION FAQ CONTROLLER
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');

    if (trigger && answer) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items (accordion behavior)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // Hero Background Video Controller
  const heroLiveVideo = document.getElementById('heroBgVideo') || document.getElementById('heroLiveVideo');
  if (heroLiveVideo) {
    heroLiveVideo.muted = true;
    heroLiveVideo.defaultMuted = true;
    const playPromise = heroLiveVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback for strict browser autoplay policies: play on first user interaction
        const startOnUserAction = () => {
          heroLiveVideo.play().catch(() => {});
          window.removeEventListener('click', startOnUserAction);
          window.removeEventListener('scroll', startOnUserAction);
          window.removeEventListener('touchstart', startOnUserAction);
        };
        window.addEventListener('click', startOnUserAction, { once: true });
        window.addEventListener('scroll', startOnUserAction, { once: true });
        window.addEventListener('touchstart', startOnUserAction, { once: true });
      });
    }
  }

  // Interactive Spatial Visualizer (Stack Spread Physics Engine)
  const stackStage = document.getElementById('stackStage');
  const cardsLayer = document.getElementById('cardsLayer');
  const centerText = document.getElementById('centerText');
  const scrollHint = document.getElementById('scrollHint');
  const stackSpreadBtn = document.getElementById('stackSpreadBtn');
  const stackClumpBtn = document.getElementById('stackClumpBtn');

  if (stackStage && cardsLayer && centerText) {
    const CARDS_DATA = [
      {
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=85",
        title: "Commercial Facades",
        stackOffset: { x: -8, y: -4 },
        stackRotate: -16,
        target: { x: -28, y: -23, rotate: -4, scale: 0.88, w: 18, h: 22 },
        z: 2
      },
      {
        src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=85",
        title: "POP & Ceilings",
        stackOffset: { x: 12, y: -6 },
        stackRotate: 16,
        target: { x: 28, y: -23, rotate: 5, scale: 0.9, w: 19, h: 23 },
        z: 3
      },
      {
        src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=85",
        title: "Venetian Plaster",
        stackOffset: { x: -14, y: 3 },
        stackRotate: -6,
        target: { x: -36, y: 4, rotate: -2, scale: 0.86, w: 17, h: 24 },
        z: 4
      },
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=85",
        title: "Prestige Villa",
        stackOffset: { x: 0, y: -8 },
        stackRotate: -2,
        target: { x: 0, y: -26, rotate: 0, scale: 0.82, w: 22, h: 22 },
        z: 5
      },
      {
        src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1000&auto=format&fit=crop&q=85",
        title: "Contemporary Residence",
        stackOffset: { x: 15, y: 4 },
        stackRotate: 6,
        target: { x: 36, y: 4, rotate: 2, scale: 0.86, w: 17, h: 24 },
        z: 6
      },
      {
        src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&auto=format&fit=crop&q=85",
        title: "Master Craftsmen",
        stackOffset: { x: -6, y: 10 },
        stackRotate: 6,
        target: { x: -26, y: 27, rotate: 3, scale: 0.88, w: 20, h: 22 },
        z: 7
      },
      {
        src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&auto=format&fit=crop&q=85",
        title: "Italian Marble",
        stackOffset: { x: 6, y: 8 },
        stackRotate: 3,
        target: { x: 0, y: 28, rotate: 0, scale: 0.85, w: 20, h: 22 },
        z: 8
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=85",
        title: "Luxury Penthouse",
        stackOffset: { x: 18, y: 12 },
        stackRotate: -7,
        target: { x: 26, y: 27, rotate: -3, scale: 0.9, w: 18, h: 20 },
        z: 9
      }
    ];

    cardsLayer.innerHTML = '';
    const isMobile = window.innerWidth < 768;
    const cardNodes = CARDS_DATA.map((card) => {
      const el = document.createElement('div');
      el.className = 'card-element';
      el.style.zIndex = card.z;
      const wVal = isMobile ? Math.max(card.target.w * 1.35, 26) : card.target.w;
      const hVal = isMobile ? Math.max(card.target.h * 1.05, 16) : card.target.h;
      el.style.width = wVal + 'vw';
      el.style.height = hVal + 'vh';

      const img = document.createElement('img');
      img.src = card.src;
      img.alt = card.title;
      img.loading = 'lazy';
      img.draggable = false;
      el.appendChild(img);

      const tag = document.createElement('div');
      tag.className = 'card-tag';
      tag.textContent = card.title;
      el.appendChild(tag);

      // Clicking a card brings it to front and expands it
      el.addEventListener('click', () => {
        cardNodes.forEach(c => c.el.style.zIndex = c.data.z);
        el.style.zIndex = 40;
      });

      cardsLayer.appendChild(el);
      return { el, data: card };
    });

    let pointerX = 0;
    let pointerY = 0;
    window.addEventListener('pointermove', (e) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    let currentProgress = 0;
    let manualMode = false;
    let manualProgress = 1;

    // Interactive button controls
    if (stackSpreadBtn && stackClumpBtn) {
      stackSpreadBtn.addEventListener('click', () => {
        manualMode = true;
        manualProgress = 1;
        stackSpreadBtn.classList.add('active');
        stackClumpBtn.classList.remove('active');
      });
      stackClumpBtn.addEventListener('click', () => {
        manualMode = true;
        manualProgress = 0;
        stackClumpBtn.classList.add('active');
        stackSpreadBtn.classList.remove('active');
      });
    }

    // Physics Engine Loop
    function updatePhysics() {
      let targetProgress = 0;

      if (manualMode) {
        targetProgress = manualProgress;
      } else {
        const rect = stackStage.getBoundingClientRect();
        const winH = window.innerHeight;

        // START ANIMATION BEFORE:
        // As soon as stage scrolls into view (rect.top <= winH * 0.95), begin spreading!
        // Full spread reached when stage reaches top of viewport (rect.top <= 0)
        const startTrigger = winH * 0.95;
        const endTrigger = 0;

        if (rect.top >= startTrigger) {
          targetProgress = 0;
        } else if (rect.top <= endTrigger) {
          targetProgress = 1;
        } else {
          targetProgress = (startTrigger - rect.top) / (startTrigger - endTrigger);
        }
      }

      // Smooth interpolation (lerp)
      currentProgress += (targetProgress - currentProgress) * 0.12;
      const progress = Math.max(0, Math.min(1, currentProgress));

      // Center text fade-in
      if (progress > 0.25) {
        const textOpacity = Math.min(1, (progress - 0.25) / 0.4);
        centerText.style.opacity = textOpacity;
        centerText.style.transform = 'scale(' + (0.88 + 0.12 * progress) + ')';
      } else {
        centerText.style.opacity = 0;
      }

      // Scroll hint fade-out
      if (scrollHint) {
        scrollHint.style.opacity = Math.max(0, 1 - progress * 1.8);
      }

      const mobileScale = isMobile ? 0.72 : 1.0;
      cardNodes.forEach(({ el, data }, idx) => {
        const tx = (data.stackOffset.x + (data.target.x - data.stackOffset.x) * progress) * mobileScale;
        const ty = (data.stackOffset.y + (data.target.y - data.stackOffset.y) * progress) * mobileScale;
        const rot = data.stackRotate + (data.target.rotate - data.stackRotate) * progress;
        const sc = 0.82 + (data.target.scale - 0.82) * progress;

        const depth = 0.5 + (idx / (CARDS_DATA.length - 1)) * 0.8;
        const dx = tx - pointerX * 2.2 * depth * progress;
        const dy = ty - pointerY * 1.8 * depth * progress;

        el.style.transform = `translate(calc(-50% + ${dx}vw), calc(-50% + ${dy}vh)) rotate(${rot}deg) scale(${sc})`;
      });

      requestAnimationFrame(updatePhysics);
    }

    requestAnimationFrame(updatePhysics);
  }

  // Architectural Metamorphosis: Before & After Optical Lens
  const blendStage = document.getElementById('visualBlendStage');
  const blendLuxuryLayer = document.getElementById('blendLuxuryLayer');
  const blendAutoScanBtn = document.getElementById('blendAutoScanBtn');
  const blendResetBtn = document.getElementById('blendResetBtn');
  const blendDragHint = document.getElementById('blendDragHint');

  if (blendStage && blendLuxuryLayer) {
    let isDragging = false;
    let autoScanRunning = false;
    let autoScanAnimId = null;
    let autoScanAngle = 0;

    function setBlendPos(percentage) {
      const clamped = Math.max(1, Math.min(99, percentage));
      blendStage.style.setProperty('--blend-pos', clamped.toFixed(2) + '%');
      const handle = document.getElementById('blendHandle');
      if (handle) handle.setAttribute('aria-valuenow', Math.round(clamped));
    }

    setBlendPos(50); // Clean initial 50% split

    function stopAutoScan() {
      if (autoScanRunning) {
        autoScanRunning = false;
        if (autoScanAnimId) cancelAnimationFrame(autoScanAnimId);
        if (blendAutoScanBtn) {
          blendAutoScanBtn.classList.remove('active');
          blendAutoScanBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Auto Scan</span>
          `;
        }
      }
    }

    function startAutoScan() {
      stopAutoScan();
      autoScanRunning = true;
      if (blendDragHint) blendDragHint.style.opacity = '0';
      if (blendAutoScanBtn) {
        blendAutoScanBtn.classList.add('active');
        blendAutoScanBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          <span>Pause</span>
        `;
      }

      function loop() {
        if (!autoScanRunning) return;
        autoScanAngle += 0.022;
        // Oscillate smoothly between 18% and 82%
        const pos = 50 + Math.sin(autoScanAngle) * 32;
        setBlendPos(pos);
        autoScanAnimId = requestAnimationFrame(loop);
      }
      autoScanAnimId = requestAnimationFrame(loop);
    }

    if (blendAutoScanBtn) {
      blendAutoScanBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (autoScanRunning) {
          stopAutoScan();
        } else {
          startAutoScan();
        }
      });
    }

    if (blendResetBtn) {
      blendResetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAutoScan();
        setBlendPos(50);
      });
    }

    function handleBlendMove(clientX) {
      const rect = blendStage.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setBlendPos(pct);
      if (blendDragHint) blendDragHint.style.opacity = '0';
    }

    blendStage.addEventListener('pointerdown', (e) => {
      stopAutoScan();
      isDragging = true;
      blendStage.setPointerCapture(e.pointerId);
      handleBlendMove(e.clientX);
    });

    blendStage.addEventListener('pointermove', (e) => {
      if (isDragging) {
        handleBlendMove(e.clientX);
      }
    });

    blendStage.addEventListener('pointerup', () => {
      isDragging = false;
    });

    blendStage.addEventListener('pointercancel', () => {
      isDragging = false;
    });

    // Scene Presets
    const tabBtns = document.querySelectorAll('.blend-tab-btn');
    const rawImg = document.getElementById('blendRawImg');
    const luxuryImg = document.getElementById('blendLuxuryImg');
    const rawTitle = document.getElementById('blendRawTitle');
    const luxuryTitle = document.getElementById('blendLuxuryTitle');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (rawImg && btn.dataset.raw) rawImg.src = btn.dataset.raw;
        if (luxuryImg && btn.dataset.luxury) luxuryImg.src = btn.dataset.luxury;
        if (rawTitle && btn.dataset.tag1) rawTitle.innerHTML = btn.dataset.tag1;
        if (luxuryTitle && btn.dataset.tag2) luxuryTitle.innerHTML = btn.dataset.tag2;

        setBlendPos(50);
      });
    });
  }

});
