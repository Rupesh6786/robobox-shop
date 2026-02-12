import React, { useState } from 'react';


const CouponModal = ({ show, onClose, onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    onApplyCoupon(couponCode);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Enter Coupon Code</h2>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="border p-2 w-full mb-4"
          placeholder="Enter coupon code"
        />
        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg mr-2"
            onClick={handleApplyCoupon}
          >
            Apply
          </button>
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
