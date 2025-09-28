// Supabase Configuration
const SUPABASE_URL = 'https://hesycproljmuaimqcptn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlc3ljcHJvbGptdWFpbXFjcHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwOTcwODEsImV4cCI6MjA3NDY3MzA4MX0.bmnCs2BELUZBSWn3A8Me3PE84zytAtf388uhmg6CyoA';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database class with Supabase integration
class SupabaseDatabase {
    constructor() {
        this.companies = [];
        this.products = [];
        this.isOnline = navigator.onLine;
        this.setupOfflineSupport();
        this.init();
    }

    async init() {
        try {
            // Load data from Supabase
            await this.loadCompaniesFromSupabase();
            await this.loadProductsFromSupabase();
        } catch (error) {
            console.warn('Failed to load from Supabase, using local data:', error);
            this.loadFromLocalStorage();
        }
    }

    setupOfflineSupport() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncWithSupabase();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Companies methods
    async loadCompaniesFromSupabase() {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            
            this.companies = data || [];
            this.saveCompaniesToLocalStorage();
        } catch (error) {
            console.error('Error loading companies:', error);
            throw error;
        }
    }

    async addCompany(companyData) {
        try {
            // Validate input
            if (!companyData.name || !companyData.description) {
                throw new Error('Company name and description are required');
            }

            // Sanitize input
            const sanitizedData = {
                id: this.generateSecureId(),
                name: this.sanitizeInput(companyData.name),
                description: this.sanitizeInput(companyData.description),
                logo: companyData.logo || null,
                created_at: new Date().toISOString()
            };

            if (this.isOnline) {
                const { data, error } = await supabase
                    .from('companies')
                    .insert([sanitizedData])
                    .select();

                if (error) throw error;
                
                this.companies.push(data[0]);
            } else {
                // Store locally for sync later
                this.companies.push(sanitizedData);
                this.markForSync('companies', 'insert', sanitizedData);
            }

            this.saveCompaniesToLocalStorage();
            return sanitizedData;
        } catch (error) {
            console.error('Error adding company:', error);
            throw error;
        }
    }

    async updateCompany(id, companyData) {
        try {
            // Validate input
            if (!companyData.name || !companyData.description) {
                throw new Error('Company name and description are required');
            }

            // Sanitize input
            const sanitizedData = {
                name: this.sanitizeInput(companyData.name),
                description: this.sanitizeInput(companyData.description),
                logo: companyData.logo || null,
                updated_at: new Date().toISOString()
            };

            if (this.isOnline) {
                const { data, error } = await supabase
                    .from('companies')
                    .update(sanitizedData)
                    .eq('id', id)
                    .select();

                if (error) throw error;
            } else {
                this.markForSync('companies', 'update', { id, ...sanitizedData });
            }

            // Update local data
            const index = this.companies.findIndex(c => c.id === id);
            if (index !== -1) {
                this.companies[index] = { ...this.companies[index], ...sanitizedData };
            }

            this.saveCompaniesToLocalStorage();
            return this.companies[index];
        } catch (error) {
            console.error('Error updating company:', error);
            throw error;
        }
    }

    async deleteCompany(id) {
        try {
            // Check if company has products
            const productsInCompany = this.products.filter(p => p.company === id);
            if (productsInCompany.length > 0) {
                throw new Error('Cannot delete company with existing products');
            }

            if (this.isOnline) {
                const { error } = await supabase
                    .from('companies')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            } else {
                this.markForSync('companies', 'delete', { id });
            }

            // Remove from local data
            this.companies = this.companies.filter(c => c.id !== id);
            this.saveCompaniesToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error deleting company:', error);
            throw error;
        }
    }

    // Products methods
    async loadProductsFromSupabase() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            
            this.products = data || [];
            this.saveProductsToLocalStorage();
        } catch (error) {
            console.error('Error loading products:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            // Validate input
            if (!productData.name || !productData.company || !productData.price || !productData.stock) {
                throw new Error('Product name, company, price, and stock are required');
            }

            // Sanitize input
            const sanitizedData = {
                id: this.generateSecureId(),
                name: this.sanitizeInput(productData.name),
                company: this.sanitizeInput(productData.company),
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock),
                description: this.sanitizeInput(productData.description || ''),
                photos: Array.isArray(productData.photos) ? productData.photos : [productData.photos || ''].filter(Boolean),
                tags: Array.isArray(productData.tags) ? productData.tags : [],
                specs: productData.specs || {},
                created_at: new Date().toISOString()
            };

            // Validate price and stock
            if (sanitizedData.price < 0 || sanitizedData.stock < 0) {
                throw new Error('Price and stock must be non-negative');
            }

            if (this.isOnline) {
                const { data, error } = await supabase
                    .from('products')
                    .insert([sanitizedData])
                    .select();

                if (error) throw error;
                
                this.products.push(data[0]);
            } else {
                this.products.push(sanitizedData);
                this.markForSync('products', 'insert', sanitizedData);
            }

            this.saveProductsToLocalStorage();
            return sanitizedData;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            // Validate input
            if (!productData.name || !productData.company || !productData.price || !productData.stock) {
                throw new Error('Product name, company, price, and stock are required');
            }

            // Sanitize input
            const sanitizedData = {
                name: this.sanitizeInput(productData.name),
                company: this.sanitizeInput(productData.company),
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock),
                description: this.sanitizeInput(productData.description || ''),
                photos: Array.isArray(productData.photos) ? productData.photos : [productData.photos || ''].filter(Boolean),
                tags: Array.isArray(productData.tags) ? productData.tags : [],
                specs: productData.specs || {},
                updated_at: new Date().toISOString()
            };

            // Validate price and stock
            if (sanitizedData.price < 0 || sanitizedData.stock < 0) {
                throw new Error('Price and stock must be non-negative');
            }

            if (this.isOnline) {
                const { data, error } = await supabase
                    .from('products')
                    .update(sanitizedData)
                    .eq('id', id)
                    .select();

                if (error) throw error;
            } else {
                this.markForSync('products', 'update', { id, ...sanitizedData });
            }

            // Update local data
            const index = this.products.findIndex(p => p.id === id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...sanitizedData };
            }

            this.saveProductsToLocalStorage();
            return this.products[index];
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            if (this.isOnline) {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            } else {
                this.markForSync('products', 'delete', { id });
            }

            // Remove from local data
            this.products = this.products.filter(p => p.id !== id);
            this.saveProductsToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    // Utility methods
    generateSecureId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    markForSync(table, operation, data) {
        const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
        syncQueue.push({ table, operation, data, timestamp: Date.now() });
        localStorage.setItem('sync_queue', JSON.stringify(syncQueue));
    }

    async syncWithSupabase() {
        try {
            const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
            
            for (const item of syncQueue) {
                try {
                    if (item.table === 'companies') {
                        if (item.operation === 'insert') {
                            await supabase.from('companies').insert([item.data]);
                        } else if (item.operation === 'update') {
                            await supabase.from('companies').update(item.data).eq('id', item.data.id);
                        } else if (item.operation === 'delete') {
                            await supabase.from('companies').delete().eq('id', item.data.id);
                        }
                    } else if (item.table === 'products') {
                        if (item.operation === 'insert') {
                            await supabase.from('products').insert([item.data]);
                        } else if (item.operation === 'update') {
                            await supabase.from('products').update(item.data).eq('id', item.data.id);
                        } else if (item.operation === 'delete') {
                            await supabase.from('products').delete().eq('id', item.data.id);
                        }
                    }
                } catch (error) {
                    console.error('Sync error for item:', item, error);
                }
            }

            // Clear sync queue
            localStorage.removeItem('sync_queue');
            
            // Reload data from Supabase
            await this.loadCompaniesFromSupabase();
            await this.loadProductsFromSupabase();
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }

    // Local storage fallback
    loadFromLocalStorage() {
        const savedCompanies = localStorage.getItem('website_companies');
        const savedProducts = localStorage.getItem('website_products');

        if (savedCompanies) {
            try {
                this.companies = JSON.parse(savedCompanies);
            } catch (e) {
                console.warn('Failed to load companies from storage:', e);
                this.companies = this.getDefaultCompanies();
            }
        } else {
            this.companies = this.getDefaultCompanies();
        }

        if (savedProducts) {
            try {
                this.products = JSON.parse(savedProducts);
            } catch (e) {
                console.warn('Failed to load products from storage:', e);
                this.products = this.getDefaultProducts();
            }
        } else {
            this.products = this.getDefaultProducts();
        }
    }

    saveCompaniesToLocalStorage() {
        try {
            localStorage.setItem('website_companies', JSON.stringify(this.companies));
        } catch (e) {
            console.warn('Failed to save companies to storage:', e);
        }
    }

    saveProductsToLocalStorage() {
        try {
            localStorage.setItem('website_products', JSON.stringify(this.products));
        } catch (e) {
            console.warn('Failed to save products to storage:', e);
        }
    }

    getDefaultCompanies() {
        return [
            { id: 'nokia', name: 'Nokia', description: 'Leading telecommunications and technology company', logo: null },
            { id: 'samsung', name: 'Samsung', description: 'Global technology conglomerate', logo: null },
            { id: 'apple', name: 'Apple', description: 'Premium consumer electronics and software', logo: null },
            { id: 'premium', name: 'Premium', description: 'Luxury and premium products', logo: null }
        ];
    }

    getDefaultProducts() {
        return [
            {
                id: 'p1',
                name: 'Nokia Smartphone Pro',
                description: 'Advanced smartphone with cutting-edge technology',
                company: 'nokia',
                price: 299.99,
                stock: 45,
                photos: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'],
                tags: ['smartphone', 'electronics', 'mobile'],
                specs: { screen: '6.5 inch OLED', storage: '128GB', ram: '8GB', camera: '48MP Triple Camera' }
            }
        ];
    }

    // Public API methods (same as before)
    getCompanies() {
        return [...this.companies];
    }

    getCompanyById(id) {
        return this.companies.find(company => company.id === id);
    }

    getProducts() {
        return [...this.products];
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getProductsByCompany(companyId) {
        return this.products.filter(product => product.company === companyId);
    }

    getAvailableProducts() {
        return this.products.filter(product => product.stock > 0);
    }

    getStats() {
        const totalProducts = this.products.length;
        const totalCompanies = this.companies.length;
        const inStockProducts = this.products.filter(p => p.stock > 0).length;
        const outOfStockProducts = totalProducts - inStockProducts;
        const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.stock), 0);

        return {
            totalProducts,
            totalCompanies,
            inStockProducts,
            outOfStockProducts,
            totalValue: totalValue.toFixed(2)
        };
    }
}

// Replace the old database instance
window.database = new SupabaseDatabase();
