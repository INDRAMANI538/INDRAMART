export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageURL: string;
  rating?: number;
  stock: number;
  featured?: boolean;
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}