import React from 'react';

const ErrorPage = () => {
  return (
   
    <div className="min-h-screen bg-[#030005] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
     
        <h1 className="relative text-[#030005] text-8xl sm:text-9xl md:text-[224px] font-black uppercase tracking-tighter mb-20 sm:mb-16 md:mb-5
                       before:content-['404'] before:absolute before:inset-0 before:text-transparent
                       before:bg-clip-text before:bg-gradient-to-r before:from-[#8400ff] before:to-[#ff005a]
                       after:content-['404'] after:absolute after:inset-0 after:text-transparent
                       after:bg-clip-text after:bg-gradient-to-l after:from-[#8400ff] after:to-[#ff005a]">
          404
        </h1>

        
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-widest mb-8
                       shadow-[0_2px_0px_#8400ff]">
          Page not found
        </h2>

        {/* Homepage link button */}
        <a href="/"
           className="inline-block text-[#ff005a] text-sm font-bold uppercase border-2 border-current
                      px-6 py-3 transition-colors duration-200 hover:text-[#8400ff]">
          Homepage
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;