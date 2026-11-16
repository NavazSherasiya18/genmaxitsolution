import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
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
        className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/35 hover:bg-[#20BD5A] hover:scale-105 active:scale-95 transition-all"
        aria-label="Chat with Genmax on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 fill-current"
          aria-hidden="true"
        >
          <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16.004c0 2.348.613 4.642 1.778 6.665L2.56 29.54l7.037-1.845a13.283 13.283 0 0 0 6.407 1.644h.006c7.363 0 13.337-5.974 13.337-13.338S23.368 2.667 16.004 2.667zm7.767 18.928c-.329.926-1.918 1.77-2.66 1.883-.682.104-1.545.148-2.495-.154-.576-.183-1.314-.427-2.263-.837-3.982-1.72-6.583-5.744-6.783-6.011-.198-.266-1.618-2.154-1.618-4.109 0-1.954 1.024-2.915 1.387-3.312.364-.397.794-.496 1.058-.496.265 0 .53.003.762.014.244.012.571-.093.893.681.33.794 1.124 2.742 1.223 2.941.099.198.165.43.033.695-.132.265-.198.43-.397.662-.198.232-.417.518-.596.695-.198.198-.405.414-.174.811.231.397 1.028 1.696 2.208 2.749 1.517 1.353 2.796 1.772 3.193 1.971.397.198.629.165.86-.099.232-.265.992-1.158 1.257-1.555.265-.397.53-.33.893-.198.364.132 2.316 1.092 2.713 1.29.397.198.662.298.761.464.099.165.099.959-.23 1.885z" />
        </svg>

        {/* Tooltip on hover */}
        <span className="hidden sm:inline-block absolute right-full mr-3 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 border border-slate-700 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Chat on WhatsApp (+91 99383 07637)
        </span>
      </a>
    </div>
  );
};
