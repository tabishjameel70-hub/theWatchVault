import React from 'react';
import heroImage from '../assets/LuxuryGoldChronographWatch.png';
const Hero = () => {
  return (
    <section className="w-full bg-[#F3EBE0] min-h-[550px] flex items-center relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto pl-8 md:pl-16 pr-0 grid grid-cols-1 md:grid-cols-2 items-center h-full">
        
        {/* Left Content: Text & Call to Action */}
        <div className="py-16 md:py-24 z-10 pr-8">
          <p className="text-[#C19B68] text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase mb-4">
            Premium Watches - Authentic - Global
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2D3332] leading-[1.15] mb-5">
            Timeless Elegance <br /> On Your Wrist
          </h1>
          
          <p className="text-gray-500 text-sm md:text-base mb-8 max-w-sm">
            Luxury isn't just a style, it's a statement.
          </p>
          
          <a  href="/shop-collection" className="bg-[#C49B66] hover:bg-[#B08A58] text-white px-7 py-2.5 rounded text-sm font-medium transition-colors w-fit flex items-center gap-2 shadow-sm">
            Shop Collection
            <span className="text-base leading-none">&rarr;</span>
          </a>
        </div>

        {/* Right Content: Hero Image */}
        <div className="absolute right-0 top-0 w-full md:w-[100%] h-full z-0 hidden md:block">
          <img 
            src={heroImage} 
            alt="Luxury Watch in Box" 
            className="w-full h-full object-cover object-left"
          />
        </div>
        
        {/* Mobile Image Fallback (Inline) */}
        <div className="w-full h-64 md:hidden block">
          <img 
            src="image_bcaef7.png" 
            alt="Luxury Watch in Box" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;