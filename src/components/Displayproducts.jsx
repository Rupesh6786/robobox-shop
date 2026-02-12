import React, { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { LayoutGrid, List } from 'lucide-react';
import 'react-lazy-load-image-component/src/effects/blur.css';

const url = import.meta.env.VITE_BACKEND_URL;

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ product, cardSize }) => {
  const dimensions = {
    small: 'w-48',
    medium: 'w-64',
    large: 'w-80'
  };

  return (
    <Link to={`/product/${product.id}`} className="block transition-transform hover:scale-105">
      <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col ${dimensions[cardSize]}`}>
        <div className="aspect-square mb-4">
          <LazyLoadImage
            src={product.images[0] ? `${url.replace(/\/+$/, '')}${product.images[0]}` : 'https://via.placeholder.com/150'}
            alt={product.title}
            effect="blur"
            className="w-full h-full object-contain"
            threshold={100}
            placeholderSrc="https://via.placeholder.com/150?text=Loading..."
          />
        </div>
        <h3 className="text-lg overflow-hidden line-clamp-2 font-semibold mb-2">
          {product.title}
        </h3>
        <div className="mt-auto">
          <p className="text-gray-600 font-medium">₹{product.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
});

const ViewControls = memo(({ viewMode, setViewMode, cardSize, setCardSize }) => (
  <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-100 rounded-lg sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <span className="font-medium">Layout:</span>
      <button
        onClick={() => setViewMode('carousel')}
        className={`p-2 rounded transition-colors ${viewMode === 'carousel' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        title="Carousel View"
      >
        <List size={20} />
      </button>
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        title="Grid View"
      >
        <LayoutGrid size={20} />
      </button>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-medium">Size:</span>
      <select
        value={cardSize}
        onChange={(e) => setCardSize(e.target.value)}
        className="p-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>
  </div>
));

const DisplayProducts = () => {
  const [products, setProducts] = useState([]);
  const containerRefs = useRef([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('carousel');
  const [cardSize, setCardSize] = useState('medium');
  const scrollTimeout = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${url}api/products`).then(res => res.json()),
      fetch(`${url}api/categories`).then(res => res.json())
    ])
    .then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
      setIsLoading(false);
    });
  }, []);

  const handleScroll = (container, direction) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    scrollTimeout.current = setTimeout(() => {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }, 50);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ViewControls 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        cardSize={cardSize} 
        setCardSize={setCardSize} 
      />
      
      {categories.map((category, index) => (
        <div key={category.Id} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{category.type}</h2>
          
          {viewMode === 'carousel' ? (
            <div className="relative">
              <button
                className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-r-lg shadow-md h-24 hidden md:flex items-center justify-center"
                onClick={() => handleScroll(containerRefs.current[index], 'left')}
              >
                <span className="text-2xl">&lt;</span>
              </button>
              <div
                className="flex overflow-x-auto scroll-smooth scrollbar-hide pb-4 gap-4"
                ref={(el) => (containerRefs.current[index] = el)}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {products
                  .filter(product => product.category === category.type)
                  .map(product => (
                    <div key={product.id} className="flex-none">
                      <ProductCard product={product} cardSize={cardSize} />
                    </div>
                  ))}
              </div>
              <button
                className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-l-lg shadow-md h-24 hidden md:flex items-center justify-center"
                onClick={() => handleScroll(containerRefs.current[index], 'right')}
              >
                <span className="text-2xl">&gt;</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products
                .filter(product => product.category === category.type)
                .map(product => (
                  <ProductCard key={product.id} product={product} cardSize={cardSize} />
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplayProducts;