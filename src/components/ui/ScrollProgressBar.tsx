import React, { useState, useEffect } from 'react';

/**
 * Slim, gradient-colored scroll progress bar fixed at the very top of the viewport.
 * Dynamically tracks page depth and transitions smoothly.
 */
export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = window.scrollY;
      const percentage = Math.min(100, Math.max(0, (scrolled / scrollHeight) * 100));
      setProgress(percentage);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none overflow-hidden bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-400 shadow-[0_0_12px_rgba(79,70,229,0.8)] transition-all duration-75 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
};
