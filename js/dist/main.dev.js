"use strict";

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  var menuToggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');
  var dropdowns = document.querySelectorAll('.dropdown');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    }); // Close menu when clicking outside

    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  } // Handle dropdowns in mobile view


  dropdowns.forEach(function (dropdown) {
    dropdown.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.classList.toggle('active');
      }
    });
  }); // Close mobile menu when clicking on a link

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  }); // Navbar scroll effect

  var navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  } // Smooth scrolling for anchor links


  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  }); // Initialize scroll reveal animations

  initScrollReveal(); // Handle animations on resize

  var resizeTimer;
  window.addEventListener('resize', function () {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      document.body.classList.remove('resize-animation-stopper');
    }, 400);
  }); // Contact Form Handling

  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function _callee(e) {
      var name, email, message, submitButton;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              e.preventDefault(); // Basic form validation

              name = document.getElementById('name').value;
              email = document.getElementById('email').value;
              message = document.getElementById('message').value;

              if (!(!name || !email || !message)) {
                _context.next = 7;
                break;
              }

              alert('Please fill in all required fields');
              return _context.abrupt("return");

            case 7:
              // Add loading state to button
              submitButton = contactForm.querySelector('button[type="submit"]');
              submitButton.disabled = true;
              submitButton.innerHTML = 'Sending...';
              _context.prev = 10;
              _context.next = 13;
              return regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 1000);
              }));

            case 13:
              alert('Thank you for your message. We will contact you soon!');
              contactForm.reset();
              _context.next = 20;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](10);
              alert('There was an error sending your message. Please try again.');

            case 20:
              _context.prev = 20;
              submitButton.disabled = false;
              submitButton.innerHTML = 'Send Message';
              return _context.finish(20);

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[10, 17, 20, 24]]);
    });
  } // Intersection Observer for scroll animations


  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  }); // Observe all animated elements

  document.querySelectorAll('.animate-from-left, .animate-from-right, .animate-from-bottom').forEach(function (el) {
    return observer.observe(el);
  });
}); // Enhanced Scroll Reveal Animation

function initScrollReveal() {
  var animateElements = document.querySelectorAll('.animate-from-bottom, .animate-from-left, .animate-from-right, .reveal');
  var options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active'); // Optional: Reset animation when element is out of view
        // } else {
        //     entry.target.classList.remove('active');
      }
    });
  }, options);
  animateElements.forEach(function (element) {
    observer.observe(element); // Add initial state class

    element.classList.add('animate-init');
  });
} // Additional animation for floating contacts on scroll


window.addEventListener('scroll', function () {
  var floatingContacts = document.querySelector('.floating-contacts');
  var contactHero = document.querySelector('.contact-hero');
  var heroHeight = contactHero.offsetHeight;
  var scrollPosition = window.scrollY;

  if (scrollPosition > heroHeight * 0.3) {
    floatingContacts.style.transform = 'translateY(0) scale(0.9)';
    floatingContacts.style.opacity = '0.9';
  } else {
    floatingContacts.style.transform = 'translateY(0) scale(1)';
    floatingContacts.style.opacity = '1';
  }
}); // Initialize animations after page load

window.addEventListener('load', initScrollReveal);
//# sourceMappingURL=main.dev.js.map
