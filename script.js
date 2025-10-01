class WebsiteApp {
    constructor() {
        this.currentFilter = 'all';
        this.isLoading = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    async initializeApp() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        
        await this.waitForDatabase();
        
        this.loadCompanies();
        this.loadProducts();
        this.hideLoading();
    }

    setupEventListeners() {
        const modal = document.getElementById('productModal');
        const closeBtn = document.querySelector('.modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    async waitForDatabase() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.database && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.database) {
            console.error('Database not available after waiting');
            return;
        }
        
        attempts = 0;
        while ((window.database.companies.length === 0 || window.database.products.length === 0) && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        console.log('✅ Database ready with', window.database.companies.length, 'companies and', window.database.products.length, 'products');
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
        this.isLoading = false;
    }

    async loadCompanies() {
        try {
            if (!window.database) {
                console.warn('Database not ready, retrying...');
                setTimeout(() => this.loadCompanies(), 1000);
                return;
            }
            
            const companies = database.getCompanies();
            console.log('📋 Loading companies for website:', companies.length);
            this.renderCompanies(companies);
            this.renderFilterButtons(companies);
        } catch (error) {
            console.error('Error loading companies:', error);
        }
    }

    renderCompanies(companies) {
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        if (companies.length === 0) {
            companiesGrid.innerHTML = '<div class="empty-state"><h3>No companies found</h3></div>';
            return;
        }

        companiesGrid.innerHTML = companies.map(company => {
            const backgroundImage = company.logo || company.photo;
            const backgroundStyle = backgroundImage ? 
                `background-image: url('${backgroundImage}'); background-size: cover; background-position: center;` : 
                '';
            
            return `
                <div class="company-card animate-fadeInUp" onclick="app.filterByCompany('${company.id}')" 
                     style="${backgroundStyle}">
                    <div class="company-overlay">
                        <h3>${company.name.toUpperCase()}</h3>
                        <div class="company-divider"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderFilterButtons(companies) {
        const filterButtons = document.getElementById('filterButtons');
        if (!filterButtons) return;

        const buttons = [
            { id: 'all', name: 'All Products' },
            ...companies.map(company => ({ id: company.id, name: company.name }))
        ];

        filterButtons.innerHTML = buttons.map(button => `
            <button class="filter-btn ${button.id === this.currentFilter ? 'active' : ''}" 
                    onclick="app.filterByCompany('${button.id}')">
                ${button.name}
            </button>
        `).join('');
    }

    async loadProducts() {
        try {
            if (!window.database) {
                console.warn('Database not ready, retrying...');
                setTimeout(() => this.loadProducts(), 1000);
                return;
            }
            
            const products = database.getAvailableProducts();
            console.log('📦 Loading products for website:', products.length);
            this.renderProducts(products);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    renderProducts(products) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        if (products.length === 0) {
            productsGrid.innerHTML = '<div class="empty-state"><h3>No products found</h3></div>';
            return;
        }

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card animate-fadeInUp" onclick="app.showProductDetails('${product.id}')">
                <div class="product-image">
                    ${product.photos && product.photos.length > 0 ? 
                        `<img src="${product.photos[0]}" alt="${product.name}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'>No Image</div>'">` :
                        `<div class="placeholder-image">No Image</div>`
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-company">${this.getCompanyName(product.company)}</p>
                    <p class="product-price">${product.price.toFixed(2)}</p>
                    <p class="product-description">${this.truncateText(product.description, 100)}</p>
                    <p class="product-stock">${product.stock} in stock</p>
                    <button class="view-details-btn" onclick="event.stopPropagation(); app.showProductDetails('${product.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    getCompanyName(companyId) {
        const company = database.getCompanyById(companyId);
        return company ? company.name : companyId;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    filterByCompany(companyId) {
        this.currentFilter = companyId;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="app.filterByCompany('${companyId}')"]`)?.classList.add('active');

        let products;
        if (companyId === 'all') {
            products = database.getAvailableProducts();
        } else {
            products = database.getProductsByCompany(companyId).filter(p => p.stock > 0);
        }

        this.renderProducts(products);
        this.scrollToSection('products');
    }

    showProductDetails(productId) {
        const product = database.getProductById(productId);
        if (!product) return;

        const company = database.getCompanyById(product.company);
        const modal = document.getElementById('productModal');
        const modalContent = document.getElementById('modalContent');

        if (!modal || !modalContent) return;

        modalContent.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                <div>
                    <img src="${product.photos[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}" 
                         alt="${product.name}"
                         style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px;"
                         onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'">
                </div>
                <div>
                    <h2 style="font-size: 2rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">${product.name}</h2>
                    <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 1rem;">${company ? company.name : product.company}</p>
                    <p style="font-size: 2rem; font-weight: 700; color: #d4a574; margin-bottom: 1.5rem;">${product.price.toFixed(2)} DA</p>
                    <p style="color: #64748b; line-height: 1.6; margin-bottom: 1.5rem;">${product.description}</p>
                    <p style="color: #059669; font-weight: 600; margin-bottom: 1.5rem;">${product.stock} in stock</p>
                    ${Object.keys(product.specs || {}).length > 0 ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h3 style="font-size: 1.2rem; font-weight: 600; color: #1e293b; margin-bottom: 0.75rem;">Specifications</h3>
                            <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                                ${Object.entries(product.specs).map(([key, value]) => `
                                    <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px solid #e2e8f0;">
                                        <span style="font-weight: 500; color: #64748b;">${key}:</span>
                                        <span style="color: #1e293b;">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

window.app = new WebsiteApp();
