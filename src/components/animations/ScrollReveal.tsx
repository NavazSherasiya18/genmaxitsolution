import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in ms
  duration?: number; // in ms
  yOffset?: number; // distance in px
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  as?: React.ElementType;
}

/**
 * Custom hook to detect when an element intersects the viewport
 */
export function useScrollReveal({
  threshold = 0.12,
  rootMargin = '0px 0px -50px 0px',
  once = true,
}: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect accessibility reduced motion setting
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Fallback if IntersectionObserver is unavailable
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

/**
 * ScrollReveal Component
 * Smoothly fades and slides up content as it enters the viewport via native IntersectionObserver
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 750,
  yOffset = 26,
  threshold = 0.12,
  rootMargin = '0px 0px -60px 0px',
  once = true,
  as: Component = 'div',
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold, rootMargin, once });

  return (
    <Component
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : `translateY(${yOffset}px)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Component>
  );
};
