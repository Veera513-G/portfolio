document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       GSAP INITIAL LOAD ANIMATIONS
       ========================================================================== */
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
        
        tl.fromTo('.navbar', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
        tl.fromTo('.badge-glow', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1 }, '-=0.4');
        tl.fromTo('.hero-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6');
        tl.fromTo('.hero-description', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.7');
        tl.fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.8');
        tl.fromTo('.hero-socials', { opacity: 0 }, { opacity: 1 }, '-=0.6');
        tl.fromTo('.hero-visual', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, '-=1');
    }

    /* ==========================================================================
       DYNAMIC PARTICLES BACKGROUND (HTML5 CANVAS)
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let mouse = { x: null, y: null, radius: 120 };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Resize handler
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
        window.addEventListener('resize', resizeCanvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Particle Class
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                // Keep inside screen
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Check mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius + this.size) {
                        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                            this.x += 2;
                        }
                        if (mouse.x > this.x && this.x > this.size * 10) {
                            this.x -= 2;
                        }
                        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                            this.y += 2;
                        }
                        if (mouse.y > this.y && this.y > this.size * 10) {
                            this.y -= 2;
                        }
                    }
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 18000;
            numberOfParticles = Math.min(numberOfParticles, 85); // Cap for performance

            const colors = ['rgba(0, 242, 254, 0.4)', 'rgba(137, 0, 255, 0.3)', 'rgba(255, 0, 127, 0.25)'];

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = colors[Math.floor(Math.random() * colors.length)];

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Draw connecting links
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 110) {
                        opacityValue = 1 - (distance / 110);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${opacityValue * 0.12})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        initParticles();
        animateParticles();
    }

    /* ==========================================================================
       SMOOTH INTERPOLATION CUSTOM CURSOR
       ========================================================================== */
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
    });

    // Animate outer ring with linear interpolation (lerp) for trailing lag effect
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        if (cursorOutline) {
            cursorOutline.style.transform = `translate3d(${outlineX - 16}px, ${outlineY - 16}px, 0)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover state reactions
    const interactiveElements = document.querySelectorAll('a, button, .filter-btn, .tab-btn, input, textarea, .project-card, .info-link-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) cursorOutline.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) cursorOutline.classList.remove('hovered');
        });
    });

    /* ==========================================================================
       CAROUSEL TYPING EFFECT
       ========================================================================== */
    const typingSpan = document.getElementById('typing-text');
    if (typingSpan) {
        const phrases = ["Full-Stack Development", "Web Development"];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIdx];
            
            if (isDeleting) {
                typingSpan.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 50;
            } else {
                typingSpan.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 120;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Delay before deleting
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing next phrase
            }

            setTimeout(type, typingSpeed);
        }
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       SCROLL INTERACTIONS (NAVBAR SCROLL & SPY NAVIGATION)
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Navbar Scrolled Accent
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active Link Spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Scroll to Top Button Visibility
        const scrollTopBtn = document.querySelector('.scroll-top-btn');
        if (scrollTopBtn) {
            if (window.scrollY > 600) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    });

    // Scroll to Top action
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksList = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinksList) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });

        // Close when clicking nav items
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinksList.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       REVEAL ON SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealTargets = document.querySelectorAll('.service-card, .skill-item, .project-card, .timeline-item, .info-link-item, .contact-form-column, .about-info, .code-editor-box, .stat-card');
    
    // Inject CSS reveal class automatically
    revealTargets.forEach(target => {
        target.classList.add('reveal-el');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealTargets.forEach(target => {
        revealObserver.observe(target);
    });

    /* ==========================================================================
       SKILL PROGRESS BAR ANIMATION
       ========================================================================== */
    function animateSkillBars(container) {
        const bars = (container || document).querySelectorAll('.skill-progress');
        bars.forEach(bar => {
            // Read the target width set via inline style in HTML
            const targetWidth = bar.style.width || '0%';
            bar.style.width = '0%';
            // Small delay so the CSS transition picks up the change
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bar.style.width = targetWidth;
                });
            });
        });
    }

    // Observe the skills section and animate bars when it enters the viewport
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars(skillsSection);
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       SKILLS TABS SYSTEM
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Deactivate all
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate current
            btn.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                // Re-animate progress bars in newly shown tab
                setTimeout(() => animateSkillBars(targetContent), 50);
            }
        });
    });

    /* ==========================================================================
       PROJECTS FILTER SYSTEM
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Toggle active filter button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.remove('show');
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ==========================================================================
       TESTIMONIALS SLIDER CAROUSEL
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotIndicators = document.querySelectorAll('.dot-indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlideIdx = 0;
    let slideTimer;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dotIndicators.forEach(dot => dot.classList.remove('active'));

        currentSlideIdx = (index + slides.length) % slides.length;
        
        slides[currentSlideIdx].classList.add('active');
        if (dotIndicators[currentSlideIdx]) {
            dotIndicators[currentSlideIdx].classList.add('active');
        }
    }

    function nextSlide() {
        showSlide(currentSlideIdx + 1);
    }

    function prevSlide() {
        showSlide(currentSlideIdx - 1);
    }

    function startSlideTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 6000);
    }

    if (slides.length > 0) {
        showSlide(currentSlideIdx);
        startSlideTimer();

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startSlideTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startSlideTimer();
            });
        }

        dotIndicators.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                showSlide(index);
                startSlideTimer();
            });
        });
    }

    /* ==========================================================================
       CONTACT FORM SUBMIT & FIELD VALIDATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successOverlay = document.querySelector('.success-overlay');
    const successCloseBtn = document.querySelector('.success-close-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            let isFormValid = true;

            // Validate name
            if (!nameInput.value.trim()) {
                showInputError(nameInput);
                isFormValid = false;
            } else {
                hideInputError(nameInput);
            }

            // Validate email
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
                showInputError(emailInput);
                isFormValid = false;
            } else {
                hideInputError(emailInput);
            }

            // Validate subject
            if (!subjectInput.value.trim()) {
                showInputError(subjectInput);
                isFormValid = false;
            } else {
                hideInputError(subjectInput);
            }

            // Validate message
            if (!messageInput.value.trim()) {
                showInputError(messageInput);
                isFormValid = false;
            } else {
                hideInputError(messageInput);
            }

            if (isFormValid) {
                const submitBtn = contactForm.querySelector('.form-submit-btn');
                const originalBtnHTML = submitBtn.innerHTML;
                
                // Show sending state
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

                // Simulate AJAX request
                setTimeout(() => {
                    if (successOverlay) {
                        const successPara = successOverlay.querySelector('.success-message p');
                        if (successPara) {
                            successPara.textContent = `Thank you for reaching out, ${nameInput.value.trim()}. I have received your message regarding "${subjectInput.value.trim()}" and will get back to you at ${emailInput.value.trim()} shortly.`;
                        }
                        successOverlay.classList.add('active');
                    }
                    
                    // Reset button and form
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                    contactForm.reset();
                }, 1500);
            }
        });

        // Add real-time input change check to remove error classes
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    hideInputError(input);
                }
            });
        });
    }

    if (successCloseBtn && successOverlay) {
        successCloseBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
        });
    }

    function showInputError(inputEl) {
        const formGroup = inputEl.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('invalid');
        }
    }

    function hideInputError(inputEl) {
        const formGroup = inputEl.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('invalid');
        }
    }
});
