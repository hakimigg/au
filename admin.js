class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.currentEditingProduct = null;
        this.currentEditingCompany = null;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeAdmin());
        } else {
            this.initializeAdmin();
        }
    }

    initializeAdmin() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.handleRefresh());
        }


        // Modal close buttons
        document.querySelectorAll('.modal-close, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Form submissions
        const productForm = document.getElementById('productForm');
        const companyForm = document.getElementById('companyForm');
        
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
        }
        
        if (companyForm) {
            companyForm.addEventListener('submit', (e) => this.handleCompanySubmit(e));
        }

        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('admin_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        // Simple authentication (in production, use proper authentication)
        if (username === 'admin' && password === 'admin123') {
            this.currentUser = { username: username };
            localStorage.setItem('admin_user', JSON.stringify(this.currentUser));
            this.showDashboard();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showError('Invalid username or password');
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('admin_user');
        this.showLogin();
        this.showNotification('Logged out successfully', 'success');
    }

    showLogin() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('adminDashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        
        // Update username display
        const usernameDisplay = document.getElementById('adminUsername');
        if (usernameDisplay && this.currentUser) {
            usernameDisplay.textContent = this.currentUser.username;
        }

        // Setup dashboard-specific event listeners
        this.setupDashboardEventListeners();

        // Load initial data
        this.loadDashboardStats();
        this.loadProducts();
        this.loadCompanies();
        this.loadCompanyOptions();
        this.loadSettings();
    }

    setupDashboardEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Add buttons
        const addProductBtn = document.getElementById('addProductBtn');
        const addCompanyBtn = document.getElementById('addCompanyBtn');
        
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => this.showProductModal());
        }
        
        if (addCompanyBtn) {
            addCompanyBtn.addEventListener('click', () => this.showCompanyModal());
        }

        // Setup file upload functionality
        setTimeout(() => {
            this.setupFileUpload();
        }, 100);
    }

    showError(message) {
        const errorElement = document.getElementById('loginError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            setTimeout(() => {
                errorElement.classList.remove('show');
            }, 3000);
        }
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}Section`).classList.add('active');

        // Load section-specific data
        if (sectionName === 'dashboard') {
            this.loadDashboardStats();
        } else if (sectionName === 'products') {
            this.loadProducts();
        } else if (sectionName === 'companies') {
            this.loadCompanies();
        }
    }

    loadDashboardStats() {
        const stats = database.getStats();
        
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        document.getElementById('totalCompanies').textContent = stats.totalCompanies;
        document.getElementById('inStockProducts').textContent = stats.inStockProducts;
    }

    loadProducts() {
        const products = database.getProducts();
        const tbody = document.getElementById('productsTableBody');
        
        if (!tbody) return;

        tbody.innerHTML = products.map(product => {
            const company = database.getCompanyById(product.company);
            return `
                <tr>
                    <td>${product.name}</td>
                    <td>${company ? company.name : product.company}</td>
                    <td>${product.price.toFixed(2)} DA</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="adminPanel.editProduct('${product.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="adminPanel.deleteProduct('${product.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadCompanies() {
        const companies = database.getCompanies();
        const tbody = document.getElementById('companiesTableBody');
        
        if (!tbody) return;

        tbody.innerHTML = companies.map(company => {
            const productCount = database.getProductsByCompany(company.id).length;
            return `
                <tr>
                    <td>${company.name}</td>
                    <td>${company.description}</td>
                    <td>${productCount}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="adminPanel.editCompany('${company.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="adminPanel.deleteCompany('${company.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadCompanyOptions() {
        const companies = database.getCompanies();
        const select = document.getElementById('productCompany');
        
        if (!select) return;

        select.innerHTML = companies.map(company => 
            `<option value="${company.id}">${company.name}</option>`
        ).join('');
    }

    showProductModal(product = null) {
        this.currentEditingProduct = product;
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const form = document.getElementById('productForm');
        
        if (!modal || !title || !form) return;

        title.textContent = product ? 'Edit Product' : 'Add Product';
        
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCompany').value = product.company;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description;
            
            // Handle existing product photo
            if (product.photos && product.photos.length > 0) {
                this.showProductImagePreview(product.photos[0]);
            }
        } else {
            form.reset();
            this.clearProductImagePreview();
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    showCompanyModal(company = null) {
        this.currentEditingCompany = company;
        const modal = document.getElementById('companyModal');
        const title = document.getElementById('companyModalTitle');
        const form = document.getElementById('companyForm');
        
        if (!modal || !title || !form) return;

        title.textContent = company ? 'Edit Company' : 'Add Company';
        
        if (company) {
            document.getElementById('companyName').value = company.name;
            document.getElementById('companyDescription').value = company.description || '';
            
            // Handle existing company photo
            if (company.photo) {
                this.showCompanyImagePreview(company.photo);
            }
        } else {
            form.reset();
            this.clearCompanyImagePreview();
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
        this.currentEditingProduct = null;
        this.currentEditingCompany = null;
    }

    async handleProductSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const productData = {
            name: formData.get('name'),
            company: formData.get('company'),
            price: parseFloat(formData.get('price')),
            stock: 1,
            description: formData.get('description'),
            photos: this.currentProductImageUrl ? [this.currentProductImageUrl] : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'],
            tags: []
        };

        try {
            if (this.currentEditingProduct) {
                // Update existing product
                await database.updateProduct(this.currentEditingProduct.id, productData);
                this.showNotification('Product updated successfully!', 'success');
            } else {
                // Add new product
                await database.addProduct(productData);
                this.showNotification('Product added successfully!', 'success');
            }

            this.closeModals();
            this.loadProducts();
            this.loadDashboardStats();
        } catch (error) {
            this.showNotification(error.message || 'Failed to save product', 'error');
        }
    }

    async handleCompanySubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const companyData = {
            name: formData.get('name'),
            description: formData.get('description'),
            photo: this.currentCompanyImageUrl || null
        };

        try {
            if (this.currentEditingCompany) {
                // Update existing company
                await database.updateCompany(this.currentEditingCompany.id, companyData);
                this.showNotification('Company updated successfully!', 'success');
            } else {
                // Add new company
                await database.addCompany(companyData);
                this.showNotification('Company added successfully!', 'success');
            }

            this.closeModals();
            this.loadCompanies();
            this.loadCompanyOptions();
            this.loadDashboardStats();
        } catch (error) {
            this.showNotification(error.message || 'Failed to save company', 'error');
        }
    }

    editProduct(productId) {
        const product = database.getProductById(productId);
        if (product) {
            this.showProductModal(product);
        }
    }

    editCompany(companyId) {
        const company = database.getCompanyById(companyId);
        if (company) {
            this.showCompanyModal(company);
        }
    }

    async deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await database.deleteProduct(productId);
                this.loadProducts();
                this.loadDashboardStats();
                this.showNotification('Product deleted successfully!', 'success');
            } catch (error) {
                this.showNotification(error.message || 'Failed to delete product', 'error');
            }
        }
    }

    async deleteCompany(companyId) {
        if (confirm('Are you sure you want to delete this company?')) {
            try {
                await database.deleteCompany(companyId);
                this.loadCompanies();
                this.loadCompanyOptions();
                this.loadDashboardStats();
                this.showNotification('Company deleted successfully!', 'success');
            } catch (error) {
                this.showNotification(error.message || 'Failed to delete company', 'error');
            }
        }
    }

    async handleRefresh() {
        try {
            this.showNotification('🔄 Syncing with database...', 'info');
            
            // Force refresh from Supabase
            await window.refreshDatabase();
            
            this.showNotification('✅ Successfully synced with database!', 'success');
        } catch (error) {
            console.error('Refresh failed:', error);
            this.showNotification('❌ Failed to sync with database', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageElement = notification.querySelector('.notification-message');
        const iconElement = notification.querySelector('.notification-icon');
        
        if (!notification || !messageElement || !iconElement) return;

        messageElement.textContent = message;
        
        // Set icon based on type
        if (type === 'success') {
            iconElement.textContent = '✅';
            notification.classList.remove('error');
        } else if (type === 'error') {
            iconElement.textContent = '❌';
            notification.classList.add('error');
        } else if (type === 'info') {
            iconElement.textContent = '💬';
            notification.classList.remove('error');
        }

        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    setupFileUpload() {
        this.setupProductFileUpload();
        this.setupCompanyFileUpload();
    }

    setupProductFileUpload() {
        const chooseBtn = document.getElementById('choosePhotoBtn');
        const fileInput = document.getElementById('productPhoto');
        const changeBtn = document.getElementById('changePhotoBtn');
        const removeBtn = document.getElementById('removePhotoBtn');

        if (!chooseBtn || !fileInput) {
            console.log('Choose photo button or file input not found');
            return;
        }

        fileInput.style.display = 'none';

        chooseBtn.addEventListener('click', () => {
            fileInput.click();
        });

        if (changeBtn) {
            changeBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleProductFileUpload(file);
            }
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.clearProductImagePreview();
            });
        }
    }

    setupCompanyFileUpload() {
        const chooseBtn = document.getElementById('chooseCompanyPhotoBtn');
        const fileInput = document.getElementById('companyPhoto');
        const changeBtn = document.getElementById('changeCompanyPhotoBtn');
        const removeBtn = document.getElementById('removeCompanyPhotoBtn');

        if (!chooseBtn || !fileInput) {
            console.log('Choose company photo button or file input not found');
            return;
        }

        fileInput.style.display = 'none';

        chooseBtn.addEventListener('click', () => {
            fileInput.click();
        });

        if (changeBtn) {
            changeBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleCompanyFileUpload(file);
            }
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.clearCompanyImagePreview();
            });
        }
    }

    handleProductFileUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('File size must be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.showProductImagePreview(e.target.result);
            this.currentProductImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    handleCompanyFileUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('File size must be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.showCompanyImagePreview(e.target.result);
            this.currentCompanyImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    showProductImagePreview(imageUrl) {
        const chooseBtn = document.getElementById('choosePhotoBtn');
        const photoPreview = document.getElementById('photoPreview');
        const previewImage = document.getElementById('previewImage');

        if (chooseBtn && photoPreview && previewImage) {
            chooseBtn.style.display = 'none';
            photoPreview.style.display = 'flex';
            previewImage.src = imageUrl;
            this.currentProductImageUrl = imageUrl;
        }
    }

    showCompanyImagePreview(imageUrl) {
        const chooseBtn = document.getElementById('chooseCompanyPhotoBtn');
        const photoPreview = document.getElementById('companyPhotoPreview');
        const previewImage = document.getElementById('companyPreviewImage');

        if (chooseBtn && photoPreview && previewImage) {
            chooseBtn.style.display = 'none';
            photoPreview.style.display = 'flex';
            previewImage.src = imageUrl;
            this.currentCompanyImageUrl = imageUrl;
        }
    }

    clearProductImagePreview() {
        const chooseBtn = document.getElementById('choosePhotoBtn');
        const photoPreview = document.getElementById('photoPreview');
        const previewImage = document.getElementById('previewImage');
        const fileInput = document.getElementById('productPhoto');

        if (chooseBtn && photoPreview && previewImage) {
            chooseBtn.style.display = 'block';
            photoPreview.style.display = 'none';
            previewImage.src = '';
            this.currentProductImageUrl = null;
            
            if (fileInput) {
                fileInput.value = '';
            }
        }
    }

    clearCompanyImagePreview() {
        const chooseBtn = document.getElementById('chooseCompanyPhotoBtn');
        const photoPreview = document.getElementById('companyPhotoPreview');
        const previewImage = document.getElementById('companyPreviewImage');
        const fileInput = document.getElementById('companyPhoto');

        if (chooseBtn && photoPreview && previewImage) {
            chooseBtn.style.display = 'block';
            photoPreview.style.display = 'none';
            previewImage.src = '';
            this.currentCompanyImageUrl = null;
            
            if (fileInput) {
                fileInput.value = '';
            }
        }
    }

    // Settings Methods
    changeUsername() {
        const newUsername = document.getElementById('newUsername').value.trim();
        
        if (!newUsername) {
            this.showNotification('Please enter a new username', 'error');
            return;
        }
        
        if (newUsername.length < 3) {
            this.showNotification('Username must be at least 3 characters long', 'error');
            return;
        }
        
        if (newUsername === this.currentUser.username) {
            this.showNotification('New username must be different from current username', 'error');
            return;
        }
        
        // Update username
        this.currentUser.username = newUsername;
        localStorage.setItem('admin_user', JSON.stringify(this.currentUser));
        
        // Update display
        document.getElementById('currentUsername').value = newUsername;
        document.getElementById('newUsername').value = '';
        
        this.showNotification('Username changed successfully!', 'success');
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }
        
        if (currentPassword !== 'admin123') {
            this.showNotification('Current password is incorrect', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            this.showNotification('New password must be at least 6 characters long', 'error');
            return;
        }
        
        // Save new password (in a real app, this would be hashed and sent to server)
        localStorage.setItem('adminPassword', newPassword);
        
        // Clear form
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        this.showNotification('Password changed successfully!', 'success');
    }

    loadSettings() {
        // Load current username
        if (this.currentUser && document.getElementById('currentUsername')) {
            document.getElementById('currentUsername').value = this.currentUser.username;
        }
    }
}

// Initialize admin panel
window.adminPanel = new AdminPanel();
