import React, { useEffect, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const url = import.meta.env.VITE_BACKEND_URL;

function ManageADV() {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchImages = () => {
    fetch(`${url}api/advertimages`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error('API response is not an array:', data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 5) {
      alert('You can only select up to 5 images.');
      return;
    }
    setSelectedFiles(imageFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));

    try {
      const response = await fetch(`${url}api/advertimages`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        alert('Images uploaded successfully');
        setSelectedFiles([]);
   
        const data = await response.json();
        setImages(data);
      } else {
        const errorText = await response.text();
        alert(`Failed to upload images: ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${url}api/advertimages/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Image deleted successfully');
        setImages(images.filter(image => image.id !== id));
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Advertisements</h1>
          <button 
            onClick={fetchImages} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
          >
            <FaSyncAlt className="mr-2" /> Refresh
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          {Array.isArray(images) && images.map((image, index) => (
            <div key={image.id} className="flex flex-col items-center mb-4">
              <LazyLoadImage src={`${url.replace(/\/+$/, '')}${image.url}`} alt={`Advertisement ${index + 1}`} className="mb-4 rounded" />
              <button onClick={() => handleDelete(image.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <label className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 cursor-pointer">
            Add Advertisement
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Selected Files</h2>
            <ul className='h-[50vh] overflow-x-hidden overflow-scroll'>
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-200 px-4 py-2 mb-2 rounded">
                  <div className="flex items-center">
                   
              
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-16 h-16 mr-4 rounded" />
                    
                    <div>
                      <span>{file.name}</span>
                      <span className="block text-sm text-gray-600">{(file.size / 1000).toFixed(2)} KB</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                </li>
              ))}
            </ul>
            <div>
              <button onClick={handleUpload} className='p-2 justify-center mr-8 bg-green-500 font-extrabold align-text-top'>
                Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageADV;