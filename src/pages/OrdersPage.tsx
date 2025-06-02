import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Order, CartItem } from '../types';
import { Package, ChevronDown, ChevronUp, ShoppingBag, ArrowLeft } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser, navigate]);
  
  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTotalItems = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shopping
          </Link>
        </div>
        
        <div className="flex items-center mb-8">
          <ShoppingBag className="h-6 w-6 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold">Your Orders</h1>
        </div>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link 
              to="/products" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order placed</p>
                      <p className="font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Items</p>
                      <p className="font-medium">{getTotalItems(order.items)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium text-xs">{order.id.substring(0, 8)}...</p>
                    </div>
                    
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    {expandedOrder === order.id ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        View Details
                      </>
                    )}
                  </button>
                </div>
                
                {expandedOrder === order.id && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Payment Method</h3>
                        <p>{order.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center">
                            <img 
                              src={item.imageURL} 
                              alt={item.name} 
                              className="h-16 w-16 object-cover rounded-md mr-4" 
                            />
                            <div>
                              <Link 
                                to={`/products/${item.id}`}
                                className="font-medium hover:text-blue-600"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;