import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { supabaseHelpers } from "../../lib/supabase";
import { useTranslation } from "react-i18next";
import { Building2, FileText, Upload, X, Check, Globe } from "lucide-react";

export default function AdminAddCompany() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [company, setCompany] = useState({ 
    name: "", 
    description: "", 
    logo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(t('adminAddCompany.errors.invalidImage'));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(t('adminAddCompany.errors.imageTooLarge'));
        return;
      }
      
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setCompany({ ...company, logo: e.target.result });
      };
      reader.readAsDataURL(file);
      setError(''); // Clear any previous errors
    }
  };

  const removePhoto = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setCompany({ ...company, logo: null });
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!company.name || !company.name.trim()) {
      newErrors.name = t('adminAddCompany.errors.nameRequired');
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
    setError("");
    setErrors({});
    
    try {
      const newCompany = await supabaseHelpers.createCompany(company);
      setSuccessMessage(t('adminAddCompany.success', { companyName: newCompany.name }));
      setCompany({ name: "", description: "", logo: null });
      setLogoPreview(null);
      setLogoFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        navigate(createPageUrl("admin/companies"));
      }, 2000);
      
    } catch (error) {
      console.error("Error creating company:", error);
      setError(error.message || t('adminAddCompany.errors.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fadeInUp">
          {t('adminAddCompany.title')}
        </h1>
        <p className="text-lg text-slate-600 animate-slideInLeft">{t('adminAddCompany.subtitle')}</p>
      </div>

      {successMessage && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg animate-scaleIn success-checkmark">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-600 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg animate-scaleIn">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div className="animate-slideInLeft">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border border-slate-200 rounded-2xl shadow-lg">
            {/* Company Logo */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Upload className="w-4 h-4 mr-2 text-purple-600" />
                {t('adminAddCompany.logo')}
              </label>
              <div className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors duration-200 hover-lift">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <svg className="w-8 h-8 text-slate-400 animate-bounce-custom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="text-center">
                        <span className="font-medium text-purple-600">{t('adminAddCompany.form.clickToUpload')}</span>
                        <span className="text-slate-500"> {t('adminAddCompany.form.orDragAndDrop')}</span>
                      </div>
                      <p className="text-xs text-slate-400">{t('adminAddCompany.form.fileTypes')}</p>
                    </div>
                  </label>
                </div>
                {/* Photo Preview */}
                {logoPreview && (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt={t('adminAddCompany.form.logoPreview')}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200 animate-scaleIn"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 hover-lift"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                {t('adminAddCompany.companyName')} *
              </label>
              <input 
                type="text"
                value={company.name} 
                onChange={e => setCompany({ ...company, name: e.target.value })} 
                required 
                className={`w-full p-4 border rounded-xl focus:ring-2 transition-all duration-200 ${
                  errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-purple-500 focus:ring-purple-200'
                }`}
                placeholder={t('adminAddCompany.companyNamePlaceholder')}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-purple-600" />
                {t('adminAddCompany.description')}
              </label>
              <textarea 
                value={company.description} 
                onChange={e => setCompany({ ...company, description: e.target.value })} 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 min-h-[120px]"
                placeholder={t('adminAddCompany.descriptionPlaceholder')}
              />
            </div>

            {/* Website */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Globe className="w-4 h-4 mr-2 text-purple-600" />
                Website
              </label>
              <input 
                type="url"
                value={company.website || ''} 
                onChange={e => setCompany({ ...company, website: e.target.value })} 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder="https://example.com"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 group hover-lift"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t('adminAddCompany.creating')}</span>
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>{t('adminAddCompany.submit')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="animate-slideInRight">
          <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-lg hover-lift">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{t('adminAddCompany.preview')}</h3>
            <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-white hover:shadow-md transition-all duration-300">
              {/* Logo Preview */}
              <div className="mb-4 flex justify-center">
                {logoPreview ? (
                    <img 
                    src={logoPreview} 
                    alt={t('adminAddCompany.form.companyLogoPreview')}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200 animate-scaleIn"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center animate-scaleIn">
                    <span className="text-white font-bold text-2xl">
                      {company.name ? company.name.charAt(0).toUpperCase() : t('adminAddCompany.previewDefault.initial')}
                    </span>
                  </div>
                )}
              </div>
              
              <h4 className="font-bold text-slate-800 text-center mb-2">
                {company.name || t('adminAddCompany.previewDefault.name')}
              </h4>
              <p className="text-sm text-slate-600 text-center mb-3">
                {company.description || t('adminAddCompany.previewDefault.description')}
              </p>
              {company.website && (
                <div className="text-center">
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
