// js/router.js
document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('CRITICAL ERROR: Element with id="main-content" was not found. The router cannot function.');
        return;
    }

    const reInitPageScripts = () => {
        // These functions are from your other JS files (main.js, animations.js)
        if (typeof initScrollReveal === 'function') initScrollReveal();
        if (typeof splitCharsForAnimation === 'function') splitCharsForAnimation();
        // Page-specific initializations
        if (document.body.classList.contains('contact-page') && typeof initContactPage === 'function') initContactPage();
        if (document.body.classList.contains('why-choose-us') && typeof initWhyChooseUsPage === 'function') initWhyChooseUsPage();
    };

    const updateNavLinks = (activePath) => {
        // Clean the path to correctly match links, ignoring hashes.
        const cleanPath = activePath.split('#')[0];
        document.querySelectorAll('header .nav-links a').forEach(link => {
            // Match against the clean path
            if (link.getAttribute('href') === cleanPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    };

    const loadPage = async (path) => {
        // FIX #1: Clean the path to handle hashes and construct the correct fetch URL.
        const cleanPath = (path.split('#')[0] || '/').replace(/\/$/, '') || '/';
        const hash = path.split('#')[1];
        const fetchPath = cleanPath === '/' ? '/index.html' : `${cleanPath}.html`;

        try {
            const response = await fetch(fetchPath);
            if (!response.ok) throw new Error(`Page not found: ${fetchPath}`);
            
            const html = await response.text();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            const newMainContent = tempDiv.querySelector('#main-content');
            const newTitle = tempDiv.querySelector('title').innerText;
            const newBodyClass = tempDiv.querySelector('body').className;

            if (newMainContent) {
                mainContent.innerHTML = newMainContent.innerHTML;
                document.title = newTitle;
                document.body.className = newBodyClass || '';
                
                updateNavLinks(cleanPath); // Use clean path for updating nav
                reInitPageScripts(); // Re-run animations etc. on new content
                
                // Scroll to top or to the anchor after content is loaded
                if (hash) {
                    // A small delay allows the DOM to update before we try to find the element
                    setTimeout(() => {
                        const element = document.getElementById(hash);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 100);
                } else {
                    window.scrollTo(0, 0);
                }
            } else {
                throw new Error('Main content container (#main-content) not found in the fetched HTML.');
            }
        } catch (error) {
            console.error('Error loading page:', error);
            mainContent.innerHTML = '<h1>404 - Not Found</h1><p>Sorry, the page you were looking for could not be found.</p>';
            document.title = '404 Not Found';
            document.body.className = 'error-page';
        }
    };

    document.body.addEventListener("click", e => {
        const link = e.target.closest('a');
        if (!link || link.target === '_blank' || link.origin !== window.location.origin || link.getAttribute('href').startsWith('#') || link.getAttribute('href').startsWith('tel:') || link.getAttribute('href').startsWith('mailto:')) {
            return;
        }

        e.preventDefault();
        const href = link.getAttribute('href');
        if (href !== location.pathname + location.search + location.hash) {
            history.pushState({ path: href }, "", href);
            loadPage(href);
        }
    });

    window.addEventListener("popstate", (e) => {
        const path = e.state ? e.state.path : (location.pathname + location.hash);
        loadPage(path);
    });

    // FIX #2: Handle initial page load correctly for deep links (e.g., on refresh).
    const isHomePageBody = document.body.classList.contains('home-page');
    const currentPath = location.pathname;
    const isHomePagePath = currentPath === '/' || currentPath === '/index.html';

    if (isHomePageBody && !isHomePagePath) {
        // SCENARIO: The user refreshed on a deep link (e.g., /about).
        // The server/SW has served index.html as a fallback.
        // The router now needs to fetch and display the correct content for the URL.
        loadPage(currentPath + location.hash);
    } else {
        // SCENARIO: Normal load. The correct HTML was served by the server, or we are on the homepage.
        // We just need to initialize the scripts for the content that is already present.
        updateNavLinks(currentPath);
        reInitPageScripts();
    }
});