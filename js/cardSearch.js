let allProducts = [];
let currentCategory = 'all';
let selectedChairs = [];

async function init() {
    try {
        // Points to your json folder
        const response = await fetch('./json/products.json');

        if (!response.ok) {
            throw new Error(`Could not find products.json (Status: ${ response.status })`);
        }

        allProducts = await response.json();
        renderCards(allProducts);
    } catch (error) {
        console.error("Error loading products:", error);
        document.getElementById('productGrid').innerHTML = `<p style="color:white; text-align:center; grid-column: 1/-1;">Error: Check your file path or Live Server.</p>`;
    }
}

function renderCards(products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';

        card.setAttribute('data-brand', product.brand_id);
        card.setAttribute('data-price', `$${ product.price.toLocaleString() }`);
        card.setAttribute('data-material', product.specs.material);
        card.setAttribute('data-warranty', product.specs.warranty);
        card.setAttribute('data-weight', `${ product.specs.weight_kg }kg`);

        card.innerHTML = `
            <div class="card-container">
                <div class="comparison-checkbox">
                    <input type="checkbox" onchange="toggleComparison(this, '${ product.model }')">
                </div>
                <div class="info-header">
                    <span class="category">${ product.brand }</span>
                    <span class="model-no">${ product.sku }</span>
                </div>
                <div class="image-box">
                    <img src="${ product.image }" alt="${ product.model }" onerror="this.src='https://via.placeholder.com/300?text=Image+Coming+Soon'">
                </div>
                <div class="footer">
                    <h3 class="product-title">${ product.model }</h3>
                    <div class="price-row">
                        <span class="price">$${ product.price.toLocaleString() }</span>
                    </div>
                    <div class="action-bar">
                        <a class="action-btn" href="./docs/chairs-brochure.docx" download="Richfield-Chair-Brochure.docx">Download</a>
                        <button class="action-btn" onclick="showAddedAlert('${ product.model }')">Add to Bag</button>
                    </div>
                </div>
                <div class="accent-bar"></div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setCategory(cat, btn) {
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = cat;
    runFilters();
}

function runFilters() {
    const searchInput = document.getElementById("searchField").value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        const brand = card.getAttribute("data-brand");
        const matchCategory = (currentCategory === 'all' || brand === currentCategory);
        const matchSearch = title.includes(searchInput);
        card.style.display = (matchCategory && matchSearch) ? "block" : "none";
    });
}

function toggleComparison(checkbox, title) {
    const card = checkbox.closest('.card');
    const chairData = {
        title: title,
        brand: card.querySelector('.category').innerText,
        price: card.getAttribute('data-price'),
        material: card.getAttribute('data-material'),
        warranty: card.getAttribute('data-warranty'),
        weight: card.getAttribute('data-weight')
    };

    if (checkbox.checked) {
        if (selectedChairs.length >= 4) {
            alert("You can compare up to 4 chairs at a time.");
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
    const countText = document.getElementById('comparisonCount');
    if (countText) countText.innerText = `${ selectedChairs.length } chair(s) selected for comparison`;
    if (bar) {
        selectedChairs.length > 0 ? bar.classList.add('active') : bar.classList.remove('active');
    }
}

function goToComparisonPage() {
    localStorage.setItem('selectedChairs', JSON.stringify(selectedChairs));
    window.location.href = 'comparison.html';
}

function showAddedAlert(modelName) {
    const existing = document.getElementById('bagToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'bagToast';
    toast.innerHTML = `
        <div class="toast-icon">✓</div>
        <div class="toast-text">
            <span class="toast-title">Added to Bag</span>
            <span class="toast-sub">${ modelName }</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast-show'));

    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

init();