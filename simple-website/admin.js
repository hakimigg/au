// Admin Panel JavaScript
class AdminApp {
    constructor() {
        this.currentTab = 'companies';
        this.editingCompany = null;
        this.editingProduct = null;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.loadStats();
        this.loadCompanies();
        this.loadProducts();
        this.setupEventListeners();
        this.hideLoading();
    }

    setupEventListeners() {
        // Modal close events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // File input for import
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById('importText').value = e.target.result;
                    };
                    reader.readAsText(file);
                }
            });
        }
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Tab Management
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="adminApp.switchTab('${tabName}')"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;
    }

    // Stats Management
    loadStats() {
        const stats = database.getStats();
        const statsGrid = document.getElementById('statsGrid');
        
        if (!statsGrid) return;

        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${stats.totalCompanies}</div>
                <div class="stat-label">Total Companies</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalProducts}</div>
                <div class="stat-label">Total Products</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.inStockProducts}</div>
                <div class="stat-label">In Stock</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.outOfStockProducts}</div>
                <div class="stat-label">Out of Stock</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">$${stats.totalValue}</div>
                <div class="stat-label">Total Inventory Value</div>
            </div>
        `;
    }

    // Company Management
    loadCompanies() {
        const companies = database.getCompanies();
        const companiesGrid = document.getElementById('companiesGrid');
        
        if (!companiesGrid) return;

        if (companies.length === 0) {
            companiesGrid.innerHTML = `
                <div class="admin-empty-state">
                    <h3>No Companies Found</h3>
                    <p>Add your first company to get started</p>
                    <button class="btn btn-primary" onclick="adminApp.showCompanyModal()">Add Company</button>
                </div>
            `;
            return;
        }

        companiesGrid.innerHTML = companies.map(company => `
            <div class="admin-card">
                <h3>${company.name}</h3>
                <p>${company.description || 'No description'}</p>
                <div class="card-meta">
                    ID: ${company.id}
                    ${company.logo ? ' • Has Logo' : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="adminApp.editCompany('${company.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="adminApp.deleteCompany('${company.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    showCompanyModal(companyId = null) {
        const modal = document.getElementById('companyModal');
        const title = document.getElementById('companyModalTitle');
        const form = document.getElementById('companyForm');
        
        if (!modal || !title || !form) return;

        this.editingCompany = companyId;
        
        if (companyId) {
            const company = database.getCompanyById(companyId);
            if (!company) return;
            
            title.textContent = 'Edit Company';
            document.getElementById('companyId').value = company.id;
            document.getElementById('companyId').disabled = true;
            document.getElementById('companyName').value = company.name;
            document.getElementById('companyDescription').value = company.description || '';
            document.getElementById('companyLogo').value = company.logo || '';
        } else {
            title.textContent = 'Add Company';
            form.reset();
            document.getElementById('companyId').disabled = false;
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeCompanyModal() {
        const modal = document.getElementById('companyModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        this.editingCompany = null;
    }

    saveCompany(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const companyData = {
            id: formData.get('id').toLowerCase().replace(/\s+/g, ''),
            name: formData.get('name'),
            description: formData.get('description'),
            logo: formData.get('logo') || null
        };

        try {
            if (this.editingCompany) {
                database.updateCompany(this.editingCompany, companyData);
                this.showToast('Company updated successfully');
            } else {
                // Check if ID already exists
                if (database.getCompanyById(companyData.id)) {
                    this.showToast('Company ID already exists', 'error');
                    return;
                }
                database.addCompany(companyData);
                this.showToast('Company added successfully');
            }
            
            this.closeCompanyModal();
            this.loadCompanies();
            this.loadStats();
            this.updateProductCompanyOptions();
        } catch (error) {
            this.showToast('Error saving company: ' + error.message, 'error');
        }
    }

    editCompany(companyId) {
        this.showCompanyModal(companyId);
    }

    deleteCompany(companyId) {
        const company = database.getCompanyById(companyId);
        if (!company) return;

        const products = database.getProductsByCompany(companyId);
        let message = `Are you sure you want to delete "${company.name}"?`;
        
        if (products.length > 0) {
            message += `\n\nThis will also delete ${products.length} product(s) from this company.`;
        }

        if (confirm(message)) {
            database.deleteCompany(companyId);
            this.showToast('Company deleted successfully');
            this.loadCompanies();
            this.loadProducts();
            this.loadStats();
            this.updateProductCompanyOptions();
        }
    }

    // Product Management
    loadProducts() {
        const products = database.getProducts();
        const productsGrid = document.getElementById('productsGrid');
        
        if (!productsGrid) return;

        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="admin-empty-state">
                    <h3>No Products Found</h3>
                    <p>Add your first product to get started</p>
                    <button class="btn btn-primary" onclick="adminApp.showProductModal()">Add Product</button>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = products.map(product => {
            const company = database.getCompanyById(product.company);
            return `
                <div class="admin-card product-admin-card">
                    <img src="${product.photos[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}" 
                         alt="${product.name}" 
                         class="product-admin-image"
                         onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'">
                    <div class="product-admin-info">
                        <h3>${product.name}</h3>
                        <div class="product-admin-price">$${product.price.toFixed(2)}</div>
                        <div class="product-admin-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                            ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </div>
                        <div class="card-meta">
                            ${company ? company.name : product.company} • ID: ${product.id}
                        </div>
                        <div class="card-actions">
                            <button class="btn btn-small btn-secondary" onclick="adminApp.editProduct('${product.id}')">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="adminApp.deleteProduct('${product.id}')">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    showProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const form = document.getElementById('productForm');
        
        if (!modal || !title || !form) return;

        this.editingProduct = productId;
        this.updateProductCompanyOptions();
        
        if (productId) {
            const product = database.getProductById(productId);
            if (!product) return;
            
            title.textContent = 'Edit Product';
            document.getElementById('productId').value = product.id;
            document.getElementById('productId').disabled = true;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productCompany').value = product.company;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productPhotos').value = (product.photos || []).join('\n');
            document.getElementById('productTags').value = (product.tags || []).join(', ');
            
            // Load specs
            this.loadProductSpecs(product.specs || {});
        } else {
            title.textContent = 'Add Product';
            form.reset();
            document.getElementById('productId').disabled = false;
            this.resetProductSpecs();
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        this.editingProduct = null;
    }

    updateProductCompanyOptions() {
        const select = document.getElementById('productCompany');
        if (!select) return;

        const companies = database.getCompanies();
        select.innerHTML = companies.map(company => 
            `<option value="${company.id}">${company.name}</option>`
        ).join('');
    }

    loadProductSpecs(specs) {
        const container = document.getElementById('specsContainer');
        if (!container) return;

        container.innerHTML = '';
        
        if (Object.keys(specs).length === 0) {
            this.addSpecRow();
        } else {
            Object.entries(specs).forEach(([key, value]) => {
                this.addSpecRow(key, value);
            });
        }
    }

    resetProductSpecs() {
        const container = document.getElementById('specsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        this.addSpecRow();
    }

    addSpecRow(key = '', value = '') {
        const container = document.getElementById('specsContainer');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'spec-row';
        row.innerHTML = `
            <input type="text" placeholder="Spec name (e.g., screen)" class="spec-key" value="${key}">
            <input type="text" placeholder="Spec value (e.g., 6.5 inch)" class="spec-value" value="${value}">
            <button type="button" onclick="adminApp.removeSpecRow(this)">Remove</button>
        `;
        container.appendChild(row);
    }

    removeSpecRow(button) {
        const row = button.parentElement;
        const container = document.getElementById('specsContainer');
        
        if (container && container.children.length > 1) {
            row.remove();
        }
    }

    saveProduct(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        
        // Collect specs
        const specs = {};
        const specRows = document.querySelectorAll('.spec-row');
        specRows.forEach(row => {
            const key = row.querySelector('.spec-key').value.trim();
            const value = row.querySelector('.spec-value').value.trim();
            if (key && value) {
                specs[key] = value;
            }
        });

        // Process photos
        const photosText = formData.get('photos').trim();
        const photos = photosText ? photosText.split('\n').map(url => url.trim()).filter(url => url) : [];

        // Process tags
        const tagsText = formData.get('tags').trim();
        const tags = tagsText ? tagsText.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        const productData = {
            id: formData.get('id'),
            name: formData.get('name'),
            description: formData.get('description'),
            company: formData.get('company'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            photos: photos,
            tags: tags,
            specs: specs
        };

        try {
            if (this.editingProduct) {
                database.updateProduct(this.editingProduct, productData);
                this.showToast('Product updated successfully');
            } else {
                // Check if ID already exists
                if (database.getProductById(productData.id)) {
                    this.showToast('Product ID already exists', 'error');
                    return;
                }
                database.addProduct(productData);
                this.showToast('Product added successfully');
            }
            
            this.closeProductModal();
            this.loadProducts();
            this.loadStats();
        } catch (error) {
            this.showToast('Error saving product: ' + error.message, 'error');
        }
    }

    editProduct(productId) {
        this.showProductModal(productId);
    }

    deleteProduct(productId) {
        const product = database.getProductById(productId);
        if (!product) return;

        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            database.deleteProduct(productId);
            this.showToast('Product deleted successfully');
            this.loadProducts();
            this.loadStats();
        }
    }

    // Data Management
    exportData() {
        const data = database.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `website-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Data exported successfully');
    }

    showImportModal() {
        const modal = document.getElementById('importModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeImportModal() {
        const modal = document.getElementById('importModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Clear form
        document.getElementById('importFile').value = '';
        document.getElementById('importText').value = '';
    }

    importData() {
        const importText = document.getElementById('importText').value.trim();
        
        if (!importText) {
            this.showToast('Please provide JSON data to import', 'error');
            return;
        }

        try {
            const data = JSON.parse(importText);
            
            if (!data.companies || !data.products) {
                this.showToast('Invalid data format. Expected companies and products arrays.', 'error');
                return;
            }

            if (confirm('This will replace all existing data. Are you sure?')) {
                database.importData(data);
                this.showToast('Data imported successfully');
                this.closeImportModal();
                this.loadStats();
                this.loadCompanies();
                this.loadProducts();
            }
        } catch (error) {
            this.showToast('Invalid JSON format: ' + error.message, 'error');
        }
    }

    resetData() {
        if (confirm('This will delete all data and reset to defaults. Are you sure?')) {
            if (confirm('This action cannot be undone. Continue?')) {
                database.resetToDefaults();
            }
        }
    }

    closeAllModals() {
        this.closeCompanyModal();
        this.closeProductModal();
        this.closeImportModal();
    }
}

// Initialize admin app
window.adminApp = new AdminApp();
