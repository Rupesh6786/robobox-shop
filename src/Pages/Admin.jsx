import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';
import ManageOrders from '../components/Orders';
import ManageCategory from '../components/AddCategory';
import ManageADV from '../components/ManageADV';
import ManageCoupon from '../components/ManageCoupon';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const url = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${url}api/ordersAdmin`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        toast.success('Orders fetched successfully');
      } else {
        const errorData = await response.json();
        toast.error('Error fetching orders: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthorized(true);
      fetchProducts();
      fetchOrders();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${url}api/products`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        toast.success('Products fetched successfully');
      } else {
        const errorData = await response.json();
        toast.error('Error fetching products: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}api/adminlogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        const token = data.token;
        sessionStorage.setItem('token', token);
        setIsAuthorized(true);
        fetchProducts();
        toast.success('Login successful');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const deleteProduct = async (product) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${url}api/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        const errorData = await response.json();
        toast.error('Error deleting product: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded">
          <h2 className="text-2xl mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 mb-4 border rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          className="md:hidden block text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </header>
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <aside
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-gray-200 p-4`}
        >
          <nav>
            <ul className="flex flex-col">
              <li
                className={`cursor-pointer p-2 ${activeTab === 'add' ? 'bg-green-300' : ''}`}
                onClick={() => handleTabChange('add')}
              >
                Add Products
              </li>
              <li
                className={`cursor-pointer p-2 ${activeTab === 'manage' ? 'bg-green-300' : ''}`}
                onClick={() => handleTabChange('manage')}
              >
                Manage Products
              </li>
              <li
                className={`cursor-pointer p-2 ${activeTab === 'Orders' ? 'bg-green-300' : ''}`}
                onClick={() => handleTabChange('Orders')}
              >
                Orders
              </li>
              <li
                className={`cursor-pointer p-2 ${activeTab === 'Category' ? 'bg-green-300' : ''}`}
                onClick={() => handleTabChange('Category')}
              >
                Manage Category
              </li>
              <li
                className={`cursor-pointer p-2 ${activeTab === 'ADV' ? 'bg-green-300' : ''}`}
                onClick={() => handleTabChange('ADV')}
              >
                Advert Image
              </li>
              <li
                className={`cursor-pointer p-2 ${activeTab === 'CUPO' ? 'bg-green-300' : ''}`}
                onClick={() => handleTabChange('CUPO')}
              >
                Manage Coupons
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-grow p-4 overflow-auto">
          {activeTab === 'add' && <AddProduct fetchProducts={fetchProducts} />}
          {activeTab === 'manage' && (
            <ManageProducts
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={deleteProduct}
              onRefresh={fetchProducts}
              setFilteredProducts={setFilteredProducts}
            />
          )}
          {activeTab === 'Orders' && <ManageOrders orders={orders} />}
          {activeTab === 'Category' && <ManageCategory />}
          {activeTab === 'ADV' && <ManageADV />}
          {activeTab === 'CUPO' && <ManageCoupon />}
        </main>
      </div>
      {showEditModal && selectedProduct && (
        <EditModal product={selectedProduct} onClose={closeEditModal} />
      )}
   
    </div>
  );
  
};

const AddProduct = ({ fetchProducts }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${url}api/categories`, {});
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    Array.from(images).forEach((image) => {
      formData.append('images', image);
    });

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${url}api/products`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        setTitle('');
        setPrice('');
        setDescription('');
        setCategory('');
        setImages([]);
        toast.success('Product added successfully');
        fetchProducts();
      } else {
        const errorData = await response.json();
        toast.error('Error adding product: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 text-black w-full mt-2"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.Id} value={cat.type}>
                {cat.type}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Images</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Product
        </button>
      </form>
    </div>
  );
};

const ManageProducts = ({ products, onEdit, onDelete, onRefresh, setFilteredProducts }) => {
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <button className="bg-blue-500 text-white p-2 mb-4" onClick={onRefresh}>
        Refresh Products
      </button>
      <input
        onChange={handleSearch}
        type="text"
        placeholder="Search products..."
        className="border p-2 w-full mb-4"
      />
      <div className="h-screen overflow-auto">
        {products.map((product) => (
          <div key={product.id} className="border p-4 mb-4 flex flex-col md:flex-row">
            <div className="md:w-1/2 pr-4">
              <h3 className="text-xl font-bold">{product.title}</h3>
              <p>Price: ₹{product.price}</p>
              <p>Category: {product.category}</p>
              <div className="mt-2">
                {product.images.map((image, index) => (
                  <LazyLoadImage
                    key={index}
                    src={`${url.replace(/\/$/, '')}${image}`}
                    alt={product.title}
                    className="w-20 h-20 inline-block mr-2 mb-2"
                  />
                ))}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => onEdit(product)}
                  className="bg-yellow-500 text-white p-2 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="bg-red-500 text-white p-2"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0">
              <h4 className="font-bold mb-2">Description:</h4>
              <p>{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EditModal = ({ product, onClose }) => {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    Array.from(images).forEach((image) => {
      formData.append('images', image);
    });

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${url}api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Product updated successfully');
        onClose();
      } else {
        const errorData = await response.json();
        toast.error('Error updating product: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    }
  };

  return (
    <div className="overflow-hidden pointer-events-auto fixed z-50 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Images</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2">
            Update Product
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white p-2 ml-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;