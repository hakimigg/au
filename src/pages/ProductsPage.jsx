import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../lib/supabase";
import ProductCard from "../components/shared/ProductCard";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState(searchParams.get("company") || "all");
  const { t } = useTranslation();

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCompanies] = await Promise.all([
          supabaseHelpers.getProducts(),
          supabaseHelpers.getCompanies()
        ]);
        setProducts(fetchedProducts);
        
        // Get unique company IDs from products (this might be where C1, C2, etc. are coming from)
        const productCompanyIds = [...new Set(fetchedProducts.map(p => p.company))];
        console.log('Product company IDs:', productCompanyIds);
        console.log('Fetched companies:', fetchedCompanies);
        
        // Define a list of allowed company IDs (whitelist approach)
        // Include both mock companies and real database companies
        const allowedCompanyIds = [
          'nokia', 'samsung', 'apple', 'premium', // Mock companies
          'techcorp', 'innovatelab', 'futuretech', 'smartdevices' // Real database companies
        ];
        
        // Filter products to only include those from allowed companies
        const filteredProducts = fetchedProducts.filter(product => 
          allowedCompanyIds.includes(product.company?.toLowerCase())
        );
        
        // Update products to only include valid ones
        setProducts(filteredProducts);
        
        // Filter out placeholder companies (like C1, C2, C3, etc.) and only keep real companies
        const realCompanies = fetchedCompanies.filter(company => {
          // Only include companies that have proper names and are in our allowed list
          return company.name && 
                 company.name.length > 2 && 
                 !company.name.match(/^C\d+$/i) && // Exclude C1, C2, C3, etc.
                 company.name !== company.id && // Exclude cases where name equals ID for placeholders
                 allowedCompanyIds.includes(company.id?.toLowerCase()); // Only allowed companies
        });
        
        // Get valid company IDs that actually have products and are allowed
        const validCompanyIds = productCompanyIds.filter(companyId => 
          allowedCompanyIds.includes(companyId?.toLowerCase())
        );
        
        console.log('Valid company IDs:', validCompanyIds);
        
        // Store full company data for display names
        setCompanyData(realCompanies);
        
        // Create filter options from valid company IDs only
        const companyOptions = ["all", ...validCompanyIds];
        setCompanies(companyOptions);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    
    // First filter by company if needed
    if (companyFilter !== "all") {
      filtered = products.filter(p => p.company === companyFilter);
    }
    
    // Then filter out out-of-stock products
    filtered = filtered.filter(product => product.stock > 0);
    
    setFilteredProducts(filtered);
  }, [products, companyFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
          {t('products.title')}
        </h1>
        <p className="text-lg md:text-xl text-slate-600">
          {t('products.subtitle')}
        </p>
      </div>
      
      {/* Company filter */}
      <div className="mb-16">
        <div className="flex flex-wrap justify-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
          {companies.map(c => {
            const companyInfo = companyData.find(comp => comp.id === c);
            const displayName = c === "all" 
              ? t('products.allCompanies')
              : (companyInfo?.name || c.charAt(0).toUpperCase() + c.slice(1));
            
            return (
              <button
                key={c}
                onClick={() => setCompanyFilter(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  companyFilter === c
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <div className="pt-[100%] bg-slate-100 animate-pulse"></div>
              <div className="p-5">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-blue-600 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="text-5xl mb-4">
            <span role="img" aria-label="No products">📭</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {products.length > 0 ? 'No available products' : 'No products found'}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            {products.length > 0 
              ? 'All products are currently out of stock. Please check back later.'
              : 'We couldn\'t find any products matching your criteria. Try adjusting your filters.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
