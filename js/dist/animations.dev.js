"use strict";

// Additional animations and effects
document.addEventListener('DOMContentLoaded', function () {
  // Parallax effect for hero section
  var hero = document.querySelector('.hero');

  if (hero) {
    window.addEventListener('scroll', function () {
      var scrollPosition = window.pageYOffset;
      hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
  } // Product card hover effect


  var productCards = document.querySelectorAll('.product-card');
  productCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var angleX = (y - centerY) / 20;
      var angleY = (centerX - x) / 20;
      this.style.transform = "perspective(1000px) rotateX(".concat(angleX, "deg) rotateY(").concat(angleY, "deg)");
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }); // Animate elements when they come into view

  var animateOnScroll = function animateOnScroll() {
    var elements = document.querySelectorAll('.animate-from-bottom, .animate-from-left, .animate-from-right, .animate-fade-in');
    elements.forEach(function (element) {
      var elementPosition = element.getBoundingClientRect().top;
      var screenPosition = window.innerHeight / 1.2;

      if (elementPosition < screenPosition) {
        element.style.animationPlayState = 'running';
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on page load
});
document.addEventListener('DOMContentLoaded', function () {
  // Reveal animations
  var revealElements = document.querySelectorAll('.reveal');

  var revealOnScroll = function revealOnScroll() {
    revealElements.forEach(function (element) {
      var elementTop = element.getBoundingClientRect().top;
      var windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
  // Trigger stats animation when section is in view

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  });
  var statsSection = document.querySelector('.stats-section');

  if (statsSection) {
    observer.observe(statsSection);
  }
});
document.addEventListener('DOMContentLoaded', function () {
  var observerOptions = {
    threshold: 0.2,
    rootMargin: '50px'
  };

  var revealCallback = function revealCallback(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  };

  var revealObserver = new IntersectionObserver(revealCallback, observerOptions);
  document.querySelectorAll('.product-card, .vehicle-card').forEach(function (element) {
    revealObserver.observe(element);
  });
});
//# sourceMappingURL=animations.dev.js.map
