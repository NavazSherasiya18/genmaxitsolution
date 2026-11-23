import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GenmaxLogo } from '../brand/GenmaxLogo';
import { Menu, X, Sparkles, PhoneCall, Sun, Moon } from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/websiteContent';
import { useTheme } from '../../context/ThemeContext';
import { MobileServicesAccordion, ServicesMegaMenu } from './ServicesNavigation';

interface NavbarProps {
  onOpenAudit: () => void;
  onOpenVerify?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAudit, onOpenVerify }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hamburger = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.key]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;

      event.preventDefault();
      hamburger.current?.focus();
      setMobileMenuOpen(false);
    };
    const breakpoint = window.matchMedia('(min-width: 64rem)');
    const handleBreakpoint = () => setMobileMenuOpen(false);

    document.addEventListener('keydown', handleEscape);
    breakpoint.addEventListener('change', handleBreakpoint);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      breakpoint.removeEventListener('change', handleBreakpoint);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm dark:shadow-lg py-3'
            : 'bg-white/92 dark:bg-[var(--bg-primary)]/88 backdrop-blur-sm border-b border-slate-200/40 dark:border-slate-800/40 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 min-[70rem]:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-3 xl:gap-8">
            {/* Zone 1: Single Brand Element */}
            <Link to="/" className="shrink-0 flex items-center group">
              <GenmaxLogo />
            </Link>

            {/* Zone 2: Concise Nav Links */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-2.5 min-[70rem]:gap-5 xl:gap-7 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Link
                to="/"
                className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white ${
                  location.pathname === '/' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                Home
              </Link>

              <ServicesMegaMenu
                active={location.pathname === '/services' || location.pathname.startsWith('/services/')}
              />

              <Link
                to="/about"
                className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white ${
                  location.pathname === '/about' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                About
              </Link>

              <Link
                to="/portfolio"
                className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white flex items-center gap-1.5 ${
                  location.pathname === '/portfolio' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                <span>Projects & Showcase</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </Link>

              <Link
                to="/solutions-and-plans"
                className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white ${
                  location.pathname === '/solutions-and-plans' || location.pathname === '/pricing'
                    ? 'text-indigo-600 dark:text-cyan-400 font-semibold'
                    : ''
                }`}
              >
                Solutions &amp; Plans
              </Link>

              <Link
                to="/blog"
                className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white ${
                  location.pathname.startsWith('/blog') ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                Blog
              </Link>

              <Link
                to="/contact"
                className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white ${
                  location.pathname === '/contact' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Zone 3: 1 Primary CTA Button + Theme Switcher */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Light / Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-slate-700" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>

              <button
                onClick={onOpenAudit}
                className="hidden sm:inline-flex items-center gap-2 px-4.5 py-2 text-xs font-semibold text-white genmax-action rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Free Consultation</span>
              </button>

              {/* Mobile Menu Hamburger Button */}
              <button
                ref={hamburger}
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls={mobileMenuOpen ? "mobile-navigation" : undefined}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Main navigation"
          onBlur={(event) => {
            const next = event.relatedTarget;
            if (next && next !== hamburger.current && !event.currentTarget.contains(next)) setMobileMenuOpen(false);
          }}
          className="fixed inset-0 z-30 lg:hidden bg-white/98 dark:bg-[var(--bg-primary)]/95 backdrop-blur-xl pt-24 pb-8 px-6 overflow-y-auto overscroll-contain motion-safe:animate-in motion-safe:slide-in-from-top-4 motion-safe:duration-200"
        >
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              Home
            </Link>

            <MobileServicesAccordion onNavigate={() => {
              hamburger.current?.focus();
              setMobileMenuOpen(false);
            }} />

            <Link
              to="/about"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              About Company & Story
            </Link>

            <Link
              to="/portfolio"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <span>Projects & Showcase</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">Live Demos</span>
            </Link>

            <Link
              to="/solutions-and-plans"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              Solutions &amp; Plans
            </Link>

            <Link
              to="/blog"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              Blog & Insights
            </Link>

            <Link
              to="/contact"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              Contact Us
            </Link>

            <div className="pt-4 space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAudit();
                }}
                className="w-full py-3 text-center text-xs font-semibold text-white genmax-action rounded-xl shadow-md"
              >
                Request Free Audit
              </button>

              <a
                href={COMPANY_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp: {COMPANY_DETAILS.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};
