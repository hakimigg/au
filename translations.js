// Translation system for the website
const translations = {
    en: {
        // Navigation
        nav: {
            home: "Home",
            products: "Products",
            companies: "Companies",
            contact: "Contact"
        },
        
        // Hero Section
        hero: {
            title: "Welcome to Beta Website",
            subtitle: "Discover amazing products from top companies",
            button: "Explore Products"
        },
        
        // Products Section
        products: {
            title: "Featured Products",
            subtitle: "Discover our carefully selected premium products",
            searchPlaceholder: "Search products...",
            allProducts: "All Products",
            noProducts: "No products found",
            inStock: "in stock",
            viewDetails: "View Details",
            price: "DA"
        },
        
        // Companies Section
        companies: {
            title: "Our Collections",
            subtitle: "Explore products from our partner companies",
            noCompanies: "No companies found"
        },
        
        // Contact Section
        contact: {
            title: "Contact Us",
            subtitle: "Get in touch with our team",
            email: "Email",
            phone: "Phone",
            address: "Address"
        },
        
        // Footer
        footer: {
            copyright: "© 2025 Beta Website. All rights reserved."
        },
        
        // Product Modal
        modal: {
            specifications: "Specifications",
            noImage: "No Image Available"
        },
        
        // Admin Panel
        admin: {
            title: "Admin Dashboard",
            dashboard: "Dashboard",
            products: "Products",
            companies: "Companies",
            settings: "Settings",
            logout: "Logout",
            addProduct: "Add Product",
            addCompany: "Add Company",
            editProduct: "Edit Product",
            editCompany: "Edit Company",
            productName: "Product Name",
            productPrice: "Price (DA)",
            productDescription: "Description",
            productPhoto: "Product Photo",
            productStock: "Stock",
            productCompany: "Company",
            companyName: "Company Name",
            companyDescription: "Company Description",
            companyPhoto: "Company Photo",
            save: "Save",
            cancel: "Cancel",
            edit: "Edit",
            delete: "Delete",
            choosePhoto: "Choose Photo",
            totalProducts: "Total Products",
            totalCompanies: "Total Companies",
            lowStock: "Low Stock Items",
            recentActivity: "Recent Activity"
        }
    },
    
    fr: {
        // Navigation
        nav: {
            home: "Accueil",
            products: "Produits",
            companies: "Entreprises",
            contact: "Contact"
        },
        
        // Hero Section
        hero: {
            title: "Bienvenue sur Beta Website",
            subtitle: "Découvrez des produits incroyables de grandes entreprises",
            button: "Explorer les Produits"
        },
        
        // Products Section
        products: {
            title: "Produits en Vedette",
            subtitle: "Découvrez nos produits premium soigneusement sélectionnés",
            searchPlaceholder: "Rechercher des produits...",
            allProducts: "Tous les Produits",
            noProducts: "Aucun produit trouvé",
            inStock: "en stock",
            viewDetails: "Voir les Détails",
            price: "DA"
        },
        
        // Companies Section
        companies: {
            title: "Nos Collections",
            subtitle: "Explorez les produits de nos entreprises partenaires",
            noCompanies: "Aucune entreprise trouvée"
        },
        
        // Contact Section
        contact: {
            title: "Nous Contacter",
            subtitle: "Contactez notre équipe",
            email: "E-mail",
            phone: "Téléphone",
            address: "Adresse"
        },
        
        // Footer
        footer: {
            copyright: "© 2025 Beta Website. Tous droits réservés."
        },
        
        // Product Modal
        modal: {
            specifications: "Spécifications",
            noImage: "Aucune Image Disponible"
        },
        
        // Admin Panel
        admin: {
            title: "Tableau de Bord Admin",
            dashboard: "Tableau de Bord",
            products: "Produits",
            companies: "Entreprises",
            settings: "Paramètres",
            logout: "Déconnexion",
            addProduct: "Ajouter un Produit",
            addCompany: "Ajouter une Entreprise",
            editProduct: "Modifier le Produit",
            editCompany: "Modifier l'Entreprise",
            productName: "Nom du Produit",
            productPrice: "Prix (DA)",
            productDescription: "Description",
            productPhoto: "Photo du Produit",
            productStock: "Stock",
            productCompany: "Entreprise",
            companyName: "Nom de l'Entreprise",
            companyDescription: "Description de l'Entreprise",
            companyPhoto: "Photo de l'Entreprise",
            save: "Enregistrer",
            cancel: "Annuler",
            edit: "Modifier",
            delete: "Supprimer",
            choosePhoto: "Choisir une Photo",
            totalProducts: "Total des Produits",
            totalCompanies: "Total des Entreprises",
            lowStock: "Articles en Rupture",
            recentActivity: "Activité Récente"
        }
    }
};

// Language management class
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = translations;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.updatePageContent();
            this.updateLanguageSwitcher();
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    translate(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English if translation not found
                translation = this.translations.en;
                for (const fallbackKey of keys) {
                    if (translation && translation[fallbackKey]) {
                        translation = translation[fallbackKey];
                    } else {
                        return key; // Return key if no translation found
                    }
                }
                break;
            }
        }
        
        return translation || key;
    }

    updatePageContent() {
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update page title
        if (document.querySelector('[data-translate="hero.title"]')) {
            document.title = this.translate('hero.title');
        }
    }

    updateLanguageSwitcher() {
        const languageSwitcher = document.querySelector('.language-switcher');
        if (languageSwitcher) {
            const buttons = languageSwitcher.querySelectorAll('.lang-btn');
            buttons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
            });
        }
    }

    init() {
        // Set initial language
        this.updatePageContent();
        this.updateLanguageSwitcher();
        
        // Add event listeners for language switcher
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            }
        });
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Make it globally available
window.languageManager = languageManager;
