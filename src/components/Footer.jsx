import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../zstandstore';

const Footer = () => {
  const {currentUser} = useUserStore();

  return (
    <footer className="bg-gray-900 bottom-0 mt-auto relative text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-lg font-semibold underline decoration-4  mb-8  underline-offset-8 decoration-amber-200">Company</h2>
            <ul className="mt-4 space-y-2">
              <li onClick={()=>{
                window.location.href = 'https://home.therobobox.co/about'
              }} className="hover:text-yellow-500 transition duration-300 cursor-pointer">About Us</li>
              <li onClick={()=>{
                window.location.href = 'https://home.therobobox.co/privacy'
              }} className="hover:text-yellow-500 transition duration-300 cursor-pointer">Privacy Policy</li>
            </ul>  
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-lg  underline decoration-4  mb-8  underline-offset-8 decoration-amber-200 font-semibold">Help</h2>
            <ul className="mt-4 space-y-2">
              <li onClick={()=>{
                window.location.href = 'https://home.therobobox.co/contactus'
              }} className="hover:text-yellow-500 transition duration-300 cursor-pointer">Contact Us</li>
              <li className="hover:text-yellow-500 transition duration-300"><a href="https://therobobox.co">Home</a></li>
              {/* <li className="hover:text-yellow-500 transition duration-300"><a href="#">Refunds</a></li> */}
{ currentUser ? <li className="hover:text-yellow-500 transition duration-300"><a href="https://rzp.io/l/xjIYVfT">Fee Payments</a></li>
          :null }           </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0" onClick={()=>{
            Link('/3dprinting')
          }}>
            <h2 className="text-lg  underline decoration-4 mb-8 underline-offset-8  decoration-amber-200 font-semibold">3D Printing  service</h2>
            <ul className="mt-4 space-y-2">
              <li className=""><a className='hover:text-yellow-500 transition duration-300' href="/3dprinting">Request Service</a></li>
              {/* <li className=""><a className='hover:text-yellow-500 transition duration-300' href="#">Human Following Robot</a></li>
              <li className=""><a className='hover:text-yellow-500 transition duration-300' href="#">Obstacle Avoiding Robot</a></li>
              <li className=""><a className='hover:text-yellow-500 transition duration-300' href="#">Line Following Robot</a></li>
          */}
            </ul>
          </div>

          <div className="w-full md:w-1/4">
            <h2 className="text-lg  underline decoration-4 mb-8   decoration-amber-200 font-semibold">Follow Us</h2>
            <div className="flex mt-4 space-x-4">
              <a href="https://www.facebook.com/wearerobobox/" className="text-gray-400 hover:text-yellow-500 transition duration-300"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition duration-300"><FaTwitter size={24} /></a>
              <a href="https://www.instagram.com/therobobox/?hl=en" className="text-gray-400 hover:text-yellow-500 transition duration-300"><FaInstagram size={24} /></a>
              <a href="https://in.linkedin.com/in/therobobox" className="text-gray-400 hover:text-yellow-500 transition duration-300"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
