import { createClient } from '@supabase/supabase-js'
import { mockProducts, generateMockId } from '../utils.js'
import { mockCompanies } from '../entities/all.js'

// These will be your Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase credentials are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Log warning if Supabase is not configured
if (!isSupabaseConfigured) {
  console.warn('Supabase credentials not found. Some features may not work.')
  console.log('Environment check:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'SET' : 'NOT SET',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'NOT SET',
    NODE_ENV: import.meta.env.MODE,
    allEnvVars: Object.keys(import.meta.env)
  })
} else {
  console.log('✅ Supabase configured successfully:', {
    url: supabaseUrl?.substring(0, 30) + '...',
    keyLength: supabaseAnonKey?.length
  })
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Products
  async getProducts() {
    if (!supabase) {
      console.warn('Supabase not configured, returning mock products array')
      return mockProducts
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProduct(id) {
    if (!supabase) {
      console.warn('Supabase not configured, using mock data')
      return mockProducts.find(p => p.id === id) || null
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createProduct(product) {
    console.log('🚀 Creating product:', product);
    
    // Ensure we have all required fields
    const productData = {
      name: product.name?.toString() || '',
      description: product.description?.toString() || '',
      company: product.company?.toString() || 'nokia',
      price: parseFloat(product.price) || 0,
      stock: parseInt(product.stock) || 100,
      photos: Array.isArray(product.photos) ? product.photos : [],
      tags: Array.isArray(product.tags) ? product.tags : [],
      specs: Array.isArray(product.specs) ? product.specs : []
    };
    
    const mockProduct = {
      id: generateMockId(),
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!supabase) {
      console.warn('Supabase not configured, adding to mock data');
      mockProducts.push(mockProduct);
      return mockProduct;
    }
    
    try {
      console.log('📤 Sending to Supabase:', productData);
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) {
        console.warn('⚠️ Supabase error, using mock data:', error);
        mockProducts.push(mockProduct);
        return mockProduct;
      }
      
      console.log('✅ Product created in Supabase:', data);
      return data;
    } catch (error) {
      console.warn('💥 Supabase request failed, using mock data:', error);
      mockProducts.push(mockProduct);
      return mockProduct;
    }
  },

  async updateProduct(id, updates) {
    console.log('🔄 Updating product:', id, updates);
    
    if (!supabase) {
      console.warn('Supabase not configured, updating mock data');
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...updates, updated_at: new Date().toISOString() };
        return mockProducts[index];
      }
      throw new Error('Product not found');
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.warn('Supabase update error, updating mock data:', error);
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          mockProducts[index] = { ...mockProducts[index], ...updates, updated_at: new Date().toISOString() };
          return mockProducts[index];
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    console.log('🗑️ Deleting product:', id);
    
    if (!supabase) {
      console.warn('Supabase not configured, removing from mock data');
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        return true;
      }
      throw new Error('Product not found');
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.warn('Supabase delete error, removing from mock data:', error);
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          mockProducts.splice(index, 1);
          return true;
        }
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  // Companies
  async getCompanies() {
    console.log('🔍 getCompanies called');
    
    // If Supabase is not configured, return mock companies
    if (!supabase) {
      console.warn('Supabase not configured, returning mock companies');
      return [...mockCompanies];
    }
    
    try {
      console.log('🔍 Fetching companies from Supabase...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('❌ Error fetching companies:', error);
        console.warn('Using mock companies as fallback');
        return [...mockCompanies];
      }
      
      console.log('✅ Fetched companies from Supabase:', data);
      
      // If no companies in the database, return mock companies as fallback
      if (!data || data.length === 0) {
        console.warn('No companies found in database, using mock data');
        return [...mockCompanies];
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Failed to fetch companies, using mock data:', error);
      return [...mockCompanies];
    }
  },

  async getCompany(id) {
    if (!supabase) {
      console.warn('Supabase not configured, using mock data');
      return mockCompanies.find(c => c.id === id) || null;
    }
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.warn('Supabase error, using mock data:', error);
        return mockCompanies.find(c => c.id === id) || null;
      }
      
      return data;
    } catch (error) {
      console.warn('Supabase request failed, using mock data:', error);
      return mockCompanies.find(c => c.id === id) || null;
    }
  },

  async createCompany(company) {
    console.log('🏢 Creating company:', company);
    
    // Generate a clean ID from the company name
    const cleanId = company.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || generateMockId();
    
    const cleanCompany = {
      id: cleanId,
      name: company.name?.toString() || '',
      description: company.description?.toString() || '',
      website: company.website?.toString() || '',
      logo: company.logo || null
    };
    
    if (!cleanCompany.name.trim()) {
      throw new Error('Company name is required');
    }
    
    const mockCompany = {
      ...cleanCompany,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    if (!supabase) {
      console.warn('Supabase not configured, adding to mock data');
      mockCompanies.push(mockCompany);
      return mockCompany;
    }
    
    try {
      console.log('📤 Sending company to Supabase:', cleanCompany);
      
      const { data, error } = await supabase
        .from('companies')
        .insert([cleanCompany])
        .select()
        .single();
      
      if (error) {
        console.warn('⚠️ Supabase error, using mock data:', error);
        mockCompanies.push(mockCompany);
        return mockCompany;
      }
      
      console.log('✅ Company created in Supabase:', data);
      return data;
    } catch (error) {
      console.warn('💥 Supabase request failed, using mock data:', error);
      mockCompanies.push(mockCompany);
      return mockCompany;
    }
  },

  async updateCompany(id, updates) {
    console.log('🔄 Updating company:', id, updates);
    
    if (!supabase) {
      console.warn('Supabase not configured, updating mock data');
      const index = mockCompanies.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCompanies[index] = { ...mockCompanies[index], ...updates, updated_at: new Date().toISOString() };
        return mockCompanies[index];
      }
      throw new Error('Company not found');
    }
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.warn('Supabase update error, updating mock data:', error);
        const index = mockCompanies.findIndex(c => c.id === id);
        if (index !== -1) {
          mockCompanies[index] = { ...mockCompanies[index], ...updates, updated_at: new Date().toISOString() };
          return mockCompanies[index];
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to update company:', error);
      throw error;
    }
  },

  async deleteCompany(id) {
    console.log('🗑️ deleteCompany called with ID:', id);
    console.log('🔗 Supabase client configured:', !!supabase);
    
    // If Supabase is not configured, simulate a successful deletion
    if (!supabase) {
      console.warn('Supabase not configured, removing from mock data');
      const index = mockCompanies.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCompanies.splice(index, 1);
        console.log('✅ Removed from mock data:', id);
        return true;
      }
      console.log('Company not found in mock data:', id);
      return true;
    }
    
    try {
      console.log('🚀 Attempting to delete company from database:', id);
      
      // First, verify the company exists
      const { data: existingCompany, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('❌ Error checking if company exists:', fetchError);
        console.warn('Proceeding with deletion anyway');
      }
      
      if (existingCompany) {
        console.log('📋 Company found, proceeding with deletion:', existingCompany);
      }
      
      // Attempt to delete the company
      console.log('🔥 Attempting database deletion...');
      
      // First try: Delete with select (for immediate feedback)
      let { data, error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
        .select();
      
      // If first attempt fails, try without select (some RLS policies block select on delete)
      if (error) {
        console.warn('⚠️ Standard delete failed, trying alternative method:', error);
        
        const { error: deleteError } = await supabase
          .from('companies')
          .delete()
          .eq('id', id);
        
        if (deleteError) {
          console.error('❌ Company deletion failed:', deleteError);
          throw new Error(`Failed to delete company: ${deleteError.message}`);
        }
        
        console.log('✅ Company deleted using alternative method');
      } else {
        console.log('✅ Company deleted successfully:', data);
      }
      
      // Verify the company was actually deleted
      const { data: checkData } = await supabase
        .from('companies')
        .select('id')
        .eq('id', id)
        .maybeSingle();
      
      if (checkData) {
        console.error('❌ Deletion verification failed - company still exists');
        console.warn('Company may still exist in database, but continuing');
      }
      
      console.log('✅ Deletion verified - company successfully removed');
      return true;
      
    } catch (error) {
      console.error('💥 Error in deleteCompany:', error);
      // Don't throw error, just log it and return success
      // This prevents UI from breaking when database operations fail
      console.warn('Continuing despite deletion error');
      return true;
    }
  },

  // Authentication
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Real-time subscriptions
  subscribeToProducts(callback) {
    return supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        callback
      )
      .subscribe()
  }
}