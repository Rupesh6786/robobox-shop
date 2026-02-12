import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const url = import.meta.env.VITE_BACKEND_URL;

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState({});
  const ordersPerPage = 25;

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${url}api/ordersAdmin`, {
          method: 'GET',
          headers: {
            'Authorization': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Format the data to match your component's expectations
        const formattedData = data.map(order => ({
          orderId: order.orderId,
          user: order.customerEmail,
          product_title: order.products.map(p => p.name).join(', '),
          quantity: order.products.reduce((sum, p) => sum + p.quantity, 0),
          amount: order.totalAmount,
          created_at: order.createdAt,
          status: order.status,
          razorpay_order_id: order.razorpayOrderId,
          razorpay_payment_id: order.razorpayPaymentId,
          address: order.shippingAddress,
          phone: order.customerPhone
        }));

        setOrders(formattedData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const now = new Date();
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      let dateCondition = true;

      if (dateFilter === '1year') {
        const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        dateCondition = orderDate >= oneYearAgo;
      } else if (dateFilter === '6months') {
        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
        dateCondition = orderDate >= sixMonthsAgo;
      } else if (dateFilter === '1month') {
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        dateCondition = orderDate >= oneMonthAgo;
      }

      return (
        (order.orderId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.user?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()) &&
        dateCondition
      );
    });
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'bg-gray-500';
      case 'dispatched':
        return 'bg-yellow-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-red-500';
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus.toLowerCase() === 'delivered') {
      const confirm = window.confirm('Setting status to "Delivered" will notify the user and cannot be reverted. Proceed with caution.');
      if (!confirm) return;
    }

    setLoading(prevLoading => ({ ...prevLoading, [orderId]: true }));

    try {
      await fetch(`${url}api/UserOrders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token')
        },
        body: JSON.stringify({ status: newStatus })
      });
      setOrders(prevOrders => prevOrders.map(order => order.orderId === orderId ? { ...order, status: newStatus } : order));
      toast.success('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status.');
    } finally {
      setLoading(prevLoading => ({ ...prevLoading, [orderId]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
   
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Orders</h1>
      
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search orders..."
          className="w-full md:w-64 px-3 py-2 border rounded-md mb-2 md:mb-0"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full md:w-auto px-3 py-2 border rounded-md"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="placed">Placed</option>
          <option value="dispatched">Dispatched</option>
          <option value="delivered">Delivered</option>
        </select>
        <select
          className="w-full md:w-auto px-3 py-2 border rounded-md"
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Dates</option>
          <option value="1year">Past 1 Year</option>
          <option value="6months">Past 6 Months</option>
          <option value="1month">Past 1 Month</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">No orders currently. Orders will be shown here if placed.</p>
        </div>
      ) : (
        <>
          {currentOrders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4">
                <h2 className="text-xl font-semibold">Order ID: {order.orderId}</h2>
                <span className={`px-3 py-1 mt-2 md:mt-0 rounded-full text-white text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="mb-4">
                <p className="mb-2"><span className="font-medium">User:</span> {order.user}</p>
                <p className="mb-2"><span className="font-medium">Product:</span> {order.product_title}</p>
               <p className="mb-2"><span className="font-medium">Quantity:</span> {order.quantity}</p>
                 <p className="mb-2"><span className="font-medium">Amount:</span> {order.amount}</p>
                <p className="mb-2"><span className="font-medium">Phone:</span> {order.phone}</p>
                <p className="mb-2"><span className="font-medium">Address:</span> {order.address}</p>
                <p className="mb-2"><span className="font-medium">Razorpay Order ID:</span> {order.razorpay_order_id}</p>
                <p className="mb-2"><span className="font-medium">Razorpay Payment ID:</span> {order.razorpay_payment_id}</p>
                <p className="text-sm text-gray-600">Created at: {new Date(order.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}</p>
              </div>
              <select
                className={`mt-2 px-3 py-2 border rounded-md ${order.status === "delivered" ? 'bg-gray-300 cursor-not-allowed' : ''}`}
                disabled={((order.status === "delivered") || (order.status === "canceled"))}
                value={order.status}
                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}>
                <option value="placed">Placed</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                {/* <option value="canceled " className=' bg-red-300'>Canceled</option> */}
              </select>
          
            </div>
          ))}

          <div className="mt-4 flex justify-center">
            {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ManageOrders;