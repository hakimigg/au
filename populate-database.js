// Database Population Script
// Run this script to add sample companies and products to your database

async function populateDatabase() {
    console.log('🚀 Starting database population...');
    
    try {
        // Wait for database to be ready
        if (!window.database) {
            console.log('⏳ Waiting for database to initialize...');
            await new Promise(resolve => {
                const checkDatabase = () => {
                    if (window.database) {
                        resolve();
                    } else {
                        setTimeout(checkDatabase, 100);
                    }
                };
                checkDatabase();
            });
        }

        // Sample companies data
        const companies = [
            {
                name: "TechCorp",
                description: "Leading technology solutions provider specializing in innovative software and hardware products."
            },
            {
                name: "StyleHub",
                description: "Premium fashion and lifestyle brand offering contemporary clothing and accessories."
            },
            {
                name: "HomeComfort",
                description: "Quality home and living products designed to enhance your everyday comfort and style."
            },
            {
                name: "SportMax",
                description: "Professional sports equipment and athletic wear for all fitness levels and activities."
            },
            {
                name: "GreenLife",
                description: "Eco-friendly products and sustainable solutions for environmentally conscious consumers."
            }
        ];

        // Add companies first
        console.log('📦 Adding companies...');
        const addedCompanies = [];
        for (const companyData of companies) {
            try {
                const company = await window.database.addCompany(companyData);
                addedCompanies.push(company);
                console.log(`✅ Added company: ${company.name}`);
            } catch (error) {
                console.error(`❌ Failed to add company ${companyData.name}:`, error);
            }
        }

        // Sample products data
        const products = [
            // TechCorp products
            {
                name: "Wireless Bluetooth Headphones",
                company: addedCompanies[0]?.id,
                price: 89.99,
                stock: 25,
                description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
                photos: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"]
            },
            {
                name: "Smart Fitness Watch",
                company: addedCompanies[0]?.id,
                price: 199.99,
                stock: 15,
                description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration.",
                photos: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"]
            },
            {
                name: "Portable Power Bank",
                company: addedCompanies[0]?.id,
                price: 34.99,
                stock: 50,
                description: "High-capacity 20,000mAh power bank with fast charging and multiple USB ports.",
                photos: ["https://images.unsplash.com/photo-1609592806596-b43dafe50b4d?w=400&h=300&fit=crop"]
            },

            // StyleHub products
            {
                name: "Classic Leather Jacket",
                company: addedCompanies[1]?.id,
                price: 249.99,
                stock: 12,
                description: "Genuine leather jacket with modern cut and premium finishing details.",
                photos: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop"]
            },
            {
                name: "Designer Sunglasses",
                company: addedCompanies[1]?.id,
                price: 129.99,
                stock: 30,
                description: "Stylish sunglasses with UV protection and polarized lenses.",
                photos: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop"]
            },
            {
                name: "Premium Canvas Backpack",
                company: addedCompanies[1]?.id,
                price: 79.99,
                stock: 20,
                description: "Durable canvas backpack with laptop compartment and multiple pockets.",
                photos: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop"]
            },

            // HomeComfort products
            {
                name: "Ceramic Coffee Mug Set",
                company: addedCompanies[2]?.id,
                price: 39.99,
                stock: 40,
                description: "Set of 4 handcrafted ceramic mugs perfect for your morning coffee routine.",
                photos: ["https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=300&fit=crop"]
            },
            {
                name: "Scented Candle Collection",
                company: addedCompanies[2]?.id,
                price: 24.99,
                stock: 35,
                description: "Set of 3 premium scented candles with relaxing lavender, vanilla, and eucalyptus fragrances.",
                photos: ["https://images.unsplash.com/photo-1602874801006-e26c1c1e3f3d?w=400&h=300&fit=crop"]
            },
            {
                name: "Soft Throw Blanket",
                company: addedCompanies[2]?.id,
                price: 49.99,
                stock: 18,
                description: "Ultra-soft fleece throw blanket perfect for cozy evenings and home decoration.",
                photos: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"]
            },

            // SportMax products
            {
                name: "Yoga Mat Premium",
                company: addedCompanies[3]?.id,
                price: 59.99,
                stock: 22,
                description: "Non-slip premium yoga mat with extra cushioning and carrying strap.",
                photos: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"]
            },
            {
                name: "Resistance Bands Set",
                company: addedCompanies[3]?.id,
                price: 29.99,
                stock: 45,
                description: "Complete set of resistance bands with different resistance levels and accessories.",
                photos: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop"]
            },
            {
                name: "Water Bottle Insulated",
                company: addedCompanies[3]?.id,
                price: 24.99,
                stock: 60,
                description: "Stainless steel insulated water bottle that keeps drinks cold for 24 hours.",
                photos: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop"]
            },

            // GreenLife products
            {
                name: "Bamboo Utensil Set",
                company: addedCompanies[4]?.id,
                price: 19.99,
                stock: 55,
                description: "Eco-friendly bamboo utensil set with carrying case, perfect for sustainable dining.",
                photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"]
            },
            {
                name: "Reusable Shopping Bags",
                company: addedCompanies[4]?.id,
                price: 14.99,
                stock: 75,
                description: "Set of 3 durable reusable shopping bags made from recycled materials.",
                photos: ["https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=400&h=300&fit=crop"]
            },
            {
                name: "Solar Phone Charger",
                company: addedCompanies[4]?.id,
                price: 69.99,
                stock: 8,
                description: "Portable solar-powered phone charger for eco-friendly mobile charging on the go.",
                photos: ["https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400&h=300&fit=crop"]
            }
        ];

        // Add products
        console.log('🛍️ Adding products...');
        let addedProducts = 0;
        for (const productData of products) {
            if (productData.company) { // Only add if company was successfully created
                try {
                    await window.database.addProduct(productData);
                    addedProducts++;
                    console.log(`✅ Added product: ${productData.name}`);
                } catch (error) {
                    console.error(`❌ Failed to add product ${productData.name}:`, error);
                }
            }
        }

        console.log(`🎉 Database population completed!`);
        console.log(`📊 Summary:`);
        console.log(`   - Companies added: ${addedCompanies.length}`);
        console.log(`   - Products added: ${addedProducts}`);
        console.log(`   - Total items: ${addedCompanies.length + addedProducts}`);
        
        // Show success notification if admin panel is available
        if (window.adminPanel) {
            window.adminPanel.showNotification(`Database populated with ${addedCompanies.length} companies and ${addedProducts} products!`, 'success');
            // Refresh admin panel data
            window.adminPanel.loadDashboardStats();
            window.adminPanel.loadProducts();
            window.adminPanel.loadCompanies();
            window.adminPanel.loadCompanyOptions();
        }

        // Refresh main website if available
        if (window.app) {
            window.app.loadCompanies();
            window.app.loadProducts();
        }

        return {
            companies: addedCompanies.length,
            products: addedProducts,
            success: true
        };

    } catch (error) {
        console.error('❌ Database population failed:', error);
        if (window.adminPanel) {
            window.adminPanel.showNotification('Failed to populate database: ' + error.message, 'error');
        }
        return {
            success: false,
            error: error.message
        };
    }
}

// Auto-run if this script is loaded directly
if (typeof window !== 'undefined') {
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', populateDatabase);
    } else {
        // Add a small delay to ensure database is initialized
        setTimeout(populateDatabase, 1000);
    }
}

// Export for manual execution
window.populateDatabase = populateDatabase;
