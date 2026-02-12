import React, { useEffect, useState } from 'react';
import axios from 'axios';
const url = import.meta.env.VITE_BACKEND_URL;

const ThreeDPrintForm = () => {
  const [formData, setFormData] = useState({
    con_name: '',
    phNo: '',
    reason: '3D Printing',
    message: '',
    files: [],
    is2DTo3D: false,
    length: '',
    width: '',
    height: '',
  });
  const [showNotice, setShowNotice] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(200); 

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue = value;


    if (name === 'length' || name === 'width' || name === 'height') {
      if (value > 22) {
        newValue = 22;
      }
    }

    if (type === 'file') {
      setFormData(prevState => ({
        ...prevState,
        files: [...prevState.files, ...files]
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : newValue
      }));
    }
  };

  const handleDeleteFile = (index) => {
    setFormData(prevState => ({
      ...prevState,
      files: prevState.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'files') {
        formData.files.forEach(file => data.append('files', file));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(`${url}api/mailforwarder/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  const calculatePrice = () => {
    let basePrice = 200;
    let nonSlvFileFound = false;
    formData.files.forEach(file => {
      if (file.name.split('.').pop().toLowerCase() !== 'stl') {
        basePrice += 150;
        nonSlvFileFound = true;
      }
    });
    setShowNotice(nonSlvFileFound);
    return basePrice;
  };

  useEffect(() => {
    const price = calculatePrice();
    setEstimatedPrice(price); // Update estimated price in state
  }, [formData.files]); 

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">3D Printing Service Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form inputs */}
        <div>
          <label htmlFor="con_name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="con_name"
            name="con_name"
            required
            className="mt-1 block w-full rounded-md border-gray-900 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="phNo" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phNo"
            name="phNo"
            required
            className="mt-1 block w-full rounded-md border-gray-900 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            name="message"
            rows="3"
            required
            className="mt-1 block w-full rounded-md border border-gray-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="files" className="block text-sm font-medium text-gray-700">Upload 3D Files</label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            required
            accept=".stl"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={handleChange}
          />
          <div className="mt-2 space-y-2">
            {formData.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{file.name}</span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteFile(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700">Length (cm)</label>
            <input
              type="number"
              id="length"
              name="length"
              min={1}
              max={22}
              required
              className="mt-1 block w-full rounded-md border-gray-900 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width (cm)</label>
            <input
              type="number"
              id="width"
              name="width"
              min={1}
              max={22}
              required
              className="mt-1 block w-full rounded-md border border-gray-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              min={1}
              max={22}
              required
              className="mt-1 block w-full rounded-md border-gray-900 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={handleChange}
            />
          </div>
        </div>
        {showNotice && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-5" role="alert">
            <p className="font-bold">Notice</p>
            <p>There is an additional charge of ₹150 for non-.slv files.</p>
          </div>
        )}
        <div className="mt-4">
          <p className="text-lg font-semibold"> Pricing Starting from : ₹{estimatedPrice}</p>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThreeDPrintForm;