import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ShoppingCart, Eye, Heart } from "lucide-react";

export default function ProductCard({ product }) {
  // Generate a subtle gradient based on the product name for consistent colors
  const nameHash = product.name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const gradientColors = [
    'from-blue-400 to-blue-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
    'from-violet-400 to-violet-600',
    'from-cyan-400 to-cyan-600',
  ];
  const gradient = gradientColors[Math.abs(nameHash) % gradientColors.length];

  return (
    <Link 
      to={createPageUrl(`ProductDetail/${product.id}`)} 
      className="block h-full group hover-lift"
    >
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 hover:border-amber-200 animate-fadeInUp hover-glow">
        {/* Image container */}
        <div className="relative pt-[100%] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="absolute inset-0 flex items-center justify-center">
            {product.photos && product.photos.length > 0 ? (
              <img 
                src={product.photos[0]} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg animate-scaleIn`}>
                <span className="text-white font-bold text-2xl">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <button className="bg-white text-slate-700 p-2 rounded-full shadow-lg hover:bg-amber-500 hover:text-white transition-all duration-200">
                <Eye className="w-4 h-4" />
              </button>
              <button className="bg-white text-slate-700 p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Price badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {product.price} da
          </div>
        </div>

        {/* Product info */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-full">
                {product.company}
              </span>
              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                In Stock
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
            
            <p className="text-sm text-slate-600 line-clamp-2 mb-6 leading-relaxed">
              {product.description}
            </p>
          </div>
          
          <button 
            className="mt-auto w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl text-sm transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
            onClick={(e) => e.preventDefault()}
          >
            <ShoppingCart className="w-4 h-4 group-hover:animate-bounce-custom" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
