import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center px-4">
        <h1 className="text-8xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;