import React, { useState, useEffect } from "react";
import { Product, UserWishlist, User } from "../entities/all";
import ProductCard from "../components/shared/ProductCard";
import { Button } from "../components/ui/button";


export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);


  useEffect(() => {
    async function loadUserAndWishlist() {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        const wishlistItems = await UserWishlist.filter({ user_email: currentUser.email });
        const productIds = wishlistItems.map(item => item.product_id);
        if (productIds.length > 0) {
          const products = await Promise.all(
            productIds.map(async id => (await Product.filter({ id }, '', 1))[0])
          );
          setWishlistProducts(products.filter(Boolean));
        }
      } catch (e) { /* not logged in */ }
      finally {
        setIsLoading(false);
      }
    }
    loadUserAndWishlist();
  }, []);


  if (isLoading) return <div className="text-center p-10">Loading...</div>;


  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-blue-500 font-bold">U</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Welcome!</h2>
        <p className="text-lg text-slate-600 mb-8">Please log in to see your personal wishlist</p>
        <Button 
          onClick={() => User.loginWithRedirect(window.location.href)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Log In
        </Button>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
          ♥ Your Wishlist
        </h1>
        <p className="text-lg text-slate-600">Items you've saved for later</p>
      </div>
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-slate-400">♡</span>
          </div>
          <p className="text-xl text-slate-600 mb-4">Your wishlist is empty</p>
          <p className="text-slate-500 mb-8">Start adding products you love!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
