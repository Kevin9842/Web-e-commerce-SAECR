document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        
        let theme = 'light';
        if (body.classList.contains('dark-mode')) {
            theme = 'dark';
            themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
        } else {
            themeToggle.innerHTML = "<i class='bx bx-moon'></i>";
        }
        localStorage.setItem('theme', theme);
    });

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            mobileToggle.innerHTML = "<i class='bx bx-x'></i>";
        } else {
            mobileToggle.innerHTML = "<i class='bx bx-menu'></i>";
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileToggle.innerHTML = "<i class='bx bx-menu'></i>";
        });
    });

    // --- Carousel Drag & Swipe Logic ---
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        if (index >= totalSlides) currentSlide = 0;
        if (index < 0) currentSlide = totalSlides - 1;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        
        // Re-trigger animation
        const content = slides[currentSlide].querySelector('.carousel-content');
        if (content) {
            content.classList.remove('fade-up');
            void content.offsetWidth;
            content.classList.add('fade-up');
        }
    }

    function nextSlide() {
        currentSlide++;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetInterval();
        });
    });

    // Touch & Mouse Drag Handling
    let isDragging = false;
    let startPosX = 0;
    let currentTranslateX = 0;

    function dragStart(e) {
        isDragging = true;
        startPosX = getPositionX(e);
        carouselWrapper.classList.add('dragging');
        clearInterval(slideInterval);
    }

    function dragMove(e) {
        if (!isDragging) return;
        const currentPosition = getPositionX(e);
        currentTranslateX = currentPosition - startPosX;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        carouselWrapper.classList.remove('dragging');
        
        // Minimum threshold to trigger slide change (50px)
        if (currentTranslateX < -50) {
            nextSlide();
        } else if (currentTranslateX > 50) {
            prevSlide();
        }
        
        currentTranslateX = 0;
        startInterval();
    }

    function getPositionX(e) {
        return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    }

    if (carouselWrapper) {
        // Touch events
        carouselWrapper.addEventListener('touchstart', dragStart, { passive: true });
        carouselWrapper.addEventListener('touchmove', dragMove, { passive: true });
        carouselWrapper.addEventListener('touchend', dragEnd);

        // Mouse events
        carouselWrapper.addEventListener('mousedown', dragStart);
        carouselWrapper.addEventListener('mousemove', dragMove);
        carouselWrapper.addEventListener('mouseup', dragEnd);
        carouselWrapper.addEventListener('mouseleave', dragEnd);
    }

    function startInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    startInterval(); // Start auto sliding

    // --- Scroll Animations (Intersection Observer) ---
    const scrollElements = document.querySelectorAll('.fade-up-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.1)) {
                displayScrollElement(el);
            }
        })
    }

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Trigger once on load
    handleScrollAnimation();

    // --- Size Guide Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sizeTables = document.querySelectorAll('.size-table');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(t => t.classList.remove('active'));
            sizeTables.forEach(t => t.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            const targetEl = document.getElementById(target);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // --- Cart Drawer Logic ---
    const cartToggleBtns = document.querySelectorAll('#cart-toggle, .cart-toggle-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    function openCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    cartToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    });

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openCart();
        });
    });

    // --- Authentication Modal Logic ---
    const userBtn = document.getElementById('user-btn');
    const authModal = document.getElementById('auth-modal');
    const authOverlay = document.getElementById('auth-modal-overlay');
    const closeAuthModalBtn = document.getElementById('close-auth-modal');
    const checkoutBtns = document.querySelectorAll('.checkout-btn');

    function openAuthModal() {
        if (authModal && authOverlay) {
            authModal.classList.add('open');
            authOverlay.classList.add('open');
        }
    }

    function closeAuthModal() {
        if (authModal && authOverlay) {
            authModal.classList.remove('open');
            authOverlay.classList.remove('open');
        }
    }

    if (userBtn) {
        userBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal();
        });
    }

    if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModal);
    if (authOverlay) authOverlay.addEventListener('click', closeAuthModal);

    // Auth Tabs Switcher (Login vs Register)
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    const authTabPanes = document.querySelectorAll('.auth-tab-pane');

    authTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            authTabBtns.forEach(b => b.classList.remove('active'));
            authTabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-auth-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // Simulate login redirect when submitting login/register or google auth
    const authForms = document.querySelectorAll('.auth-form, #google-login-btn, #google-register-btn');
    authForms.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('btn-google')) {
                e.preventDefault();
                window.location.href = 'perfil.html';
            }
        });
        if (item.tagName === 'FORM') {
            item.addEventListener('submit', (e) => {
                e.preventDefault();
                window.location.href = 'perfil.html';
            });
        }
    });

    // Checkout button prompt for login if unauthenticated
    checkoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!window.location.pathname.includes('perfil.html') && !localStorage.getItem('saecr_logged_in')) {
                // Prompt auth modal
                closeCart();
                openAuthModal();
            }
        });
    });

    // --- Terms & Conditions Modal with Mandatory Scroll Logic ---
    const openTermsBtns = document.querySelectorAll('#open-terms-btn');
    const termsModal = document.getElementById('terms-modal');
    const termsOverlay = document.getElementById('terms-modal-overlay');
    const closeTermsBtns = document.querySelectorAll('#close-terms-modal, #terms-modal-overlay');
    const termsModalBody = document.getElementById('terms-modal-body');
    const acceptTermsBtn = document.getElementById('accept-terms-btn');
    const scrollPromptText = document.getElementById('scroll-prompt-text');
    const termsCheckboxes = document.querySelectorAll('#terms-checkbox');

    function openTermsModal() {
        if (termsModal && termsOverlay) {
            termsModal.classList.add('open');
            termsOverlay.classList.add('open');

            if (termsModalBody) {
                if (termsModalBody.scrollHeight <= termsModalBody.clientHeight + 10) {
                    enableAcceptButton();
                } else {
                    termsModalBody.scrollTop = 0;
                }
            }
        }
    }

    function closeTermsModal() {
        if (termsModal && termsOverlay) {
            termsModal.classList.remove('open');
            termsOverlay.classList.remove('open');
        }
    }

    function enableAcceptButton() {
        if (acceptTermsBtn) {
            acceptTermsBtn.disabled = false;
            acceptTermsBtn.style.opacity = '1';
            acceptTermsBtn.style.cursor = 'pointer';
            acceptTermsBtn.innerHTML = "<i class='bx bx-check-circle'></i> I Have Read and Agree";
        }
        if (scrollPromptText) {
            scrollPromptText.innerHTML = "<i class='bx bx-check' style='color: #2b9348;'></i> You have read the full document!";
            scrollPromptText.style.color = "#2b9348";
        }
    }

    if (termsModalBody) {
        termsModalBody.addEventListener('scroll', () => {
            const isAtBottom = termsModalBody.scrollTop + termsModalBody.clientHeight >= termsModalBody.scrollHeight - 20;
            if (isAtBottom) {
                enableAcceptButton();
            }
        });
    }

    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', () => {
            if (!acceptTermsBtn.disabled) {
                termsCheckboxes.forEach(cb => {
                    cb.disabled = false;
                    cb.checked = true;
                });
                closeTermsModal();
                showToast('Terms & conditions accepted successfully!');
            }
        });
    }

    openTermsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openTermsModal();
        });
    });

    closeTermsBtns.forEach(btn => {
        btn.addEventListener('click', closeTermsModal);
    });
});
