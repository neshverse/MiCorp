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
                // If this entry is inside the stats section, trigger the counter animation
                try {
                    if (entry.target.closest && entry.target.closest('.stats-section')) {
                        animateCounters(entry.target.closest('.stats-section'));
                    }
                } catch (e) {}
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
    // Fallback: if stats are already visible on load, animate them
    requestAnimationFrame(() => animateCounters());
});


/**
 * Animate numeric counters inside `.stat-number` elements.
 * Accepts an optional container (Element) to scope the animation.
 */
function animateCounters(container) {
    const root = container || document;
    const counters = root.querySelectorAll('.stat-number');
    if (!counters || counters.length === 0) return;

    counters.forEach(el => {
        if (el.dataset.animated === 'true') return; // already animated

        let raw = el.getAttribute('data-count') || el.textContent || '0';
        // keep suffix like + or %
        const suffixMatch = raw.match(/([+%])+$/);
        const suffix = suffixMatch ? suffixMatch[0] : '';
        const numeric = parseFloat(raw.replace(/[+, %]/g, '')) || 0;
        const duration = 1400; // ms
        const start = performance.now();

        function step(now) {
            const t = Math.min((now - start) / duration, 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.round(numeric * eased);
            el.textContent = current.toLocaleString();
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                // make sure final value shows decimals correctly if original had them
                if (raw.indexOf('.') !== -1) {
                    el.textContent = numeric.toFixed(1);
                } else {
                    el.textContent = numeric.toLocaleString();
                }
                if (suffix) el.textContent = el.textContent + suffix;
                el.dataset.animated = 'true';
            }
        }

        // start from 0
        el.textContent = '0';
        requestAnimationFrame(step);
    });
}