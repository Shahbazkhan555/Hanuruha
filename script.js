/* ============================================
   HANURUHA – Women's Rehabilitation Centre
   Interactive Website JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== MOBILE MENU =====
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const suffix = counter.getAttribute('data-suffix') || '+';
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            counter.textContent = current + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ===== TESTIMONIALS CAROUSEL =====
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testimonial-slide').length;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => goToSlide(+dot.getAttribute('data-index')));
  });

  // Auto-play carousel
  let autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);

  const carousel = document.querySelector('.testimonial-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
  carousel.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
  });

  // ===== INSURANCE FORM STEPS =====
  // Insurance form removed - not supported

  // ===== BOOKING FORM → GOOGLE SHEETS =====
  // ⚠️ REPLACE THIS URL with your deployed Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_1vOuRRffa44vonyO-q-q0wyTYgnu5P0jEzgInbOaqW4natESlfJOZGTYFQnCM7FqrQ/exec';

  document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Collect form data
    const formData = {
      name: document.getElementById('bookName').value,
      phone: document.getElementById('bookPhone').value,
      email: document.getElementById('bookEmail').value,
      type: document.getElementById('bookType').value,
      date: document.getElementById('bookDate').value,
      message: document.getElementById('bookMessage').value
    };

    // Show loading state
    btn.innerHTML = '⏳ Submitting...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // With no-cors mode, we can't read the response, but if fetch didn't throw, it was sent
      btn.innerHTML = '✓ Consultation Booked Successfully!';
      btn.style.background = 'linear-gradient(135deg, #2e7d32, #43a047)';
      btn.style.opacity = '1';
      e.target.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);

    } catch (error) {
      console.error('Form submission error:', error);
      btn.innerHTML = '❌ Something went wrong. Try again.';
      btn.style.background = 'linear-gradient(135deg, #c62828, #e53935)';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });

  // ===== AI CHAT WIDGET =====
  const chatToggle = document.getElementById('chatToggle');
  const chatBox = document.getElementById('chatBox');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  chatToggle.addEventListener('click', () => {
    chatBox.classList.toggle('open');
    chatToggle.querySelector('.notification').style.display = 'none';
  });

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function sendMessage(textOverride = null) {
    // Determine input text either from parameter (Quick Response) or input field
    const text = typeof textOverride === 'string' ? textOverride : chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'chat-message bot';
    typing.textContent = '...';
    typing.style.opacity = '0.6';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: "chat", message: text })
      });

      const data = await response.json();
      typing.remove();
      addMessage(data.reply || "I'm sorry, I couldn't understand that.", 'bot');

    } catch (error) {
      console.error('AI Chat Error:', error);
      typing.remove();
      addMessage("I'm experiencing connection issues right now. For immediate help, please call +91 7353 836 666.", 'bot');
    }
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Attach Quick Reply button events
  const quickReplies = document.querySelectorAll('.quick-reply-btn');
  quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.textContent.trim());
    });
  });

  // ===== GALLERY FILTERING & PAGINATION & AUTOSWIPE =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const pageInfo = document.getElementById('galleryPageInfo');

  let currentFilter = 'all';
  let currentPage = 0;
  let autoSwipeInterval;

  function updateGalleryDisplay() {
    const itemsPerPageDynamic = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);

    const filteredItems = Array.from(galleryItems).filter(item => {
      const match = currentFilter === 'all' || item.classList.contains(currentFilter);
      if (match) {
        item.classList.add('show');
      } else {
        item.classList.remove('show');
      }
      return match;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPageDynamic);
    if (currentPage >= totalPages) currentPage = Math.max(0, totalPages - 1);

    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
      if (filteredItems.length > 0) {
        const itemWidth = filteredItems[0].offsetWidth;
        const gap = 20;
        const slideAmount = currentPage * itemsPerPageDynamic * (itemWidth + gap);
        galleryGrid.style.transform = `translateX(-${slideAmount}px)`;
      } else {
        galleryGrid.style.transform = `translateX(0px)`;
      }
    }

    if (pageInfo) {
      if (totalPages === 0) {
        pageInfo.textContent = '0 / 0';
      } else {
        pageInfo.textContent = `${currentPage + 1} / ${totalPages}`;
      }
    }
  }

  function startAutoSwipe() {
    stopAutoSwipe();
    autoSwipeInterval = setInterval(() => {
      const itemsPerPageDynamic = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
      const filteredItems = Array.from(galleryItems).filter(item => currentFilter === 'all' || item.classList.contains(currentFilter));
      const totalPages = Math.ceil(filteredItems.length / itemsPerPageDynamic);
      if (totalPages > 1) {
        currentPage++;
        if (currentPage >= totalPages) currentPage = 0; // loop back to first page
        updateGalleryDisplay();
      }
    }, 3500);
  }

  function stopAutoSwipe() {
    if (autoSwipeInterval) clearInterval(autoSwipeInterval);
  }

  updateGalleryDisplay();
  startAutoSwipe();

  // Pause autoswipe on hover
  const galleryWrapper = document.querySelector('.gallery-wrapper');
  if (galleryWrapper) {
    galleryWrapper.addEventListener('mouseenter', stopAutoSwipe);
    galleryWrapper.addEventListener('mouseleave', startAutoSwipe);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      currentPage = 0;
      updateGalleryDisplay();
      startAutoSwipe(); // reset interval on manual click
    });
  });

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.getAttribute('data-src');
      lightbox.classList.add('open');
    });
  });

  lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });

  // ===== ACCESSIBILITY PANEL =====
  const accessToggle = document.getElementById('accessToggle');
  const accessOptions = document.getElementById('accessOptions');

  accessToggle.addEventListener('click', () => {
    accessOptions.classList.toggle('open');
  });

  document.getElementById('textLarger').addEventListener('click', () => {
    document.body.classList.add('large-text');
  });

  document.getElementById('textSmaller').addEventListener('click', () => {
    document.body.classList.remove('large-text');
  });

  document.getElementById('contrastToggle').addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });

  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== ACTIVE NAV LINK HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = '#F08321';
        } else {
          link.style.color = '';
        }
      }
    });
  });

  // ===== PROGRAM CARD STAGGER ANIMATION =====
  const cards = document.querySelectorAll('.program-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  const whyCards = document.querySelectorAll('.why-us-card');
  whyCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // ===== PARALLAX EFFECT ON HERO =====
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-bg');
    if (hero) {
      const scrolled = window.scrollY;
      hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // ===== TEXTAREA FOCUS STYLE =====
  const textarea = document.getElementById('bookMessage');
  if (textarea) {
    textarea.addEventListener('focus', function () {
      this.style.borderColor = '#F08321';
      this.style.background = '#fff';
      this.style.boxShadow = '0 0 0 4px rgba(240,131,33,0.1)';
    });
    textarea.addEventListener('blur', function () {
      this.style.borderColor = '';
      this.style.background = '';
      this.style.boxShadow = '';
    });
  }

  // ===== PRELOADER SIMULATION =====
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

});
