function splitCharsForAnimation() {
    const textElementsToSplit = document.querySelectorAll('.animate-text.js-split');

    textElementsToSplit.forEach(textEl => {
        if (textEl.dataset.textSplitDone === 'true') {
            return;
        }

        const originalHTML = textEl.innerHTML; // Keep original HTML to preserve <br>
        textEl.innerHTML = ''; 

        let charDelay = 0;
        const segments = originalHTML.split(/(<br\s*\/?>)/i); // Split by <br> tags, case-insensitive

        segments.forEach(segment => {
            if (segment.match(/<br\s*\/?>/i)) {
                textEl.appendChild(document.createElement('br'));
                charDelay = 0; // Reset delay after a line break for better effect
            } else {
                // Process text content segment
                const textOnly = segment.replace(/<[^>]+>/g, ""); // Strip any other tags if present
                textOnly.split('').forEach((char) => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.innerHTML = char === ' ' ? '&nbsp;' : char; // Use non-breaking space
                    span.style.animationDelay = `${charDelay.toFixed(2)}s`;
                    textEl.appendChild(span);
                    if (char !== ' ') { 
                         charDelay += 0.03; 
                    } else {
                        // Optional: slightly smaller delay increment for spaces if desired
                        // charDelay += 0.01; 
                    }
                });
            }
        });
        textEl.dataset.textSplitDone = 'true';
    });
}

/**
 * Initializes Intersection Observer to add 'active' class to elements
 * when they scroll into view, triggering CSS animations.
 */
function initScrollReveal() {
    const animatedElements = document.querySelectorAll(
        '.reveal, .animate-from-bottom, .animate-from-left, .animate-from-right, .animate-fade-in, .animate-scale, .animate-text.js-split'
    );

    if (animatedElements.length === 0) {
        return;
    }

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px 0px -10% 0px', // trigger when 10% of the element is visible from the bottom
        threshold: 0.1 // 10% of the element is visible
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Unobserve after animation is triggered
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    splitCharsForAnimation();
    initScrollReveal();
});
// Re-run splitCharsForAnimation on window resize to handle responsive text