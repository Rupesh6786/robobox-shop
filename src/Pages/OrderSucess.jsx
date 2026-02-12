import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (


    <div className="min-h-screen flex flex-col justify-center items-center bg-green-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-md">
        <img
          src="https://img.freepik.com/premium-vector/concept-successful-payment-payment-transaction-approved-successful-notification-check-mark_675567-5947.jpg?w=740" 
          alt="Success Illustration"
          className="w-24 h-24 mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-green-700">Payment Successful!</h2>
        <p className="text-gray-600 mt-2 mb-4">
          Thank you for your purchase. A receipt has been sent to your email.
        </p>
        <button
          onClick={() => navigate('/Orders')}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
