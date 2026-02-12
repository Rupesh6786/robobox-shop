import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './Searchbar';
import { useUserStore } from '../../zstandstore';
import { auth } from '../config';
import { LazyLoadImage } from 'react-lazy-load-image-component';



const Navbar = () => {
  const [isKitsOpen, setIsKitsOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  let kitsTimeout, communityTimeout, workshopTimeout, profileTimeout;
  const handleMouseLeaveKits = () => {
    kitsTimeout = setTimeout(() => setIsKitsOpen(false), 300);
  };

  

  const handleMouseEnterProfile = () => {
    clearTimeout(profileTimeout);
    setIsProfileOpen(true);
  };

  const handleMouseLeaveProfile = () => {
    profileTimeout = setTimeout(() => setIsProfileOpen(false), 300);
  };


  const handleMouseEnterKits = () => {
    clearTimeout(kitsTimeout);
    setIsKitsOpen(true);
  };

  const handleMouseEnterWorkshops = () => {
    clearTimeout(workshopTimeout);
    setIsWorkshopOpen(true);
  };

  const handleMouseLeaveWorkshops = () => {
    workshopTimeout = setTimeout(() => setIsWorkshopOpen(false), 300);
  };

  const handleMouseLeaveCommunity = () => {
    communityTimeout = setTimeout(() => setIsCommunityOpen(false), 300);
  };

  const handleMouseEnterCommunity = () => {
    clearTimeout(communityTimeout);
    setIsCommunityOpen(true);
  };

const {currentUser,cart} = useUserStore();

  return (
    <>
      <nav className="bg-gray-200  p-4 z-50">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center w-full md:w-auto justify-between">
            <Link to="/">
              <LazyLoadImage src="/images/logo.webp" alt="The RoboBox" className="select-none h-16 ml-4 md:ml-12 hover:scale-125 duration-150"/>
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          
          <div className="w-full md:w-1/3 my-4 md:my-0">
            <SearchBar />
          </div>

          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:space-x-4 md:mr-8 w-full md:w-auto`}>
          <div className='relative'>
                <Link to="https://home.therobobox.co" className="text-gray-700 hover:text-green-500">Home</Link>
              </div>
            
            {/* Kits dropdown */}
            <div className="relative">
              <button 
                onMouseEnter={handleMouseEnterKits}
                onMouseLeave={handleMouseLeaveKits}
                onClick={() => setIsKitsOpen(!isKitsOpen)}
                className="text-gray-700 flex items-center w-full md:w-auto justify-between"
              >
                Kits
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {isKitsOpen && (
                <div 
                  onMouseEnter={handleMouseEnterKits}
                  onMouseLeave={handleMouseLeaveKits}
                  className="md:absolute left-0 p-4 z-50 mt-2 w-full md:w-48 bg-white border border-gray-300 rounded shadow-lg"
                >
                  <ul className="submenu-nav">
                  <a href="/searchquer?q=robobox" className="block hover:bg-gray-100 text-gray-700 py-2">Robobox Kits</a>
                <a href="/searchquer?q=Mechatronics" className="block hover:bg-gray-100 text-gray-700 py-2">Mechatronics Kits</a>
                <a href="/searchquer?q=Blix" className="block text-gray-700 hover:bg-gray-100 py-2">Blix Kits</a>
                <a href="/searchquer?q=Drone" className="block text-gray-700 hover:bg-gray-100 py-2">Drone Kits</a>
                 </ul>
                </div>
              )}
            </div>


            <div className="relative">
              <button 
                onMouseEnter={handleMouseEnterWorkshops}
                onMouseLeave={handleMouseLeaveWorkshops}
                onClick={() => setIsWorkshopOpen(!isWorkshopOpen)}
                className="text-gray-700 flex items-center w-full md:w-auto justify-between"
              >
                Workshop
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {isWorkshopOpen && (
                <div 
                  onMouseEnter={handleMouseEnterWorkshops}
                  onMouseLeave={handleMouseLeaveWorkshops}
                  className="md:absolute z-50 left-0 mt-2 w-full md:w-48 bg-white border border-gray-300 rounded shadow-lg"
                >
                  <ul className="submenu-nav">
                    <li className='block px-4 py-2 text-gray-700 hover:bg-gray-100'><Link href="/insights-to-robotics/">Insights to Robotics</Link></li>
                    <li className='block px-4 py-2 text-gray-700 hover:bg-gray-100'><Link href="/all-in-one-masterclass/">All in one Masterclass</Link></li>
                    <li className='block px-4 py-2 text-gray-700 hover:bg-gray-100'><Link href="/masterclass-scratch-to-pro/">Masterclass (Scratch to Pro)</Link></li>
                  </ul>
                </div>
              )}
            </div>

          
            <div className="relative">
              <button 
                onMouseEnter={handleMouseEnterCommunity}
                onMouseLeave={handleMouseLeaveCommunity}
                onClick={() => setIsCommunityOpen(!isCommunityOpen)}
                className="text-gray-700 flex items-center w-full md:w-auto justify-between"
              >
                Community
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {isCommunityOpen && (
                <div 
                  onMouseEnter={handleMouseEnterCommunity}
                  onMouseLeave={handleMouseLeaveCommunity}
                  className="md:absolute z-50 left-0 mt-2 w-full md:w-48 bg-white border border-gray-300 rounded shadow-lg"
                >
                  <Link to="/soon" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Games</Link>
                  <Link to="/soon" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Scholarship</Link>
                  <Link to="/soon" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Make Your Bot</Link>
                </div>
              )}
            </div>

            

            <div className="flex items-center space-x-4 max-md:flex-col max-md:float-start gap-2" >
            {currentUser ? (
            <>
              <div className="relative">
                <button 
                  onMouseEnter={handleMouseEnterProfile}
                  onMouseLeave={handleMouseLeaveProfile}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-gray-700 flex items-center"
                >
                  {currentUser.username}
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {isProfileOpen && (
                  <div 
                    onMouseEnter={handleMouseEnterProfile}
                    onMouseLeave={handleMouseLeaveProfile}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-50"
                  >
                    <Link to="/editprofile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Edit Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">MY Orders</Link>
                   <button onClick={() => auth.signOut()} className="block px-4 w-full py-2 text-gray-700 hover:bg-red-300">Logout</button>
                  </div>
                )}
              </div>
              <Link to="/cart" className="text-gray-700 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                
                  { 
                  cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  
                   { cart ? cart.length>0 ? cart.length : null : null}
                  </span>
                  )
                  }

                    
                
              </Link>
            </> 
          ) : (
            <Link to="/login" className="text-gray-700">Login</Link>
          )}
        </div>
          </div>
          
        </div>
      </nav>

    </>
  );
};

export default Navbar;