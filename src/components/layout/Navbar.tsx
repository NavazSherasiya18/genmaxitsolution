import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GenmaxLogo } from '../brand/GenmaxLogo';
import { ChevronDown, Menu, X, ArrowUpRight, Sparkles, PhoneCall, Sun, Moon } from 'lucide-react';
import { SERVICES, COMPANY_DETAILS } from '../../data/websiteContent';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenAudit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAudit }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location.pathname]);

  const categories = [
    { key: 'seo', name: 'Digital Marketing & SEO', items: SERVICES.filter(s => s.category === 'seo') },
    { key: 'design', name: 'Website Design', items: SERVICES.filter(s => s.category === 'design') },
    { key: 'development', name: 'Web Development', items: SERVICES.filter(s => s.category === 'development') },
    { key: 'mobile', name: 'Mobile App Engineering', items: SERVICES.filter(s => s.category === 'mobile') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm dark:shadow-lg py-3'
            : 'bg-white/70 dark:bg-[#0B1020]/70 backdrop-blur-sm border-b border-slate-200/40 dark:border-slate-800/40 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            {/* Zone 1: Single Brand Element */}
            <Link to="/" className="shrink-0 flex items-center group">
              <GenmaxLogo size="md" theme={theme === 'dark' ? 'gradient' : 'dark'} />
            </Link>

            {/* Zone 2: Concise Nav Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Link
                to="/"
                className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white ${
                  location.pathname === '/' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                Home
              </Link>

              {/* Services Mega Dropdown Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <Link
                  to="/services"
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white py-2 ${
                    location.pathname.startsWith('/services') ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-indigo-600 dark:text-cyan-400' : ''}`} />
                </Link>

                {/* Mega Menu Dropdown */}
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[820px] mt-1 p-6 rounded-2xl bg-white dark:bg-[#0B1020]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="grid grid-cols-2 gap-6">
                      {categories.map((cat) => (
                        <div key={cat.key} className="space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                            {cat.name}
                          </h4>
                          <ul className="space-y-1">
                            {cat.items.map((svc) => (
                              <li key={svc.id}>
                                <Link
                                  to={`/services/${svc.slug}`}
                                  className="text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:translate-x-1 flex items-center justify-between py-1 transition-all group/item"
                                >
                                  <span>{svc.title}</span>
                                  <ArrowUpRight className="w-3 h-3 text-slate-400 dark:text-slate-500 opacity-0 group-hover/item:opacity-100 group-hover/item:text-indigo-600 dark:group-hover/item:text-cyan-400 transition-opacity" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Need a custom technology roadmap?</span>
                      <Link
                        to="/services"
                        className="text-indigo-600 dark:text-cyan-400 hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <span>View All 19 Capabilities</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

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
                className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white ${
                  location.pathname === '/portfolio' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                Case Studies
              </Link>

              <Link
                to="/pricing"
                className={`whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-white ${
                  location.pathname === '/pricing' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                Pricing
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
                className="hidden sm:inline-flex items-center gap-2 px-4.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Free Consultation</span>
              </button>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-white/98 dark:bg-[#0B1020]/95 backdrop-blur-xl pt-24 pb-8 px-6 overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              Home
            </Link>

            <Link
              to="/services"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              All Services (19 Pillars)
            </Link>

            <div className="pl-4 space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800 my-1">
              <Link to="/services/local-seo" className="block text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 py-1">
                Local SEO & Maps
              </Link>
              <Link to="/services/seo-services" className="block text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 py-1">
                Comprehensive SEO
              </Link>
              <Link to="/services/website-design-india" className="block text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 py-1">
                Website Design India
              </Link>
              <Link to="/services/wordpress-development" className="block text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 py-1">
                WordPress Development
              </Link>
              <Link to="/services/woocommerce-web-design" className="block text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 py-1">
                WooCommerce Stores
              </Link>
              <Link to="/services/laravel-development" className="block text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 py-1">
                Laravel Applications
              </Link>
              <Link to="/services/ios-app-development" className="block text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 py-1">
                iOS Mobile Apps
              </Link>
              <Link to="/services/android-app-development" className="block text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 py-1">
                Android Mobile Apps
              </Link>
            </div>

            <Link
              to="/about"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              About Company & Story
            </Link>

            <Link
              to="/portfolio"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              Case Studies
            </Link>

            <Link
              to="/pricing"
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              Pricing Packages
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
                className="w-full py-3 text-center text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 rounded-xl shadow-md"
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
        </div>
      )}
    </>
  );
};
