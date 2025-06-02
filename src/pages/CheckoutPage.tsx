import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=checkout');
    }
  }, [currentUser, navigate]);
  
  // Redirect if cart is empty
  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      toast.error('Your cart is empty');
    }
  }, [cart, navigate]);
  
  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateShippingInfo = () => {
    const { fullName, street, city, state, postalCode, country } = shippingInfo;
    if (!fullName || !street || !city || !state || !postalCode || !country) {
      toast.error('Please fill in all required shipping fields');
      return false;
    }
    return true;
  };
  
  const validatePaymentInfo = () => {
    const { cardNumber, cardName, expiryDate, cvv } = paymentInfo;
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast.error('Please fill in all required payment fields');
      return false;
    }
    
    // Basic validation for card number (16 digits)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Invalid card number');
      return false;
    }
    
    // Basic validation for CVV (3 or 4 digits)
    if (cvv.length < 3 || cvv.length > 4) {
      toast.error('Invalid CVV');
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (currentStep === 'shipping') {
      if (validateShippingInfo()) {
        setCurrentStep('payment');
      }
    } else if (currentStep === 'payment') {
      if (validatePaymentInfo()) {
        setCurrentStep('confirmation');
      }
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment');
    }
  };
  
  const handlePlaceOrder = async () => {
    if (!currentUser) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create order in Firestore
      const orderData = {
        userId: currentUser.uid,
        items: cart,
        total: cartTotal,
        shippingAddress: shippingInfo,
        paymentMethod: 'Credit Card',
        status: 'pending',
        createdAt: Date.now()
      };
      
      // Add order to orders collection
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Add order to user's orders subcollection
      await setDoc(
        doc(db, 'users', currentUser.uid, 'orders', orderRef.id),
        {
          orderId: orderRef.id,
          total: cartTotal,
          status: 'pending',
          createdAt: serverTimestamp()
        }
      );
      
      // Clear the cart
      clearCart();
      
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Checkout steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            <div className="h-0.5 w-16 bg-gray-200"></div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            <div className="h-0.5 w-16 bg-gray-200"></div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'confirmation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Shipping Information */}
          {currentStep === 'shipping' && (
            <div>
              <div className="flex items-center mb-6">
                <Truck className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingInfoChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={shippingInfo.phoneNumber}
                    onChange={handleShippingInfoChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={shippingInfo.street}
                    onChange={handleShippingInfoChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingInfoChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State / Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingInfoChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingInfoChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingInfoChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}
          
          {/* Payment Information */}
          {currentStep === 'payment' && (
            <div>
              <div className="flex items-center mb-6">
                <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold">Payment Information</h2>
              </div>
              
              <div className="mb-6">
                <div className="mb-4">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentInfoChange}
                    placeholder="1234 5678 9012 3456"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentInfoChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentInfoChange}
                      placeholder="MM/YY"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentInfoChange}
                      placeholder="123"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 italic mb-8">
                This is a demo site. No real payments will be processed.
              </p>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="text-gray-700 hover:text-gray-900 font-medium py-2"
                >
                  Back to Shipping
                </button>
                
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}
          
          {/* Order Confirmation */}
          {currentStep === 'confirmation' && (
            <div>
              <div className="flex items-center mb-6">
                <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="border rounded-md p-4 mb-6">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>{shippingInfo.fullName}</p>
                <p>{shippingInfo.street}</p>
                <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}</p>
                <p>{shippingInfo.country}</p>
                {shippingInfo.phoneNumber && <p>Phone: {shippingInfo.phoneNumber}</p>}
              </div>
              
              <div className="border rounded-md p-4 mb-6">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-600" />
                  Credit Card ending in {paymentInfo.cardNumber.slice(-4)}
                </p>
              </div>
              
              <div className="border rounded-md p-4 mb-6">
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={item.imageURL} 
                          alt={item.name} 
                          className="h-16 w-16 object-cover rounded-md mr-4" 
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-600">Subtotal</p>
                    <p>${cartTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-600">Shipping</p>
                    <p>Free</p>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <p>Total</p>
                    <p>${cartTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="text-gray-700 hover:text-gray-900 font-medium py-2"
                >
                  Back to Payment
                </button>
                
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;