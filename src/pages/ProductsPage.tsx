import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('latest');
  const [categories, setCategories] = useState<string[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const PRODUCTS_PER_PAGE = 12;

  // Parse the query parameters whenever they change
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('search') || '';
    setSearchQuery(searchParam);
  }, [location.search]);

  // Function to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        const uniqueCategories = new Set<string>();
        snapshot.forEach((doc) => {
          const product = doc.data() as Product;
          if (product.category) {
            uniqueCategories.add(product.category);
          }
        });
        
        setCategories(Array.from(uniqueCategories).sort());
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Function to fetch products
  const fetchProducts = async (isNewQuery = true) => {
    try {
      setIsLoading(true);
      
      const productsRef = collection(db, 'products');
      let productQuery: any = query(productsRef);
      
      // Apply category filter
      if (selectedCategory) {
        productQuery = query(productQuery, where('category', '==', selectedCategory));
      }
      
      // Apply search filter if provided
      if (searchQuery) {
        // For this basic implementation, we're doing a simple contains check
        // In a real application, you might want to use a more sophisticated search solution
        productQuery = query(
          productQuery, 
          where('name', '>=', searchQuery), 
          where('name', '<=', searchQuery + '\uf8ff')
        );
      }
      
      // Apply sorting
      if (sortOption === 'priceAsc') {
        productQuery = query(productQuery, orderBy('price', 'asc'));
      } else if (sortOption === 'priceDesc') {
        productQuery = query(productQuery, orderBy('price', 'desc'));
      } else {
        // Default to latest
        productQuery = query(productQuery, orderBy('createdAt', 'desc'));
      }
      
      // Apply pagination
      productQuery = query(productQuery, limit(PRODUCTS_PER_PAGE));
      
      if (!isNewQuery && lastVisible) {
        productQuery = query(productQuery, startAfter(lastVisible));
      }
      
      const snapshot = await getDocs(productQuery);
      
      // Check if there are more products to load
      setHasMore(snapshot.size === PRODUCTS_PER_PAGE);
      
      // Update last visible document for pagination
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastVisible(lastDoc || null);
      
      const fetchedProducts: Product[] = [];
      snapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      if (isNewQuery) {
        setProducts(fetchedProducts);
      } else {
        setProducts((prev) => [...prev, ...fetchedProducts]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(true);
  }, [selectedCategory, sortOption, searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(true);
  };
  
  const loadMoreProducts = () => {
    fetchProducts(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      {/* Mobile filter toggle */}
      <button
        className="md:hidden flex items-center justify-between w-full bg-white p-4 rounded-lg shadow mb-4"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          <span>Filters</span>
        </div>
        {isFilterOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-6`}>
          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-3">Search</h3>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Search size={18} className="text-gray-500" />
              </button>
            </form>
          </div>
          
          {/* Categories */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="category-all"
                  name="category"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="category-all" className="ml-2 text-gray-700">
                  All Categories
                </label>
              </div>
              
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="radio"
                    id={`category-${category}`}
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`category-${category}`} className="ml-2 text-gray-700">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sort options */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-3">Sort By</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sort-latest"
                  name="sort"
                  checked={sortOption === 'latest'}
                  onChange={() => setSortOption('latest')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sort-latest" className="ml-2 text-gray-700">
                  Latest
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sort-price-asc"
                  name="sort"
                  checked={sortOption === 'priceAsc'}
                  onChange={() => setSortOption('priceAsc')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sort-price-asc" className="ml-2 text-gray-700">
                  Price: Low to High
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sort-price-desc"
                  name="sort"
                  checked={sortOption === 'priceDesc'}
                  onChange={() => setSortOption('priceDesc')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sort-price-desc" className="ml-2 text-gray-700">
                  Price: High to Low
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product grid */}
        <div className="flex-1">
          {isLoading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMoreProducts}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-xl text-gray-600">No products found.</p>
              <p className="mt-2 text-gray-500">Try changing your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;