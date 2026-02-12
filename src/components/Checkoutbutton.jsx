import React, { useState } from 'react';
import { useUserStore } from '../../zstandstore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const url = import.meta.env.VITE_BACKEND_URL;

const CheckoutButton = ({ productId, quantity }) => {
  const { currentUser } = useUserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);





  const handlePayment = async () => {
    if (!currentUser) {
      toast.error('Please login to continue');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`${url}api/createBulkOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ items: [{ productId, quantity }] }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
  
      const orderData = await response.json();
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "The Robobox",
        description: `Transaction for order ${orderData.id}`,
        order_id: orderData.id,
        handler: async (response) => {
          const paymentVerification = await fetch(`${url}api/processOrder`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearr ${currentUser.token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: currentUser.email,
              name: currentUser.username,
              address: currentUser.address,
              phone: currentUser.phone,
              items: [{ productId, quantity }],
            }),
          });
  
          const verificationResult = await paymentVerification.json();
          console.log(verificationResult , 'verificationResult');
          setLoading(false);
  
          if (verificationResult.success) {
            toast.success('Payment successful! A receipt has been sent to your email.');
            navigate('/orderSucess');
          } else {
            toast.error('Payment verification failed');
          }
        },
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
        contact: currentUser.phone,
        address: currentUser.address,
      },
      notes: {
        address: "`305/TULIP, EVEREST WORLD, KOLSHET ROAD,THANE, (400607), Maharashtra, India`",
      },
      theme: {
        color: "#F37254",
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          toast.error('Payment canceled');
        },
        error: {
          description: "An error occurred during payment. Please try again.",
        },
      },
    };

    if (window.Razorpay) {
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      console.error('Razorpay SDK not loaded');
      alert('Razorpay SDK not loaded');
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred during payment. Please try again.');
    setLoading(false);
  }
};

  return (
    <button
      onClick={handlePayment}
      className={`bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Checkout'}
    </button>
  );
};

export default CheckoutButton;
