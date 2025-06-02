import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { ArrowRight, TrendingUp, Tag, Award } from 'lucide-react';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products
        const featuredQuery = query(
          collection(db, 'products'),
          where('featured', '==', true),
          limit(4)
        );
        
        // Fetch new arrivals
        const newArrivalsQuery = query(
          collection(db, 'products'),
          orderBy('createdAt', 'desc'),
          limit(8)
        );
        
        const [featuredSnapshot, newArrivalsSnapshot] = await Promise.all([
          getDocs(featuredQuery),
          getDocs(newArrivalsQuery)
        ]);
        
        const featuredItems: Product[] = [];
        featuredSnapshot.forEach((doc) => {
          featuredItems.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        const newItems: Product[] = [];
        newArrivalsSnapshot.forEach((doc) => {
          newItems.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        setFeaturedProducts(featuredItems);
        setNewArrivals(newItems);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Hero section background
  const heroBackground = "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  
  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[80vh] flex items-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Style</h1>
            <p className="text-xl mb-8">Shop the latest trends and find your perfect fit.</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trending Styles</h3>
              <p className="text-gray-600">Discover the latest fashion trends and stay ahead of the curve.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Tag className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Quality products at competitive prices, guaranteed.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Carefully selected products that meet our high standards.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No featured products available.</p>
          )}
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No new arrivals available.</p>
          )}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products and exclusive offers.
          </p>
          <form className="flex flex-col md:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none"
              required
            />
            <button 
              type="submit"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;