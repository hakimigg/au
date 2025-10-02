class CompanyApp {
    constructor() {
        this.companyId = null;
        this.company = null;
        this.products = [];
        this.allProducts = [];
        this.isLoading = true;
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
        console.log('🚀 Initializing company app...');
        
        // Get company ID from URL parameters
        this.companyId = this.getCompanyIdFromURL();
        console.log('Company ID from URL:', this.companyId);
        if (!this.companyId) {
            console.error('No company ID found in URL');
            alert('No company ID found. Redirecting to home page.');
            window.location.href = 'index.html';
            return;
        }

        this.setupEventListeners();
        
        // Initialize language system
        if (window.languageManager) {
            window.languageManager.init();
        }
        
        console.log('⏳ Waiting for database...');
        await this.waitForDatabase();
        console.log('✅ Database ready, loading company data...');
        
        this.loadCompanyData();
        this.hideLoading();
        console.log('✅ Company app initialization complete');
    }

    getCompanyIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async waitForDatabase() {
        while (!window.database) {
            console.log('⏳ Waiting for database connection...');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
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

        // Setup search listener
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.searchProducts();
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchProducts();
                }
            });
        }
    }

    loadCompanyData() {
        try {
            // Load company details
            const companies = database.getCompanies();
            console.log('Available companies:', companies);
            this.company = companies.find(c => c.id === this.companyId);
            console.log('Found company:', this.company);
            
            if (!this.company) {
                console.error('Company not found with ID:', this.companyId);
                alert('Company not found. Redirecting to home page.');
                window.location.href = 'index.html';
                return;
            }

            // Load company products
            this.allProducts = database.getProductsByCompany(this.companyId);
            this.products = [...this.allProducts];
            console.log('Found products for company:', this.allProducts.length);

            this.renderCompanyDetails();
            this.renderProducts();
            
        } catch (error) {
            console.error('Error loading company data:', error);
        }
    }

    renderCompanyDetails() {
        const companyDetails = document.getElementById('companyDetails');
        if (!companyDetails || !this.company) return;

        const backgroundImage = this.company.logo || this.company.photo;
        
        companyDetails.innerHTML = `
            <div class="company-hero">
                <div class="company-image" style="${backgroundImage ? `background-image: url('${backgroundImage}'); background-size: cover; background-position: center;` : 'background: linear-gradient(135deg, #d4a574, #b8860b);'}">
                    <div class="company-overlay">
                        <h1 class="company-name">${this.company.name}</h1>
                        <p class="company-description">${this.company.description || 'Premium quality products'}</p>
                    </div>
                </div>
            </div>
        `;

        // Update page title
        document.title = `${this.company.name} - Beta Website`;
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        if (this.products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No products found</h3>
                    <p>This company doesn't have any products available at the moment.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = this.products.map(product => {
            const imageUrl = product.image || 'assets/placeholder-product.jpg';
            const price = product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'Price on request';
            
            return `
                <div class="product-card animate-fadeInUp" onclick="companyApp.showProductModal('${product.id}')">
                    <div class="product-image">
                        <img src="${imageUrl}" alt="${product.name}" onerror="this.src='assets/placeholder-product.jpg'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${this.truncateText(product.description || '', 100)}</p>
                        <div class="product-price">${price}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    searchProducts() {
        const searchTerm = document.getElementById('productSearch').value.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.products = [...this.allProducts];
        } else {
            this.products = this.allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm))
            );
        }
        
        this.renderProducts();
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('productModal');
        const modalContent = document.getElementById('modalContent');
        
        if (!modal || !modalContent) return;

        const imageUrl = product.image || 'assets/placeholder-product.jpg';
        const price = product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'Price on request';
        
        modalContent.innerHTML = `
            <div class="modal-product">
                <div class="modal-product-image">
                    <img src="${imageUrl}" alt="${product.name}" onerror="this.src='assets/placeholder-product.jpg'">
                </div>
                <div class="modal-product-info">
                    <h2>${product.name}</h2>
                    <p class="modal-company-name">by ${this.company.name}</p>
                    <p class="modal-product-description">${product.description || 'No description available.'}</p>
                    <div class="modal-product-price">${price}</div>
                    <button class="contact-btn" onclick="companyApp.contactForProduct('${product.id}')">
                        Contact for this product
                    </button>
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

    contactForProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const subject = `Inquiry about ${product.name}`;
            const body = `Hello,\n\nI'm interested in learning more about ${product.name} from ${this.company.name}.\n\nPlease provide more information.\n\nThank you!`;
            window.location.href = `mailto:contact@betawebsite.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        this.isLoading = false;
    }
}

// Initialize the company app
const companyApp = new CompanyApp();
