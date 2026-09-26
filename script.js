document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       ULTRA-CINEMATIC GOLDEN INTRO PRELOADER CONTROL
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    const progressFill = document.getElementById('preloader-progress');
    const percentText = document.getElementById('preloader-percent');
    const preloaderCanvas = document.getElementById('preloader-canvas');

    let preloaderInterval;
    function runPreloaderAnimation() {
        if (!preloader) return;

        clearInterval(preloaderInterval);
        preloader.classList.remove('fade-out');
        document.body.style.overflow = 'hidden';

        const leftHalf = preloader.querySelector('.logo-half-left');
        const rightHalf = preloader.querySelector('.logo-half-right');
        if (leftHalf && rightHalf) {
            leftHalf.style.animation = 'none';
            rightHalf.style.animation = 'none';
            void leftHalf.offsetWidth; // Force CSS reflow
            leftHalf.style.animation = 'splitLogoLeft 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both';
            rightHalf.style.animation = 'splitLogoRight 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both';
        }

        if (progressFill) progressFill.style.width = '0%';
        if (percentText) percentText.textContent = '0%';

        let progress = 0;
        const duration = 1800; // 1.8 seconds total load animation
        const intervalTime = 25;
        const increment = 100 / (duration / intervalTime);

        preloaderInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(preloaderInterval);

                if (progressFill) progressFill.style.width = '100%';
                if (percentText) percentText.textContent = '100%';

                // Smooth cinematic shutter split exit after 350ms buffer
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    document.body.style.overflow = ''; // Unlock body scroll

                    // Trigger GSAP Initial Load Animations as website is revealed
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
                }, 350);
            } else {
                if (progressFill) progressFill.style.width = `${Math.floor(progress)}%`;
                if (percentText) percentText.textContent = `${Math.floor(progress)}%`;
            }
        }, intervalTime);
    }

    if (preloader) {
        // Floating Golden Dust Particles Canvas inside Preloader
        if (preloaderCanvas) {
            const pCtx = preloaderCanvas.getContext('2d');
            preloaderCanvas.width = window.innerWidth;
            preloaderCanvas.height = window.innerHeight;

            const goldParticles = [];
            for (let i = 0; i < 45; i++) {
                goldParticles.push({
                    x: Math.random() * preloaderCanvas.width,
                    y: Math.random() * preloaderCanvas.height,
                    radius: Math.random() * 2.2 + 0.6,
                    vy: -(Math.random() * 0.6 + 0.2),
                    vx: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.7 + 0.2,
                    pulse: Math.random() * Math.PI
                });
            }

            function animatePreloaderParticles() {
                pCtx.clearRect(0, 0, preloaderCanvas.width, preloaderCanvas.height);
                if (!preloader.classList.contains('fade-out')) {
                    goldParticles.forEach(p => {
                        p.y += p.vy;
                        p.x += p.vx;
                        p.pulse += 0.04;
                        if (p.y < -10) {
                            p.y = preloaderCanvas.height + 10;
                            p.x = Math.random() * preloaderCanvas.width;
                        }
                        const alpha = Math.max(0, p.opacity + Math.sin(p.pulse) * 0.25);
                        pCtx.beginPath();
                        pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        pCtx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
                        pCtx.shadowBlur = 8;
                        pCtx.shadowColor = '#ffd700';
                        pCtx.fill();
                    });
                }
                requestAnimationFrame(animatePreloaderParticles);
            }
            animatePreloaderParticles();
        }

        // Run preloader on initial page load
        runPreloaderAnimation();

        // Click handler on navbar circular logo button to replay intro animation
        const replayBtn = document.getElementById('replay-intro-btn');
        if (replayBtn) {
            replayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                runPreloaderAnimation();
            });
        }
    }

    /* ==========================================================================
       PREMIUM PARTICLE MESH BACKGROUND (HTML5 CANVAS)
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let smokeParticles = [];
        let emberParticles = [];
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2, radius: 220 };

        window.addEventListener('mousemove', (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.targetX = canvas.width / 2;
            mouse.targetY = canvas.height / 2;
        });

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initScene();
        }
        window.addEventListener('resize', resizeCanvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Smoky Palette (Ice Blue, Deep Azure, Cyan, White Fog)
        const smokeColors = [
            { r: 140, g: 200, b: 255 },  // Ice Blue
            { r: 0, g: 242, b: 254 },    // Electric Cyan
            { r: 80, g: 140, b: 220 },   // Deep Smoke Azure
            { r: 220, g: 240, b: 255 }   // Misty White
        ];

        // 1. Interactive Soft Smoke Cloud Puff
        class SmokePuff {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 90 + 50; // Large soft smoke cloud
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = -(Math.random() * 0.2 + 0.1); // Slow upward smoke drift
                this.color = smokeColors[Math.floor(Math.random() * smokeColors.length)];
                this.maxOpacity = Math.random() * 0.08 + 0.03;
                this.opacity = 0;
                this.growth = Math.random() * 0.05 + 0.02;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.005;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.angle += this.spin;
                this.radius += this.growth;

                // Fade in and fade out cycle
                if (this.radius < 120 && this.opacity < this.maxOpacity) {
                    this.opacity += 0.002;
                } else {
                    this.opacity -= 0.001;
                }

                // Reset smoke puff when it fades or grows out
                if (this.opacity <= 0 || this.y < -this.radius || this.radius > 200) {
                    this.x = Math.random() * canvas.width;
                    this.y = canvas.height + this.radius;
                    this.radius = Math.random() * 50 + 40;
                    this.opacity = 0.01;
                }

                // Mouse turbulence / Swirl force
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
                grad.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
                grad.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.5})`);
                grad.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

                ctx.beginPath();
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.restore();
            }
        }

        // 2. Glowing Cyan Smoke Embers
        class SmokeEmber {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 2 + 0.8;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -(Math.random() * 0.5 + 0.2);
                this.color = smokeColors[Math.floor(Math.random() * smokeColors.length)];
                this.pulse = Math.random() * Math.PI;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulse += 0.03;

                if (this.y < -10) {
                    this.y = canvas.height + 10;
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                let opacity = 0.4 + Math.sin(this.pulse) * 0.3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity * 0.2})`;
                ctx.fill();
            }
        }

        function initScene() {
            smokeParticles = [];
            emberParticles = [];

            for (let i = 0; i < 35; i++) {
                smokeParticles.push(new SmokePuff());
            }
            for (let i = 0; i < 45; i++) {
                emberParticles.push(new SmokeEmber());
            }
        }

        // 3. Main 60fps Loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Smooth Lerp Mouse Movement
            mouse.x += (mouse.targetX - mouse.x) * 0.06;
            mouse.y += (mouse.targetY - mouse.y) * 0.06;

            // Ambient Cursor Smoke Glow
            let mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
            mouseGlow.addColorStop(0, 'rgba(0, 242, 254, 0.09)');
            mouseGlow.addColorStop(0.6, 'rgba(40, 100, 180, 0.03)');
            mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = mouseGlow;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Render Smoke Puffs
            for (let i = 0; i < smokeParticles.length; i++) {
                smokeParticles[i].update();
                smokeParticles[i].draw();
            }

            // Render Glowing Embers
            for (let i = 0; i < emberParticles.length; i++) {
                emberParticles[i].update();
                emberParticles[i].draw();
            }
        }

        initScene();
        animate();
    }






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
    const revealTargets = document.querySelectorAll('.service-card, .skill-item, .project-card, .timeline-item, .info-link-item, .contact-form-column, .about-info, .code-editor-box, .stat-card, .certificate-card');
    
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

                // Send real email via FormSubmit AJAX service
                fetch("https://formsubmit.co/ajax/gveera513@gmail.com", {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        subject: subjectInput.value.trim(),
                        message: messageInput.value.trim(),
                        _subject: `New Portfolio Contact Message from ${nameInput.value.trim()}: ${subjectInput.value.trim()}`,
                        _template: 'table'
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (successOverlay) {
                        const successPara = successOverlay.querySelector('.success-message p');
                        if (successPara) {
                            successPara.textContent = `Thank you for reaching out, ${nameInput.value.trim()}. Your message has been sent to my email and I will get back to you at ${emailInput.value.trim()} shortly.`;
                        }
                        successOverlay.classList.add('active');
                    }
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error sending email:', error);
                    alert('There was an issue sending your message. Please try again or email directly to gveera513@gmail.com');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                });
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

    /* ==========================================================================
       CERTIFICATE VIEW TOGGLE & LIGHTBOX PREVIEW
       ========================================================================== */
    // Certificate Card 1 Toggle
    const toggleCertsBtn = document.getElementById('toggle-certs-btn');
    const certGallery = document.getElementById('cert-gallery');
    const toggleCertsText = document.getElementById('toggle-certs-text');
    const toggleCertsIcon = document.getElementById('toggle-certs-icon');

    if (toggleCertsBtn && certGallery) {
        toggleCertsBtn.addEventListener('click', () => {
            const isHidden = certGallery.style.display === 'none' || certGallery.style.display === '';
            if (isHidden) {
                certGallery.style.display = 'block';
                setTimeout(() => { certGallery.style.opacity = '1'; }, 10);
                toggleCertsText.textContent = 'Hide Certificates';
                toggleCertsIcon.style.transform = 'rotate(180deg)';
                toggleCertsBtn.classList.add('active');
            } else {
                certGallery.style.opacity = '0';
                setTimeout(() => { certGallery.style.display = 'none'; }, 400);
                toggleCertsText.textContent = 'View Certificates';
                toggleCertsIcon.style.transform = 'rotate(0deg)';
                toggleCertsBtn.classList.remove('active');
            }
        });
    }

    // Certificate Card 2 Toggle (Sinthan'AI Hackathon)
    const toggleCertsBtn2 = document.getElementById('toggle-certs-btn-2');
    const certGallery2 = document.getElementById('cert-gallery-2');
    const toggleCertsText2 = document.getElementById('toggle-certs-text-2');
    const toggleCertsIcon2 = document.getElementById('toggle-certs-icon-2');

    if (toggleCertsBtn2 && certGallery2) {
        toggleCertsBtn2.addEventListener('click', () => {
            const isHidden = certGallery2.style.display === 'none' || certGallery2.style.display === '';
            if (isHidden) {
                certGallery2.style.display = 'block';
                setTimeout(() => { certGallery2.style.opacity = '1'; }, 10);
                if (toggleCertsText2) toggleCertsText2.textContent = 'Hide Certificate';
                if (toggleCertsIcon2) toggleCertsIcon2.style.transform = 'rotate(180deg)';
                toggleCertsBtn2.classList.add('active');
            } else {
                certGallery2.style.opacity = '0';
                setTimeout(() => { certGallery2.style.display = 'none'; }, 400);
                if (toggleCertsText2) toggleCertsText2.textContent = 'View Certificate';
                if (toggleCertsIcon2) toggleCertsIcon2.style.transform = 'rotate(0deg)';
                toggleCertsBtn2.classList.remove('active');
            }
        });
    }

    // Certificate Card 3 Toggle (Extol Tech Solution AI/ML Inplant Training)
    const toggleCertsBtn3 = document.getElementById('toggle-certs-btn-3');
    const certGallery3 = document.getElementById('cert-gallery-3');
    const toggleCertsText3 = document.getElementById('toggle-certs-text-3');
    const toggleCertsIcon3 = document.getElementById('toggle-certs-icon-3');

    if (toggleCertsBtn3 && certGallery3) {
        toggleCertsBtn3.addEventListener('click', () => {
            const isHidden = certGallery3.style.display === 'none' || certGallery3.style.display === '';
            if (isHidden) {
                certGallery3.style.display = 'block';
                setTimeout(() => { certGallery3.style.opacity = '1'; }, 10);
                if (toggleCertsText3) toggleCertsText3.textContent = 'Hide Certificate';
                if (toggleCertsIcon3) toggleCertsIcon3.style.transform = 'rotate(180deg)';
                toggleCertsBtn3.classList.add('active');
            } else {
                certGallery3.style.opacity = '0';
                setTimeout(() => { certGallery3.style.display = 'none'; }, 400);
                if (toggleCertsText3) toggleCertsText3.textContent = 'View Certificate';
                if (toggleCertsIcon3) toggleCertsIcon3.style.transform = 'rotate(0deg)';
                toggleCertsBtn3.classList.remove('active');
            }
        });
    }

    // Certificate Card 4 Toggle (RGF Fest 2025 AI Tools & World Record Attempt)
    const toggleCertsBtn4 = document.getElementById('toggle-certs-btn-4');
    const certGallery4 = document.getElementById('cert-gallery-4');
    const toggleCertsText4 = document.getElementById('toggle-certs-text-4');
    const toggleCertsIcon4 = document.getElementById('toggle-certs-icon-4');

    if (toggleCertsBtn4 && certGallery4) {
        toggleCertsBtn4.addEventListener('click', () => {
            const isHidden = certGallery4.style.display === 'none' || certGallery4.style.display === '';
            if (isHidden) {
                certGallery4.style.display = 'block';
                setTimeout(() => { certGallery4.style.opacity = '1'; }, 10);
                if (toggleCertsText4) toggleCertsText4.textContent = 'Hide Certificates';
                if (toggleCertsIcon4) toggleCertsIcon4.style.transform = 'rotate(180deg)';
                toggleCertsBtn4.classList.add('active');
            } else {
                certGallery4.style.opacity = '0';
                setTimeout(() => { certGallery4.style.display = 'none'; }, 400);
                if (toggleCertsText4) toggleCertsText4.textContent = 'View Certificates';
                if (toggleCertsIcon4) toggleCertsIcon4.style.transform = 'rotate(0deg)';
                toggleCertsBtn4.classList.remove('active');
            }
        });
    }

    // Generic Helper for all Certificate Card Toggles (Cards 5, 6, 7, 8, etc.)
    [5, 6, 7, 8].forEach(num => {
        const btn = document.getElementById(`toggle-certs-btn-${num}`);
        const gallery = document.getElementById(`cert-gallery-${num}`);
        const text = document.getElementById(`toggle-certs-text-${num}`);
        const icon = document.getElementById(`toggle-certs-icon-${num}`);

        if (btn && gallery) {
            btn.addEventListener('click', () => {
                const isHidden = gallery.style.display === 'none' || gallery.style.display === '';
                if (isHidden) {
                    gallery.style.display = 'block';
                    setTimeout(() => { gallery.style.opacity = '1'; }, 10);
                    if (text) text.textContent = 'Hide Certificate';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                    btn.classList.add('active');
                } else {
                    gallery.style.opacity = '0';
                    setTimeout(() => { gallery.style.display = 'none'; }, 400);
                    if (text) text.textContent = 'View Certificate';
                    if (icon) icon.style.transform = 'rotate(0deg)';
                    btn.classList.remove('active');
                }
            });
        }
    });

    // Lightbox Modal Functionality
    const certLightbox = document.getElementById('cert-lightbox');
    const certLightboxImg = document.getElementById('cert-lightbox-img');
    const certLightboxClose = document.getElementById('cert-lightbox-close');
    const certTriggers = document.querySelectorAll('.cert-modal-trigger');

    if (certLightbox && certLightboxImg && certTriggers.length > 0) {
        certTriggers.forEach(img => {
            img.addEventListener('click', () => {
                certLightboxImg.src = img.src;
                certLightboxImg.alt = img.alt || 'Certificate';
                certLightbox.style.display = 'flex';
                setTimeout(() => {
                    certLightbox.style.opacity = '1';
                }, 10);
            });
        });

        const closeLightbox = () => {
            certLightbox.style.opacity = '0';
            setTimeout(() => {
                certLightbox.style.display = 'none';
                certLightboxImg.src = '';
            }, 300);
        };

        if (certLightboxClose) {
            certLightboxClose.addEventListener('click', closeLightbox);
        }

        certLightbox.addEventListener('click', (e) => {
            if (e.target === certLightbox || e.target === certLightboxClose) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certLightbox.style.display === 'flex') {
                closeLightbox();
            }
        });
    }
});

