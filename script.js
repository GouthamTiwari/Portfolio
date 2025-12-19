/**
 * Portfolio Website - JavaScript
 * Goutham Tiwari - Operations Specialist
 * Fixed version with working animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // =====================================================
    // Premium Loading Screen
    // =====================================================
    const loader = document.getElementById('loading-screen');
    const loaderCounter = document.querySelector('.loader-counter');
    const barFill = document.querySelector('.bar-fill');

    // Disable scroll initially
    document.body.style.overflow = 'hidden';

    let loadCount = 0;
    const loadInterval = setInterval(() => {
        loadCount++;
        if (loaderCounter) {
            loaderCounter.textContent = `${loadCount}%`;
        }
        if (barFill) {
            barFill.style.width = `${loadCount}%`;
        }

        if (loadCount >= 100) {
            clearInterval(loadInterval);

            // Fade out loader
            setTimeout(() => {
                if (loader) {
                    loader.classList.add('fade-out');
                }
                // Enable scroll
                document.body.style.overflow = '';

                // Trigger hero animations after loader is gone
                setTimeout(() => {
                    initAnimations();
                }, 500);
            }, 500);
        }
    }, 20); // Adjust speed of counting here

    // Initialize Lucide icons
    lucide.createIcons();

    // =====================================================
    // Custom Cursor
    // =====================================================
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function animateCursor() {
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .impact-card, .skill-category, .achievement-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Hide cursor on touch devices
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
    }

    // =====================================================
    // Scroll Progress Indicator
    // =====================================================
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #FF6B35, #FF8555);
        z-index: 9999;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }, { passive: true });

    // =====================================================
    // Mouse Gradient Follower
    // =====================================================
    const mouseGradient = document.createElement('div');
    mouseGradient.style.cssText = `
        position: fixed;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 107, 53, 0.12) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: left 0.3s ease, top 0.3s ease;
    `;
    document.body.appendChild(mouseGradient);

    let gradientX = 0, gradientY = 0;
    document.addEventListener('mousemove', (e) => {
        gradientX += (e.clientX - gradientX) * 0.05;
        gradientY += (e.clientY - gradientY) * 0.05;
    });

    function animateGradient() {
        mouseGradient.style.left = gradientX + 'px';
        mouseGradient.style.top = gradientY + 'px';
        requestAnimationFrame(animateGradient);
    }
    animateGradient();

    // =====================================================
    // Navigation - Scroll Effect
    // =====================================================
    const navbar = document.getElementById('navbar');
    let ticking = false;

    const updateNavbar = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

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
    // =====================================================
    // Scroll Reveal Animation (Intersection Observer)
    // =====================================================
    function initAnimations() {
        const revealElements = document.querySelectorAll('.reveal');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // =====================================================
    // 3D Tilt Effect on Cards
    // =====================================================
    const tiltCards = document.querySelectorAll('.project-card, .impact-card, .achievement-card, .tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // =====================================================
    // Magnetic Button Effect
    // =====================================================
    const magneticBtns = document.querySelectorAll('.btn, .nav-cta');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // =====================================================
    // Counter Animation
    // =====================================================
    const counterElements = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;

        counterElements.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const duration = 2500;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
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
                setTimeout(() => {
                    entry.target.style.width = progress + '%';
                }, 200);
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
    // Staggered Card Animations
    // =====================================================
    const animatedCards = document.querySelectorAll('.impact-card, .skill-category, .project-card, .timeline-item, .education-card, .achievement-card, .hobby-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.querySelectorAll('.impact-card, .skill-category, .project-card, .timeline-item, .education-card, .achievement-card, .hobby-card');
                const siblingIndex = Array.from(siblings).indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, siblingIndex * 100);

                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    animatedCards.forEach(card => cardObserver.observe(card));

    // =====================================================
    // Project Tabs Logic
    // =====================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(`${tabId}-projects`);
            if (targetContent) {
                targetContent.classList.add('active');

                // Re-trigger scroll animations for new content
                const newCards = targetContent.querySelectorAll('.project-card');
                newCards.forEach(card => {
                    card.classList.remove('visible');
                    cardObserver.observe(card);
                });
            }
        });
    });

    // =====================================================
    // Console Easter Egg
    // =====================================================
    console.log('%c🚀 GOUTHAM TIWARI', 'font-size: 24px; font-weight: bold; color: #FF6B35;');
    console.log('%cOperations Specialist • System Architect • Automation Engineer', 'font-size: 14px; color: #888;');
    console.log('%c50% productivity gains • 10K+ tickets unlocked • Sev-2 incident management', 'font-size: 12px; color: #FF8555;');
});
