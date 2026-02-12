import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../zstandstore';
import axios from 'axios';

const OrdersPage = () => {
  const { currentUser } = useUserStore();
  const [orders, setOrders] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!currentUser) return;
  
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${url}api/UserOrders`, {
          headers: {
            'Content-Type': 'application/json',
            'email': currentUser.email,
          },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders();
  }, [currentUser, url]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Orders</h2>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-gray-600 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-gray-100 pb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono text-gray-700">{order.order_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ordered On</p>
                      <p className="text-gray-700">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-full">
                      <p className="text-blue-700 font-medium">{order.status}</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="space-y-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4">
                          <div className="bg-gray-50 rounded-lg p-4 h-40 flex items-center justify-center">
                            <img 
                              src={url.replace(/\/+$/, '') + item.image_url} 
                              alt={item.title}
                              className="max-h-32 max-w-full object-contain"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {item.title}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Quantity</p>
                                <p className="font-medium">{item.quantity}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Price per unit</p>
                                <p className="font-medium">₹{item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Shipping Address</p>
                      <p className="text-gray-700">{order.address}</p>
                      <p className="text-gray-700">{order.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-800">₹{order.total_amount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;