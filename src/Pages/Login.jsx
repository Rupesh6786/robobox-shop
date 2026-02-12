import React, { useState, useEffect } from 'react';
import { auth, db } from '../config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [page, setPage] = useState('login');
  const [invalid, setInvalid] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
const location = useLocation();
const from = location.state?.from?.pathname || '/';

 

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    mobileNumber: '',
    password: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [ user]);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    }
  }, [user, navigate, from]);
  



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };




  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, username, mobileNumber, password, address, city, state, zipCode } = formData;

    if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      setPhoneError('Phone number must be 10 digits');
      setLoading(false);
      return;
    }
    setPhoneError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        id: userCredential.user.uid,
        username,
        email,
        phone: '+91' + mobileNumber,
        address,
        city,
        state,
        zipCode,
        cart: []
      });

      toast.success('Verification email sent');
      await updateProfile(userCredential.user, { displayName: username });
      setLoading(false);
      setStep(1);
      setPage('login');
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use');
      } else {
        toast.error('Error signing up');
      }
    }
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email } = formData;
    try {
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      toast.success('Reset email sent');
      setPage('login');
    } catch (error) {
      setLoading(false);
      if (error.message === 'auth/user-not-found') {
        toast.error('User not found');
      } else {
        toast.error('Error sending reset email');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        toast.warn('Email not verified. Please verify your email.');
        await sendEmailVerification(userCredential.user);
        return;
      } else {
        toast.success('Login Successful');

        window.location.reload();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);

      if (error.message === 'Firebase: Error (auth/user-not-found).' || error.message === 'Firebase: Error (auth/invalid-credential).') {
        setInvalid(true);
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
    toast.info('Logged out successfully');
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[url('/LoginBg.png')] bg-contain">
 
      {user ? (
        <div className="bg-slate-400 p-8 border shadow-md rounded-md w-96">
          <h2 className="text-2xl font-bold justify-center items-center flex mb-4">Welcome, {user.email}</h2>
          <button
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        {/* redirect user to home page in 3 sec */}
        <p className="text-center text-gray-500 mt-4">Redirecting to home page in 3 seconds...</p>
        </div>
      ) : (
        <>
          {page === 'login' ? (
            <div className="bg-slate-400 p-8 border shadow-md z-50 rounded-md w-96">
              <h2 className="text-2xl font-bold justify-center items-center flex mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {invalid && (
                  <div className="relative bg-red-500 text-white text-sm p-2 rounded-md mt-2">
                    Invalid email or password
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-b-8 border-b-red-500 border-x-8 border-x-transparent"></div>
                  </div>
                )}
                <span
                  onClick={() => setPage('forgot')}
                  className="mb-4 my-4 inline-block text-black hover:text-green-300 cursor-pointer"
                >
                  Forgot password?
                </span>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <div
                className="mt-4 items-center w-full flex bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer p-2 rounded-md justify-center"
                onClick={() => setPage('signup')}
              >
                Create an account
              </div>
            </div>
          ) : page === 'signup' ? (
            <div className="bg-slate-400 p-8 border shadow-md rounded-md w-full max-w-md">
              <h2 className="text-2xl font-bold justify-center items-center flex mb-4">Signup</h2>
              <form onSubmit={handleSignup}>
                {step === 1 && (
                  <div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        required
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        required
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                      <input
                        type="text"
                        required
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                      {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <div className="mb-4">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        required
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                      <input
                        type="password"
                        required
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <div className="mb-4">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        required
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        required
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        required
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                      <input
                        type="text"
                        required
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                      onClick={handlePreviousStep}
                    >
                      Previous
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
                      onClick={handleNextStep}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Signing up...' : 'Signup'}
                    </button>
                  )}
                </div>
              </form>
              <button
                className="mt-4 w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                onClick={() => setPage('login')}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="bg-slate-400 p-8 border shadow-md rounded-md w-96">
              <h2 className="text-2xl font-bold justify-center items-center flex mb-4">Forgot Password</h2>
              <form onSubmit={handleForgetPassword}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Sending reset email...' : 'Send Reset Email'}
                </button>
              </form>
              <button
                className="mt-4 w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                onClick={() => setPage('login')}
              >
                Back to Login
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Login;
