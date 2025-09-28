// Simple JSON-based database for the website
class Database {
    constructor() {
        this.companies = [
            {
                id: 'nokia',
                name: 'Nokia',
                description: 'Leading telecommunications and technology company',
                logo: null
            },
            {
                id: 'samsung',
                name: 'Samsung',
                description: 'Global technology conglomerate',
                logo: null
            },
            {
                id: 'apple',
                name: 'Apple',
                description: 'Premium consumer electronics and software',
                logo: null
            },
            {
                id: 'premium',
                name: 'Premium',
                description: 'Luxury and premium products',
                logo: null
            }
        ];

        this.products = [
            {
                id: 'p1',
                name: 'Nokia Smartphone Pro',
                description: 'Advanced smartphone with cutting-edge technology, featuring a powerful processor, exceptional camera system, and long-lasting battery life.',
                company: 'nokia',
                price: 299.99,
                stock: 45,
                photos: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'],
                tags: ['smartphone', 'electronics', 'mobile'],
                specs: {
                    screen: '6.5 inch OLED',
                    storage: '128GB',
                    ram: '8GB',
                    camera: '48MP Triple Camera'
                }
            },
            {
                id: 'p2',
                name: 'Samsung Galaxy Ultra',
                description: 'Premium flagship smartphone with professional-grade camera and display technology for the ultimate mobile experience.',
                company: 'samsung',
                price: 899.99,
                stock: 32,
                photos: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop'],
                tags: ['smartphone', 'flagship', 'premium'],
                specs: {
                    screen: '6.8 inch Dynamic AMOLED',
                    storage: '256GB',
                    ram: '12GB',
                    camera: '108MP Quad Camera'
                }
            },
            {
                id: 'p3',
                name: 'Apple iPhone Pro',
                description: 'The most advanced iPhone ever, featuring the powerful A17 Pro chip, titanium design, and revolutionary camera system.',
                company: 'apple',
                price: 1199.99,
                stock: 28,
                photos: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop'],
                tags: ['iphone', 'premium', 'apple'],
                specs: {
                    screen: '6.7 inch Super Retina XDR',
                    storage: '256GB',
                    ram: '8GB',
                    camera: '48MP Pro Camera System'
                }
            },
            {
                id: 'p4',
                name: 'Nokia Tablet Elite',
                description: 'Professional tablet designed for productivity and creativity, with a stunning display and powerful performance.',
                company: 'nokia',
                price: 449.99,
                stock: 18,
                photos: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop'],
                tags: ['tablet', 'productivity', 'electronics'],
                specs: {
                    screen: '11 inch LCD',
                    storage: '128GB',
                    ram: '6GB',
                    battery: '8000mAh'
                }
            },
            {
                id: 'p5',
                name: 'Samsung Smart TV 4K',
                description: 'Ultra-high definition smart TV with vibrant colors, smart features, and immersive sound for the ultimate viewing experience.',
                company: 'samsung',
                price: 799.99,
                stock: 15,
                photos: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop'],
                tags: ['tv', 'smart', '4k'],
                specs: {
                    screen: '55 inch 4K UHD',
                    resolution: '3840x2160',
                    features: 'Smart TV, HDR',
                    connectivity: 'WiFi, Bluetooth'
                }
            },
            {
                id: 'p6',
                name: 'Apple MacBook Pro',
                description: 'Supercharged by the M3 Pro chip, this MacBook Pro delivers exceptional performance for professionals and creators.',
                company: 'apple',
                price: 1999.99,
                stock: 12,
                photos: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop'],
                tags: ['laptop', 'professional', 'apple'],
                specs: {
                    screen: '14 inch Liquid Retina XDR',
                    processor: 'M3 Pro chip',
                    ram: '16GB',
                    storage: '512GB SSD'
                }
            },
            {
                id: 'p7',
                name: 'Premium Wireless Headphones',
                description: 'Audiophile-grade wireless headphones with active noise cancellation and premium materials for the ultimate listening experience.',
                company: 'premium',
                price: 349.99,
                stock: 67,
                photos: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'],
                tags: ['headphones', 'audio', 'wireless'],
                specs: {
                    type: 'Over-ear',
                    connectivity: 'Bluetooth 5.0',
                    battery: '30 hours',
                    features: 'Active Noise Cancellation'
                }
            },
            {
                id: 'p8',
                name: 'Samsung Gaming Monitor',
                description: 'High-performance curved gaming monitor with ultra-fast refresh rate and stunning visuals for competitive gaming.',
                company: 'samsung',
                price: 599.99,
                stock: 23,
                photos: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop'],
                tags: ['monitor', 'gaming', 'display'],
                specs: {
                    screen: '27 inch Curved',
                    resolution: '2560x1440',
                    refresh: '144Hz',
                    panel: 'VA Panel'
                }
            },
            {
                id: 'p9',
                name: 'Apple AirPods Pro',
                description: 'Advanced wireless earbuds with spatial audio, adaptive transparency, and personalized listening experience.',
                company: 'apple',
                price: 249.99,
                stock: 89,
                photos: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop'],
                tags: ['earbuds', 'wireless', 'apple'],
                specs: {
                    type: 'In-ear',
                    connectivity: 'Bluetooth',
                    battery: '6 hours + case',
                    features: 'Spatial Audio, ANC'
                }
            },
            {
                id: 'p10',
                name: 'Premium Smart Watch',
                description: 'Luxury smartwatch with health monitoring, fitness tracking, and premium materials for the discerning user.',
                company: 'premium',
                price: 599.99,
                stock: 34,
                photos: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'],
                tags: ['smartwatch', 'fitness', 'luxury'],
                specs: {
                    display: '1.4 inch AMOLED',
                    battery: '7 days',
                    features: 'Health monitoring, GPS',
                    material: 'Titanium'
                }
            },
            {
                id: 'p11',
                name: 'Nokia Wireless Speaker',
                description: 'Portable wireless speaker with rich sound, waterproof design, and long battery life for any adventure.',
                company: 'nokia',
                price: 129.99,
                stock: 56,
                photos: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop'],
                tags: ['speaker', 'wireless', 'portable'],
                specs: {
                    connectivity: 'Bluetooth 5.0',
                    battery: '12 hours',
                    features: 'Waterproof IPX7',
                    power: '20W'
                }
            },
            {
                id: 'p12',
                name: 'Samsung Tablet Pro',
                description: 'Professional tablet with S Pen support, powerful performance, and versatile design for work and creativity.',
                company: 'samsung',
                price: 749.99,
                stock: 21,
                photos: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop'],
                tags: ['tablet', 'professional', 's-pen'],
                specs: {
                    screen: '12.4 inch Super AMOLED',
                    storage: '256GB',
                    ram: '8GB',
                    features: 'S Pen included'
                }
            }
        ];

        // Initialize from localStorage if available
        this.loadFromStorage();
    }

    // Load data from localStorage
    loadFromStorage() {
        const savedCompanies = localStorage.getItem('website_companies');
        const savedProducts = localStorage.getItem('website_products');

        if (savedCompanies) {
            try {
                this.companies = JSON.parse(savedCompanies);
            } catch (e) {
                console.warn('Failed to load companies from storage:', e);
            }
        }

        if (savedProducts) {
            try {
                this.products = JSON.parse(savedProducts);
            } catch (e) {
                console.warn('Failed to load products from storage:', e);
            }
        }
    }

    // Save data to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('website_companies', JSON.stringify(this.companies));
            localStorage.setItem('website_products', JSON.stringify(this.products));
        } catch (e) {
            console.warn('Failed to save to storage:', e);
        }
    }

    // Company methods
    getCompanies() {
        return [...this.companies];
    }

    getCompanyById(id) {
        return this.companies.find(company => company.id === id);
    }

    addCompany(company) {
        const newCompany = {
            id: company.id || this.generateId(),
            name: company.name,
            description: company.description || '',
            logo: company.logo || null
        };
        this.companies.push(newCompany);
        this.saveToStorage();
        return newCompany;
    }

    updateCompany(id, updates) {
        const index = this.companies.findIndex(company => company.id === id);
        if (index !== -1) {
            this.companies[index] = { ...this.companies[index], ...updates };
            this.saveToStorage();
            return this.companies[index];
        }
        return null;
    }

    deleteCompany(id) {
        const index = this.companies.findIndex(company => company.id === id);
        if (index !== -1) {
            // Also delete all products from this company
            this.products = this.products.filter(product => product.company !== id);
            this.companies.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Product methods
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

    addProduct(product) {
        const newProduct = {
            id: product.id || this.generateId(),
            name: product.name,
            description: product.description || '',
            company: product.company,
            price: parseFloat(product.price) || 0,
            stock: parseInt(product.stock) || 0,
            photos: product.photos || [],
            tags: product.tags || [],
            specs: product.specs || {}
        };
        this.products.push(newProduct);
        this.saveToStorage();
        return newProduct;
    }

    updateProduct(id, updates) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            // Ensure numeric fields are properly typed
            if (updates.price !== undefined) {
                updates.price = parseFloat(updates.price) || 0;
            }
            if (updates.stock !== undefined) {
                updates.stock = parseInt(updates.stock) || 0;
            }
            
            this.products[index] = { ...this.products[index], ...updates };
            this.saveToStorage();
            return this.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Search and filter methods
    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery) ||
            product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    filterProducts(filters) {
        let filtered = [...this.products];

        if (filters.company && filters.company !== 'all') {
            filtered = filtered.filter(product => product.company === filters.company);
        }

        if (filters.minPrice !== undefined) {
            filtered = filtered.filter(product => product.price >= filters.minPrice);
        }

        if (filters.maxPrice !== undefined) {
            filtered = filtered.filter(product => product.price <= filters.maxPrice);
        }

        if (filters.inStock) {
            filtered = filtered.filter(product => product.stock > 0);
        }

        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(product => 
                filters.tags.some(tag => product.tags.includes(tag))
            );
        }

        return filtered;
    }

    // Utility methods
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Reset to default data
    resetToDefaults() {
        localStorage.removeItem('website_companies');
        localStorage.removeItem('website_products');
        location.reload(); // Reload to reinitialize with default data
    }

    // Export data
    exportData() {
        return {
            companies: this.companies,
            products: this.products,
            exportDate: new Date().toISOString()
        };
    }

    // Import data
    importData(data) {
        if (data.companies && Array.isArray(data.companies)) {
            this.companies = data.companies;
        }
        if (data.products && Array.isArray(data.products)) {
            this.products = data.products;
        }
        this.saveToStorage();
    }

    // Get statistics
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

// Create global database instance
window.database = new Database();
