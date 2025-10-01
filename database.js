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
                photos: [],
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
                photos: [],
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
                photos: [],
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
                photos: [],
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
                photos: [],
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
                photos: [],
                tags: ['laptop', 'professional', 'apple'],
                specs: {
                    screen: '14 inch Liquid Retina XDR',
                    processor: 'M3 Pro chip',
                    ram: '16GB',
                    storage: '512GB SSD'
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
