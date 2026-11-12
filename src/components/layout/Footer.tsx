import React from 'react';
import { Link } from 'react-router-dom';
import { GenmaxLogo } from '../brand/GenmaxLogo';
import { COMPANY_DETAILS } from '../../data/websiteContent';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake, Zap, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenVerify?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVerify }) => {
  return (
    <footer className="relative bg-[#070B16] border-t border-slate-800/80 text-slate-400 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Pillars Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 mb-16 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">1 Year Free Technical Support</h4>
              <p className="text-xs text-slate-400">Complimentary 365 days support on all web & app projects</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">7-14 Business Days Delivery</h4>
              <p className="text-xs text-slate-400">Disciplined agile execution with zero sacrifice in quality</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% White-Hat SEO</h4>
              <p className="text-xs text-slate-400">Google Webmaster compliant strategies built for sustainable ranks</p>
            </div>
          </div>
        </div>

        {/* Multi-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1: Brand Info & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block mb-2">
              <GenmaxLogo size="lg" theme="white" />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed pr-4">
              {COMPANY_DETAILS.tagline}. We combine deep technical architecture, algorithmic search dominance, and conversion UI to scale ambitious businesses.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{COMPANY_DETAILS.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {COMPANY_DETAILS.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-white transition-colors">
                  {COMPANY_DETAILS.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{COMPANY_DETAILS.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: SEO & Marketing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              SEO & Marketing
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/local-seo" className="hover:text-white transition-colors">Local SEO & Google Maps</Link>
              </li>
              <li>
                <Link to="/services/seo-services" className="hover:text-white transition-colors">Comprehensive SEO</Link>
              </li>
              <li>
                <Link to="/services/ecommerce-seo" className="hover:text-white transition-colors">eCommerce SEO</Link>
              </li>
              <li>
                <Link to="/services/social-media-marketing" className="hover:text-white transition-colors">Social Media Marketing</Link>
              </li>
              <li>
                <Link to="/services/ppc-management" className="hover:text-white transition-colors">PPC Management</Link>
              </li>
              <li>
                <Link to="/services/reputation-management" className="hover:text-white transition-colors">Reputation Management (ORM)</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Web Design & CMS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Web Design & CMS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/website-design-india" className="hover:text-white transition-colors">Website Design India</Link>
              </li>
              <li>
                <Link to="/services/wordpress-website-design" className="hover:text-white transition-colors">WordPress Web Design</Link>
              </li>
              <li>
                <Link to="/services/woocommerce-web-design" className="hover:text-white transition-colors">WooCommerce Web Design</Link>
              </li>
              <li>
                <Link to="/services/responsive-web-design" className="hover:text-white transition-colors">Responsive Web Design</Link>
              </li>
              <li>
                <Link to="/services/website-redesign" className="hover:text-white transition-colors">Website Redesign</Link>
              </li>
              <li>
                <Link to="/services/wordpress-development" className="hover:text-white transition-colors">WordPress Development</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Engineering & Apps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Engineering & Apps
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/website-development" className="hover:text-white transition-colors">Custom Web Development</Link>
              </li>
              <li>
                <Link to="/services/laravel-development" className="hover:text-white transition-colors">Laravel Applications</Link>
              </li>
              <li>
                <Link to="/services/codeigniter-development" className="hover:text-white transition-colors">CodeIgniter Development</Link>
              </li>
              <li>
                <Link to="/services/matx-development" className="hover:text-white transition-colors">Matx Web Development</Link>
              </li>
              <li>
                <Link to="/services/ios-app-development" className="hover:text-white transition-colors">iOS Mobile Apps</Link>
              </li>
              <li>
                <Link to="/services/android-app-development" className="hover:text-white transition-colors">Android Mobile Apps</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {COMPANY_DETAILS.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
            <Link to="/portfolio" className="hover:text-slate-300 transition-colors">Case Studies</Link>
            <Link to="/pricing" className="hover:text-slate-300 transition-colors">Pricing</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link
              to="/admin/leads"
              className="text-slate-600 hover:text-slate-400 text-[11px] transition-colors"
              title="Company Management Portal & Excel Export"
            >
              <span>Admin Portal</span>
            </Link>
            <a
              href="https://genmaxitsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              <span>Original Site Link</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
