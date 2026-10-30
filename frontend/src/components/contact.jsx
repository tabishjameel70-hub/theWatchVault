import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-[#FCFCF9] font-sans selection:bg-[#c19a6b] selection:text-white">
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-24">
        
        {/* --- ABOUT SECTION --- */}
        <section className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-24 md:mb-32">
          
          {/* Text Content */}
          <div className="flex-1 space-y-8 order-2 lg:order-1">
            <div>
              <span className="text-[#c19a6b] uppercase tracking-[0.25em] text-xs font-bold">
                Our Philosophy
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#162032] leading-[1.1] mt-4">
                Curators of <br />
                <span className="italic font-light text-stone-500">Timeless Elegance.</span>
              </h1>
            </div>
            
            <div className="space-y-5 text-stone-500 text-sm md:text-base leading-relaxed">
              <p>
                At The Watch Vault, we believe a timepiece is far more than a mere instrument to measure hours—it is a statement of heritage, precision, and personal legacy. Founded on an uncompromising passion for horological excellence, we bridge the gap between classic craftsmanship and modern sophistication.
              </p>
              <p>
                Whether you are seeking a rare collector's edition to pass down through generations, or a daily symbol of refinement, our global sourcing network ensures that only the most exceptional, authentic watches make it into our vault. 
              </p>
              <p className="font-medium text-[#162032]">
                Your time is your ultimate luxury. Wear it well.
              </p>
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="flex-1 w-full order-1 lg:order-2">
            <div className="relative aspect-square md:aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden group shadow-2xl shadow-stone-200/50">
              <img 
                src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop" 
                alt="Luxury Watch Movement" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />
              {/* Subtle elegant overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* --- DIVIDER --- */}
        <div className="w-full max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent mb-20 md:mb-24"></div>

        {/* --- CONTACT SECTION --- */}
        <section>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#162032]">
              Get in Touch
            </h2>
            <p className="text-stone-500 mt-4 text-sm md:text-base">
              Experience bespoke client service. Our concierges are available to assist you around the clock.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            
            {/* Phone Card */}
            <div className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-stone-200/50 border border-stone-100 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 bg-stone-50 group-hover:bg-[#f4f1eb] text-[#c19a6b] rounded-full flex items-center justify-center mb-6 transition-colors duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 className="text-[#162032] font-serif text-lg mb-1">Direct Line</h3>
              <p className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-[0.15em] mb-4">Personal Concierge</p>
              <a href="tel:03150231516" className="text-[#162032] font-medium text-lg hover:text-[#c19a6b] transition-colors">
                0315-0231516
              </a>
            </div>

            {/* Email Card */}
            <div className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-stone-200/50 border border-stone-100 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 bg-stone-50 group-hover:bg-[#f4f1eb] text-[#c19a6b] rounded-full flex items-center justify-center mb-6 transition-colors duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3 className="text-[#162032] font-serif text-lg mb-1">Digital Support</h3>
              <p className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-[0.15em] mb-4">Email Inquiries</p>
              <a href="mailto:iftikharanus45@gmail.com" className="text-[#162032] font-medium text-sm sm:text-base hover:text-[#c19a6b] transition-colors break-all">
                iftikharanus45@gmail.com
              </a>
            </div>

            {/* Business Hours Card */}
            <div className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-stone-200/50 border border-stone-100 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 bg-stone-50 group-hover:bg-[#f4f1eb] text-[#c19a6b] rounded-full flex items-center justify-center mb-6 transition-colors duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="text-[#162032] font-serif text-lg mb-1">Vault Hours</h3>
              <p className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-[0.15em] mb-4">Availability</p>
              <span className="text-[#162032] font-medium text-lg">
                24 Hours / 7 Days
              </span>
            </div>

          </div>
        </section>
        
      </main>
    </div>
  );
};

export default About;