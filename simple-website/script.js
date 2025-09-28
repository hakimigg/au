// Main JavaScript file for the website
class WebsiteApp {
    constructor() {
        this.currentFilter = 'all';
        this.isLoading = false;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadCompanies();
        this.loadProducts();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.hideLoading();
    }

    setupEventListeners() {
        // Modal close events
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

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Hero button
        const heroBtn = document.querySelector('.hero-btn');
        if (heroBtn) {
            heroBtn.addEventListener('click', () => {
                this.scrollToSection('products');
            });
        }
    }

    setupSmoothScrolling() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
        this.isLoading = true;
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
            const companies = database.getCompanies();
            this.renderCompanies(companies);
            this.renderFilterButtons(companies);
        } catch (error) {
            console.error('Error loading companies:', error);
            this.showError('Failed to load companies');
        }
    }

    renderCompanies(companies) {
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        if (companies.length === 0) {
            companiesGrid.innerHTML = this.getEmptyState('No companies found', 'Add some companies to get started');
            return;
        }

        companiesGrid.innerHTML = companies.map(company => `
            <div class="company-card animate-fadeInUp" onclick="app.filterByCompany('${company.id}')">
                ${this.getCompanyBackground(company.name)}
                <div style="position: relative; z-index: 10;">
                    <h3>${company.name.toUpperCase()}</h3>
                    <div class="company-divider"></div>
                </div>
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(255,255,255,0.1), transparent); transition: all 0.3s ease;"></div>
            </div>
        `).join('');

        // Add staggered animation
        this.addStaggeredAnimation('.company-card');
    }

    getCompanyBackground(companyName) {
        const patterns = {
            'Nokia': `
                <div style="position: absolute; inset: 0; opacity: 0.08;">
                    <div style="position: absolute; top: 1.5rem; left: 1.5rem; width: 3rem; height: 3rem; border: 2px solid #3b82f6; border-radius: 0.5rem; transform: rotate(12deg);"></div>
                    <div style="position: absolute; top: 3rem; right: 2rem; width: 2rem; height: 2rem; border: 1px solid #60a5fa; border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: 2rem; left: 3rem; width: 1.5rem; height: 1.5rem; background: #dbeafe; border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: 1.5rem; right: 1.5rem; width: 2.5rem; height: 2.5rem; border: 2px solid #3b82f6; border-radius: 0.5rem; transform: rotate(-12deg);"></div>
                </div>
            `,
            'Samsung': `
                <div style="position: absolute; inset: 0; opacity: 0.08;">
                    <div style="position: absolute; top: 1rem; left: 2rem; width: 3.5rem; height: 1.5rem; border: 2px solid #64748b; border-radius: 50px;"></div>
                    <div style="position: absolute; top: 2.5rem; right: 1.5rem; width: 2rem; height: 2rem; border: 1px solid #94a3b8; border-radius: 0.5rem; transform: rotate(45deg);"></div>
                    <div style="position: absolute; bottom: 2.5rem; left: 1.5rem; width: 2.5rem; height: 1rem; background: #e2e8f0; border-radius: 50px;"></div>
                    <div style="position: absolute; bottom: 1rem; right: 2rem; width: 3rem; height: 3rem; border: 1px solid #64748b; border-radius: 50%;"></div>
                </div>
            `,
            'Apple': `
                <div style="position: absolute; inset: 0; opacity: 0.08;">
                    <div style="position: absolute; top: 2rem; left: 2rem; width: 2.5rem; height: 2.5rem; border: 2px solid #6b7280; border-radius: 50%;"></div>
                    <div style="position: absolute; top: 1.5rem; right: 2.5rem; width: 1.5rem; height: 1.5rem; background: #e5e7eb; border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: 2rem; left: 2.5rem; width: 2rem; height: 2rem; border: 1px solid #6b7280; border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: 1.5rem; right: 2rem; width: 3rem; height: 3rem; border: 1px solid #e5e7eb; border-radius: 50%;"></div>
                </div>
            `
        };

        return patterns[companyName] || `
            <div style="position: absolute; inset: 0; opacity: 0.08;">
                <div style="position: absolute; top: 1rem; left: 1rem; width: 2rem; height: 2rem; border: 2px solid #d4a574; border-radius: 50%;"></div>
                <div style="position: absolute; top: 2rem; right: 2rem; width: 1.5rem; height: 1.5rem; border: 2px solid #64748b; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 1.5rem; left: 2rem; width: 1rem; height: 1rem; background: #fbbf24; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 2rem; right: 1.5rem; width: 2.5rem; height: 2.5rem; border: 1px solid #64748b; border-radius: 50%;"></div>
            </div>
        `;
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
            const products = database.getAvailableProducts();
            this.renderProducts(products);
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products');
        }
    }

    renderProducts(products) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        if (products.length === 0) {
            productsGrid.innerHTML = this.getEmptyState('No products found', 'No products match your current filter or all products are out of stock');
            return;
        }

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card animate-fadeInUp" onclick="app.showProductDetails('${product.id}')">
                <div class="product-image">
                    <img src="${product.photos[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}" 
                         alt="${product.name}"
                         onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-company">${this.getCompanyName(product.company)}</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-description">${this.truncateText(product.description, 100)}</p>
                    <p class="product-stock ${product.stock <= 0 ? 'out-of-stock' : ''}">
                        ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                    <button class="view-details-btn" onclick="event.stopPropagation(); app.showProductDetails('${product.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');

        // Add staggered animation
        this.addStaggeredAnimation('.product-card');
    }

    getCompanyName(companyId) {
        const company = database.getCompanyById(companyId);
        return company ? company.name : companyId;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    addStaggeredAnimation(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }

    filterByCompany(companyId) {
        this.currentFilter = companyId;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="app.filterByCompany('${companyId}')"]`)?.classList.add('active');

        // Filter and render products
        let products;
        if (companyId === 'all') {
            products = database.getAvailableProducts();
        } else {
            products = database.getProductsByCompany(companyId).filter(p => p.stock > 0);
        }

        this.renderProducts(products);
        
        // Scroll to products section
        this.scrollToSection('products');
    }

    showProductDetails(productId) {
        const product = database.getProductById(productId);
        if (!product) {
            this.showError('Product not found');
            return;
        }

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
                    <p style="font-size: 2rem; font-weight: 700; color: #d4a574; margin-bottom: 1.5rem;">$${product.price.toFixed(2)}</p>
                    <p style="color: #64748b; line-height: 1.6; margin-bottom: 1.5rem;">${product.description}</p>
                    <p style="color: ${product.stock > 0 ? '#059669' : '#dc2626'}; font-weight: 600; margin-bottom: 1.5rem;">
                        ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                    ${Object.keys(product.specs || {}).length > 0 ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h3 style="font-size: 1.2rem; font-weight: 600; color: #1e293b; margin-bottom: 0.75rem;">Specifications</h3>
                            <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                                ${Object.entries(product.specs).map(([key, value]) => `
                                    <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px solid #e2e8f0;">
                                        <span style="font-weight: 500; color: #64748b;">${this.formatSpecKey(key)}:</span>
                                        <span style="color: #1e293b;">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${product.tags && product.tags.length > 0 ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h3 style="font-size: 1.2rem; font-weight: 600; color: #1e293b; margin-bottom: 0.75rem;">Tags</h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${product.tags.map(tag => `
                                    <span style="background: #e2e8f0; color: #64748b; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem;">
                                        ${tag}
                                    </span>
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

    formatSpecKey(key) {
        return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    getEmptyState(title, message) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }

    showError(message) {
        console.error(message);
        // You could implement a toast notification here
        alert(message);
    }

    // Public method to refresh data
    refresh() {
        this.loadCompanies();
        this.loadProducts();
    }
}

// Utility functions
function scrollToSection(sectionId) {
    if (window.app) {
        window.app.scrollToSection(sectionId);
    }
}

// Initialize the app
window.app = new WebsiteApp();
