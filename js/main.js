document.addEventListener('DOMContentLoaded', () => {
    // COMMON SITE-WIDE INITIALIZATIONS
    initMobileMenu();
    initScrollBehaviors();
    initCurrentYear();
    initFloatingActionButtons();

    // PAGE-SPECIFIC INITIALIZATIONS
    if (document.body.classList.contains('contact-page')) {
        initContactPage();
    }
    if (document.body.classList.contains('why-choose-us')) {
        initWhyChooseUsPage();
    }
});

// --- COMMON FUNCTIONS ---
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navWrapper = document.querySelector('.nav-wrapper');

    if (menuToggle && navWrapper) {
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.toggle('active');
            navWrapper.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.classList.toggle('menu-open', isActive);

            if (isActive) {
                const navLinks = navWrapper.querySelectorAll('.nav-links li');
                navLinks.forEach((li, index) => {
                    li.style.setProperty('--item-index', index);
                });
            }
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
    
    if(isHomePage) {
        siteHeader.classList.add('is-on-home-page');
    }

    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (chatbotWindow && chatbotWindow.classList.contains('active')) {
            chatbotWindow.classList.remove('active');
            if (chatbotToggle) chatbotToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Handle header style change
        if (scrollTop > 50) {
            siteHeader.classList.add('header-scrolled');
        } else {
            siteHeader.classList.remove('header-scrolled');
        }
        
        // Hide/show on scroll logic for header and FAB
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling Down
            if (!isHomePage) siteHeader.classList.add('hidden'); // Hide header only on non-home pages
            if (fabContainer) fabContainer.classList.add('hidden');
        } else {
            // Scrolling Up
            if (!isHomePage) siteHeader.classList.remove('hidden');
            if (fabContainer) fabContainer.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

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
    if (mapElement && typeof L !== 'undefined') {
        const lat = 25.2625; 
        const lng = 55.2980;
        try {
            var map = L.map('map').setView([lat, lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            L.marker([lat, lng]).addTo(map)
                .bindPopup('<b>Micorp Trading LLC</b><br>Office 709, Fahidi Heights<br>Al Hamriya, Bur Dubai')
                .openPopup();
        } catch(e) {
            console.error("Error initializing Leaflet map:", e);
            mapElement.innerHTML = "<p style='color:red; text-align:center;'>Map could not be loaded.</p>";
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

    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject');
    const subjectSelect = document.getElementById('subject');
    if (subjectParam && subjectSelect && subjectSelect.querySelector(`option[value="${subjectParam}"]`)) {
        subjectSelect.value = subjectParam;
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm && contactForm.action && contactForm.action.includes('formspree.io')) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    alert("Thank you for your message! We'll be in touch soon.");
                    contactForm.reset();
                    if (subjectParam && subjectSelect && subjectSelect.querySelector(`option[value="${subjectParam}"]`)) {
                        subjectSelect.value = subjectParam;
                    }
                } else {
                    const errorData = await response.json().catch(() => ({ error: "Failed to parse server error response." }));
                    let errorMessage = "Oops! There was a problem submitting your form.";
                    if (errorData && errorData.errors && Array.isArray(errorData.errors)) errorMessage += "\nDetails: " + errorData.errors.map(e => e.message || 'Unknown error').join(", ");
                    else if (errorData && errorData.error) errorMessage += " Details: " + errorData.error;
                    alert(errorMessage  + " Please try again or contact us directly.");
                }
            } catch (error) {
                alert("An error occurred while sending your message. Please try again or contact us directly.");
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
}