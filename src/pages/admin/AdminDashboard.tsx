import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

const AdminAddProduct = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [imageURL, setImageURL] = useState('');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || price === '' || stock === '' || !imageURL) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'products'), {
        name,
        category,
        price: Number(price),
        stock: Number(stock),
        imageURL,
        featured,
        createdAt: Timestamp.now(),
      });

      toast.success('Product added successfully');
      navigate('/admin'); // Go back to dashboard
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full border px-3 py-2 rounded"
            value={price}
            onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Stock</label>
          <input
            type="number"
            min="0"
            className="w-full border px-3 py-2 rounded"
            value={stock}
            onChange={e => setStock(e.target.value === '' ? '' : Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={imageURL}
            onChange={e => setImageURL(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={e => setFeatured(e.target.checked)}
          />
          <label htmlFor="featured">Featured</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
