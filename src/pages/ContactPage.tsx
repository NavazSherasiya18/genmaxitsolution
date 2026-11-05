import React, { useState } from 'react';
import { COMPANY_DETAILS } from '../data/websiteContent';
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleMapsSection } from '../components/maps/GoogleMapsSection';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Comprehensive SEO & Web Redesign',
    budget: '₹25,000 - ₹50,000',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please provide your contact phone or WhatsApp number.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please describe your project goals or requirements.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#22D3EE', '#A78BFA'],
        });
      } catch {
        // Fallback safely
      }
    }, 850);
  };

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <section className="relative py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
              Direct Contact & Solutions Desk
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Let's Discuss Your Project. <br />
              <span className="gradient-text">Fast Turnarounds. Tangible Results.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Reach out directly to our engineering and digital strategy teams in Noida, Delhi NCR. We respond to all qualified inquiries within 2 business hours.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Office Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl relative">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-cyan-500/10 border border-emerald-200 dark:border-cyan-500/30 flex items-center justify-center text-emerald-600 dark:text-cyan-400">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                      Inquiry Dispatched Successfully
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. Our senior technical team in Noida has logged your inquiry. We will review your requirements and respond at <strong className="text-indigo-600 dark:text-cyan-400">{formData.email}</strong> within 2 business hours.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        Send another message
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                      Send Us a Message
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
                      Complete the brief below to receive an itemized proposal, architectural timeline, or pricing quote.
                    </p>

                    {errorMessage && (
                      <div className="mb-6 p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Phone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 99383 07637"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Primary Service Focus
                          </label>
                          <select
                            value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                          >
                            <option value="Local SEO & Google Maps 3-Pack">Local SEO & Google Maps</option>
                            <option value="Comprehensive SEO & Penalty Recovery">Comprehensive SEO</option>
                            <option value="Website Design India">Website Design India</option>
                            <option value="WordPress & WooCommerce Stores">WordPress & WooCommerce</option>
                            <option value="Custom Laravel / CodeIgniter / Matx">Laravel / CodeIgniter / Matx</option>
                            <option value="iOS & Android Mobile App Development">iOS & Android Mobile Apps</option>
                            <option value="Website Redesign & Speed Optimization">Website Redesign & Speed</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Project Scope & Goals *
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Tell us about your current website, ranking goals, target market, or specific software requirements..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white font-bold text-sm tracking-wide uppercase hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Submit Project Inquiry</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        By submitting, your details remain 100% confidential under NDA. No spam, ever.
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Contact Details & Office */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                  Direct Office Contacts
                </h3>

                <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0 mt-1" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-heading">Noida Headquarters:</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{COMPANY_DETAILS.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0 mt-1" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-heading">Direct Telephone / WhatsApp:</strong>
                      <a href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, '')}`} className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline">
                        {COMPANY_DETAILS.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0 mt-1" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-heading">Email Address:</strong>
                      <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline">
                        {COMPANY_DETAILS.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0 mt-1" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-heading">Operational Hours:</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{COMPANY_DETAILS.workingHours}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={COMPANY_DETAILS.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Instant WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              {/* Interactive Office Location Map */}
              <GoogleMapsSection compact={true} />
            </div>

          </div>
        </div>
      </section>

      {/* Dedicated Interactive Google Map & Commute Navigator */}
      <section className="pb-16 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GoogleMapsSection />
        </div>
      </section>
    </div>
  );
};
