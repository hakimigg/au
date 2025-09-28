import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseHelpers } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function ProductDetailPage() {
  // Updated: Specifications section completely removed
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);




  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const productData = await supabaseHelpers.getProduct(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id]);




  const nextPhoto = () => {
    if (product?.photos && product.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % product.photos.length);
    }
  };

  const prevPhoto = () => {
    if (product?.photos && product.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + product.photos.length) % product.photos.length);
    }
  };


  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (!product) return <div className="text-center p-10">Product not found.</div>;


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-8 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
      >
        ← Back
      </Button>
      <div className="grid md:grid-cols-2 gap-12">
        {/* Photo Gallery */}
        <div className="relative">
          <div className="border border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden min-h-[400px]">
            {product.photos && product.photos.length > 0 ? (
              <>
                <img 
                  src={product.photos[currentPhotoIndex]} 
                  alt={`${product.name} - Photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation arrows for multiple photos */}
                {product.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Photo indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {product.photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-12">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-4xl">{product.name.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Thumbnail strip for multiple photos */}
          {product.photos && product.photos.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
              {product.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentPhotoIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={photo} 
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">{product.name}</h1>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">{product.description}</p>
          <div className="mb-6 text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{product.price} da</div>
          <div className="flex flex-col gap-3 mb-4">
            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <span className="font-medium text-slate-700">Company:</span>
              <span className="ml-2 text-slate-600 font-semibold">{product.company.toUpperCase()}</span>
            </div>
            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <span className="font-medium text-slate-700">Stock:</span>
              <span className="ml-2 text-slate-600 font-semibold">{product.stock} units</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags?.map(tag => <div key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full font-medium">{tag}</div>)}
          </div>
          
          {product.stock > 0 ? (
            <Button className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2">
              Add to Cart
            </Button>
          ) : (
            <div className="w-full py-4 px-6 text-center bg-red-50 border border-red-200 text-red-700 font-medium rounded-lg">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
