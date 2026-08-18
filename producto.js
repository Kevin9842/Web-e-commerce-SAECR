document.addEventListener('DOMContentLoaded', () => {
    // Gallery Thumbnails Switcher
    const mainImg = document.getElementById('main-product-img');
    const thumbImgs = document.querySelectorAll('.thumb-img');

    thumbImgs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbImgs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            if (mainImg) {
                mainImg.src = thumb.src;
            }
        });
    });

    // Color Swatch Selection
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const selectedColorLabel = document.getElementById('selected-color');

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            const color = swatch.getAttribute('data-color');
            if (selectedColorLabel) selectedColorLabel.textContent = color;
        });
    });

    // Size Selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    const selectedSizeLabel = document.getElementById('selected-size');

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            const size = btn.getAttribute('data-size');
            if (selectedSizeLabel) selectedSizeLabel.textContent = size;
        });
    });

    // Quantity Selector (+ / -)
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');

    if (qtyMinus && qtyPlus && qtyInput) {
        qtyMinus.addEventListener('click', () => {
            let current = parseInt(qtyInput.value) || 1;
            if (current > 1) {
                qtyInput.value = current - 1;
            }
        });

        qtyPlus.addEventListener('click', () => {
            let current = parseInt(qtyInput.value) || 1;
            if (current < 10) {
                qtyInput.value = current + 1;
            }
        });
    }

    // Helper function for button click animation and feedback
    function triggerBtnAnimation(btn, originalHTML) {
        btn.classList.add('btn-clicked');
        btn.innerHTML = `<i class='bx bx-check'></i> ¡Añadido!`;
        
        setTimeout(() => {
            btn.classList.remove('btn-clicked');
        }, 400);

        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 1200);

        // Open Cart Drawer
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('open');
        }
    }

    // Detail "Añadir al Carrito" Button
    const detailAddCart = document.getElementById('detail-add-cart');
    if (detailAddCart) {
        const originalHTML = detailAddCart.innerHTML;
        detailAddCart.addEventListener('click', () => {
            triggerBtnAnimation(detailAddCart, originalHTML);
        });
    }

    // Detail "Pre-Ordenar Ahora" Button
    const detailPreorderBtn = document.getElementById('detail-preorder-btn');
    if (detailPreorderBtn) {
        const originalHTML = detailPreorderBtn.innerHTML;
        detailPreorderBtn.addEventListener('click', () => {
            triggerBtnAnimation(detailPreorderBtn, originalHTML);
        });
    }

    // Size Guide Pop-up Modal Logic
    const openSizeModalBtn = document.getElementById('open-size-modal');
    const closeSizeModalBtn = document.getElementById('close-size-modal');
    const sizeModal = document.getElementById('size-modal');
    const sizeModalOverlay = document.getElementById('size-modal-overlay');

    function openSizeModal() {
        if (sizeModal && sizeModalOverlay) {
            sizeModal.classList.add('open');
            sizeModalOverlay.classList.add('open');
        }
    }

    function closeSizeModal() {
        if (sizeModal && sizeModalOverlay) {
            sizeModal.classList.remove('open');
            sizeModalOverlay.classList.remove('open');
        }
    }

    if (openSizeModalBtn) openSizeModalBtn.addEventListener('click', openSizeModal);
    if (closeSizeModalBtn) closeSizeModalBtn.addEventListener('click', closeSizeModal);
    if (sizeModalOverlay) sizeModalOverlay.addEventListener('click', closeSizeModal);

    // Modal Tabs Switcher
    const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
    const modalTabContents = document.querySelectorAll('.modal-tab-content');

    modalTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalTabBtns.forEach(b => b.classList.remove('active'));
            modalTabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });
});
