import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { useUserStore } from '../../zstandstore';
import { db } from '../config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import CouponModal from './CouponModal';
const url = import.meta.env.VITE_BACKEND_URL;
const fetchProductDetails = async (id) => {
  const response = await fetch(`${url}api/product/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  const data = await response.json();
  console.log(data);
  
  if (data.images && data.images[0]) {
    const datawithimg = await fetch(`${url.replace(/\/+$/, '')}${data.images[0]}`);
    console.log(datawithimg);
    data.image = datawithimg.url;
  } else {
    data.image = 'Alternative text';
  }
  return data;
};

const Cart = () => {
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cartRef = useRef(null);
  const { currentUser, cart, setCart } = useUserStore();
  const [loading, setLoading] = useState(false);
  const getCartItems = async () => {
    if (cart.length > 0) {
      try {
        const productPromises = cart.map(({ id }) => fetchProductDetails(id));
        const products = await Promise.all(productPromises);
        const productsWithQuantity = products.map((product, index) => ({
          ...product,
          quantity: cart[index].quantity,
        }));
        setCartItems(productsWithQuantity);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getCartItems();
    }
  }, [currentUser, cart]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (cartRef.current) {
        const rect = cartRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };




    const handleTouchMove = (event) => {
      if (cartRef.current && event.touches.length > 0) {
        const rect = cartRef.current.getBoundingClientRect();
        const touch = event.touches[0];
        setMousePosition({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [cartRef]);


  const handleCheckoutAll = async () => {
    if (!currentUser) {
      toast.error('Please login to continue');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`${url}api/createBulkOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${currentUser.token}`,
        },
        body: JSON.stringify({ 
          items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })), 
          couponCode: couponCode 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create bulk order');
      }
  
      const orderData = await response.json();
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "The Robobox",
        description: `Bulk transaction for order ${orderData.id}`,
        order_id: orderData.id,
        handler: async (response) => {
          const paymentVerification = await fetch(`${url}api/processOrder`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${currentUser.token}`,
              'content': currentUser.email,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: currentUser.email,
              name: currentUser.username,
              address: currentUser.address,
              phone: currentUser.phone,
              items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
              couponCode: couponCode,
              appliedDiscount: orderData.discount 
            }),
          });
  
          const verificationResult = await paymentVerification.json();
          setLoading(false);
  
          if (verificationResult.success) {
            toast.success('Payment successful! A receipt has been sent to your email.');
            setCartItems([]);
            setCart([]);
            const userRef = doc(db, 'users', currentUser.id);
            await updateDoc(userRef, { cart: [] });
            navigate('/orderSucess');
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: currentUser.username,
          email: currentUser.email,
          contact: currentUser.phone,
          address: currentUser.address,
        },
        notes: {
          address: "305/TULIP, EVEREST WORLD, KOLSHET ROAD,THANE, (400607), Maharashtra, India",
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment canceled');
          },
        },
      };
  
      if (window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error('Razorpay SDK not loaded');
        toast.error('Razorpay SDK not loaded');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during payment. Please try again.');
      setLoading(false);
    }
  };


  const updateQuantity = async (id, quantity) => {
    try {
      const updatedCartItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      setCartItems(updatedCartItems);
      const cartProducts = updatedCartItems.map(item => ({ id: item.id, quantity: item.quantity }));
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { cart: cartProducts });
      setCart(cartProducts);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedCartItems);
      const cartProducts = updatedCartItems.map(item => ({ id: item.id, quantity: item.quantity }));
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { cart: cartProducts });
      setCart(cartProducts);
    } catch (err) {
      console.error(err);
    }
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculateEyePosition = (mouseX, mouseY) => {
    if (!cartRef.current) {
      return 'translate(0px, 0px)';
    }

    const eyeX = (mouseX / cartRef.current.offsetWidth) * 20 - 10;
    const eyeY = (mouseY / cartRef.current.offsetHeight) * 20 - 10;
    return `translate(${eyeX}px, ${eyeY}px)`;
  };


  const handleApplyCoupon = async (couponCode) => {
    try {
      const response = await fetch(`${url}api/verifyCoupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, totalAmount: total, productId: 18 }),
      });
      const result = await response.json();
      if (result.success) {
        setDiscount(result.discount);
        setCouponCode(couponCode);
        toast.success(result.message);
        setShowCouponModal(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while applying the coupon.');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponCode('');
    toast.info('Coupon removed successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {currentUser ? (
        cartItems.length === 0 ? (
          <div ref={cartRef} className="flex flex-col items-center justify-center h-[60vh]">
            <div className="relative w-48 h-48 mb-8">
              <div className="absolute inset-0 bg-gray-300 rounded-lg"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-12 h-10 bg-gray-400 rounded-t-full"></div>
              <div className="absolute top-[25%] left-[25%] w-[16.67%] h-[16.67%] bg-white rounded-full flex items-center justify-center">
                <div
                  className="w-[50%] h-[50%] bg-black rounded-full"
                  style={{ transform: calculateEyePosition(mousePosition.x, mousePosition.y) }}
                ></div>
              </div>
              <div className="absolute top-[25%] right-[25%] w-[16.67%] h-[16.67%] bg-white rounded-full flex items-center justify-center">
                <div
                  className="w-[50%] h-[50%] bg-black rounded-full"
                  style={{ transform: calculateEyePosition(mousePosition.x, mousePosition.y) }}
                ></div>
              </div>
              <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[33.33%] h-[16.67%] border-b-4 border-black rounded-b-full rotate-180"></div>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-center">Your Cart is Empty</h1>
            <p className="text-gray-600 text-center">Looks like your cart is feeling a bit lonely. Why not add some items to cheer it up?</p>
          </div>
        ) : (
          <>
                                                                  {currentUser && currentUser.address && (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
    <p className="text-gray-600">{currentUser.address}</p>
  </div>
)}
            <h1 className="text-2xl font-bold mb-4">Your Cart ({totalItems} items)</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {cartItems.map(item => (<>
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-4 flex flex-col sm:flex-row items-center">
                    <img src={item.image} alt={item.title} className="w-24 h-24 object-cover mb-4 sm:mb-0 sm:mr-6" />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-2">₹{item.price}</p>
                      <div className="flex items-center mb-4">
                        {item.quantity > 1 && (
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="bg-gray-200 text-gray-600 px-2 py-1 rounded-l"
                          >
                            <FaMinus />
                          </button>
                        )}
                        <span className="bg-gray-100 px-4">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-200 text-gray-600 px-2 py-1 rounded-r"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-semibold mb-2">₹{(item.price * item.quantity)}</p>
                      <div className="flex items-center">
                     
                         {/* <CheckoutButton className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 mr-2" productId={item.id} quantity={item.quantity} /> */}
                       
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>

                    </div>
                    
                  </div>
                <div>
                       
                </div>
       
                </>
                ))}
        
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>₹0.00</span>
                    </div>
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">₹{(total - discount).toFixed(2)}</span>
                  </div>
                  {couponCode ? (
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-green-600"><FaCheck /> Coupon Applied: {couponCode}</span>
                      <button onClick={handleRemoveCoupon} className="text-red-500"><FaTimes /></button>
                    </div>
                  ) : (
                    <button onClick={() => setShowCouponModal(true)} className='bg-slate-400 text-center w-full p-2 mb-2 text-amber-900 font-extrabold hover:text-green-900'>
                      Have a Coupon Code?
                    </button>
                  )}
                  <CouponModal
                    show={showCouponModal}
                    onClose={() => setShowCouponModal(false)}
                    onApplyCoupon={handleApplyCoupon}
                  />
                  <button
                    onClick={handleCheckoutAll}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
  {loading ? 'Processing...' : 'Checkout All'}
</button>
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-bold mb-4 text-center">Please Login to view your cart</h1>
          <Link to="/login">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export const AddToCartButton = ({ productId }) => {

  const { currentUser, setCart } = useUserStore();
  const navigate = useNavigate();
const location = useLocation();
  const addToCart = async () => {
    if (!currentUser) {
      toast.info('Please log in to add items to your cart');
      setTimeout(() => {
        navigate('/login', { state: { from: location } });
   }, 2000);
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.id);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const cartProducts = userData.cart || [];

      const existingProduct = cartProducts.find(item => item.id === productId);
      if (existingProduct) {
          document.getElementById('addtocart').innerHTML = 'Already in Cart';
      } else {
        cartProducts.push({ id: productId, quantity: 1 });
        await updateDoc(userRef, { cart: cartProducts });
        setCart(cartProducts);
        toast.success('Item added to cart');
        document.getElementById('addtocart').innerHTML = 'Already in Cart';
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
    id='addtocart'
      onClick={addToCart}
      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
    >
      Add to Cart
    </button>
  );
};

export default Cart;

