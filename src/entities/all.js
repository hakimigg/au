// Mock entities for Product Plaza demo
import { mockProducts, mockUsers, mockWishlist } from '../utils.js';

// Mock companies data - Updated to match database
export const mockCompanies = [
  {
    id: "nokia",
    name: "Nokia",
    description: "Leading technology company specializing in telecommunications and consumer electronics",
    logo: null,
    website: "https://nokia.com",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "samsung", 
    name: "Samsung",
    description: "Innovation-focused company creating cutting-edge electronics and technology",
    logo: null,
    website: "https://samsung.com",
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "apple",
    name: "Apple",
    description: "Premium technology brand known for innovative consumer electronics",
    logo: null,
    website: "https://apple.com",
    created_at: "2024-01-03T00:00:00Z"
  },
  {
    id: "premium",
    name: "Premium Brand",
    description: "Luxury products and premium quality electronics",
    logo: null,
    website: "",
    created_at: "2024-01-04T00:00:00Z"
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Product entity
export class Product {
  static async list(sortBy = '-created_date', limit = 100) {
    await delay(500); // Simulate API call
    let products = [...mockProducts];
    
    if (sortBy === '-created_date') {
      products = products.reverse();
    }
    
    return products.slice(0, limit);
  }

  static async filter(filters, sortBy = '', limit = 100) {
    await delay(300);
    let products = [...mockProducts];
    
    if (filters.id) {
      products = products.filter(p => p.id === filters.id);
    }
    
    if (filters.company) {
      products = products.filter(p => p.company === filters.company);
    }
    
    return products.slice(0, limit);
  }

  static async create(productData) {
    console.log('Product.create called with:', productData);
    await delay(800);
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      specs: productData.specs || [],
      tags: productData.tags || [],
      photos: productData.photos || []
    };
    console.log('Created product:', newProduct);
    mockProducts.push(newProduct);
    return newProduct;
  }

  static async update(id, productData) {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...productData };
      return mockProducts[index];
    }
    throw new Error('Product not found');
  }

  static async delete(id) {
    await delay(300);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts.splice(index, 1);
      return true;
    }
    throw new Error('Product not found');
  }
}

// Mock User entity
export class User {
  static async me() {
    await delay(200);
    // Simulate logged in user
    return mockUsers[0];
  }

  static async loginWithRedirect(returnUrl) {
    await delay(100);
    // In a real app, this would redirect to auth provider
    console.log('Redirecting to login...', returnUrl);
    // For demo, we'll just simulate successful login
    return mockUsers[0];
  }

  static async logout() {
    await delay(100);
    console.log('Logging out...');
    return true;
  }
}

// Mock UserWishlist entity
export class UserWishlist {
  static async filter(filters) {
    await delay(200);
    let wishlist = [...mockWishlist];
    
    if (filters.user_email) {
      wishlist = wishlist.filter(w => w.user_email === filters.user_email);
    }
    
    if (filters.product_id) {
      wishlist = wishlist.filter(w => w.product_id === filters.product_id);
    }
    
    return wishlist;
  }

  static async create(wishlistData) {
    await delay(300);
    const newWishlistItem = {
      id: Date.now().toString(),
      ...wishlistData
    };
    mockWishlist.push(newWishlistItem);
    return newWishlistItem;
  }

  static async delete(id) {
    await delay(200);
    const index = mockWishlist.findIndex(w => w.id === id);
    if (index !== -1) {
      mockWishlist.splice(index, 1);
      return true;
    }
    throw new Error('Wishlist item not found');
  }
}

// Mock Company entity
export class Company {
  static async getAll() {
    console.log('Company.getAll called');
    await delay(300);
    return [...mockCompanies];
  }

  static async getById(id) {
    console.log('Company.getById called with:', id);
    await delay(200);
    return mockCompanies.find(c => c.id === id) || null;
  }

  static async create(companyData) {
    console.log('Company.create called with:', companyData);
    await delay(800);
    const newCompany = {
      id: `c${Date.now()}`,
      ...companyData,
      created_at: new Date().toISOString()
    };
    console.log('Created company:', newCompany);
    mockCompanies.push(newCompany);
    return newCompany;
  }

  static async update(id, companyData) {
    console.log('Company.update called with:', id, companyData);
    await delay(500);
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCompanies[index] = { ...mockCompanies[index], ...companyData };
      console.log('Updated company:', mockCompanies[index]);
      return mockCompanies[index];
    }
    throw new Error('Company not found');
  }

  static async delete(id) {
    console.log('Company.delete called with:', id);
    await delay(400);
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      const deleted = mockCompanies.splice(index, 1)[0];
      console.log('Deleted company:', deleted);
      return deleted;
    }
    throw new Error('Company not found');
  }
}
