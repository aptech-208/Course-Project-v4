let allProducts = [];
let currentCategory = 'all';
let selectedChairs = [];

async function init() {
    try {
        const response = await fetch('./json/products.json');
        if (!response.ok) throw new Error(`Status: ${ response.status }`);
        allProducts = await response.json();
        renderCards(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productGrid').innerHTML =
            `<p style="color:rgba(255,255,255,0.35);text-align:center;grid-column:1/-1;padding:80px 20px;font-family:'Jost',sans-serif;letter-spacing:1px;font-size:0.88rem;">Unable to load collection. Please try again.</p>`;
    }
}

function renderCards(products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = '';

    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-brand', product.brand_id);
        card.setAttribute('data-price', `$${ product.price.toLocaleString() }`);
        card.setAttribute('data-material', product.specs.material);
        card.setAttribute('data-warranty', product.specs.warranty);
        card.setAttribute('data-weight', `${ product.specs.weight_kg }kg`);
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-duration', '700');
        card.setAttribute('data-aos-delay', String((index % 3) * 80));

        card.innerHTML = `
            <div class="card-container">
                <div class="comparison-checkbox">
                    <input type="checkbox" title="Add to comparison" onchange="toggleComparison(this, '${ product.model }')">
                </div>
                <div class="info-header">
                    <span class="category">${ product.brand }</span>
                    <span class="model-no">${ product.sku }</span>
                </div>
                <div class="image-box">
                    <img src="${ product.image }" alt="${ product.model }" onerror="this.style.opacity='0.12'">
                </div>
                <div class="footer">
                    <h3 class="product-title">${ product.model }</h3>
                    <div class="price-row">
                        <span class="price">$${ product.price.toLocaleString() }</span>
                    </div>
                    <div class="action-bar">
                        <a class="action-btn" href="./docs/chairs-brochure.docx" download="Richfield-Chair-Brochure.docx">Download</a>
                        <button class="action-btn" onclick="showBagToast('${ product.model }')">Add to Bag</button>
                    </div>
                </div>
                <div class="accent-bar"></div>
            </div>
        `;
        grid.appendChild(card);
    });

    if (typeof AOS !== 'undefined') AOS.refresh();
}

function setCategory(cat, btn) {
    document.querySelectorAll('.cs-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = cat;
    runFilters();
}

function runFilters() {
    const search = document.getElementById('searchField').value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('.product-title')?.innerText.toLowerCase() || '';
        const brand = card.getAttribute('data-brand');
        const matchCat = currentCategory === 'all' || brand === currentCategory;
        const matchSearch = title.includes(search);
        card.style.display = (matchCat && matchSearch) ? '' : 'none';
    });
}

function toggleComparison(checkbox, title) {
    const card = checkbox.closest('.card');
    const chairData = {
        title,
        brand: card.querySelector('.category')?.innerText || '',
        price: card.getAttribute('data-price') || '',
        material: card.getAttribute('data-material') || '',
        warranty: card.getAttribute('data-warranty') || '',
        weight: card.getAttribute('data-weight') || '',
    };
    if (checkbox.checked) {
        if (selectedChairs.length >= 4) {
            alert('You can compare up to 4 chairs at a time.');
            checkbox.checked = false;
            return;
        }
        selectedChairs.push(chairData);
    } else {
        selectedChairs = selectedChairs.filter(c => c.title !== title);
    }
    updateComparisonUI();
}

function updateComparisonUI() {
    const bar = document.getElementById('comparisonBar');
    const count = document.getElementById('comparisonCount');
    if (count) count.textContent = `${ selectedChairs.length } chair${ selectedChairs.length !== 1 ? 's' : '' } selected`;
    if (bar) bar.classList.toggle('active', selectedChairs.length > 0);
}

function goToComparisonPage() {
    localStorage.setItem('selectedChairs', JSON.stringify(selectedChairs));
    window.location.href = 'comparison.html';
}

function showBagToast(name) {
    const toast = document.getElementById('bagToast');
    if (!toast) return;
    toast.innerHTML = `
        <div class="toast-icon">&#10003;</div>
        <div class="toast-text">
            <span class="toast-title">Added to Bag</span>
            <span class="toast-sub">${ name }</span>
        </div>
        <button class="toast-close" onclick="document.getElementById('bagToast').classList.remove('toast-show')">&#215;</button>
    `;
    toast.classList.remove('toast-show');
    requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('toast-show')); });
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('toast-show'), 3000);
}

init();