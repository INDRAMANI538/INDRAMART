import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { User as UserIcon, Edit, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    photoURL: ''
  });
  
  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data() as User;
          setProfile(userData);
          setFormData({
            displayName: userData.displayName || '',
            email: userData.email,
            photoURL: userData.photoURL || ''
          });
        } else {
          // If user document doesn't exist, create one from auth data
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || undefined,
            photoURL: currentUser.photoURL || undefined
          });
          
          setFormData({
            displayName: currentUser.displayName || '',
            email: currentUser.email,
            photoURL: currentUser.photoURL || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [currentUser, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      setIsSaving(true);
      
      // Update in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
        updatedAt: Date.now()
      });
      
      // Update in Firebase Auth
      if (auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: formData.displayName,
          photoURL: formData.photoURL
        });
      }
      
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          displayName: formData.displayName,
          photoURL: formData.photoURL
        };
      });
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
        <p className="text-gray-600 mb-8">There was an error loading your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 h-32 relative">
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="absolute top-4 right-4 bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors"
              >
                <Save className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            
            <div className="absolute -bottom-16 left-6">
              <div className="h-32 w-32 rounded-full bg-white p-1">
                {profile.photoURL ? (
                  <img 
                    src={profile.photoURL} 
                    alt={profile.displayName || 'User'} 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center">
                    <UserIcon className="h-16 w-16 text-blue-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-20 px-6 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.displayName || 'User'}
            </h1>
            <p className="text-gray-600">{profile.email}</p>
            
            {isEditing ? (
              <div className="mt-8 space-y-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed.</p>
                </div>
                
                <div>
                  <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    id="photoURL"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleInputChange}
                    placeholder="https://example.com/profile.jpg"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter a URL to your profile picture.</p>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="mr-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Account Information</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Display Name</p>
                      <p className="font-medium">{profile.displayName || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium">{profile.isAdmin ? 'Administrator' : 'Customer'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/orders')}
                      className="text-blue-600 hover:text-blue-800 block"
                    >
                      View Order History
                    </button>
                    <button 
                      onClick={() => navigate('/cart')}
                      className="text-blue-600 hover:text-blue-800 block"
                    >
                      View Shopping Cart
                    </button>
                    {profile.isAdmin && (
                      <button 
                        onClick={() => navigate('/admin')}
                        className="text-blue-600 hover:text-blue-800 block"
                      >
                        Go to Admin Dashboard
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;