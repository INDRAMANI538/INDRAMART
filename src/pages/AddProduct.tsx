import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  if (!isAdmin) {
    return <p>You are not authorized to access this page.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        image,
        description,
        createdAt: Timestamp.now()
      });

      alert('Product added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full border p-2"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          className="w-full border p-2"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
