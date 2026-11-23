import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { COMPANY_DETAILS } from '../data/websiteContent';
import { SERVICE_CATALOG, SERVICE_CATEGORIES, servicePath, type ServiceCategoryId } from '../data/servicesData';
import { useServiceMetadata } from '../utils/useServiceMetadata';
import {
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles,
  ChevronRight, MessageSquare, Plus, Minus
} from 'lucide-react';

interface ServiceDetailPageProps {
  onOpenAudit: (serviceName?: string) => void;
}

const CATEGORY_ASSURANCES: Record<ServiceCategoryId, [string, string]> = {
  seo: ['100% White-Hat & Guideline Compliant', 'Transparent Weekly Progress Reports'],
  paid: ['Full Ad Account & Pixel Ownership', 'Weekly Spend & CPA Optimization'],
  design: ['1 Year Free Support Included', 'Free Domain Registration (₹999)'],
  development: ['1 Year Free Support Included', '100% Clean Source Code Ownership'],
  mobile: ['1 Year OS & Maintenance Support', 'Play Store & App Store Release Ready'],
  software: ['Full Source Code & IP Ownership', '1 Year Priority Support & Docs'],
  branding: ['100% Commercial Usage Rights', 'Editable Source & Print-Ready Exports'],
  support: ['Pre-Change Backup & Rollback Plan', 'Verified Staging & Production QA'],
};

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ onOpenAudit }) => {
  const { slug } = useParams<{ slug: string }>();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    setActiveFaq(0);
  }, [slug]);

  // Find matching service
  const service = SERVICE_CATALOG.find((s) => s.slug === slug);
  useServiceMetadata(service && servicePath(service.slug));

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Related services in same or complementary category
  const category = SERVICE_CATEGORIES.find((entry) => entry.id === service.category)!;
  const relatedServices = category.services.filter((entry) => entry.id !== service.id).slice(0, 3);
  const assurances = CATEGORY_ASSURANCES[service.category];

  return (
    <div className="pt-28 pb-20 bg-[var(--bg-primary)] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <Link to="/services" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Services</Link>
          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <span aria-current="page" className="text-indigo-600 dark:text-cyan-400 font-medium truncate">{service.title}</span>
        </nav>
      </div>

      {/* Service Hero */}
      <section className="relative py-16 lg:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className={`space-y-6 ${service.metrics.length ? "lg:col-span-8" : "lg:col-span-10"}`}>
              <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 text-xs font-semibold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider">
                <span>{category.title}</span>
                {service.legacy && <><span aria-hidden="true">·</span><span>7-14 Days Sprint</span></>}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
                {service.title}
              </h1>

              <p className="text-base sm:text-lg text-indigo-700 dark:text-indigo-200/90 font-medium">
                {service.subtitle}
              </p>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {service.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => onOpenAudit(service.title)}
                  className="px-7 py-3.5 rounded-xl genmax-action text-white font-semibold text-sm hover:opacity-95 shadow-md transition-all flex max-w-full items-center gap-2 text-left cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Request Proposal for {service.title}</span>
                </button>

                <a
                  href={COMPANY_DETAILS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-600/15 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Quick WhatsApp Discuss</span>
                </a>
              </div>
            </div>

            {/* Performance KPIs Card */}
            {service.metrics.length > 0 && (
              <div className="lg:col-span-4">
                <div className="p-8 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-[#0F172A] border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl space-y-6 box-zoom">
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 pb-3 border-b border-slate-100 dark:border-slate-800">
                    Target Performance & Delivery
                  </div>

                  {service.metrics.map((m, idx) => (
                    <div key={idx}>
                      <div className="text-3xl font-bold font-heading text-slate-900 dark:text-white">{m.value}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.label}</div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                      <span>{assurances[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-cyan-400 shrink-0" />
                      <span>{assurances[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* In-Depth Description Paragraphs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Column: Full Copy */}
            <div className={`space-y-6 ${service.process.length ? "lg:col-span-7" : "lg:col-span-9"}`}>
              <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest">
                Service Overview & Strategic Value
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
                About {service.title}
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {service.fullDescription.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Deliverables Checklist */}
              <div className="pt-8">
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-4">
                  What Is Included in This Deliverable
                </h3>
                <div className="space-y-3">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-slate-700 box-zoom-sm">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: 4-Step Process */}
            {service.process.length > 0 && (
              <div className="lg:col-span-5 space-y-6">
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl box-zoom-sm">
                  <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
                    Our Sprint Execution
                  </div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-6">
                    4-Step Delivery Methodology
                  </h3>

                  <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {service.process.map((step) => (
                      <div key={step.step} className="relative pl-9">
                        <div className="absolute left-1.5 -translate-x-1/2 top-1 w-4 h-4 rounded-full bg-indigo-600 dark:bg-cyan-400 border-4 border-white dark:border-[#0B1020]" />
                        <div className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 mb-1">
                          STEP {step.step}
                        </div>
                        <h4 className="text-sm font-bold font-heading text-slate-900 dark:text-white mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onOpenAudit(service.title)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all text-center cursor-pointer shadow-md"
                    >
                      Discuss Your {service.title} Scope
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Service FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 bg-slate-100/60 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
                Questions on This Service
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
                Frequently Asked About {service.title}
              </h2>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-slate-700 box-zoom-sm">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-semibold font-heading text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 ml-4">
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-6">
              Related Services in {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id}
                  to={servicePath(rel.slug)}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-cyan-500/50 shadow-xs hover:shadow-xl box-zoom group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-cyan-400 font-semibold">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
