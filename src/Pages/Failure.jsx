import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailurePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-md">
        <img
          src="https://img.freepik.com/premium-vector/red-grunge-rubber-stamp-with-word-payment-declining-red_545399-3524.jpg" 
          alt="Failure Illustration"
          className="w-30 h-30 mx-auto "
        />
        <h2 className="text-2xl font-semibold text-red-700">Payment Failed</h2>
        <p className="text-gray-600 mt-2 mb-4">
          Unfortunately, your payment could not be processed. Please try again later.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 mr-2"
        >
          Go Home
        </button>
       
      </div>
    </div>
  );
};

export default PaymentFailurePage;
