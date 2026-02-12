import React, { useEffect, startTransition, useState } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config';
import { useUserStore } from '../zstandstore';
import IDCard from './Pages/Profile';
import Landing from './Pages/Landing';
import ProductDescription from './Pages/ProductDiscription';
import Cart from './components/Cart';
import Login from './Pages/Login';
import Footer from './components/Footer';
import ErrorPage from './Pages/Error';
import ThreeDPrintForm from './Pages/ThreeDform';
import Dashboard from './Pages/Admin';
import ComingSoonPage from './Pages/CommingSoon';
import SearchResults from './Pages/Searchres';
import OopsDependencyBroke from './Pages/DIPBROK'
import OrdersPage from './components/UserOrder';
import PaymentSuccessPage from './Pages/OrderSucess';
import PaymentFailurePage from './Pages/Failure';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}






const App = () => {
  const { currentUser, isLoading, fetchuserInfo } = useUserStore();
  const [error, setError] = useState(false);



  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      startTransition(() => {
        fetchuserInfo(user ? user.uid : null);
      });
    });

    return () => unSub();
  }, [fetchuserInfo]);






  if (isLoading) {
    return (
      

      <div className="flex justify-center items-center h-screen">
         
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8M4 12a8 8 0 008 8v4c4.418 0 8-3.582 8-8"
          stroke="currentColor"
          strokeWidth="4"
        ></path>
      </svg>
    </div>
    )
  }


      return (

        <>
        
        {error ? (
          <OopsDependencyBroke />
        ) : (
          <ErrorBoundary>
            <ToastContainer />
            <BrowserRouter>
            
              <div className="flex flex-col min-h-screen">
              
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/searchquer" element={<SearchResults />} />
                    <Route path="/product/:id" element={<ProductDescription />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/3dprinting" element={<ThreeDPrintForm />} />
                    <Route path="/soon" element={<ComingSoonPage />} />
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/Orders" element={<OrdersPage />} />
                    <Route path="/orderSucess" element={<PaymentSuccessPage />} />
                    <Route path="/orderFail" element={<PaymentFailurePage />} />
                    <Route
                      path="/editprofile"
                      element={
                        <IDCard
                          user={currentUser}
                          onClose={() => (window.location.href = "/")}
                        />
                      }
                    />
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </ErrorBoundary>
        )}
      </>
      );
}

export default App;













