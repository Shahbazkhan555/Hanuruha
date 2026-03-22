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

  // ===== BOOKING FORM =====
  document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '✓ Consultation Booked Successfully!';
    btn.style.background = 'linear-gradient(135deg, #2e7d32, #43a047)';
    setTimeout(() => {
      btn.innerHTML = '📅 Book Free Consultation';
      btn.style.background = '';
      e.target.reset();
    }, 3000);
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

  const chatResponses = {
    'program': 'We offer 6 main programs: Medical Detoxification, Psychiatric Treatment, Individual Therapy, Group Therapy, Yoga & Meditation, and Art & Music Therapy. Each is tailored to your unique needs. Would you like details on any specific program? 🌿',
    'cost': 'Treatment costs vary based on the program and duration. We offer flexible payment plans and EMI options to make treatment accessible. Would you like to speak with our team about pricing? 💰',
    'insurance': 'We currently do not support insurance payments, but we do offer flexible payment plans and EMI options. Our team can discuss affordable options that work for you. 📋',
    'book': 'I\'d love to help you book a consultation! You can schedule an In-Person, Video, or Phone consultation through our booking section. Would you like me to guide you there? 📅',
    'help': 'You\'re not alone, and taking this step takes incredible courage. 💛 Our team is available 24/7. You can call us at +91 73494 90505 or WhatsApp us anytime. We\'re here for you.',
    'admission': 'Our admission process is simple and compassionate. It starts with a free consultation, followed by an assessment and personalized treatment plan. We handle everything to make it as smooth as possible for you and your family. 🤝',
    'location': 'Hanuruha is located in Bangalore, Karnataka, India. We have a serene, home-like campus designed for comfort and healing. Would you like to take a virtual tour of our facility? 📍',
    'duration': 'Treatment duration typically ranges from 30 to 90 days, depending on individual needs. Some programs offer extended care options. Our team will create a timeline that works best for your recovery journey. ⏰',
    'family': 'Absolutely! We offer dedicated family therapy sessions and family integration programs. We believe healing is a journey that involves the entire family. Your loved ones are welcome to participate. 👨‍👩‍👧‍👦',
  };

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotResponse(message) {
    const lower = message.toLowerCase();
    for (const [key, response] of Object.entries(chatResponses)) {
      if (lower.includes(key)) return response;
    }
    return 'Thank you for reaching out! 🌿 For specific queries, I recommend speaking with our team directly. You can call +91 73494 90505 (24/7) or fill out our booking form for a free consultation. Is there anything else I can help with?';
  }

  function sendMessage() {
    const text = chatInput.value.trim();
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
    
    setTimeout(() => {
      typing.remove();
      addMessage(getBotResponse(text), 'bot');
    }, 1000 + Math.random() * 500);
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.tour-item').forEach(item => {
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
    anchor.addEventListener('click', function(e) {
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
    textarea.addEventListener('focus', function() {
      this.style.borderColor = '#F08321';
      this.style.background = '#fff';
      this.style.boxShadow = '0 0 0 4px rgba(240,131,33,0.1)';
    });
    textarea.addEventListener('blur', function() {
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
