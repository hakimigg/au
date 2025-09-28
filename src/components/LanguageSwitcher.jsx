import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Available languages
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Save language preference to localStorage
    localStorage.setItem('i18nextLng', lng);
  };

  // Check if we're in the admin panel
  const isAdminPanel = window.location.pathname.includes('/admin');

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
            isAdminPanel
              ? currentLanguage === lang.code
                ? 'bg-blue-600 text-white font-semibold shadow-md'
                : 'bg-white text-blue-600 font-medium hover:bg-gray-100'
              : currentLanguage === lang.code
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold shadow-md'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
          }`}
          aria-label={`Switch to ${lang.name}`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
