import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.products": "Products",
      "nav.addProduct": "Add Product",

      // Common
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.submit": "Submit",
      "common.required": "Required",
      "common.optional": "Optional",
      "common.stock": "Stock",

      // Home Page
      "home.title": "Welcome to Beta Website",
      "home.subtitle": "Discover amazing products from top companies",
      "home.cta": "Explore Products",
      "home.collections": "Collections",
      "home.featured": "Featured Collection",
      "home.connect": "Connect With Us",
      "home.footerTitle": "Beta Website",
      "home.footerSubtitle": "A curated collection of amazing products. Discover quality and style in every piece.",
      "home.footerCopyright": " 2025 Beta Website. All rights reserved.",

      // Products Page
      "products.title": "Our Products",
      "products.subtitle": "Browse our collection of amazing products",
      "products.noProducts": "No products found",
      "products.loadMore": "Load More",
      "products.allCompanies": "All Companies",

      // Product Detail
      "product.addToCart": "Add to Cart",
      "product.price": "Price",
      "product.description": "Description",
      "product.company": "Company",
      "product.stock": "Stock",

      // Add Product (Public)
      "addProduct.title": "Add a New Product",
      "addProduct.subtitle": "Share your amazing product with the world",
      "addProduct.productName": "Product Name",
      "addProduct.productNamePlaceholder": "Enter product name",
      "addProduct.description": "Description",
      "addProduct.descriptionPlaceholder": "Describe your product",
      "addProduct.company": "Company",
      "addProduct.price": "Price (da)",
      "addProduct.pricePlaceholder": "0.00",
      "addProduct.photos": "Product Photos",
      "addProduct.creating": "Creating Product...",
      "addProduct.submit": "Add Product",

      // Admin Dashboard
      "admin.title": "Admin Panel",
      "admin.dashboard": "Dashboard",
      "admin.addProduct": "Add Product",
      "admin.manageProducts": "Manage Products",
      "admin.addCompany": "Add Company",
      "admin.manageCompanies": "Manage Companies",
      "admin.backToSite": "Back to Site",
      "admin.manageYourStore": "Manage your store",
      "admin.quickActions": "Quick Actions",
      "admin.recentProducts": "Recent Products",
      "admin.statistics": "Statistics",
      "admin.totalProducts": "Total Products",
      "admin.totalCompanies": "Total Companies",
      "admin.recentActivity": "Recent Activity",
      "admin.addNewProduct": "Add New Product",
      "admin.manageProducts": "Manage Products",
      "admin.viewPublicSite": "View Public Site",
      "admin.noProductsYet": "No products yet",
      "admin.inStock": "in stock",
      "admin.errorLoadingDashboard": "Error loading dashboard:",

      // Admin Add Product
      "adminAddProduct.title": "Add New Product",
      "adminAddProduct.subtitle": "Add a new product to your inventory",
      "adminAddProduct.productName": "Product Name",
      "adminAddProduct.productNamePlaceholder": "Enter product name",
      "adminAddProduct.description": "Description",
      "adminAddProduct.descriptionPlaceholder": "Describe your product",
      "adminAddProduct.company": "Company",
      "adminAddProduct.price": "Price (da)",
      "adminAddProduct.pricePlaceholder": "0.00",
      "adminAddProduct.preview": "Product Preview",
      "adminAddProduct.creating": "Creating Product...",
      "adminAddProduct.submit": "Create Product",

      // Admin Add Company
      "adminAddCompany.title": "Add New Company",
      "adminAddCompany.subtitle": "Create a new company profile",
      "adminAddCompany.companyName": "Company Name",
      "adminAddCompany.companyNamePlaceholder": "Enter company name",
      "adminAddCompany.description": "Description",
      "adminAddCompany.descriptionPlaceholder": "Describe the company...",
      "adminAddCompany.logo": "Company Logo",
      "adminAddCompany.creating": "Creating Company...",
      "adminAddCompany.submit": "Create Company",
      "adminAddCompany.success": "Company '{{companyName}}' has been created successfully!",
      "adminAddCompany.preview": "Company Preview",
      "adminAddCompany.previewDefault.name": "Company Name",
      "adminAddCompany.previewDefault.description": "Company description",
      "adminAddCompany.previewDefault.initial": "C",
      "adminAddCompany.form.clickToUpload": "Click to upload",
      "adminAddCompany.form.orDragAndDrop": "or drag and drop",
      "adminAddCompany.form.fileTypes": "PNG, JPG, GIF up to 5MB",
      "adminAddCompany.form.logoPreview": "Logo preview",
      "adminAddCompany.form.companyLogoPreview": "Company logo preview",
      "adminAddCompany.buttons.create": "Create Company",
      "adminAddCompany.buttons.creating": "Creating Company...",
      "adminAddCompany.errors.invalidImage": "Please select a valid image file",
      "adminAddCompany.errors.imageTooLarge": "Image size must be less than 5MB",
      "adminAddCompany.errors.nameRequired": "Please enter a company name",
      "adminAddCompany.errors.createFailed": "Failed to create company. Please try again.",

      // Admin Manage Companies
      "adminCompanies.title": "Manage Companies",
      "adminCompanies.subtitle": "View and manage all companies",
      "adminCompanies.testConnection": "Test Connection",
      "adminCompanies.addNewCompany": "Add New Company",
      "adminCompanies.noCompanies": "No companies yet",
      "adminCompanies.getStarted": "Get started by adding your first company",
      "adminCompanies.addFirstCompany": "Add First Company",
      "adminCompanies.errorLoading": "Error Loading Companies",
      "adminCompanies.totalCompanies": "Total companies: {{count}}",
      "adminCompanies.tableHeaders.company": "Company",
      "adminCompanies.tableHeaders.description": "Description",
      "adminCompanies.tableHeaders.website": "Website",
      "adminCompanies.tableHeaders.created": "Created",
      "adminCompanies.tableHeaders.actions": "Actions",
      "common.id": "ID",
      "common.noDescription": "No description",
      "common.visitWebsite": "Visit Website",
      "common.noWebsite": "No website",
      "common.deleting": "Deleting...",
      "common.tryAgain": "Try Again",
      "adminCompanies.subtitle": "View and manage all companies",
      "adminCompanies.loading": "Loading companies...",
      "adminCompanies.noCompanies": "No companies found",
      "adminCompanies.confirmDelete": "Are you sure you want to delete \"{{companyName}}\"? This action cannot be undone.",
      "adminCompanies.deleted": "Company \"{{companyName}}\" has been permanently deleted!",
      "adminCompanies.deleteFailed": "Failed to delete \"{{companyName}}\". The company still exists in the database.",
      "adminCompanies.deleteError": "Failed to delete \"{{companyName}}\": {{error}}",

      // Admin Products
      "adminProducts.title": "Manage Products",
      "adminProducts.subtitle": "View and manage all products in your inventory",
      "adminProducts.loading": "Loading products...",
      "adminProducts.noProducts": "No products found",
      "adminProducts.filterByCompany": "Filter by Company",
      "adminProducts.allCompanies": "All Companies",
      "adminProducts.showingResults": "Showing {{shown}} of {{total}} products",
      "adminProducts.tableHeaders": {
        "product": "Product",
        "company": "Company",
        "price": "Price",
        "stock": "Stock",
        "actions": "Actions"
      },
      "adminProducts.confirmDelete": "Are you sure you want to delete this product?",
      "adminProducts.deleteError": "Error deleting product. Please try again.",
      "adminProducts.addNewProduct": "Add New Product",

      // Admin Add Product
      "adminAddProduct.title": "Add New Product",
      "adminAddProduct.subtitle": "Add a new product to your inventory",
      "adminAddProduct.productName": "Product Name",
      "adminAddProduct.productNamePlaceholder": "Enter product name",
      "adminAddProduct.description": "Description",
      "adminAddProduct.descriptionPlaceholder": "Describe your product",
      "adminAddProduct.company": "Company",
      "adminAddProduct.price": "Price (da)",
      "adminAddProduct.preview": "Product Preview",
      "adminAddProduct.previewInitial": "P",
      "adminAddProduct.previewName": "Product Name",
      "adminAddProduct.previewDescription": "Product description",
      "adminAddProduct.loadingCompanies": "Loading companies",
      "adminAddProduct.redirecting": "Redirecting to dashboard...",
      "adminAddProduct.creating": "Creating Product...",
      "adminAddProduct.createButton": "Create Product",
      "adminAddProduct.success": "Product \"{{productName}}\" created successfully!",
      "adminAddProduct.error": "Error creating product: {{error}}",
      "adminAddProduct.validation": {
        "nameRequired": "Please enter a product name",
        "validPrice": "Please enter a valid price"
      },

      // Error Messages
      "error.generic": "An error occurred. Please try again.",
      "error.network": "Network error. Please check your connection.",
      "error.validation": "Please fill in all required fields.",

      // Success Messages
      "success.productCreated": "Product \"{{productName}}\" created successfully!",
      "success.companyCreated": "Company \"{{companyName}}\" has been created successfully!",
      "success.companyDeleted": "Company \"{{companyName}}\" has been permanently deleted!",
    }
  },
  fr: {
    translation: {
      // Navigation
      "nav.home": "Accueil",
      "nav.products": "Produits",
      "nav.addProduct": "Ajouter un Produit",

      // Common
      "common.loading": "Chargement...",
      "common.save": "Enregistrer",
      "common.cancel": "Annuler",
      "common.delete": "Supprimer",
      "common.edit": "Modifier",
      "common.submit": "Soumettre",
      "common.required": "Obligatoire",
      "common.optional": "Optionnel",
      "common.stock": "Stock",

      // Home Page
      "home.title": "Bienvenue sur Beta Website",
      "home.subtitle": "Découvrez des produits exceptionnels des meilleures entreprises",
      "home.cta": "Explorer les Produits",
      "home.collections": "Collections",
      "home.featured": "Collection en Vedette",
      "home.connect": "Connectez-vous avec Nous",
      "home.connectSubtitle": "Suivez-nous sur les réseaux sociaux et restez connecté",
      "home.footerTitle": "Site Web Beta",
      "home.footerSubtitle": "Une collection sélectionnée de produits exceptionnels. Découvrez la qualité et le style dans chaque pièce.",
      "home.footerCopyright": "© 2025 Site Web Beta. Tous droits réservés.",

      // Products Page
      "products.title": "Nos Produits",
      "products.subtitle": "Parcourez notre collection de produits exceptionnels",
      "products.noProducts": "Aucun produit trouvé",
      "products.loadMore": "Charger Plus",
      "products.allCompanies": "Toutes les entreprises",

      // Product Detail
      "product.addToCart": "Ajouter au Panier",
      "product.price": "Prix",
      "product.description": "Description",
      "product.company": "Entreprise",
      "product.stock": "Stock",

      // Add Product (Public)
      "addProduct.title": "Ajouter un Nouveau Produit",
      "addProduct.subtitle": "Partagez votre produit exceptionnel avec le monde",
      "addProduct.productName": "Nom du Produit",
      "addProduct.productNamePlaceholder": "Entrez le nom du produit",
      "addProduct.description": "Description",
      "addProduct.descriptionPlaceholder": "Décrivez votre produit",
      "addProduct.company": "Entreprise",
      "addProduct.price": "Prix (da)",
      "addProduct.pricePlaceholder": "0.00",
      "addProduct.photos": "Photos du Produit",
      "addProduct.creating": "Création du Produit...",
      "addProduct.submit": "Ajouter le Produit",

      // Admin Dashboard
      "admin.title": "Panneau d'Administration",
      "admin.dashboard": "Tableau de Bord",
      "admin.addProduct": "Ajouter un Produit",
      "admin.manageProducts": "Gérer les Produits",
      "admin.addCompany": "Ajouter une Entreprise",
      "admin.manageCompanies": "Gérer les Entreprises",
      "admin.backToSite": "Retour au Site",
      "admin.manageYourStore": "Gérez votre magasin",
      "admin.quickActions": "Actions Rapides",
      "admin.recentProducts": "Produits Récents",
      "admin.statistics": "Statistiques",
      "admin.totalProducts": "Total des Produits",
      "admin.totalCompanies": "Total des Entreprises",
      "admin.recentActivity": "Activité Récente",
      "admin.addNewProduct": "Ajouter un Nouveau Produit",
      "admin.manageProducts": "Gérer les Produits",
      "admin.viewPublicSite": "Voir le Site Public",
      "admin.noProductsYet": "Aucun produit pour le moment",
      "admin.inStock": "en stock",
      "admin.errorLoadingDashboard": "Erreur lors du chargement du tableau de bord :",

      // Admin Add Product
      "adminAddProduct.title": "Ajouter un Nouveau Produit",
      "adminAddProduct.subtitle": "Ajoutez un nouveau produit à votre inventaire",
      "adminAddProduct.productName": "Nom du Produit",
      "adminAddProduct.productNamePlaceholder": "Entrez le nom du produit",
      "adminAddProduct.description": "Description",
      "adminAddProduct.descriptionPlaceholder": "Décrivez votre produit",
      "adminAddProduct.company": "Entreprise",
      "adminAddProduct.price": "Prix (da)",
      "adminAddProduct.pricePlaceholder": "0.00",
      "adminAddProduct.preview": "Aperçu du Produit",
      "adminAddProduct.creating": "Création du Produit...",
      "adminAddProduct.submit": "Créer le Produit",

      // Admin Add Company
      "adminAddCompany.title": "Ajouter une Nouvelle Entreprise",
      "adminAddCompany.subtitle": "Créez un profil d'entreprise",
      "adminAddCompany.companyName": "Nom de l'Entreprise",
      "adminAddCompany.companyNamePlaceholder": "Entrez le nom de l'entreprise",
      "adminAddCompany.description": "Description",
      "adminAddCompany.descriptionPlaceholder": "Décrivez l'entreprise...",
      "adminAddCompany.logo": "Logo de l'Entreprise",
      "adminAddCompany.creating": "Création de l'Entreprise...",
      "adminAddCompany.submit": "Créer l'Entreprise",
      "adminAddCompany.success": "L'entreprise '{{companyName}}' a été créée avec succès !",
      "adminAddCompany.preview": "Aperçu de l'entreprise",
      "adminAddCompany.previewDefault.name": "Nom de l'entreprise",
      "adminAddCompany.previewDefault.description": "Description de l'entreprise",
      "adminAddCompany.previewDefault.initial": "E",
      "adminAddCompany.form.clickToUpload": "Cliquez pour télécharger",
      "adminAddCompany.form.orDragAndDrop": "ou glissez-déposez",
      "adminAddCompany.form.fileTypes": "PNG, JPG, GIF jusqu'à 5 Mo",
      "adminAddCompany.form.logoPreview": "Aperçu du logo",
      "adminAddCompany.form.companyLogoPreview": "Aperçu du logo de l'entreprise",
      "adminAddCompany.buttons.create": "Créer l'entreprise",
      "adminAddCompany.buttons.creating": "Création en cours...",
      "adminAddCompany.errors.invalidImage": "Veuillez sélectionner un fichier image valide",
      "adminAddCompany.errors.imageTooLarge": "La taille de l'image ne doit pas dépasser 5 Mo",
      "adminAddCompany.errors.nameRequired": "Veuillez entrer un nom d'entreprise",
      "adminAddCompany.errors.createFailed": "Échec de la création de l'entreprise. Veuillez réessayer.",

      // Admin Manage Companies
      "adminCompanies.title": "Gérer les Entreprises",
      "adminCompanies.subtitle": "Afficher et gérer toutes les entreprises",
      "adminCompanies.testConnection": "Tester la connexion",
      "adminCompanies.addNewCompany": "Ajouter une entreprise",
      "adminCompanies.noCompanies": "Aucune entreprise pour le moment",
      "adminCompanies.getStarted": "Commencez par ajouter votre première entreprise",
      "adminCompanies.addFirstCompany": "Ajouter une première entreprise",
      "adminCompanies.errorLoading": "Erreur lors du chargement des entreprises",
      "adminCompanies.totalCompanies": "Total des entreprises : {{count}}",
      "adminCompanies.tableHeaders.company": "Entreprise",
      "adminCompanies.tableHeaders.description": "Description",
      "adminCompanies.tableHeaders.website": "Site web",
      "adminCompanies.tableHeaders.created": "Créée le",
      "adminCompanies.tableHeaders.actions": "Actions",
      "common.id": "ID",
      "common.noDescription": "Aucune description",
      "common.visitWebsite": "Visiter le site",
      "common.noWebsite": "Aucun site web",
      "common.deleting": "Suppression...",
      "common.tryAgain": "Réessayer",
      "adminCompanies.subtitle": "Voir et gérer toutes les entreprises",
      "adminCompanies.loading": "Chargement des entreprises...",
      "adminCompanies.noCompanies": "Aucune entreprise trouvée",
      "adminCompanies.confirmDelete": "Êtes-vous sûr de vouloir supprimer \"{{companyName}}\" ? Cette action ne peut pas être annulée.",
      "adminCompanies.deleted": "L'entreprise \"{{companyName}}\" a été supprimée définitivement !",
      "adminCompanies.deleteFailed": "Échec de la suppression de \"{{companyName}}\". L'entreprise existe toujours dans la base de données.",
      "adminCompanies.deleteError": "Échec de la suppression de \"{{companyName}}\" : {{error}}",

      // Admin Products
      "adminProducts.title": "Gérer les Produits",
      "adminProducts.subtitle": "Afficher et gérer tous les produits de votre inventaire",
      "adminProducts.loading": "Chargement des produits...",
      "adminProducts.noProducts": "Aucun produit trouvé",
      "adminProducts.filterByCompany": "Filtrer par entreprise",
      "adminProducts.allCompanies": "Toutes les entreprises",
      "adminProducts.showingResults": "Affichage de {{shown}} sur {{total}} produits",
      "adminProducts.tableHeaders": {
        "product": "Produit",
        "company": "Entreprise",
        "price": "Prix",
        "stock": "Stock",
        "actions": "Actions"
      },
      "adminProducts.confirmDelete": "Êtes-vous sûr de vouloir supprimer ce produit ?",
      "adminProducts.deleteError": "Erreur lors de la suppression du produit. Veuillez réessayer.",
      "adminProducts.addNewProduct": "Ajouter un nouveau produit",

      // Admin Add Product
      // Admin Add Product
      "adminAddProduct.title": "Ajouter un Nouveau Produit",
      "adminAddProduct.subtitle": "Ajoutez un nouveau produit à votre inventaire",
      "adminAddProduct.productName": "Nom du Produit",
      "adminAddProduct.productNamePlaceholder": "Entrez le nom du produit",
      "adminAddProduct.description": "Description",
      "adminAddProduct.descriptionPlaceholder": "Décrivez votre produit",
      "adminAddProduct.company": "Entreprise",
      "adminAddProduct.price": "Prix (da)",
      "adminAddProduct.preview": "Aperçu du Produit",
      "adminAddProduct.previewInitial": "P",
      "adminAddProduct.previewName": "Nom du Produit",
      "adminAddProduct.previewDescription": "Description du produit",
      "adminAddProduct.loadingCompanies": "Chargement des entreprises",
      "adminAddProduct.redirecting": "Redirection vers le tableau de bord...",
      "adminAddProduct.creating": "Création du Produit...",
      "adminAddProduct.createButton": "Créer le Produit",
      "adminAddProduct.success": "Le produit \"{{productName}}\" a été créé avec succès !",
      "adminAddProduct.error": "Erreur lors de la création du produit : {{error}}",
      "adminAddProduct.validation": {
        "nameRequired": "Veuillez entrer un nom de produit",
        "validPrice": "Veuillez entrer un prix valide"
      },

      // Common
      "common.currency": "da",

      // Error Messages
      "error.generic": "Une erreur s'est produite. Veuillez réessayer.",
      "error.network": "Erreur de réseau. Veuillez vérifier votre connexion.",
      "error.validation": "Veuillez remplir tous les champs obligatoires.",
      "success.productCreated": "Le produit \"{{productName}}\" a été créé avec succès !",
      "success.companyCreated": "L'entreprise \"{{companyName}}\" a été créée avec succès !",
      "success.companyDeleted": "L'entreprise \"{{companyName}}\" a été supprimée définitivement !",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: true, // Enable debug mode to see translation issues in console

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
