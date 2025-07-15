"use strict";

// CLIENTS PAGE - PREMIUM INTERACTIVITY
document.addEventListener('DOMContentLoaded', function () {
  // Initialize GSAP and plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); // Set up custom cursor

  initCustomCursor(); // Initialize page animations

  initPageAnimations(); // Load and display client data

  loadClientData(); // Initialize testimonial slider

  initTestimonialSlider(); // Initialize case studies

  initCaseStudies(); // Initialize magnetic buttons

  initMagneticButtons(); // Initialize filter functionality

  initClientFilter();
});
document.addEventListener('DOMContentLoaded', function () {
  // Initialize animations
  initHeroAnimations();
  initScrollAnimations();
  initFilterButtons();
});

function initCustomCursor() {
  var cursor = document.querySelector('.custom-cursor');
  var follower = document.querySelector('.cursor-follower');

  if (window.innerWidth > 1024) {
    document.addEventListener('mousemove', function (e) {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6
      });
    }); // Add hover effects for interactive elements

    var hoverElements = document.querySelectorAll('a, button, .client-card, .case-study-card, .filter-btn');
    hoverElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(cursor, {
          scale: 0.5,
          backgroundColor: 'white',
          duration: 0.3
        });
        gsap.to(follower, {
          scale: 1.2,
          borderColor: 'white',
          duration: 0.3
        });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: '#2a5bd7',
          duration: 0.3
        });
        gsap.to(follower, {
          scale: 1,
          borderColor: '#2a5bd7',
          duration: 0.3
        });
      });
    });
  } else {
    cursor.style.display = 'none';
    follower.style.display = 'none';
  }
}

function initPageAnimations() {
  // Hero section animations
  var heroTitle = document.querySelector('.hero-title');
  var heroSubtitle = document.querySelector('.hero-subtitle');
  var scrollHint = document.querySelector('.scroll-hint'); // Split text for advanced animation

  if (heroTitle) {
    var text = heroTitle.textContent;
    heroTitle.innerHTML = '';

    for (var i = 0; i < text.length; i++) {
      var _char = document.createElement('span');

      _char.className = 'char';
      _char.textContent = text[i] === ' ' ? '&nbsp;' : text[i];
      heroTitle.appendChild(_char);
    }

    var chars = gsap.utils.toArray('.char');
    gsap.from(chars, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.03,
      delay: 0.3
    });
  }

  gsap.to(heroSubtitle, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    delay: 0.8
  });
  gsap.to(scrollHint, {
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    delay: 1.5
  }); // Section title animations

  gsap.utils.toArray('[data-animate="title"]').forEach(function (title) {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }); // Section subtitle animations

  gsap.utils.toArray('[data-animate="subtitle"]').forEach(function (subtitle) {
    gsap.from(subtitle, {
      scrollTrigger: {
        trigger: subtitle,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    });
  }); // Client card animations

  gsap.utils.toArray('.client-card').forEach(function (card, index) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power3.out'
    });
  }); // Case study animations

  gsap.utils.toArray('.case-study-card').forEach(function (card, index) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power3.out'
    });
  });
}

function loadClientData() {
  // In a real implementation, you would fetch this from an API
  var clientsData = [{
    id: 1,
    name: "Tech Solutions LLC",
    industry: "technology",
    description: "Enterprise IT infrastructure provider",
    logo: "../assets/images/clients/tech-solutions.png"
  }, {
    id: 2,
    name: "Digital Innovations",
    industry: "technology",
    description: "Software development company",
    logo: "../assets/images/clients/digital-innovations.png"
  }, {
    id: 3,
    name: "Emirates Bank",
    industry: "finance",
    description: "Leading financial institution",
    logo: "../assets/images/clients/emirates-bank.png"
  }, {
    id: 4,
    name: "Gulf Finance House",
    industry: "finance",
    description: "Investment banking services",
    logo: "../assets/images/clients/gulf-finance.png"
  }, {
    id: 5,
    name: "Dubai Municipality",
    industry: "government",
    description: "Government administration",
    logo: "../assets/images/clients/dubai-municipality.png"
  }, {
    id: 6,
    name: "Roads & Transport Authority",
    industry: "government",
    description: "Transportation infrastructure",
    logo: "../assets/images/clients/rta.png"
  }, {
    id: 7,
    name: "Gulf Retail Group",
    industry: "retail",
    description: "Regional retail chain",
    logo: "../assets/images/clients/gulf-retail.png"
  }, {
    id: 8,
    name: "Home Plus",
    industry: "retail",
    description: "Home appliances retailer",
    logo: "../assets/images/clients/home-plus.png"
  }, {
    id: 9,
    name: "Dubai Health Authority",
    industry: "healthcare",
    description: "Public healthcare provider",
    logo: "../assets/images/clients/dubai-health.png"
  }, {
    id: 10,
    name: "Medcare Hospitals",
    industry: "healthcare",
    description: "Private healthcare network",
    logo: "../assets/images/clients/medcare.png"
  }];
  var testimonialsData = [{
    id: 1,
    text: "Micorp Trading has been our trusted supplier for IT equipment for the past five years. Their reliability and technical expertise have been invaluable to our operations.",
    name: "Ali Al Maktoum",
    position: "IT Director, Tech Solutions LLC",
    photo: "../assets/images/testimonials/ali-al-maktoum.jpg"
  }, {
    id: 2,
    text: "The electronic products we've sourced through Micorp have significantly enhanced our retail offerings. Their competitive pricing and excellent service make them our preferred supplier.",
    name: "Fatima Al Hashimi",
    position: "Procurement Manager, Gulf Retail Group",
    photo: "../assets/images/testimonials/fatima-al-hashimi.jpg"
  }, {
    id: 3,
    text: "We've been working with Micorp Trading for our vehicle fleet needs for several years. Their professionalism and attention to detail have made them a trusted partner.",
    name: "Khalid Al Farsi",
    position: "Fleet Manager, Dubai Municipality",
    photo: "../assets/images/testimonials/khalid-al-farsi.jpg"
  }];
  var caseStudiesData = [{
    id: 1,
    title: "Enterprise IT Infrastructure Upgrade",
    description: "Complete overhaul of network infrastructure with next-gen equipment, resulting in 40% performance improvement and 30% reduction in downtime.",
    image: "../assets/images/case-studies/it-infrastructure.jpg",
    link: "#"
  }, {
    id: 2,
    title: "Retail Chain Electronics Supply",
    description: "Ongoing supply of consumer electronics to 25 retail locations across the UAE with 99.8% delivery accuracy and just-in-time inventory management.",
    image: "../assets/images/case-studies/retail-electronics.jpg",
    link: "#"
  }, {
    id: 3,
    title: "Municipal Fleet Modernization",
    description: "Supply and maintenance of 150 commercial vehicles with customized configurations for municipal operations, reducing maintenance costs by 25%.",
    image: "../assets/images/case-studies/fleet-modernization.jpg",
    link: "#"
  }]; // Populate clients grid

  var clientsGrid = document.querySelector('.clients-grid');
  clientsData.forEach(function (client) {
    var clientCard = document.createElement('div');
    clientCard.className = 'client-card';
    clientCard.setAttribute('data-industry', client.industry);
    clientCard.innerHTML = "\n            <div class=\"client-logo-container\">\n                <img src=\"".concat(client.logo, "\" alt=\"").concat(client.name, "\" class=\"client-logo\" loading=\"lazy\">\n            </div>\n            <div class=\"client-info\">\n                <h3>").concat(client.name, "</h3>\n                <p>").concat(client.description, "</p>\n            </div>\n        ");
    clientsGrid.appendChild(clientCard);
  }); // Populate testimonials slider

  var testimonialTrack = document.querySelector('.testimonial-track');
  var dotsContainer = document.querySelector('.slider-dots');
  testimonialsData.forEach(function (testimonial, index) {
    // Create testimonial slide
    var testimonialSlide = document.createElement('div');
    testimonialSlide.className = 'testimonial-slide';
    testimonialSlide.innerHTML = "\n            <div class=\"testimonial-content\">\n                <div class=\"quote-icon\">\n                    <i class=\"fas fa-quote-left\"></i>\n                </div>\n                <p class=\"testimonial-text\">\"".concat(testimonial.text, "\"</p>\n                <div class=\"client-details\">\n                    <img src=\"").concat(testimonial.photo, "\" alt=\"").concat(testimonial.name, "\" class=\"client-photo\" loading=\"lazy\">\n                    <div>\n                        <h4>").concat(testimonial.name, "</h4>\n                        <p class=\"client-position\">").concat(testimonial.position, "</p>\n                    </div>\n                </div>\n            </div>\n        ");
    testimonialTrack.appendChild(testimonialSlide); // Create slider dot

    var dot = document.createElement('span');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', function () {
      return goToSlide(index);
    });
    dotsContainer.appendChild(dot);
  }); // Populate case studies

  var caseStudiesGrid = document.querySelector('.case-studies-grid');
  caseStudiesData.forEach(function (study) {
    var caseStudyCard = document.createElement('div');
    caseStudyCard.className = 'case-study-card';
    caseStudyCard.innerHTML = "\n            <div class=\"case-study-image\">\n                <img src=\"".concat(study.image, "\" alt=\"").concat(study.title, "\" loading=\"lazy\">\n                <div class=\"case-study-overlay\">\n                    <h3>").concat(study.title, "</h3>\n                </div>\n            </div>\n            <div class=\"case-study-content\">\n                <p>").concat(study.description, "</p>\n                <a href=\"").concat(study.link, "\" class=\"btn-secondary\">Read Full Case Study</a>\n            </div>\n        ");
    caseStudiesGrid.appendChild(caseStudyCard);
  });
}

function initTestimonialSlider() {
  var track = document.querySelector('.testimonial-track');
  var slides = document.querySelectorAll('.testimonial-slide');
  var dots = document.querySelectorAll('.dot');
  var prevBtn = document.querySelector('.prev-slide');
  var nextBtn = document.querySelector('.next-slide');
  if (!track || slides.length === 0) return;
  var currentIndex = 0;
  var slideCount = slides.length;
  var autoSlideInterval; // Update slider position

  function updateSlider() {
    gsap.to(track, {
      x: "-".concat(currentIndex * 100, "%"),
      duration: 0.8,
      ease: 'power3.out'
    }); // Update active dot

    dots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === currentIndex);
    });
  } // Go to specific slide


  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoSlide();
  } // Next slide


  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlider();
    resetAutoSlide();
  } // Previous slide


  function prevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSlider();
    resetAutoSlide();
  } // Auto-advance slides


  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 6000);
  } // Reset auto-slide timer


  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  } // Event listeners


  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide); // Pause on hover

  track.addEventListener('mouseenter', function () {
    clearInterval(autoSlideInterval);
  });
  track.addEventListener('mouseleave', function () {
    startAutoSlide();
  }); // Start auto-slide

  startAutoSlide(); // Keyboard navigation

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });
}

function initCaseStudies() {
  var caseStudyCards = document.querySelectorAll('.case-study-card');
  caseStudyCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      gsap.to(card.querySelector('.case-study-overlay'), {
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
    card.addEventListener('mouseleave', function () {
      gsap.to(card.querySelector('.case-study-overlay'), {
        y: '100%',
        duration: 0.4,
        ease: 'power3.in'
      });
    });
  });
}

function initMagneticButtons() {
  var magneticButtons = document.querySelectorAll('.magnetic-button');
  magneticButtons.forEach(function (button) {
    var btnText = button.querySelector('.btn-text');
    var btnIcon = button.querySelector('.btn-icon');
    button.addEventListener('mousemove', function (e) {
      var rect = button.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var distanceX = x - centerX;
      var distanceY = y - centerY;
      gsap.to(button, {
        x: distanceX * 0.2,
        y: distanceY * 0.2,
        duration: 0.5,
        ease: 'power3.out'
      });
      gsap.to(btnText, {
        x: distanceX * 0.4,
        y: distanceY * 0.4,
        duration: 0.5,
        ease: 'power3.out'
      });
      gsap.to(btnIcon, {
        x: distanceX * 0.6,
        y: distanceY * 0.6,
        duration: 0.5,
        ease: 'power3.out'
      });
    });
    button.addEventListener('mouseleave', function () {
      gsap.to([button, btnText, btnIcon], {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

function initClientFilter() {
  var filterButtons = document.querySelectorAll('.filter-btn');
  var clientCards = document.querySelectorAll('.client-card');
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      // Update active button
      filterButtons.forEach(function (btn) {
        return btn.classList.remove('active');
      });
      button.classList.add('active');
      var filterValue = button.getAttribute('data-filter'); // Filter client cards

      clientCards.forEach(function (card) {
        if (filterValue === 'all' || card.getAttribute('data-industry') === filterValue) {
          card.style.display = 'block';
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out'
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: function onComplete() {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  });
}

function initHeroAnimations() {
  var title = document.querySelector('.hero-title');
  var subtitle = document.querySelector('.hero-subtitle');
  var scroll = document.querySelector('.scroll-hint');

  if (title) {
    // Split text into characters for animation
    var chars = title.textContent.split('');
    title.textContent = '';
    chars.forEach(function (_char2, i) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = _char2;
      span.style.animationDelay = "".concat(i * 0.05, "s");
      title.appendChild(span);
    });
  }

  if (subtitle) {
    setTimeout(function () {
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
    }, 500);
  }

  if (scroll) {
    setTimeout(function () {
      scroll.style.opacity = '1';
    }, 1000);
  }
}

function initScrollAnimations() {
  var elements = document.querySelectorAll('.reveal-on-scroll');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1
  });
  elements.forEach(function (el) {
    return observer.observe(el);
  });
}

function initFilterButtons() {
  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.client-card');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.dataset.filter;
      buttons.forEach(function (btn) {
        return btn.classList.remove('active');
      });
      button.classList.add('active');
      cards.forEach(function (card) {
        if (filter === 'all' || card.dataset.industry === filter) {
          card.style.display = 'block';
          setTimeout(function () {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px) scale(0.95)';
          setTimeout(function () {
            card.style.display = 'none';
          }, 600);
        }
      });
    });
  });
}
//# sourceMappingURL=clients.dev.js.map
