/**
 * Portfolio Website - JavaScript
 * Goutham Tiwari - Operations Specialist & System Architect
 * Optimized for smooth animations and performance
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // =====================================================
    // Dark Mode Toggle with Wave Transition
    // =====================================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeOverlay = document.getElementById('themeOverlay');
    const body = document.body;

    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', (e) => {
        const rect = darkModeToggle.getBoundingClientRect();
        const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

        themeOverlay.style.setProperty('--click-x', `${x}%`);
        themeOverlay.style.setProperty('--click-y', `${y}%`);

        const isDark = body.classList.contains('dark-mode');

        // Set the wave color to the NEW theme color
        themeOverlay.classList.remove('to-dark', 'to-light', 'active');
        themeOverlay.classList.add(isDark ? 'to-light' : 'to-dark');

        // Force reflow
        void themeOverlay.offsetWidth;

        // Start wave sweep animation
        themeOverlay.classList.add('active');

        // Toggle theme when wave reaches midpoint (~50% coverage)
        // Elements transform as wave passes over them
        setTimeout(() => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
            lucide.createIcons();
        }, 350);

        // Clean up after animation completes
        setTimeout(() => {
            themeOverlay.classList.remove('active', 'to-dark', 'to-light');
        }, 750);
    });

    // =====================================================
    // Navigation - Scroll Effect
    // =====================================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    let ticking = false;

    const updateNavbar = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // =====================================================
    // Mobile Menu Toggle
    // =====================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // =====================================================
    // Scroll Reveal Animation (Intersection Observer)
    // =====================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // =====================================================
    // Counter Animation
    // =====================================================
    const counterElements = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;

        counterElements.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = target * easeOutQuart;

                if (target >= 1000) {
                    counter.textContent = Math.floor(current).toLocaleString();
                } else if (target < 10) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            requestAnimationFrame(updateCounter);
        });

        countersAnimated = true;
    };

    // Observe hero stats for counter animation
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // =====================================================
    // Skill Progress Bar Animation
    // =====================================================
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                entry.target.style.width = progress + '%';
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        skillsObserver.observe(bar);
    });

    // =====================================================
    // Smooth Scroll for Anchor Links
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =====================================================
    // Skill Tag Hover Effects
    // =====================================================
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-3px) scale(1.02)';
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) scale(1)';
        });
    });

    // =====================================================
    // Console Easter Egg
    // =====================================================
    console.log('%c👋 Hi there!', 'font-size: 24px; font-weight: bold;');
    console.log('%cThanks for checking out my portfolio!', 'font-size: 14px;');
    console.log('%c— Goutham Tiwari', 'font-size: 12px; color: #0071e3;');
});
