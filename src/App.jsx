import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n' // Import i18n configuration
import Layout from './Layout'
import AdminLayout from './AdminLayout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAddProduct from './pages/admin/AdminAddProduct'
import AdminProducts from './pages/admin/AdminProducts'
import AdminAddCompany from './pages/admin/AdminAddCompany'
import AdminManageCompanies from './pages/admin/AdminManageCompanies'

function App() {
  // Handle double /testt/testt URLs by redirecting to correct path
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/testt/testt/')) {
      const correctedPath = currentPath.replace('/testt/testt/', '/testt/');
      console.log('Redirecting from:', currentPath, 'to:', correctedPath);
      window.location.replace(correctedPath);
    }
  }, []);
  
  // Conditional basename: use /testt for GitHub Pages, empty for local development
  const basename = import.meta.env.PROD ? "/testt" : "";
  
  console.log('App basename:', basename);
  console.log('Current pathname:', window.location.pathname);
  console.log('Environment:', import.meta.env.PROD ? 'production' : 'development');
  
  return (
    <I18nextProvider i18n={i18n}>
      <Router basename={basename}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/Home" element={<Layout><HomePage /></Layout>} />
          <Route path="/Products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/ProductDetail/:id" element={<Layout><ProductDetailPage /></Layout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/add-product" element={<AdminLayout><AdminAddProduct /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/add-company" element={<AdminLayout><AdminAddCompany /></AdminLayout>} />
          <Route path="/admin/companies" element={<AdminLayout><AdminManageCompanies /></AdminLayout>} />
        </Routes>
      </Router>
    </I18nextProvider>
  )
}

export default App
