import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#162032] text-stone-300 py-12 md:py-16 font-sans border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">
          
          {/* Section 1: Company & Brand Information */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              {/* You can replace this text with an <img /> tag if you have an SVG logo */}
              <span className="text-2xl font-serif font-bold text-white tracking-wider">
                The Watch Vault
              </span>
            </Link>
            <p className="text-stone-400 leading-relaxed font-light max-w-sm">
              Curating timeless elegance. We source and deliver the world's most premium, authentic timepieces. Luxury isn't just a style, it's a statement on your wrist.
            </p>
          </div>

          {/* Section 2: Contact Details */}
          <div>
            <h3 className="text-white font-serif text-sm mb-6 uppercase tracking-[0.2em] text-[#c19a6b]">
              Contact Us
            </h3>
            <ul className="space-y-5 font-light text-stone-400">
              <li className="flex items-start group">
                <svg className="w-5 h-5 mr-4 text-[#c19a6b] mt-1 flex-shrink-0 transition-transform group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  123 Luxury Avenue, Suite 400<br />
                  Karachi, Sindh, Pakistan
                </span>
              </li>
              <li className="flex items-center group cursor-pointer hover:text-white transition-colors">
                <svg className="w-5 h-5 mr-4 text-[#c19a6b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+92 (300) 123-4567</span>
              </li>
              <li className="flex items-center group cursor-pointer hover:text-white transition-colors">
                <svg className="w-5 h-5 mr-4 text-[#c19a6b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@thewatchvault.com</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Business Hours (Added for visual balance) */}
          <div>
            <h3 className="text-white font-serif text-sm mb-6 uppercase tracking-[0.2em] text-[#c19a6b]">
              Business Hours
            </h3>
            <ul className="space-y-4 font-light text-stone-400">
              <li className="flex justify-between border-b border-stone-800 pb-3">
                <span>Monday - Friday</span>
                <span className="text-stone-300">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-stone-800 pb-3">
                <span>Saturday</span>
                <span className="text-stone-300">10:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Sunday</span>
                <span className="text-[#c19a6b]">Closed</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright Notice & Legal Links */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-stone-500 tracking-wide">
          <p>
            &copy; {currentYear} The Watch Vault. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link to="/privacy" className="hover:text-[#c19a6b] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#c19a6b] transition-colors">Terms of Service</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;