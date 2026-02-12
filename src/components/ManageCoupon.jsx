import React, { useEffect, useState } from 'react';
import { FaSyncAlt, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const url = import.meta.env.VITE_BACKEND_URL;

function ManageCoupon() {
  const token = sessionStorage.getItem('token');
  const [coupons, setCoupons] = useState([]);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [editedCoupon, setEditedCoupon] = useState({
    code: '',
    discount: '',
    discount_percent: '',
    min_purchase: '',
    product_id: ''
  });

  async function fetchCoupons() {
    try {
      const response = await fetch(`${url}api/coupons`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCoupons(data);
      } else {
        toast.error(data.message || 'Failed to fetch coupons');
      }
    } catch (error) {
      toast.error('An error occurred while fetching coupons');
      console.error('Fetch coupons error:', error);
    }
  }

  async function addCoupon() {
    try {
      const response = await fetch(`${url}api/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(editedCoupon)
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Coupon added successfully');
        fetchCoupons();
        setIsAddingCoupon(false);
        setEditedCoupon({
          code: '',
          discount: '',
          discount_percent: '',
          min_purchase: '',
          product_id: ''
        });
      } else {
        toast.error(data.message || 'Failed to add coupon');
      }
    } catch (error) {
      toast.error('An error occurred while adding the coupon');
      console.error('Add coupon error:', error);
    }
  }

  useEffect(() => {
    document.title = "Manage Coupons";
    fetchCoupons();
  }, []);

  function deleteCoupon(id) {
    fetch(`${url}api/coupons/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        setCoupons(coupons.filter(coupon => coupon.id !== id));
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Failed to delete coupon');
      }
    })
    .catch(error => {
      toast.error('An error occurred while deleting the coupon');
      console.error('Delete coupon error:', error);
    });
  }

  function editCoupon(coupon) {
    setEditingCouponId(coupon.id);
    setEditedCoupon({
      code: coupon.code,
      discount: coupon.discount,
      discount_percent: coupon.discount_percent,
      min_purchase: coupon.min_purchase,
      product_id: coupon.product_id || ''
    });
  }

  function saveCoupon(id) {
    fetch(`${url}api/coupons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(editedCoupon)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        setEditingCouponId(null);
        toast.success(data.message);
        fetchCoupons(); 
      } else {
        toast.error(data.message || 'Failed to save coupon');
      }
    })
    .catch(error => {
      toast.error('An error occurred while saving the coupon');
      console.error('Save coupon error:', error);
    });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditedCoupon({ ...editedCoupon, [name]: value });
  }

  function renderInputField(fieldName, label, type = 'text') {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <input
          type={type}
          name={fieldName}
          value={editedCoupon[fieldName]}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  }

  function renderAddCouponModal() {
    if (!isAddingCoupon) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Coupon</h2>
            <button 
              onClick={() => setIsAddingCoupon(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          {renderInputField('code', 'Coupon Code')}
          {renderInputField('discount', 'Fixed Discount', 'number')}
          {renderInputField('discount_percent', 'Discount Percentage', 'number')}
          {renderInputField('min_purchase', 'Minimum Purchase', 'number')}
          {renderInputField('product_id', 'Product ID (Optional)')}
          
          <div className="flex justify-end mt-6">
            <button
              onClick={addCoupon}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
            >
              Add Coupon
            </button>
            <button
              onClick={() => setIsAddingCoupon(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 relative">
      {renderAddCouponModal()}

      <div>
        <h2 className="text-lg font-semibold underline decoration-4 mb-8 underline-offset-8 decoration-amber-200">
          Manage Coupons
        </h2>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupon List</h1>
        <div className="flex space-x-4">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center" 
            onClick={fetchCoupons}
          >
            <FaSyncAlt className="mr-2" /> Refresh
          </button>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
            onClick={() => setIsAddingCoupon(true)}
          >
            <FaPlus className="mr-2" /> Add Coupon
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto h-[50vh] bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fixed Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Purchase</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map(coupon => (
              <tr key={coupon.id}>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCouponId === coupon.id ? (
                    <input
                      type="text"
                      name="code"
                      value={editedCoupon.code}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    coupon.code
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCouponId === coupon.id ? (
                    <input
                      type="number"
                      name="discount"
                      value={editedCoupon.discount}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    coupon.discount || 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCouponId === coupon.id ? (
                    <input
                      type="number"
                      name="discount_percent"
                      value={editedCoupon.discount_percent}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    coupon.discount_percent ? `${coupon.discount_percent}%` : 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCouponId === coupon.id ? (
                    <input
                      type="number"
                      name="min_purchase"
                      value={editedCoupon.min_purchase}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    coupon.min_purchase || 'No Minimum'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCouponId === coupon.id ? (
                    <input
                      type="text"
                      name="product_id"
                      value={editedCoupon.product_id}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    coupon.product_id || 'All Products'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-3">
                    {editingCouponId === coupon.id ? (
                      <>
                        <button
                          onClick={() => saveCoupon(coupon.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCouponId(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => editCoupon(coupon)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCoupon;