import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../../lib/supabase";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCompanies: 0,
    recentProducts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        // Load both products and companies from their respective sources
        const [products, companies] = await Promise.all([
          supabaseHelpers.getProducts(),
          supabaseHelpers.getCompanies()
        ]);
        
        const recentProducts = products.slice(0, 5);
        
        setStats({
          totalProducts: products.length,
          totalCompanies: companies.length, // Now using actual companies table
          recentProducts
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      title: "admin.totalProducts",
      value: stats.totalProducts,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "admin.companies",
      value: stats.totalCompanies,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600"
    },
    {
      title: "admin.recentProducts",
      value: stats.recentProducts.length,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600"
    }];
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {t('admin.dashboard')}
        </h1>
        <p className="text-lg text-slate-600">{t('admin.manageYourStore')}</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{t('admin.errorLoadingDashboard')} {error}</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t(stat.title)}</h3>
                <p className="text-4xl font-bold">{isLoading ? "..." : stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-xl">
                  {stat.title.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('admin.quickActions')}</h2>
          <div className="space-y-3">
            <Link
              to={createPageUrl("admin/add-product")}
              className="block w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 text-center"
            >
              {t('admin.addNewProduct')}
            </Link>
            <Link
              to={createPageUrl("admin/products")}
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-center"
            >
              {t('admin.manageProducts')}
            </Link>
            <Link
              to={createPageUrl("Products")}
              className="block w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 text-center"
            >
              {t('admin.viewPublicSite')}
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('admin.recentProducts')}</h2>
          {isLoading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-lg p-3 animate-pulse h-16"></div>
              ))}
            </div>
          ) : stats.recentProducts.length === 0 ? (
            <p className="text-slate-500 text-center py-8">{t('admin.noProductsYet')}</p>
          ) : (
            <div className="space-y-3">
              {stats.recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <div>
                    <h3 className="font-semibold text-slate-800">{product.name}</h3>
                    <p className="text-sm text-slate-600">{product.company.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{product.price} {t('common.currency')}</p>
                    <p className="text-xs text-slate-500">{product.stock} {t('admin.inStock')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
