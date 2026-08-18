document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('catalog-search');
    const categoryLinks = document.querySelectorAll('#category-filters .category-link');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const sortSelect = document.getElementById('sort-select');
    const productGrid = document.getElementById('catalog-grid');
    const catalogItems = document.querySelectorAll('.catalog-item');
    const productCount = document.getElementById('product-count');
    const noResults = document.getElementById('no-results');

    let currentCategory = 'todos';
    let currentSearch = '';
    let maxPrice = 200;

    // Category Filter Handler
    categoryLinks.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryLinks.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            filterProducts();
        });
    });

    // Search Input Handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            filterProducts();
        });
    }

    // Price Filter Handler
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            maxPrice = parseFloat(e.target.value);
            if (priceValue) priceValue.textContent = `$${maxPrice}`;
            filterProducts();
        });
    }

    // Sort Handler
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortProducts(sortSelect.value);
        });
    }

    function filterProducts() {
        let visibleCount = 0;

        catalogItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const name = item.getAttribute('data-name');
            const price = parseFloat(item.getAttribute('data-price'));

            const matchesCategory = (currentCategory === 'todos' || category === currentCategory);
            const matchesSearch = (currentSearch === '' || name.includes(currentSearch));
            const matchesPrice = price <= maxPrice;

            if (matchesCategory && matchesSearch && matchesPrice) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Update product count label
        if (productCount) {
            productCount.textContent = `Showing ${visibleCount} item${visibleCount !== 1 ? 's' : ''}`;
        }

        // Show/Hide No Results message
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    function sortProducts(criteria) {
        const itemsArray = Array.from(catalogItems);

        itemsArray.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            const nameA = a.getAttribute('data-name');
            const nameB = b.getAttribute('data-name');

            if (criteria === 'low-high') {
                return priceA - priceB;
            } else if (criteria === 'high-low') {
                return priceB - priceA;
            } else if (criteria === 'name') {
                return nameA.localeCompare(nameB);
            }
            return 0; // Default/Popular
        });

        // Re-append items in sorted order
        itemsArray.forEach(item => productGrid.appendChild(item));
    }
});
