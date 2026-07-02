document.addEventListener('DOMContentLoaded', () => {
  // Init core features
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initButtonRipple();
  initActiveNavLink();
  initFAQs();
  initForms();
  initUserAccountDropdown();
  
  // Redesigned Hero interactions
  initMouseParallax();
  
  // Premium Homepage elements
  initHomepageCarousels();
  
  // Conditionally init gallery/courses filters if the components exist on the page
  if (document.querySelector('.gallery-grid')) {
    initGallery();
  }
  if (document.querySelector('.gal-grid') || document.getElementById('galGrid')) {
    initPremiumGallery();
  }
  if (document.querySelector('.courses-grid') || document.querySelector('.filter-btn')) {
    initCourseFilters();
  }

  // Journey 3D Coverflow Carousel
  if (document.querySelector('.journey-card')) {
    initJourneyCarousel();
  }

  // 3D Mouse Tilt for Premium Cards
  initTiltCards();
});

/* ==========================================
   USER ACCOUNT DROPDOWN
   ========================================== */
function initUserAccountDropdown() {
  const profileBtn = document.getElementById('userProfileBtn');
  const dropdown = document.getElementById('userDropdown');

  if (!profileBtn || !dropdown) return;

  // Toggle dropdown on button click
  profileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isActive = dropdown.classList.contains('active');
    dropdown.classList.toggle('active', !isActive);
    this.setAttribute('aria-expanded', String(!isActive));
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      profileBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      profileBtn.setAttribute('aria-expanded', 'false');
      profileBtn.focus();
    }
  });
}

/* ==========================================
   HEADER SCROLL & SCROLL DIRECTION LOGIC
   ========================================== */
function initHeader() {
  const header = document.querySelector('header');
  const backToTopBtn = document.querySelector('.back-to-top');
  const navMenu = document.querySelector('.nav-menu');
  const dropdown = document.getElementById('userDropdown');
  
  if (!header) return;

  let lastScrollY = window.scrollY;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Glassmorphism scroll state
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Smart navbar: hide on scroll down, show on scroll up
    // Prevent hiding if the mobile menu drawer or user profile dropdown is open
    const isMobileMenuOpen = navMenu && navMenu.classList.contains('active');
    const isDropdownOpen = dropdown && dropdown.classList.contains('active');

    if (currentScrollY > scrollThreshold && !isMobileMenuOpen && !isDropdownOpen) {
      if (currentScrollY > lastScrollY) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    } else {
      header.classList.remove('header-hidden');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (currentScrollY > 600) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    lastScrollY = currentScrollY;
  });

  // Smooth scroll back to top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================
   MOBILE MENU DRAWER
   ========================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const dropdown = document.getElementById('mobNavDropdown');
  const dropdownLinks = document.querySelectorAll('.mob-dropdown-link');
  const overlay = document.getElementById('navOverlay');
  const closeBtn = document.getElementById('mobCloseBtn');

  if (!hamburger || !dropdown) return;

  function openMenu() {
    hamburger.classList.add('active');
    dropdown.classList.add('active');
    if (overlay) overlay.classList.add('visible');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    dropdown.classList.remove('active');
    if (overlay) overlay.classList.remove('visible');
    document.body.classList.remove('no-scroll');
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent immediate click propagation to document listener
    if (hamburger.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking the close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close menu when clicking the overlay
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close menu when clicking an option
  dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (dropdown.classList.contains('active')) {
      if (!dropdown.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    }
  });
}

/* ==========================================
   INTERSECTION OBSERVER FOR SCROLL REVEAL
   ========================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after showing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/* ==========================================
   ANIMATED STATS COUNTERS
   ========================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length === 0) return;

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetEl = entry.target;
        const targetValue = parseInt(targetEl.getAttribute('data-target'), 10);
        const suffix = targetEl.getAttribute('data-suffix') || '';
        
        animateCounter(targetEl, targetValue, suffix);
        observer.unobserve(targetEl);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => {
    countObserver.observe(num);
  });
}

function animateCounter(element, target, suffix) {
  let start = 0;
  const duration = 2000; // 2 seconds
  const stepTime = Math.abs(Math.floor(duration / target));
  
  const timer = setInterval(() => {
    start += Math.ceil(target / 40); // Increment dynamically for smooth speed
    if (start >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = start + suffix;
    }
  }, stepTime > 30 ? stepTime : 30);
}

/* ==========================================
   BUTTON RIPPLE EFFECT
   ========================================== */
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Find coordinates
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      // Remove after animation completes
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  });
}

/* ==========================================
   NAVBAR ACTIVE STATE LINK HIGHLIGHT
   ========================================== */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  // Get filename from path
  const currentPath = window.location.pathname;
  let filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  // Default to index.html if empty
  if (filename === '' || filename === '/') {
    filename = 'index.html';
  }

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === filename) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================
   ACCORDION SYSTEM (FAQs)
   ========================================== */
function initFAQs() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const faqContent = this.nextElementSibling;
      const isActive = faqItem.classList.contains('active');
      
      // Close other open FAQ items for a neat accordion behavior
      document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (!isActive) {
        faqItem.classList.add('active');
        faqContent.style.maxHeight = faqContent.scrollHeight + "px";
      } else {
        faqItem.classList.remove('active');
        faqContent.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================
   COURSE FILTERING LOGIC
   ========================================== */
function initCourseFilters() {
  const filterBtns = document.querySelectorAll('.courses-section .filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (filterBtns.length === 0 || courseCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Toggle active classes on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');

      // Filter cards
      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   PREMIUM GALLERY & CUSTOM LIGHTBOX SYSTEM
   ========================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-section .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryGrid = document.querySelector('.gallery-grid');
  
  if (!galleryGrid || galleryItems.length === 0) return;

  // 1. Gallery Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 2. Lightbox Setup & Modal Logic
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  lightbox.setAttribute('id', 'custom-lightbox');
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
      <div class="lightbox-img-wrapper">
        <img src="" alt="Exhibition Art">
      </div>
      <div class="lightbox-caption">
        <h3></h3>
        <p></p>
      </div>
      <button class="lightbox-next" aria-label="Next image">&#10095;</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img-wrapper img');
  const lightboxTitle = lightbox.querySelector('.lightbox-caption h3');
  const lightboxArtist = lightbox.querySelector('.lightbox-caption p');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let activeIndex = 0;
  let visibleItems = [];

  // Open Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      // Re-evaluate visible items based on current active category filters
      visibleItems = Array.from(galleryItems).filter(el => el.style.display !== 'none');
      activeIndex = visibleItems.indexOf(this);
      
      updateLightboxContent();
      
      lightbox.classList.add('active');
      document.body.classList.add('overflow-hidden');
    });
  });

  function updateLightboxContent() {
    if (visibleItems.length === 0) return;
    const currentItem = visibleItems[activeIndex];
    const imgElement = currentItem.querySelector('.gallery-img-wrapper img');
    const title = currentItem.querySelector('.gallery-overlay h3').textContent;
    const desc = currentItem.querySelector('.gallery-overlay p').textContent;

    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightboxTitle.textContent = title;
    lightboxArtist.textContent = desc;
  }

  // Close Lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Next Slide
  function showNext() {
    if (visibleItems.length <= 1) return;
    activeIndex = (activeIndex + 1) % visibleItems.length;
    updateLightboxContent();
  }

  // Previous Slide
  function showPrev() {
    if (visibleItems.length <= 1) return;
    activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxContent();
  }

  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });
}

/* ==========================================
   FORMS HANDLING & TOAST ALERTS
   ========================================== */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  // 1. Toast Notification Setup
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.classList.add('toast-msg');
    document.body.appendChild(toast);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // 2. Contact Form Submit Validation
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Simple email pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      // Form validation succeeds
      showToast('Thank you! Your message has been sent. We will respond within 24 hours.');
      contactForm.reset();
    });
  }

  // 3. Newsletter submits
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('.newsletter-input');
      const email = input.value.trim();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailPattern.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      showToast('Welcome to our Art Community! You are now subscribed to the Pencil Tip newsletter.');
      input.value = '';
    });
  });
}

/* ==========================================
   MOUSE PARALLAX INTERACTION (HERO SECTION)
   ========================================== */
function initMouseParallax() {
  const hero = document.querySelector('.hero');
  const layers = document.querySelectorAll('.parallax-layer');
  
  if (!hero || layers.length === 0) return;
  
  hero.addEventListener('mousemove', (e) => {
    // Get mouse coordinates relative to the center of the hero section
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    layers.forEach(layer => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
      // Calculate translation based on depth and mouse position
      const moveX = x * depth * 0.05;
      const moveY = y * depth * 0.05;
      
      // Apply translation using 3D transforms for hardware acceleration
      layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
  
  // Reset layers position when mouse leaves the hero section
  hero.addEventListener('mouseleave', () => {
    layers.forEach(layer => {
      layer.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}



/* ==========================================
   HOMEPAGE PREMIUM REDESIGN INTERACTIVE SCRIPTS
   ========================================== */
function initHomepageCarousels() {
  // 1. Virtual Gallery Carousel
  const gallerySlides = document.querySelectorAll('.exhibition-slide');
  const prevBtn = document.querySelector('.exhibition-nav-btn.prev');
  const nextBtn = document.querySelector('.exhibition-nav-btn.next');
  let currentSlide = 0;

  if (gallerySlides.length > 0) {
    function showSlide(index) {
      gallerySlides.forEach(slide => slide.classList.remove('active'));
      currentSlide = (index + gallerySlides.length) % gallerySlides.length;
      gallerySlides[currentSlide].classList.add('active');
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    }
  }

  // 2. Success Stories Carousel
  const successSlider = document.querySelector('.success-slide-container');
  const successDots = document.querySelectorAll('.success-carousel-dot');
  
  if (successSlider && successDots.length > 0) {
    successDots.forEach(dot => {
      dot.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-slide'), 10);
        
        successDots.forEach(d => d.classList.remove('active'));
        this.classList.add('active');
        
        successSlider.style.transform = `translateX(-${slideIndex * 100}%)`;
      });
    });
  }

  // 3. Studio Facilities Interactive Tabs
  const facilityTabs = document.querySelectorAll('.facility-tab-item');
  const facilityImage = document.querySelector('.facility-showcase-panel img');
  const facilityHeading = document.querySelector('.facility-overlay-desc h3');
  const facilityPara = document.querySelector('.facility-overlay-desc p');

  if (facilityTabs.length > 0 && facilityImage) {
    // Add transitions inline if not present in style
    facilityImage.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
    
    facilityTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        
        facilityTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const imgPath = this.getAttribute('data-image');
        const headingText = this.getAttribute('data-heading');
        const descText = this.getAttribute('data-desc');

        // Apply smooth fade transition
        facilityImage.style.opacity = '0';
        setTimeout(() => {
          facilityImage.src = imgPath;
          facilityHeading.textContent = headingText;
          facilityPara.textContent = descText;
          facilityImage.style.opacity = '1';
        }, 300);
      });
    });
  }
}

/* ==========================================
   OUR JOURNEY — 3D COVERFLOW CAROUSEL ENGINE
   ========================================== */
function initJourneyCarousel() {
  const cards   = Array.from(document.querySelectorAll('.journey-card'));
  const prevBtn = document.getElementById('journeyPrev');
  const nextBtn = document.getElementById('journeyNext');
  const wrapper = document.getElementById('journeyCarouselWrapper');

  if (!cards.length || !wrapper) return;

  const total      = cards.length;
  let   current    = 0;
  let   autoTimer  = null;
  const AUTOPLAY_MS = 10000;
  let   isHovered  = false;

  /* ── State classes ─────────────────────────────────────────────── */
  const ALL_STATES = ['is-active','is-prev','is-next','is-far-prev','is-far-next','is-hidden'];

  function mod(n, m) { return ((n % m) + m) % m; }

  function relPos(i) {
    const diff    = mod(i - current, total);
    const signed  = diff > total / 2 ? diff - total : diff;
    return signed;
  }

  function stateFor(pos) {
    if (pos ===  0) return 'is-active';
    if (pos ===  1) return 'is-next';
    if (pos === -1) return 'is-prev';
    if (pos ===  2) return 'is-far-next';
    if (pos === -2) return 'is-far-prev';
    return 'is-hidden';
  }

  function render() {
    cards.forEach((card, i) => {
      const pos = relPos(i);
      const cls = stateFor(pos);
      ALL_STATES.forEach(c => card.classList.remove(c));
      card.classList.add(cls);
    });
  }

  function goTo(idx) {
    current = mod(idx, total);
    render();
  }

  function prev() { goTo(current - 1); }
  function next() { goTo(current + 1); }

  /* ── Initial render ────────────────────────────────────────────── */
  render();

  /* ── Arrow buttons ─────────────────────────────────────────────── */
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  /* ── Card click & keyboard selection ─────────────────────────────── */
  cards.forEach(card => {
    let startX = 0;
    let startY = 0;

    card.addEventListener('pointerdown', e => {
      startX = e.clientX;
      startY = e.clientY;
    });

    card.addEventListener('pointerup', e => {
      // Ignore clicks on the Learn More button itself
      if (e.target.closest('.journey-learn-btn')) return;

      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);

      // If the pointer moved less than 15px, treat it as a click/tap
      if (dx < 15 && dy < 15) {
        const idx = parseInt(card.dataset.index, 10);
        if (relPos(idx) !== 0) {
          goTo(idx);
          resetAuto();
        }
      }
    });

    // Keyboard: Enter / Space
    card.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const idx = parseInt(this.dataset.index, 10);
      if (relPos(idx) !== 0) {
        goTo(idx);
        resetAuto();
      }
    });
  });

  /* ── Pointer-drag detection ─────────────────────────────────────── */
  let pointerDownX = 0;
  let pointerDownY = 0;

  wrapper.addEventListener('pointerdown', e => {
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
  });

  /* ── Mouse-drag to navigate (desktop) ──────────────────────────── */
  wrapper.addEventListener('pointerup', e => {
    const dx = e.clientX - pointerDownX;
    const dy = e.clientY - pointerDownY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else         prev();
      resetAuto();
    }
  });

  /* ── Touch swipe (mobile) ───────────────────────────────────────── */
  let touchX0 = 0, touchY0 = 0;
  wrapper.addEventListener('touchstart', e => {
    touchX0 = e.touches[0].clientX;
    touchY0 = e.touches[0].clientY;
  }, { passive: true });
  wrapper.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX0;
    const dy = e.changedTouches[0].clientY - touchY0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
      resetAuto();
    }
  }, { passive: true });

  /* ── Keyboard arrow keys (when section in viewport) ────────────── */
  document.addEventListener('keydown', e => {
    const section = document.getElementById('ourJourney');
    if (!section) return;
    const r = section.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
  });

  /* ── Auto-play ──────────────────────────────────────────────────── */
  function startAuto() {
    stopAuto();
    if (!isHovered) {
      autoTimer = setInterval(next, AUTOPLAY_MS);
    }
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetAuto() {
    startAuto();
  }

  // Pause on hover / focus (only on hover-capable devices to avoid freezing on touch devices)
  if (window.matchMedia('(hover: hover)').matches) {
    wrapper.addEventListener('mouseenter', () => {
      isHovered = true;
      stopAuto();
    });
    wrapper.addEventListener('mouseleave', () => {
      isHovered = false;
      startAuto();
    });
    wrapper.addEventListener('focusin', () => {
      isHovered = true;
      stopAuto();
    });
    wrapper.addEventListener('focusout', () => {
      isHovered = false;
      startAuto();
    });
  }

  // Start auto-play only when section enters viewport
  const journeySection = document.getElementById('ourJourney');
  if (journeySection && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startAuto();
        else stopAuto();
      });
    }, { threshold: 0.2 });
    io.observe(journeySection);
  } else {
    startAuto();
  }
}

/* ==========================================
   3D MOUSE TILT EFFECT FOR PREMIUM CARDS
   ========================================== */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top;  // y position within the element.
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8; // max 8 deg rotation
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      card.style.transition = 'none'; // remove transition for real-time tracking
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease';
    });
  });
}

/* ==========================================
   THE EXHIBITION HALL — PREMIUM GALLERY LOGIC
   ========================================== */
function initPremiumGallery() {
  const grid = document.getElementById('galGrid');
  const pills = document.querySelectorAll('.gal-pill');
  const countNum = document.getElementById('galCountNum');
  const emptyState = document.getElementById('galEmpty');
  
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.gal-item'));
  let visibleItems = [...items]; // Currently visible items based on filter

  // ── 1. Grid Filtering with Smooth Transition ───────────────────────────
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Set active class
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Scroll active pill into horizontal view on mobile scroll tracks
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      const filter = pill.getAttribute('data-filter');

      // Fade out grid first
      grid.style.opacity = '0.15';
      grid.style.transform = 'translateY(10px)';

      setTimeout(() => {
        // Filter items
        if (filter === 'all') {
          visibleItems = items;
        } else {
          visibleItems = items.filter(item => item.getAttribute('data-category') === filter);
        }

        // Toggle display of items
        items.forEach(item => {
          if (visibleItems.includes(item)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });

        // Update counts & empty states
        countNum.textContent = visibleItems.length;
        if (visibleItems.length === 0) {
          emptyState.style.display = 'block';
        } else {
          emptyState.style.display = 'none';
        }

        // Fade grid back in
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      }, 350);
    });
  });

  // ── 2. Premium Lightbox Controller (Artwork Details View) ──────────────────
  const lightbox = document.getElementById('galLightbox');
  const lbImg = document.getElementById('galLbImg');
  const lbTitle = document.getElementById('galLbTitle');
  const lbArtist = document.getElementById('galLbArtist');
  const lbCat = document.getElementById('galLbCat');
  const lbMedium = document.getElementById('galLbMedium');
  const lbDims = document.getElementById('galLbDims');
  const lbYear = document.getElementById('galLbYear');
  const lbDesc = document.getElementById('galLbDesc');
  const lbExtra = document.getElementById('galLbExtra');
  
  const lbClose = document.getElementById('galLbClose');
  const lbBackdrop = document.getElementById('galLbBackdrop');

  let currentIndex = 0;

  const catMapping = {
    'oil-acrylic': 'Oil & Acrylic',
    'sketch-ink': 'Sketch & Ink',
    'watercolor': 'Watercolor',
    'sculpture': 'Sculpture & Clay',
    'digital': 'Digital Art',
    'studio': 'Studio & Life'
  };

  function updateLightboxContent() {
    if (visibleItems.length === 0) return;
    const currentItem = visibleItems[currentIndex];
    
    // Smooth transition between details view
    lbImg.style.opacity = '0';
    setTimeout(() => {
      const img = currentItem.querySelector('.gal-img-wrap img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      
      lbTitle.textContent = currentItem.getAttribute('data-title') || '';
      lbArtist.textContent = currentItem.getAttribute('data-artist') || '';
      
      const rawCat = currentItem.getAttribute('data-category');
      lbCat.textContent = catMapping[rawCat] || rawCat;
      
      lbMedium.textContent = currentItem.getAttribute('data-medium') || '';
      lbDims.textContent = currentItem.getAttribute('data-dimensions') || '';
      lbYear.textContent = currentItem.getAttribute('data-year') || '';
      lbDesc.textContent = currentItem.getAttribute('data-description') || '';
      lbExtra.textContent = currentItem.getAttribute('data-extra') || '';
      
      // Remove zoom status
      lbImg.classList.remove('zoomed');

      lbImg.style.opacity = '1';
    }, 150);
  }

  function openLightbox(indexInVisible) {
    currentIndex = indexInVisible;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.classList.add('overflow-hidden');
    document.documentElement.classList.add('overflow-hidden');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
    document.documentElement.classList.remove('overflow-hidden');
    lbImg.classList.remove('zoomed');
  }

  // Click card to open using event delegation on the grid container - view button only
  grid.addEventListener('click', (e) => {
    // Find the closest "View Artwork" button (only action that opens detailed view)
    const viewBtn = e.target.closest('.gal-view-btn');
    if (!viewBtn) return;

    // Find the parent .gal-item card element
    const card = viewBtn.closest('.gal-item');
    if (!card) return;

    // Resolve index of this card within currently visible/filtered list
    const index = visibleItems.indexOf(card);
    if (index !== -1) {
      openLightbox(index);
    }
  });

  // Control Listeners (Back to Gallery button and backdrop click)
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

  // Tap-to-zoom on image click inside detail view
  if (lbImg) {
    lbImg.addEventListener('click', (e) => {
      e.stopPropagation();
      lbImg.classList.toggle('zoomed');
    });
  }

  // Keyboard navigation - ESC key only closes the details page
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
  });
}

