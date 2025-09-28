import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../../lib/supabase";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { useTranslation } from "react-i18next";
import ProductCard from "../../components/shared/ProductCard";
export default function AdminProducts() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await supabaseHelpers.getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const [companies, setCompanies] = useState([{ id: 'all', name: t('adminProducts.allCompanies') }]);
  
  // Load companies from database
  useEffect(() => {
    async function loadCompanies() {
      try {
        const dbCompanies = await supabaseHelpers.getCompanies();
        setCompanies([
          { id: 'all', name: t('adminProducts.allCompanies') },
          ...dbCompanies
        ]);
      } catch (error) {
        console.error('Error loading companies:', error);
      }
    }
    loadCompanies();
  }, [t]);
  const filteredProducts = filter === "all"
    ? products
    : products.filter(p => p.company === filter);

  // Refresh products from database
  const refreshProducts = async () => {
    try {
      const fetchedProducts = await supabaseHelpers.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error refreshing products:', err);
      setError(err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm(t('adminProducts.confirmDelete'))) {
      try {
        await supabaseHelpers.deleteProduct(productId);
        // Refresh the products list after deletion
        await refreshProducts();
      } catch (error) {
        alert(t('adminProducts.deleteError'));
      }
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
        </div>
        <p className="text-center text-slate-500 mt-4">
          {t('adminProducts.loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-4">
          {t('adminProducts.title')}
        </h1>
        <p className="text-xl text-slate-600 text-center">
          {t('adminProducts.subtitle')}
        </p>
      </div>

      {/* Filter and Stats */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('adminProducts.filterByCompany')}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t('adminProducts.allCompanies')}
              </button>
              {companies
                .filter(company => company.id !== 'all')
                .map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setFilter(company.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === company.id
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {company.name}
                  </button>
                ))}
            </div>
          </div>
          <Link
            to={createPageUrl("admin/add-product")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap w-full sm:w-auto text-center"
          >
            {t('adminProducts.addProduct')}
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-slate-500 text-lg">{t('adminProducts.noProducts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link
                    to={createPageUrl(`admin/edit-product/${product.id}`)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors"
                    title={t('common.edit')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title={t('common.delete')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-700' 
                      : product.stock > 0 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {t('common.stock')}: {product.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
