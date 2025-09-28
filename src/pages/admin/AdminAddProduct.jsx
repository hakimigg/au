import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { useTranslation } from 'react-i18next';
import { Package, DollarSign, Building2, FileText, Plus, Check } from "lucide-react";

export default function AdminAddProduct() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ 
    name: "", 
    description: "", 
    company: "nokia", 
    price: 0,
    stock: 100,
    tags: [],
    specs: []
  });
  const [photos, setPhotos] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Load companies from database
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoadingCompanies(true);
        const fetchedCompanies = await supabaseHelpers.getCompanies();
        setCompanies(fetchedCompanies);

        // Set default company to first available if current one doesn't exist
        if (fetchedCompanies.length > 0 && !fetchedCompanies.find(c => c.id === product.company)) {
          setProduct({ ...product, company: fetchedCompanies[0].id });
        }
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    loadCompanies();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!product.name || !product.name.trim()) {
      newErrors.name = t('adminAddProduct.validation.nameRequired');
    }
    
    if (isNaN(Number(product.price)) || Number(product.price) < 0) {
      newErrors.price = t('adminAddProduct.validation.validPrice');
    }
    
    if (!product.company) {
      newErrors.company = 'Please select a company';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrors({});
    
    try {
      const productToCreate = { 
        ...product, 
        price: Number(product.price),
        stock: Number(product.stock) || 100,
        photos: photos.map(p => p.preview || p),
        tags: product.tags || [],
        specs: product.specs || []
      };
      
      console.log('Creating product:', productToCreate);
      const newProduct = await supabaseHelpers.createProduct(productToCreate);
      console.log('Product created:', newProduct);
      
      setSuccessMessage(t('adminAddProduct.success', { productName: newProduct.name }));
      
      // Reset form
      setProduct({ 
        name: "", 
        description: "", 
        company: companies.length > 0 ? companies[0].id : "nokia", 
        price: 0,
        stock: 100,
        tags: [],
        specs: []
      });
      setPhotos([]);
      
      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate(createPageUrl("admin"));
      }, 2000);
    } catch (error) {
      console.error("Error creating product:", error);
      setErrors({ submit: t('adminAddProduct.error', { error: error.message || t('common.tryAgain') }) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {t('adminAddProduct.title')}
        </h1>
        <p className="text-lg text-slate-600">{t('adminAddProduct.subtitle')}</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl animate-scaleIn success-checkmark">
          <p className="font-semibold">{successMessage}</p>
          <p className="text-sm">{t('adminAddProduct.redirecting')}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6 animate-slideInLeft">
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                <p className="font-medium">{errors.submit}</p>
              </div>
            )}
            
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Package className="w-4 h-4 mr-2 text-purple-600" />
                {t('adminAddProduct.productName')} *
              </label>
              <input 
                type="text"
                value={product.name} 
                onChange={e => setProduct({ ...product, name: e.target.value })} 
                required 
                className={`w-full p-4 border rounded-xl focus:ring-2 transition-all duration-200 ${
                  errors.name 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-slate-300 focus:border-purple-500 focus:ring-purple-200'
                }`}
                placeholder={t('adminAddProduct.productNamePlaceholder')}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-purple-600" />
                {t('adminAddProduct.description')}
              </label>
              <textarea 
                value={product.description} 
                onChange={e => setProduct({ ...product, description: e.target.value })} 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 min-h-[120px]"
                placeholder={t('adminAddProduct.descriptionPlaceholder')}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                {t('adminAddProduct.company')} *
              </label>
              {isLoadingCompanies ? (
                <div className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 text-slate-500 animate-shimmer">
                  {t('adminAddProduct.loadingCompanies')}...
                </div>
              ) : (
                <select
                  value={product.company}
                  onChange={e => setProduct({ ...product, company: e.target.value })}
                  className={`w-full p-4 border rounded-xl focus:ring-2 transition-all duration-200 bg-white ${
                    errors.company 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-300 focus:border-purple-500 focus:ring-purple-200'
                  }`}
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                  {t('adminAddProduct.price')} *
                </label>
                <input 
                  type="number" 
                  value={product.price} 
                  onChange={e => setProduct({ ...product, price: e.target.value })} 
                  required 
                  className={`w-full p-4 border rounded-xl focus:ring-2 transition-all duration-200 ${
                    errors.price 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-300 focus:border-purple-500 focus:ring-purple-200'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Stock</label>
                <input 
                  type="number" 
                  value={product.stock} 
                  onChange={e => setProduct({ ...product, stock: e.target.value })} 
                  className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  placeholder="100"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 animate-slideInRight">
            {/* Product Preview */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover-lift">
              <h3 className="font-semibold text-slate-700 mb-4 text-center">{t('adminAddProduct.preview')}</h3>
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="mb-4">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center animate-scaleIn">
                    <span className="text-white font-bold text-2xl">
                      {product.name ? product.name.charAt(0).toUpperCase() : t('adminAddProduct.previewInitial')}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-center mb-2">{product.name || t('adminAddProduct.previewName')}</h4>
                <p className="text-sm text-slate-600 text-center mb-3">{product.description || t('adminAddProduct.previewDescription')}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                    {companies.find(c => c.id === product.company)?.name?.toUpperCase() || product.company.toUpperCase()}
                  </span>
                  <span className="font-bold text-purple-600">
                    {product.price || "0.00"} da
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4 animate-fadeInUp">
          <button 
            type="button"
            onClick={() => navigate(createPageUrl("admin"))}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-200 font-medium"
          >
            {t('common.cancel')}
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 group"
          >
            {isSubmitting ? (
              <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>{t('adminAddProduct.creating')}</span></>
            ) : (
              <><Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /><span>{t('adminAddProduct.createButton')}</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
