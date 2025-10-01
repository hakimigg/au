const SUPABASE_URL = 'https://hesycproljmuaimqcptn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlc3ljcHJvbGptdWFpbXFjcHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwOTcwODEsImV4cCI6MjA3NDY3MzA4MX0.bmnCs2BELUZBSWn3A8Me3PE84zytAtf388uhmg6CyoA';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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
            const shouldClearCache = localStorage.getItem('force_refresh') === 'true';
            if (shouldClearCache) {
                this.clearOldLocalStorage();
                localStorage.removeItem('force_refresh');
            }
            await this.loadCompaniesFromSupabase();
            await this.loadProductsFromSupabase();
            
            console.log('✅ Successfully loaded data from Supabase');
        } catch (error) {
            console.warn('❌ Failed to load from Supabase, using local data:', error);
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

    async loadCompaniesFromSupabase() {
        try {
            console.log('🏢 Loading companies from Supabase...');
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Supabase companies error:', error);
                throw error;
            }
            
            this.companies = data || [];
            console.log(`✅ Loaded ${this.companies.length} companies from Supabase`);
            this.saveCompaniesToLocalStorage();
        } catch (error) {
            console.error('Error loading companies:', error);
        }
    }

    async addCompany(companyData) {
        try {
            if (!companyData.name) {
                throw new Error('Company name is required');
            }

            const sanitizedData = {
                id: this.generateSecureId(),
                name: this.sanitizeInput(companyData.name),
                description: companyData.description ? this.sanitizeInput(companyData.description) : null,
                logo: companyData.photo || null,
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
            if (!companyData.name) {
                throw new Error('Company name is required');
            }

            const sanitizedData = {
                name: this.sanitizeInput(companyData.name),
                description: companyData.description ? this.sanitizeInput(companyData.description) : null,
                logo: companyData.photo || null,
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
            console.log(`🗑️ Attempting to delete company with ID: ${id}`);
            
            const productsInCompany = this.products.filter(p => p.company === id);
            if (productsInCompany.length > 0) {
                throw new Error(`Cannot delete company with existing products (${productsInCompany.length} products found)`);
            }

            if (this.isOnline) {
                console.log('📡 Deleting from Supabase...');
                const { error, data } = await supabase
                    .from('companies')
                    .delete()
                    .eq('id', id)
                    .select();

                if (error) {
                    console.error('Supabase delete error:', error);
                    throw error;
                }
                
                console.log('✅ Successfully deleted from Supabase:', data);
            } else {
                console.log('📱 Offline - marking for sync');
                this.markForSync('companies', 'delete', { id });
            }

            const beforeCount = this.companies.length;
            this.companies = this.companies.filter(c => c.id !== id);
            const afterCount = this.companies.length;
            
            console.log(`📊 Local companies count: ${beforeCount} → ${afterCount}`);
            
            this.saveCompaniesToLocalStorage();
            return true;
        } catch (error) {
            console.error('❌ Error deleting company:', error);
            throw error;
        }
    }

    async loadProductsFromSupabase() {
        try {
            console.log('📦 Loading products from Supabase...');
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Supabase products error:', error);
                throw error;
            }
            
            this.products = data || [];
            console.log(`✅ Loaded ${this.products.length} products from Supabase`);
            this.saveProductsToLocalStorage();
        } catch (error) {
            console.error('Error loading products:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            if (!productData.name || !productData.company || !productData.price || !productData.stock) {
                throw new Error('Product name, company, price, and stock are required');
            }

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
            if (!productData.name || !productData.company || !productData.price || !productData.stock) {
                throw new Error('Product name, company, price, and stock are required');
            }

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
            console.log(`🗑️ Attempting to delete product with ID: ${id}`);
            
            if (this.isOnline) {
                console.log('📡 Deleting from Supabase...');
                const { error, data } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id)
                    .select();

                if (error) {
                    console.error('Supabase delete error:', error);
                    throw error;
                }
                
                console.log('✅ Successfully deleted from Supabase:', data);
            } else {
                console.log('📱 Offline - marking for sync');
                this.markForSync('products', 'delete', { id });
            }

            const beforeCount = this.products.length;
            this.products = this.products.filter(p => p.id !== id);
            const afterCount = this.products.length;
            
            console.log(`📊 Local products count: ${beforeCount} → ${afterCount}`);
            
            this.saveProductsToLocalStorage();
            return true;
        } catch (error) {
            console.error('❌ Error deleting product:', error);
            throw error;
        }
    }

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

            localStorage.removeItem('sync_queue');
            
            if (syncQueue.length > 0) {
                console.log(`🔄 Synced ${syncQueue.length} operations, reloading data...`);
                await this.loadCompaniesFromSupabase();
                await this.loadProductsFromSupabase();
            }
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }

    clearOldLocalStorage() {
        localStorage.removeItem('website_companies');
        localStorage.removeItem('website_products');
        localStorage.removeItem('sync_queue');
        console.log('🗑️ Cleared old localStorage data');
    }

    loadFromLocalStorage() {
        console.log('📱 Loading from localStorage as fallback');
        const savedCompanies = localStorage.getItem('website_companies');
        const savedProducts = localStorage.getItem('website_products');

        if (savedCompanies) {
            try {
                this.companies = JSON.parse(savedCompanies);
            } catch (e) {
                console.warn('Failed to load companies from storage:', e);
                this.companies = [];
            }
        } else {
            this.companies = [];
        }

        if (savedProducts) {
            try {
                this.products = JSON.parse(savedProducts);
            } catch (e) {
                console.warn('Failed to load products from storage:', e);
                this.products = [];
            }
        } else {
            this.products = [];
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

    async forceRefresh() {
        console.log('🔄 Force refreshing data from Supabase...');
        localStorage.setItem('force_refresh', 'true');
        await this.init();
        
        if (window.adminPanel) {
            window.adminPanel.loadDashboardStats();
            window.adminPanel.loadProducts();
            window.adminPanel.loadCompanies();
            window.adminPanel.loadCompanyOptions();
        }
        
        if (window.app) {
            window.app.loadCompanies();
            window.app.loadProducts();
        }
    }

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

window.database = new SupabaseDatabase();

window.refreshDatabase = () => {
    return window.database.forceRefresh();
};
