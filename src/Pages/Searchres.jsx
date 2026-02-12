import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotFound from '../components/notfound';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { BeatLoader } from 'react-spinners';
const url = import.meta.env.VITE_BACKEND_URL;

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
        try {
          const response = await fetch(`${url}api/products/search/${query}`);
            let data;
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
              data = await response.json();
            } else {
              data = await response.text();
            }
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);

          }
    
          setProducts(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

    fetchProducts();
  }, [query]);

  if (loading) return <div className="text-center h-[90vh] py-4"><BeatLoader color="#123abc" /></div>;
  if (error === "HTTP error! status: 404" ) return (
    <>
    <div className='h-[90vh]'>
      <NotFound/>
    </div>
    </>
  )


  return (
    <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
    <div className="grid grid-cols-1 h-[70vh] overflow-scroll no-scrollbar sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <LazyLoadImage
            src={`${url.replace(/\/+$/, '')}${product.images[0]}`} 
            alt={product.title}
            effect="blur"
            className="w-full h-40 object-cover mb-4 rounded"
            style={{ objectFit: 'contain' }}
          />
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <p className="text-gray-600 mt-2">{product.description.slice(0, 100)}{product.description.length > 100 ? '...' : ''}</p>
            <p className="text-gray-800 font-bold mt-2">₹{product.price}</p>
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;