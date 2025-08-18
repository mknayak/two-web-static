// Enhanced User Experience JavaScript
class TechWayFitEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addReadingProgress();
        this.enhanceCodeBlocks();
        this.addReadingTime();
        this.improveTOC();
        this.addSmoothScrolling();
        this.addBackToTop();
        this.enhanceQuizAnimations();
    }

    // Reading Progress Bar
    addReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.prepend(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        });
    }

    // Enhanced Code Blocks with Copy Functionality
    enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach((block, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-container';
            
            const header = document.createElement('div');
            header.className = 'code-block-header';
            
            const language = block.className.match(/language-(\w+)/);
            const langName = language ? language[1].toUpperCase() : 'CODE';
            
            header.innerHTML = `
                <span class="code-language">${langName}</span>
                <button class="copy-button" data-code-index="${index}">
                    <i class="fas fa-copy"></i> Copy
                </button>
            `;
            
            block.parentNode.parentNode.insertBefore(wrapper, block.parentNode);
            wrapper.appendChild(header);
            wrapper.appendChild(block.parentNode);
        });

        // Copy functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.copy-button')) {
                const button = e.target.closest('.copy-button');
                const index = button.dataset.codeIndex;
                const codeBlock = document.querySelectorAll('pre code')[index];
                
                navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    button.classList.add('copied');
                    
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        button.classList.remove('copied');
                    }, 2000);
                });
            }
        });
    }

    // Reading Time Calculator
    addReadingTime() {
        const content = document.querySelector('.blog-content, .article-content');
        if (!content) return;

        const text = content.textContent;
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);

        const readingTimeElement = document.createElement('div');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.innerHTML = `
            <i class="fas fa-clock"></i>
            <span>${readingTime} min read</span>
        `;

        const insertPoint = document.querySelector('.article-header, h1');
        if (insertPoint) {
            insertPoint.parentNode.insertBefore(readingTimeElement, insertPoint.nextSibling);
        }
    }

    // Enhanced Table of Contents
    improveTOC() {
        const toc = document.querySelector('.toc-list');
        if (!toc) return;

        const headings = document.querySelectorAll('h2, h3, h4');
        const tocLinks = toc.querySelectorAll('a');

        // Intersection Observer for active section highlighting
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    tocLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = toc.querySelector(`a[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, {
            rootMargin: '-20% 0px -60% 0px'
        });

        headings.forEach(heading => {
            if (heading.id) observer.observe(heading);
        });
    }

    // Smooth Scrolling
    addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Back to Top Button
    addBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,123,255,0.3);
        `;

        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Enhanced Quiz Animations
    enhanceQuizAnimations() {
        // Add entrance animations to quiz elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        });

        // Observe quiz cards and results
        document.querySelectorAll('.quiz-card, .quiz-result, .review-item').forEach(el => {
            observer.observe(el);
        });

        // Enhanced option selection feedback
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quiz-option')) {
                const option = e.target.closest('.quiz-option');
                
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(0,123,255,0.3);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = option.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                
                option.style.position = 'relative';
                option.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            }
        });

        // Add CSS for ripple animation
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                .animate-in {
                    animation: slideInUp 0.6s ease-out;
                }
                
                @keyframes slideInUp {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = performance.now();
        
        function animate(time) {
            let progress = (time - start) / duration;
            progress = Math.min(progress, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        let start = performance.now();
        
        function animate(time) {
            let progress = (time - start) / duration;
            progress = Math.min(progress, 1);
            
            element.style.opacity = 1 - progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// Social Sharing Functions
class SocialShare {
    static shareOnTwitter(text, url) {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    }

    static shareOnLinkedIn(url, title) {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedInUrl, '_blank', 'width=550,height=420');
    }

    static shareOnFacebook(url) {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=550,height=420');
    }

    static copyToClipboard(text) {
        return navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
            return true;
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            return false;
        });
    }
}

// Performance Monitoring
class PerformanceMonitor {
    static measurePageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
        });
    }

    static measureQuizCompletion() {
        // Track quiz completion times
        window.quizStartTime = Date.now();
    }

    static logQuizMetrics(score, totalQuestions, timeSpent) {
        console.log('Quiz Metrics:', {
            score: score,
            totalQuestions: totalQuestions,
            timeSpent: timeSpent,
            accuracy: (score / totalQuestions) * 100
        });
    }
}

// Initialize enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TechWayFitEnhancements();
    PerformanceMonitor.measurePageLoad();
});

// Export for global use
window.TechWayFit = {
    Utils,
    SocialShare,
    PerformanceMonitor
};
