import React, { useState, useEffect } from "react";
import { Product, User } from "../entities/all";
import { supabaseHelpers } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import PhotoUpload from "../components/ui/PhotoUpload";


export default function AddProductPage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: "", description: "", company: "nokia", price: 0 });
  const [photos, setPhotos] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('AddProductPage form submitted');
    console.log('Product data:', product);
    
    // Basic validation
    if (!product.name || !product.name.trim()) {
      alert('Please enter a product name');
      return;
    }
    
    if (isNaN(Number(product.price)) || Number(product.price) < 0) {
      alert('Please enter a valid price');
      return;
    }
    
    try {
      await User.me();
    } catch (err) {
      await User.loginWithRedirect(window.location.href);
      return;
    }
    setIsSubmitting(true);
    try {
      // Convert photos to base64 strings for storage
      const photoUrls = photos.map(photo => photo.preview);
      
      const productToCreate = { 
        ...product, 
        price: Number(product.price),
        photos: photoUrls
      };
      console.log('Creating product with data:', productToCreate);
      
      const newProduct = await Product.create(productToCreate);
      navigate(createPageUrl(`ProductDetail/${newProduct.id}` ));
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Error creating product: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">Add a New Product</h1>
        <p className="text-lg text-slate-600">Share your amazing product with the world</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-10 border border-slate-200 rounded-2xl shadow-xl">
        {/* Photo Upload Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Product Photos</label>
          <PhotoUpload 
            onPhotosChange={setPhotos}
            maxFiles={5}
            maxSizeInMB={5}
            existingPhotos={photos}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
          <Input 
            value={product.name} 
            onChange={e => setProduct({ ...product, name: e.target.value })} 
            required 
            className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            placeholder="Enter product name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
          <Textarea 
            value={product.description} 
            onChange={e => setProduct({ ...product, description: e.target.value })} 
            className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 min-h-[120px]"
            placeholder="Describe your product"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
            {isLoadingCompanies ? (
              <div className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 text-slate-500">
                Loading companies...
              </div>
            ) : (
              <select
                value={product.company}
                onChange={e => setProduct({ ...product, company: e.target.value })}
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
              >
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Price (da)</label>
            <Input 
              type="number" 
              value={product.price} 
              onChange={e => setProduct({ ...product, price: e.target.value })} 
              required 
              className="w-full p-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
        >
          {isSubmitting ? "Creating Product..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
