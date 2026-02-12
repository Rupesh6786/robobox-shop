import React, { useState, useEffect, useRef } from 'react';

const ComingSoonPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (event.clientX - left) / width;
        const y = (event.clientY - top) / height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4"
      style={{
        backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
      }}
    >
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 animate-pulse">
          Coming Soon
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12 animate-bounce">
          Something amazing is in the works!
        </p>
        <div className="relative inline-block">
          <input
            type="email"
            placeholder="Enter your email"
            className="py-3 px-4 w-64 md:w-80 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
          />
          <button className="absolute right-0 top-0 bottom-0 bg-yellow-400 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-yellow-300 transition duration-300 transform hover:scale-105">
            Notify Me
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ComingSoonPage;