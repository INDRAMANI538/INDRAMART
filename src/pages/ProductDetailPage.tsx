import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { MinusCircle, PlusCircle, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const productRef = doc(db, 'products', id);
        const docSnap = await getDoc(productRef);
        
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          
          // Fetch related products from the same category
          const relatedQuery = query(
            collection(db, 'products'),
            where('category', '==', productData.category),
            where('id', '!=', id),
            limit(4)
          );
          
          const relatedSnapshot = await getDocs(relatedQuery);
          const relatedItems: Product[] = [];
          
          relatedSnapshot.forEach((doc) => {
            relatedItems.push({ id: doc.id, ...doc.data() } as Product);
          });
          
          setRelatedProducts(relatedItems);
        } else {
          console.log('No such product!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 bg-gray-200 rounded-lg h-96"></div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/products" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
        
        {/* Product details */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product image */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={product.imageURL} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Product info */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                {product.category}
              </p>
              
              <div className="border-t border-b border-gray-200 py-4 my-4">
                <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                
                {product.stock <= 5 && product.stock > 0 ? (
                  <p className="mt-2 text-sm text-orange-600">Only {product.stock} left!</p>
                ) : product.stock === 0 ? (
                  <p className="mt-2 text-sm text-red-600">Out of stock</p>
                ) : (
                  <p className="mt-2 text-sm text-green-600">In stock</p>
                )}
              </div>
              
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              {/* Quantity selector */}
              <div className="flex items-center mb-6">
                <span className="mr-3 text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <MinusCircle size={20} />
                  </button>
                  <span className="px-4 py-2 text-center w-12">{quantity}</span>
                  <button 
                    onClick={increaseQuantity}
                    disabled={product.stock <= quantity}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
                
                <button className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;