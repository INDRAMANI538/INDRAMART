import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative pt-[100%] bg-gray-100">
          <img
            src={product.imageURL}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover object-center"
          />
          
          {product.featured && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</h3>
          <h2 className="mt-1 text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h2>
          
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</p>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
          
          {product.stock <= 5 && product.stock > 0 ? (
            <p className="mt-2 text-sm text-orange-600">Only {product.stock} left!</p>
          ) : product.stock === 0 ? (
            <p className="mt-2 text-sm text-red-600">Out of stock</p>
          ) : null}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;