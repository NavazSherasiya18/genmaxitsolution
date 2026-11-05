import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp } from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/websiteContent';

export const FloatingActions: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-24 right-7 z-40 flex flex-col items-center gap-3">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-11 h-11 rounded-full bg-[#111827] border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 flex items-center justify-center shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* WhatsApp Quick Connect */}
      <a
        href={COMPANY_DETAILS.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 active:scale-95 transition-all"
        aria-label="Chat with Genmax on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
        
        {/* Tooltip on hover */}
        <span className="hidden sm:inline-block absolute right-full mr-3 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 border border-slate-700 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Chat on WhatsApp (+91 99383 07637)
        </span>
      </a>
    </div>
  );
};
