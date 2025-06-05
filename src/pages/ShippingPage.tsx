import React from 'react';
import { Truck, Clock, Globe, DollarSign } from 'lucide-react';

const ShippingPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>
        
        {/* Shipping Methods */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Shipping Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Standard Shipping</h3>
              <p className="text-gray-600 mb-2">3-5 business days</p>
              <p className="text-sm text-gray-500">Free for orders over ₹500</p>
              <p className="text-sm text-gray-500">₹50 for orders under ₹500</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Express Shipping</h3>
              <p className="text-gray-600 mb-2">1-2 business days</p>
              <p className="text-sm text-gray-500">₹14.99 flat rate</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Next Day Delivery</h3>
              <p className="text-gray-600 mb-2">Next business day</p>
              <p className="text-sm text-gray-500">₹100 flat rate</p>
              <p className="text-sm text-gray-500">Order by 2 PM for same-day dispatch</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">International Shipping</h3>
              <p className="text-gray-600 mb-2">7-14 business days</p>
              <p className="text-sm text-gray-500">Rates calculated at checkout</p>
            </div>
          </div>
        </div>
        
        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Truck className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
            <p className="text-gray-600">
              Enjoy free standard shipping on all orders over ₹50 within the continental US.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Clock className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
            <p className="text-gray-600">
              Most orders are processed and shipped within 24 hours of purchase.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Globe className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Worldwide Delivery</h3>
            <p className="text-gray-600">
              We ship to over 100 countries worldwide with reliable tracking.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <DollarSign className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Competitive Rates</h3>
            <p className="text-gray-600">
              We partner with major carriers to offer you the best shipping rates.
            </p>
          </div>
        </div>
        
        {/* Shipping Policy */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Shipping Policy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Order Processing</h3>
              <p className="text-gray-600">
                Orders are typically processed within 24 hours of purchase. You'll receive
                a confirmation email with tracking information once your order ships.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Delivery Times</h3>
              <p className="text-gray-600">
                Delivery times vary based on shipping method and destination. Standard
                shipping within the US typically takes 3-5 business days. International
                shipping can take 7-14 business days.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">International Orders</h3>
              <p className="text-gray-600">
                International customers are responsible for any customs duties, taxes,
                or fees imposed by their country. These charges are not included in
                the shipping cost.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Tracking Orders</h3>
              <p className="text-gray-600">
                All orders include tracking information. You can track your order
                through your account dashboard or using the tracking number provided
                in your shipping confirmation email.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">What if my order is delayed?</h3>
              <p className="text-gray-600">
                While rare, delays can occur due to weather, customs, or other factors.
                Contact our customer service team if your order is significantly delayed.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Can I change my shipping address?</h3>
              <p className="text-gray-600">
                You can change your shipping address before your order ships. Contact
                customer service immediately if you need to update your address.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Do you ship to PO boxes?</h3>
              <p className="text-gray-600">
                Yes, we ship to PO boxes using USPS. Note that some shipping methods
                may not be available for PO box addresses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;