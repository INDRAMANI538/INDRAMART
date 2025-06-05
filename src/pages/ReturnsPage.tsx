import React from 'react';
import { RefreshCw, Package, CheckCircle, HelpCircle } from 'lucide-react';

const ReturnsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Returns & Exchanges</h1>
        
        {/* Return Policy Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Our Return Policy</h2>
          <p className="text-gray-600 mb-6">
            We want you to be completely satisfied with your purchase. If you're not
            happy with your order, we accept returns within 30 days of delivery for a
            full refund or exchange.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">30-Day Returns</h3>
              <p className="text-sm text-gray-500">
                Return any item within 30 days of delivery
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Free Returns</h3>
              <p className="text-sm text-gray-500">
                We cover return shipping on defective items
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Easy Process</h3>
              <p className="text-sm text-gray-500">
                Simple online return authorization
              </p>
            </div>
          </div>
        </div>
        
        {/* Return Process */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Return Process</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <span className="block w-6 h-6 text-blue-600 text-center font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-medium mb-2">Initiate Your Return</h3>
                <p className="text-gray-600">
                  Log into your account and go to your orders. Select the item you
                  want to return and follow the prompts to generate a return authorization.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <span className="block w-6 h-6 text-blue-600 text-center font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-medium mb-2">Package Your Return</h3>
                <p className="text-gray-600">
                  Pack the item securely in its original packaging if possible. Include
                  all tags, accessories, and the return form in your package.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <span className="block w-6 h-6 text-blue-600 text-center font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-medium mb-2">Ship Your Return</h3>
                <p className="text-gray-600">
                  Use the provided return shipping label or send it to our returns
                  address. We recommend using a tracked shipping service.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <span className="block w-6 h-6 text-blue-600 text-center font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-medium mb-2">Refund Processing</h3>
                <p className="text-gray-600">
                  Once we receive and inspect your return, we'll process your refund
                  within 3-5 business days. You'll receive an email confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Return Conditions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Return Conditions</h2>
          <div className="space-y-4">
            <p className="text-gray-600">To be eligible for a return, your item must be:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Unused and in the same condition that you received it</li>
              <li>In the original packaging with all tags attached</li>
              <li>Accompanied by the original receipt or proof of purchase</li>
              <li>Returned within 30 days of delivery</li>
            </ul>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Non-Returnable Items</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Personal care items</li>
                <li>Intimate apparel</li>
                <li>Final sale items</li>
                <li>Gift cards</li>
                <li>Customized or personalized items</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Need Help? */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to help you with any questions about
            returns or exchanges.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;