import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const url = import.meta.env.VITE_BACKEND_URL;

const ProductCategories = () => {
  const [categories, setCategories] = useState([])


useEffect(() => {
  const fetchcategories = async () => {
    const response = await fetch(`${url}api/categories`);
    const data = await response.json();
    setCategories(data);
    console.log(data);
  }
  fetchcategories();

}, []);


  return (
    <div className="bg-white p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Shop By  Categories</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {categories.map((category, index) => (
          <Link key={index}to={category.link} className="flex-shrink-0">
            <div className="bg-gray-100 p-4 rounded-md hover:bg-gray-200 transition duration-300">
              <h3 className="text-lg font-semibold">{category}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;