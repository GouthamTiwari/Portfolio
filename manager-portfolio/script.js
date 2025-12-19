document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize all modules
    initPreloader();
    initCustomCursor();
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initGSAPAnimations();
    initSmoothScroll();
    initInteractiveCards();
});

/* =====================================================
   Preloader
   ===================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'visible';

            // Trigger hero animations after preloader
            animateHero();
        }, 1800);
    });
}

/* =====================================================
   Custom Cursor
   ===================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows mouse directly
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower has more lag
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .interactive-card, .expertise-card, .publication-card, .contact-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

/* =====================================================
   Navigation
   ===================================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* =====================================================
   Mobile Menu
   ===================================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* =====================================================
   Interactive Cards - Mouse Following Gradient
   ===================================================== */
function initInteractiveCards() {
    const cards = document.querySelectorAll('.interactive-card[data-glow="true"]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* =====================================================
   Scroll Animations
   ===================================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for grid items
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, observerOptions);

    // Observe reveal elements
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Observe card elements with stagger
    const cardTypes = [
        '.highlight-card',
        '.expertise-card',
        '.publication-card',
        '.cert-card',
        '.education-card',
        '.timeline-item',
        '.seminar-card',
        '.contact-card',
        '.impact-card',
        '.approach-item',
        '.fc-card'
    ];

    cardTypes.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.dataset.delay = index * 100;
            observer.observe(el);
        });
    });
}

/* =====================================================
   GSAP Animations
   ===================================================== */
function initGSAPAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Parallax effect for section backgrounds
    gsap.utils.toArray('.section').forEach(section => {
        gsap.to(section, {
            backgroundPositionY: '30%',
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Gold line animations
    gsap.utils.toArray('.gold-line, .title-underline').forEach(line => {
        gsap.from(line, {
            width: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: line,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Timeline marker animations
    gsap.utils.toArray('.marker-dot').forEach(dot => {
        gsap.from(dot, {
            scale: 0,
            duration: 0.5,
            ease: 'back.out(2)',
            scrollTrigger: {
                trigger: dot,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Floating badges animation
    gsap.utils.toArray('.floating-badge').forEach((badge, i) => {
        gsap.to(badge, {
            y: -10,
            duration: 2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.5
        });
    });
}

/* =====================================================
   Hero Animations
   ===================================================== */
function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-intro', {
        opacity: 0,
        x: -30,
        duration: 0.8
    })
        .from('.name-line', {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8
        }, '-=0.4')
        .from('.hero-title', {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, '-=0.4')
        .from('.hero-location', {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, '-=0.4')
        .from('.hero-description', {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, '-=0.3')
        .from('.hero-cta .btn', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.6
        }, '-=0.3')
        .from('.stat-item', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.6
        }, '-=0.3')
        .from('.hero-image-container', {
            opacity: 0,
            scale: 0.9,
            duration: 1
        }, '-=1')
        .from('.floating-badge', {
            opacity: 0,
            scale: 0,
            stagger: 0.2,
            duration: 0.6,
            ease: 'back.out(2)'
        }, '-=0.5')
        .from('.scroll-indicator', {
            opacity: 0,
            y: -20,
            duration: 0.6
        }, '-=0.3');
}

/* =====================================================
   Smooth Scroll
   ===================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =====================================================
   Counter Animation (for stats)
   ===================================================== */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* =====================================================
   Magnetic Button Effect
   ===================================================== */
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

/* =====================================================
   Image Lazy Loading
   ===================================================== */
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

/* =====================================================
   Scroll Progress Indicator
   ===================================================== */
const scrollProgress = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    document.documentElement.style.setProperty('--scroll-progress', `${scrollPercent}%`);
};

window.addEventListener('scroll', scrollProgress);

/* =====================================================
   Tilt Effect for Cards (Subtle)
   ===================================================== */
document.querySelectorAll('.expertise-card, .publication-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Reduced by 80% (divisor changed from 20 to 100)
        const rotateX = (y - centerY) / 100;
        const rotateY = (centerX - x) / 100;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* =====================================================
   Text Reveal Animation
   ===================================================== */
const splitText = (element) => {
    const text = element.textContent;
    element.innerHTML = '';

    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${i * 0.03}s`;
        element.appendChild(span);
    });
};

// Apply to section titles on scroll
const sectionTitles = document.querySelectorAll('.section-title');
const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            titleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

sectionTitles.forEach(title => titleObserver.observe(title));

console.log('Portfolio initialized successfully ✨');
