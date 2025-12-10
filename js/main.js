
document.addEventListener('DOMContentLoaded', () => {
    // COMMON SITE-WIDE INITIALIZATIONS
    initTheme(); // Initialize Dark/Light Theme
    initMobileMenu();
    initScrollBehaviors();
    initCurrentYear();
    initFloatingActionButtons();
    registerServiceWorker(); // Initialize PWA
    
    // HERO SLIDER INIT
    if (document.querySelector('.hero-slider')) {
        initHeroSlider();
    }

    // PAGE-SPECIFIC INITIALIZATIONS
    if (document.body.classList.contains('contact-page')) {
        initContactPage();
    }
    if (document.body.classList.contains('why-choose-us')) {
        initWhyChooseUsPage();
    }
});

// --- THEME MANAGEMENT (Dark Mode) ---
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme
    if (storedTheme) {
        html.setAttribute('data-theme', storedTheme);
        updateToggleIcon(storedTheme);
    } else if (prefersDark) {
        html.setAttribute('data-theme', 'dark');
        updateToggleIcon('dark');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateToggleIcon(newTheme);
        });
    }
}

function updateToggleIcon(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    
    // Logic: 
    // If Theme is Dark, show Sun (to switch to light)
    // If Theme is Light, show Moon (to switch to dark)
    if (theme === 'dark') {
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        toggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        toggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
}

// --- PWA SERVICE WORKER REGISTRATION ---
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js', { scope: '/' })
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
}

// --- HERO SLIDER LOGIC ---
function initHeroSlider() {
    const slider = document.getElementById('homeHeroSlider');
    const slides = slider.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    // Create Dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + totalSlides) % totalSlides;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 6000); 
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Initialize
    startAutoPlay();
}

// --- COMMON FUNCTIONS ---
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle && navWrapper) {
        // Toggle Menu
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.toggle('active');
            navWrapper.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.classList.toggle('menu-open', isActive);
        });

        // Close Menu on Link Click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navWrapper.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navWrapper.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }
}

function initScrollBehaviors() {
    const siteHeader = document.querySelector('.site-header');
    if (!siteHeader) return;

    const fabContainer = document.querySelector('.floating-action-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const isHomePage = document.body.classList.contains('home-page');
    
    // Explicitly add class for home page header styling
    if(isHomePage && !siteHeader.classList.contains('is-on-home-page')) {
        siteHeader.classList.add('is-on-home-page');
    }

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Close chatbot if open on scroll
        if (chatbotWindow && chatbotWindow.classList.contains('active')) {
            chatbotWindow.classList.remove('active');
            if (chatbotToggle) chatbotToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Handle header style change (Glass effect intensifies on scroll)
        if (scrollTop > 50) {
            siteHeader.classList.add('header-scrolled');
        } else {
            siteHeader.classList.remove('header-scrolled');
        }
        
    }, { passive: true });
}

function initCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function initFloatingActionButtons() {
    const fabContainer = document.querySelector('.floating-action-button');
    if (fabContainer) {
        setTimeout(() => {
            fabContainer.classList.add('visible');
        }, 500);
    }
}


// --- WHY CHOOSE US PAGE SPECIFIC ---
function initWhyChooseUsPage() {
    const statNumbers = document.querySelectorAll('.why-choose-us .stat-number');
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const countTo = parseInt(el.dataset.count, 10);
                    if (!el.classList.contains('counted')) {
                        animateCount(el, 0, countTo, 1500);
                        el.classList.add('counted');
                        observer.unobserve(el);
                    }
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(stat => observer.observe(stat));
    }
}

function animateCount(element, start, end, duration) {
    let startTime = null;
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    requestAnimationFrame(animation);
}


// --- CONTACT PAGE SPECIFIC ---
function initContactPage() {
    const mapElement = document.getElementById('map');
    const lat = 25.2625; 
    const lng = 55.2980;

    function initLeafletMap() {
        if (!mapElement || mapElement.dataset.mapReady === 'true') return;
        if (typeof L === 'undefined') {
            console.warn('Leaflet not available');
            document.querySelectorAll('.map-placeholder').forEach(p => p.classList.add('map-hidden'));
            return;
        }
        try {
            const map = L.map('map').setView([lat, lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            L.marker([lat, lng]).addTo(map)
                .bindPopup('<b>Micorp Trading LLC</b><br>Office 709, Fahidi Heights<br>Al Hamriya, Bur Dubai')
                .openPopup();

            // mark as ready and hide placeholder
            mapElement.classList.add('map-ready');
            mapElement.dataset.mapReady = 'true';
            document.querySelectorAll('.map-placeholder').forEach(p => p.classList.add('map-hidden'));
        } catch (e) {
            console.error('Error initializing Leaflet map:', e);
            document.querySelectorAll('.map-placeholder').forEach(p => p.classList.add('map-hidden'));
            mapElement.innerHTML = "<p style='color:red; text-align:center;'>Map could not be loaded.</p>";
        }
    }

    // Lazy-init map when it scrolls into view or when user clicks the Open in Maps link
    if (mapElement) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initLeafletMap();
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '200px', threshold: 0.01 });
        observer.observe(mapElement);

        const openMaps = document.getElementById('open-in-maps');
        if (openMaps) {
            openMaps.addEventListener('click', () => initLeafletMap());
        }
    }

    const faqItems = document.querySelectorAll('.contact-page .faq-item button.faq-question');
    faqItems.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
            button.classList.toggle('active');
            answer.classList.toggle('show');
            answer.style.maxHeight = !isExpanded ? answer.scrollHeight + "px" : null;
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm && contactForm.action && contactForm.action.includes('formspree.io')) {
        const statusElem = document.getElementById('contactFormStatus');
        const hiddenReplyTo = document.getElementById('contact_replyto');
        const submitButton = document.getElementById('contactFormSubmit') || contactForm.querySelector('button[type="submit"]');

        // helper: show floating toast
        function showToast(type, title, text) {
            const toast = document.getElementById('contactToast');
            if (!toast) return;
            toast.className = 'contact-toast ' + (type === 'success' ? 'success' : 'error') + ' show';
            toast.innerHTML = `
                <div class="toast-icon">${type === 'success' ? '<i class="fas fa-check"></i>' : '<i class="fas fa-exclamation-triangle"></i>'}</div>
                <div class="toast-body">
                    <div class="toast-title">${title}</div>
                    <div class="toast-text">${text}</div>
                </div>`;
            // auto hide
            setTimeout(() => { toast.classList.remove('show'); }, 5200);
        }

        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Simple client-side validation to provide immediate feedback
            const emailInput = document.getElementById('contact_email');
            if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                if (statusElem) {
                    statusElem.className = 'form-status error';
                    statusElem.textContent = 'Please enter a valid email address.';
                    emailInput.focus();
                } else {
                    alert('Please enter a valid email address.');
                }
                return;
            }

            const formData = new FormData(contactForm);
            const originalButtonText = submitButton ? (submitButton.querySelector('.btn-label') ? submitButton.querySelector('.btn-label').textContent : submitButton.textContent) : null;
            if (submitButton) { submitButton.disabled = true; submitButton.classList.add('is-loading'); }

            // Ensure _replyto is present both in FormData (for fetch) and in hidden input (for non-JS fallback)
            const emailVal = formData.get('email') || '';
            if (emailVal) {
                formData.set('_replyto', emailVal);
                if (hiddenReplyTo) hiddenReplyTo.value = emailVal;
            }

            if (statusElem) {
                statusElem.className = 'form-status sending';
                statusElem.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending your message...';
            }

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // show toast and accessible status
                    showToast('success', 'Message Sent', "We'll reply shortly.");
                    if (statusElem) { statusElem.className = 'form-status success'; statusElem.textContent = "Thank you — your message has been sent."; }
                    contactForm.reset();
                    if (hiddenReplyTo) hiddenReplyTo.value = '';
                    const firstInput = contactForm.querySelector('input, textarea, select'); if (firstInput) firstInput.focus();
                    // clear accessible status after some time
                    setTimeout(() => { if (statusElem) { statusElem.className = 'form-status'; statusElem.textContent = ''; } }, 6000);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Form submission error:', errorData);
                    showToast('error', 'Send Failed', 'There was a problem sending your message. Please try again later.');
                    if (statusElem) { statusElem.className = 'form-status error'; statusElem.textContent = 'There was a problem sending your message. Please try again later.'; }
                }
            } catch (error) {
                console.error('Network error:', error);
                if (statusElem) {
                    statusElem.className = 'form-status error';
                    statusElem.textContent = 'Network error. Please try again later or email info@micorptrd.com.';
                } else {
                    alert('Network error. Please try again later or email info@micorptrd.com.');
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.classList.remove('is-loading');
                    // restore label text
                    const label = submitButton.querySelector('.btn-label');
                    if (label && originalButtonText) label.textContent = originalButtonText;
                }
            }
        });
    }
}
