import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, Sparkles, MessageSquare, PhoneCall } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPANY_DETAILS } from '../../data/websiteContent';

interface VerifyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerifyDetailsModal: React.FC<VerifyDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [clientInfo, setClientInfo] = useState<{ name: string; email: string; phone: string } | null>(null);

  // Clear errors when user edits fields
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [name, email, phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please provide a valid business email address.');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage('Please provide your valid contact phone or WhatsApp number.');
      return;
    }

    // Client-side quick duplicate email check
    try {
      const existingLocal = JSON.parse(localStorage.getItem('genmax_verified_emails') || '[]');
      if (Array.isArray(existingLocal) && existingLocal.includes(cleanEmail)) {
        setErrorMessage('⚠️ This Email ID has already been registered! Only 1 entry is permitted per Email ID. Duplicate submissions are not accepted. (આ ઈમેલ આઈડી થી પહેલેથી નોંધણી થયેલ છે).');
        return;
      }
    } catch {
      // Continue to server verification
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          source: 'Website 5-Second Verification Popup',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409 || result.duplicate) {
          setErrorMessage('⚠️ This Email ID has already been registered! Only 1 entry is permitted per Email ID. Duplicate submissions are not accepted. (આ ઈમેલ આઈડી થી પહેલેથી એન્ટ્રી થઈ ગયેલ છે, બીજી વાર માન્ય નથી).');
          setIsSubmitting(false);
          return;
        }
        throw new Error(result.error || 'Failed to verify details.');
      }

      // Save locally to prevent duplicate attempts from the same browser
      try {
        const existingLocal = JSON.parse(localStorage.getItem('genmax_verified_emails') || '[]');
        if (Array.isArray(existingLocal) && !existingLocal.includes(cleanEmail)) {
          existingLocal.push(cleanEmail);
          localStorage.setItem('genmax_verified_emails', JSON.stringify(existingLocal));
        }
      } catch {
        // Safe fallback
      }

      setClientInfo({ name: cleanName, email: cleanEmail, phone: cleanPhone });
      setIsSuccess(true);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#06B6D4', '#22C55E'],
        });
      } catch {
        // Ignore
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err?.message || 'A network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Dialog Styled in Website Theme */}
      <div 
        className="relative w-full max-w-[460px] rounded-3xl bg-white dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Brand Glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-indigo-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-cyan-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button 'X' */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close verify popup"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header / Brand Identity */}
            <div className="text-center pt-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-200/80 dark:border-indigo-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Verification Desk</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
                Verify Your Details
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Connect directly with Genmax IT Solution senior engineers for your custom web development, mobile app, or SEO project.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Your Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Email Address (Strict Unique Constraint) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Business Email Address *
                  </label>
                  <span className="text-[10px] text-indigo-600 dark:text-cyan-400 font-medium">
                    1 Entry per Email
                  </span>
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone Number / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 99383 07637"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Signature Brand Gradient Verify Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white font-bold text-sm sm:text-base tracking-wide uppercase hover:opacity-95 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Connect With Team</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust & Confidentiality Notice */}
              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>100% Confidential under NDA • Dispatched to Genmax management • Zero Spam</span>
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Client Success Confirmation State (NO Excel Download Button) */
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                Details Verified Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900 dark:text-white">{clientInfo?.name}</strong>. Your inquiry has been securely dispatched to our senior consulting desk in Noida. We will review your project and contact you within 2 business hours.
              </p>
            </div>

            {/* Client's verified details review */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Registered Email:</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{clientInfo?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Contact Number:</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{clientInfo?.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Response Guarantee:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Under 2 Hours</span>
              </div>
            </div>

            {/* Client Action CTAs */}
            <div className="pt-2 space-y-2.5">
              <a
                href={COMPANY_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Chat: {COMPANY_DETAILS.phoneDisplay}</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Continue Browsing Website
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
