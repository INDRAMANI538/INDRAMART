import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const { currentUser } = useAuth();

  // Load cart from localStorage or Firestore on initial load
  useEffect(() => {
    const loadCart = async () => {
      if (currentUser) {
        // If user is logged in, try to load cart from Firestore
        const cartRef = doc(db, 'carts', currentUser.uid);
        const cartSnap = await getDoc(cartRef);
        
        if (cartSnap.exists()) {
          const cartData = cartSnap.data();
          setCart(cartData.items || []);
        } else {
          // If no cart in Firestore but exists in localStorage, save to Firestore
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            setCart(parsedCart);
            await setDoc(cartRef, { items: parsedCart, updatedAt: Date.now() });
          } else {
            setCart([]);
          }
        }
      } else {
        // If not logged in, load from localStorage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCart(JSON.parse(localCart));
        }
      }
    };

    loadCart();
  }, [currentUser]);

  // Save cart to localStorage and Firestore when it changes
  useEffect(() => {
    const saveCart = async () => {
      localStorage.setItem('cart', JSON.stringify(cart));
      
      if (currentUser) {
        const cartRef = doc(db, 'carts', currentUser.uid);
        await setDoc(cartRef, { items: cart, updatedAt: Date.now() });
      }
    };

    // Calculate totals
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(total);
    setItemCount(count);
    
    // Only save if cart has been initialized (not first load)
    if (cart.length > 0 || localStorage.getItem('cart')) {
      saveCart();
    }
  }, [cart, currentUser]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Item doesn't exist, add to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};