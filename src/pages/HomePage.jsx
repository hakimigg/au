import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../lib/supabase";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import ProductCard from "../components/shared/ProductCard";
import { useTranslation } from 'react-i18next';
import { ArrowRight, Star, Zap, Shield, Truck } from "lucide-react";


export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const { t } = useTranslation();
  
  // Conditional asset path for local vs production
  const assetPath = import.meta.env.PROD ? "/testt" : "";


  useEffect(() => {
    async function loadData() {
      try {
        // Load products and companies in parallel
        const [fetchedProducts, fetchedCompanies] = await Promise.all([
          supabaseHelpers.getProducts(),
          supabaseHelpers.getCompanies()
        ]);
        
        console.log('🏠 HomePage - Fetched companies:', fetchedCompanies);
        setProducts(fetchedProducts.slice(0, 8)); // Get first 8 products
        setCompanies(fetchedCompanies.slice(0, 4)); // Get first 4 companies
        console.log('🏠 HomePage - Set companies:', fetchedCompanies.slice(0, 4));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
        setCompaniesLoading(false);
      }
    }
    loadData();
  }, []);


  return (
    <div>
      <section className="relative py-32 text-center overflow-hidden min-h-screen flex items-center gradient-animate">
        {/* Background Image - Your chosen modern interior photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('${assetPath}/assets/background-image.jpeg'), linear-gradient(135deg, #d4a574 0%, #c49968 50%, #b8935c 100%)`
          }}
        ></div>
        
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 animate-fadeInUp">
          <div className="mb-6 flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
              <span className="text-white/90 text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                Premium Quality Products
              </span>
            </div>
          </div>
          <h1 className="text-7xl font-light text-white mb-8 drop-shadow-2xl tracking-wide animate-slideInLeft">
            {t('home.title')}
          </h1>
          <p className="text-2xl text-white mb-12 leading-relaxed opacity-95 font-light animate-slideInRight">
            {t('home.subtitle')}
          </p>
          <Link 
            to={createPageUrl("Products")} 
            className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-4 px-10 rounded-full hover:from-amber-700 hover:to-amber-800 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl group animate-scaleIn"
          >
            <span>{t('home.cta')}</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Fast Delivery</h3>
              <p className="text-white/80 text-sm">Quick and reliable shipping</p>
            </div>
            <div className="text-center animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-white/80 text-sm">100% authentic products</p>
            </div>
            <div className="text-center animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Free Shipping</h3>
              <p className="text-white/80 text-sm">On orders over 5000 DA</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto bg-gradient-to-b from-stone-50 to-amber-50 animate-fadeInUp">
        <h2 className="text-5xl font-light text-stone-800 text-center mb-16 tracking-wide animate-slideInLeft">{t('home.collections')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {companiesLoading ? (
            // Loading skeleton for companies
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="relative p-12 border border-stone-200 rounded-3xl bg-white/90 backdrop-blur-sm overflow-hidden min-h-[200px] flex items-center justify-center loading-skeleton">
                <div className="text-center">
                  <div className="h-8 bg-stone-200 rounded w-32 mx-auto mb-4"></div>
                  <div className="w-20 h-0.5 bg-stone-200 mx-auto"></div>
                </div>
              </div>
            ))
          ) : (
            companies.map((co) => (
              <Link key={co.id} to={`${createPageUrl("Products")}?company=${co.id}` }>
                <div className="relative p-12 border border-stone-200 rounded-3xl hover:shadow-2xl hover:border-amber-300 transition-all duration-500 bg-white/90 hover:transform hover:scale-105 backdrop-blur-sm overflow-hidden min-h-[200px] flex items-center justify-center hover-lift group animate-scaleIn">
                  {/* Background Logo - Only if logo exists */}
                  {co.logo && (
                    <div 
                      className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-8 grayscale filter blur-[0.5px]"
                      style={{
                        backgroundImage: `url('${co.logo}')`,
                        backgroundSize: '50%'
                      }}
                    ></div>
                  )}
                  
                  {/* Company-specific background patterns */}
                  {!co.logo && (
                    <div className="absolute inset-0 opacity-8">
                      {/* Nokia - Tech/Network pattern */}
                      {co.name === "Nokia" && (
                        <>
                          <div className="absolute top-6 left-6 w-12 h-12 border-2 border-blue-300 rounded-lg rotate-12"></div>
                          <div className="absolute top-12 right-8 w-8 h-8 border border-blue-400 rounded-full"></div>
                          <div className="absolute bottom-8 left-12 w-6 h-6 bg-blue-200 rounded-full"></div>
                          <div className="absolute bottom-6 right-6 w-10 h-10 border-2 border-blue-300 rounded-lg -rotate-12"></div>
                        </>
                      )}
                      
                      {/* Samsung - Modern/Tech pattern */}
                      {co.name === "Samsung" && (
                        <>
                          <div className="absolute top-4 left-8 w-14 h-6 border-2 border-slate-300 rounded-full"></div>
                          <div className="absolute top-10 right-6 w-8 h-8 border border-slate-400 rounded-lg rotate-45"></div>
                          <div className="absolute bottom-10 left-6 w-10 h-4 bg-slate-200 rounded-full"></div>
                          <div className="absolute bottom-4 right-8 w-12 h-12 border border-slate-300 rounded-full"></div>
                        </>
                      )}
                      
                      {/* Apple - Minimalist/Clean pattern */}
                      {co.name === "Apple" && (
                        <>
                          <div className="absolute top-8 left-8 w-10 h-10 border-2 border-gray-300 rounded-full"></div>
                          <div className="absolute top-6 right-10 w-6 h-6 bg-gray-200 rounded-full"></div>
                          <div className="absolute bottom-8 left-10 w-8 h-8 border border-gray-300 rounded-full"></div>
                          <div className="absolute bottom-6 right-8 w-12 h-12 border border-gray-200 rounded-full"></div>
                        </>
                      )}
                      
                      {/* Default pattern for other companies */}
                      {!["Nokia", "Samsung", "Apple"].includes(co.name) && (
                        <>
                          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-amber-400 rounded-full"></div>
                          <div className="absolute top-8 right-8 w-6 h-6 border-2 border-stone-400 rounded-full"></div>
                          <div className="absolute bottom-6 left-8 w-4 h-4 bg-amber-300 rounded-full"></div>
                          <div className="absolute bottom-8 right-6 w-10 h-10 border border-stone-300 rounded-full"></div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Company Name Overlay */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-4xl font-light text-stone-800 tracking-wider drop-shadow-sm group-hover:text-amber-600 transition-colors duration-300">
                      {co.name.toUpperCase()}
                    </h3>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4 group-hover:w-32 transition-all duration-300"></div>
                  </div>
                  
                  {/* Subtle gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent group-hover:from-amber-50/20 transition-all duration-300"></div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-stone-100 to-amber-100 animate-fadeInUp">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-light text-stone-800 text-center mb-16 tracking-wide animate-slideInRight">{t('home.featured')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {isLoading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="border border-stone-200 rounded-2xl p-8 h-96 bg-gradient-to-br from-stone-50 to-amber-50 loading-skeleton shadow-lg"></div>
                ))
              : products.map((product, index) => <div key={product.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}><ProductCard product={product} /></div>)}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-stone-100 animate-fadeInUp">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-light text-stone-800 mb-8 tracking-wide animate-slideInLeft">{t('home.connect')}</h2>
          <p className="text-xl text-stone-600 mb-16 font-light animate-slideInRight">{t('home.connectSubtitle')}</p>
          
          <div className="flex justify-center items-center space-x-8 animate-scaleIn">
            {/* Instagram */}
            <a href="#" className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 hover-glow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>

            {/* Twitter */}
            <a href="#" className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 hover-glow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
            </a>

            {/* Phone */}
            <a href="tel:+15551234567" className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 hover-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
            </a>

            {/* LinkedIn */}
            <a href="#" className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 hover-glow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </a>

            {/* Facebook */}
            <a href="#" className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 hover-glow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:hello@testwebsite.com" className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 hover-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-20 animate-fadeInUp">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-light mb-6 tracking-wide text-amber-100 animate-slideInLeft">{t('home.footerTitle')}</h3>
          <p className="text-stone-300 mb-12 leading-relaxed text-lg font-light max-w-2xl mx-auto">
            {t('home.footerSubtitle')}
          </p>
          
          <div className="border-t border-stone-700 pt-8">
            <p className="text-stone-400 font-light">{t('home.footerCopyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
