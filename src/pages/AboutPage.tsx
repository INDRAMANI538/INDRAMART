import React from 'react';
import { Award, Users, ShieldCheck, Truck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">About INDRA'S MART</h1>
        
        {/* Hero Section */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-lg mb-6">
            INDRA'S MART was created in 2023 as a personal project to explore the world of modern e-commerce and full-stack development. This site is designed to showcase how a fully functional, engaging online shopping platform can be built from the ground up using React, Firebase, and Tailwind CSS.
          </p>
          <p className="text-lg">
            The goal of this project is not only to demonstrate technical capability, but also to deliver a smooth, secure, and user-friendly shopping experience, much like a real-world platform.
          </p>
        </div>
        
        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Award className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quality First</h3>
            <p className="text-gray-600">
              We carefully curate our product selection to ensure only the highest quality
              items make it to our platform.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Users className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customer Focused</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do. We're committed to
              providing exceptional service and support.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ShieldCheck className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
            <p className="text-gray-600">
              Your security is our priority. We use the latest technology to protect
              your personal and payment information.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Truck className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              We partner with reliable shipping providers to ensure your orders reach
              you quickly and safely.
            </p>
          </div>
        </div>
        
        {/* Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                alt="John Smith"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold">John Smith</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                alt="Sarah Johnson"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold">Sarah Johnson</h3>
              <p className="text-gray-600">Head of Operations</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                alt="Mike Wilson"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold">Mike Wilson</h3>
              <p className="text-gray-600">Head of Technology</p>
            </div>
          </div>
        </div>
        
        {/* Join Us */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-gray-600 mb-6">
            Interested in building powerful applications or collaborating on innovative web projects?
            Reach out and be part of the learning and building journey at INDRA'S MART.
          </p>
          <a
            href="#"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Careers
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
