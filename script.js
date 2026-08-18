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

    // Check local storage for theme preference (Default: Dark Mode for Urban Gothic aesthetic)
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme !== 'light') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        if (themeToggle) themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        if (themeToggle) themeToggle.innerHTML = "<i class='bx bx-moon'></i>";
    }

    if (themeToggle) {
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
    }

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
        if (!slides || slides.length === 0) return;

        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        if (index >= totalSlides) currentSlide = 0;
        if (index < 0) currentSlide = totalSlides - 1;

        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }

        // Re-trigger animation
        if (slides[currentSlide]) {
            const content = slides[currentSlide].querySelector('.carousel-content');
            if (content) {
                content.classList.remove('fade-up');
                void content.offsetWidth;
                content.classList.add('fade-up');
            }
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
        if (totalSlides > 0) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    if (totalSlides > 0) {
        startInterval(); // Start auto sliding
    }

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

    // --- Spin-to-Win Coupon Wheel & Cart Coupon Engine ---
    const openWheelBtn = document.getElementById('open-wheel-btn');
    const wheelModal = document.getElementById('wheel-modal');
    const wheelOverlay = document.getElementById('wheel-modal-overlay');
    const closeWheelBtn = document.getElementById('close-wheel-modal');

    // Victory Pop-up Modal Elements
    const winModal = document.getElementById('win-modal');
    const winOverlay = document.getElementById('win-modal-overlay');
    const closeWinModalBtn = document.getElementById('close-win-modal');
    const winPrizeTitle = document.getElementById('win-prize-title');
    const winCodeText = document.getElementById('win-code-text');
    const applyWinCouponBtn = document.getElementById('apply-win-coupon-btn');
    const copyWinCodeBtn = document.getElementById('copy-win-code-btn');

    // Cart Coupon Control Elements
    const cartCouponInput = document.getElementById('cart-coupon-input');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const activeCouponBadge = document.getElementById('active-coupon-badge');
    const appliedCouponName = document.getElementById('applied-coupon-name');
    const removeCouponBtn = document.getElementById('remove-coupon-btn');
    const cartDiscountLine = document.getElementById('cart-discount-line');
    const discountLabel = document.label ? document.getElementById('discount-label') : document.getElementById('discount-label');
    const cartDiscountAmount = document.getElementById('cart-discount-amount');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartFinalTotalEl = document.getElementById('cart-final-total');

    // SAECR Brand Palette
    const prizes = [
        { label: '15% OFF', code: 'SAECR15', color: '#111111', textColor: '#ffffff', rate: 0.15 },
        { label: 'FREE SHIP', code: 'FREESHIP', color: '#d90429', textColor: '#ffffff', rate: 0.00, freeShip: true },
        { label: '20% OFF', code: 'SAECR20', color: '#1f1f1f', textColor: '#ffffff', rate: 0.20 },
        { label: '10% OFF', code: 'SAECR10', color: '#ffffff', textColor: '#111111', rate: 0.10 },
        { label: '25% JACKET', code: 'JACKET25', color: '#a1031d', textColor: '#ffffff', rate: 0.25 },
        { label: 'FREE GIFT', code: 'SAECRGIFT', color: '#161616', textColor: '#ffffff', rate: 0.15 }
    ];

    // Coupon Calculation Engine
    let activeCoupon = localStorage.getItem('saecr_active_coupon') || null;

    function recalculateCart() {
        const subtotal = 165.00; // Base sample subtotal
        if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;

        if (activeCoupon) {
            const prizeObj = prizes.find(p => p.code === activeCoupon) || { code: activeCoupon, rate: 0.15, label: '15% OFF' };
            const discountValue = subtotal * (prizeObj.rate || 0.15);
            const finalTotal = Math.max(0, subtotal - discountValue);

            if (activeCouponBadge) activeCouponBadge.classList.remove('hidden');
            if (appliedCouponName) appliedCouponName.textContent = activeCoupon;
            if (cartDiscountLine) cartDiscountLine.classList.remove('hidden');
            const discLbl = document.getElementById('discount-label');
            if (discLbl) discLbl.textContent = prizeObj.label;
            if (cartDiscountAmount) cartDiscountAmount.textContent = `-$${discountValue.toFixed(2)}`;
            if (cartFinalTotalEl) cartFinalTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
        } else {
            if (activeCouponBadge) activeCouponBadge.classList.add('hidden');
            if (cartDiscountLine) cartDiscountLine.classList.add('hidden');
            if (cartFinalTotalEl) cartFinalTotalEl.textContent = `$${subtotal.toFixed(2)}`;
        }
    }

    recalculateCart();

    if (applyCouponBtn && cartCouponInput) {
        applyCouponBtn.addEventListener('click', () => {
            const code = cartCouponInput.value.trim().toUpperCase();
            if (code) {
                activeCoupon = code;
                localStorage.setItem('saecr_active_coupon', code);
                recalculateCart();
                showToast(`Coupon ${code} applied successfully!`);
                cartCouponInput.value = '';
            }
        });
    }

    if (removeCouponBtn) {
        removeCouponBtn.addEventListener('click', () => {
            activeCoupon = null;
            localStorage.removeItem('saecr_active_coupon');
            recalculateCart();
            showToast('Coupon removed.');
        });
    }

    // Standalone Confetti Burst Engine
    function launchConfettiBurst() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ffffff', '#d90429', '#111111', '#ff4d6d', '#ffd700'];

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 3,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.8) * 20,
                size: Math.random() * 8 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10,
                opacity: 1,
                decay: Math.random() * 0.015 + 0.008
            });
        }

        function renderConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activeCount = 0;

            particles.forEach(p => {
                if (p.opacity > 0) {
                    activeCount++;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.4;
                    p.rotation += p.vRot;
                    p.opacity -= p.decay;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });

            if (activeCount > 0) requestAnimationFrame(renderConfetti);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        renderConfetti();
    }

    // Draw Wheel on Canvas
    function drawWheelOnCanvas(canvasEl) {
        if (!canvasEl) return;
        const ctx = canvasEl.getContext('2d');
        const numSlices = prizes.length;
        const radius = canvasEl.width / 2;
        const sliceAngle = (2 * Math.PI) / numSlices;

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        for (let i = 0; i < numSlices; i++) {
            const angle = i * sliceAngle;
            ctx.beginPath();
            ctx.fillStyle = prizes[i].color;
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius - 6, angle, angle + sliceAngle);
            ctx.lineTo(radius, radius);
            ctx.fill();

            // Divider Line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = prizes[i].textColor;
            ctx.font = 'bold 28px Outfit, sans-serif';
            ctx.shadowColor = prizes[i].textColor === '#ffffff' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.3)';
            ctx.shadowBlur = 3;
            ctx.fillText(prizes[i].label, radius - 50, 9);
            ctx.restore();
        }

        // Outer ring
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    // Open Victory Pop-up Modal
    function openWinModal(prize) {
        if (winPrizeTitle) winPrizeTitle.textContent = `${prize.label} YOUR ORDER`;
        if (winCodeText) winCodeText.textContent = prize.code;

        if (winModal && winOverlay) {
            winModal.classList.add('open');
            winOverlay.classList.add('open');
        }

        launchConfettiBurst();
    }

    function closeWinModal() {
        if (winModal && winOverlay) {
            winModal.classList.remove('open');
            winOverlay.classList.remove('open');
        }
    }

    if (closeWinModalBtn) closeWinModalBtn.addEventListener('click', closeWinModal);
    if (winOverlay) winOverlay.addEventListener('click', closeWinModal);

    if (applyWinCouponBtn) {
        applyWinCouponBtn.addEventListener('click', () => {
            const code = winCodeText ? winCodeText.textContent : 'SAECR15';
            activeCoupon = code;
            localStorage.setItem('saecr_active_coupon', code);
            recalculateCart();
            closeWinModal();
            closeWheelModal();
            openCart();
            showToast(`Coupon ${code} applied to your cart!`);
        });
    }

    if (copyWinCodeBtn) {
        copyWinCodeBtn.addEventListener('click', () => {
            const code = winCodeText ? winCodeText.textContent : 'SAECR15';
            navigator.clipboard.writeText(code).then(() => {
                copyWinCodeBtn.innerHTML = "<i class='bx bx-check'></i> Copied!";
                showToast('Coupon code copied!');
                setTimeout(() => {
                    copyWinCodeBtn.innerHTML = "<i class='bx bx-copy'></i> Copy Code";
                }, 2000);
            });
        });
    }

    function setupWheelInstance(canvasId, spinBtnId, pointerId) {
        const canvas = document.getElementById(canvasId);
        const spinBtn = document.getElementById(spinBtnId);
        const pointer = document.getElementById(pointerId);

        if (!canvas) return;

        drawWheelOnCanvas(canvas);

        let instanceDegree = 0;
        let isSpinning = false;

        // Reset button state on load so it's always ready for testing
        if (spinBtn) {
            spinBtn.disabled = false;
            spinBtn.style.opacity = '1';
            if (spinBtn.tagName === 'BUTTON' && spinBtn.classList.contains('spin-center-btn')) {
                spinBtn.textContent = 'SPIN';
            }
        }

        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                if (isSpinning) return;
                isSpinning = true;
                spinBtn.disabled = true;
                spinBtn.style.opacity = '0.5';

                const bezel = canvas.closest('.wheel-bezel');
                if (bezel) bezel.classList.add('spinning');

                const tickInterval = setInterval(() => {
                    if (pointer) {
                        pointer.classList.add('tick');
                        setTimeout(() => pointer.classList.remove('tick'), 60);
                    }
                }, 110);

                const randomIndex = Math.floor(Math.random() * prizes.length);
                const numSlices = prizes.length;
                const sliceDegrees = 360 / numSlices;

                const targetDegree = (360 * 6) + (270 - (randomIndex * sliceDegrees) - (sliceDegrees / 2));
                instanceDegree += targetDegree;

                canvas.style.transform = `rotate(${instanceDegree}deg)`;

                setTimeout(() => {
                    clearInterval(tickInterval);
                    if (bezel) bezel.classList.remove('spinning');

                    const prize = prizes[randomIndex];
                    isSpinning = false;
                    spinBtn.disabled = false;
                    spinBtn.style.opacity = '1';

                    openWinModal(prize);
                }, 4500);
            });
        }
    }

    // Modal Instance
    setupWheelInstance('wheel-canvas', 'spin-btn', 'modal-wheel-pointer');
    // Dedicated Section Instance
    setupWheelInstance('section-wheel-canvas', 'section-spin-btn', 'section-wheel-pointer');

    function openWheelModal() {
        if (wheelModal && wheelOverlay) {
            wheelModal.classList.add('open');
            wheelOverlay.classList.add('open');
        }
    }

    function closeWheelModal() {
        if (wheelModal && wheelOverlay) {
            wheelModal.classList.remove('open');
            wheelOverlay.classList.remove('open');
        }
    }

    if (openWheelBtn) openWheelBtn.addEventListener('click', openWheelModal);
    if (closeWheelBtn) closeWheelBtn.addEventListener('click', closeWheelModal);
    if (wheelOverlay) wheelOverlay.addEventListener('click', closeWheelModal);

    // Auto open pop-up after 3 seconds on home page for previewing
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        setTimeout(() => {
            openWheelModal();
        }, 3000);
    }
});
