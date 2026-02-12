import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AddToCartButton } from '../components/Cart';
import { toast } from 'react-toastify';

const url = import.meta.env.VITE_BACKEND_URL;

const ProductDescription = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    school: '',
    classna: '',
    division : '',
    rollNo:'' 
  });

  useEffect(() => {
    fetch(`${url}api/product/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitButton = document.getElementById('submitbtnfree');
    submitButton.disabled = true;
    submitButton.style.backgroundColor = 'green';
    submitButton.innerHTML = 'Submitting...';
  
    try {
      const response = await fetch(`${url}api/freeclaim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, productId: id })
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      });
      toast.success(response.message);
      submitButton.innerHTML = 'Claimed successfully'; 
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
      submitButton.innerHTML = 'Submit';
    } finally {
      submitButton.disabled = false;
    }
  };


  if (loading) return (
    <div className='flex justify-center items-center h-[80vh]'>
      <div className='text-4xl font-bold text-center'>Loading...</div>
    </div>
  );

  if (!product) return (
    <div className='flex justify-center items-center h-[80vh]'>
      <div className='text-4xl font-bold text-center text-red-500'>Product not found 404</div>
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: product.images.length > 1, // Set infinite to false if there's only one image
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2">
          <Slider {...sliderSettings}>
            {product.images.map((image, index) => (
              <div key={index}>
                <img src={`${url.replace(/\/+$/, '')}${image}`} alt={product.title} className="w-full h-96 object-contain" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="lg:w-1/2 lg:pl-8 mt-4 lg:mt-0">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-xl font-semibold mb-4">₹{product.price}</p>
          <p className="text-gray-600 max-h-[30vh] overflow-y-auto mb-4">{product.description}</p>
          {product.price > 0 ? (
            <div className="flex mt-8 space-x-4">
              <AddToCartButton productId={product.id} />
              <button onClick={() => { window.location.href='/cart' }} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300">Go to Cart</button>
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Claim This for free</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                </div>


                <div>
                  <label htmlFor="classna" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input
                    type="text"
                    id="classna"
                    name="classna"
                    value={formData.classna}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                  <input
                    type="text"
                    id="division"
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
                  <input
                    type="text"
                    id="rollNo"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    required
                  />
                </div>


                <div>
                  <button
                    type="submit" 
                    
                    id='submitbtnfree'
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
                  >
                   
                   Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;  