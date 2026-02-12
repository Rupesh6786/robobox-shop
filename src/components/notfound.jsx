
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="relative flex justify-center items-center w-44 h-44 mx-auto mb-10">
          <div className="absolute inset-0 bg-orange-400 transform rotate-45 border-4 border-black rounded-sm"></div>
          <h1 className="relative text-7xl font-bold text-black">404</h1>
        </div>
        <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">Product not found</h2>
        <p className="text-lg text-black mb-6">The Keyword you are looking for might been irrelevant or had its name changed or is temporarily unavailable.</p>
        <a href="/" className="inline-block px-6 py-3 bg-gray-600 text-white text-sm font-bold uppercase rounded-full mb-8 transition-transform transform hover:bg-gray-800">
          Home Page
        </a>
      </div>
    </div>
  );
}

export default NotFound;
