import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from 'react-i18next';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { t } = useTranslation();

  const adminNavigation = [
    { nameKey: "admin.dashboard", url: createPageUrl("admin") },
    { nameKey: "admin.addProduct", url: createPageUrl("admin/add-product") },
    { nameKey: "admin.manageProducts", url: createPageUrl("admin/products") },
    { nameKey: "admin.addCompany", url: createPageUrl("admin/add-company") },
    { nameKey: "admin.manageCompanies", url: createPageUrl("admin/companies") },
    { nameKey: "admin.backToSite", url: createPageUrl("Home") }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("admin")} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Admin Panel
                </h1>
              </div>
            </Link>

            <nav className="hidden md:flex space-x-1">
              {adminNavigation.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.nameKey}
                    to={item.url}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg transform scale-105'
                        : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'
                    }`}
                  >
                    <span>{t(item.nameKey)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">{children}</main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="flex justify-around py-3">
          {adminNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.url);
            return (
              <Link
                key={item.nameKey}
                to={item.url}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-white bg-white/20 shadow-md transform scale-105' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mb-1 ${
                  isActive ? 'bg-white text-purple-600' : 'bg-white/20 text-white'
                }`}>
                  {t(item.nameKey).charAt(0)}
                </div>
                <span className="text-xs font-medium">{t(item.nameKey).split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="h-20 md:hidden"></div>
    </div>
  );
}
