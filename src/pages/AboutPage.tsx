import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Zap, Target, Users, Award, MapPin, ArrowRight } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/websiteContent';

interface AboutPageProps {
  onOpenAudit: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenAudit }) => {
  const milestones = [
    { year: '2019', title: 'Agency Inception', description: 'Founded in Noida, Delhi NCR with a laser focus on transparent, white-hat SEO and clean custom web development.' },
    { year: '2021', title: '100+ Enterprise Milestone', description: 'Expanded engineering teams into dedicated Laravel, CodeIgniter, and Matx React enterprise application stacks.' },
    { year: '2023', title: 'Global Delivery Expansion', description: 'Established international client workflows across the USA, UK, UAE, and Australia, managing over 50k monthly organic visits for clients.' },
    { year: '2026', title: '500+ Projects & Next-Gen Architecture', description: 'Surpassed 500 successfully deployed client projects with a 99.8% satisfaction rating and 1-year free support standard.' },
  ];

  const teamMembers = [
    { name: 'Nawaz Sherasiya', role: 'Managing Director & Strategic Lead', specialty: 'Digital Growth Strategy & Enterprise Partnerships' },
    { name: 'Pooja Sharma', role: 'Head of Technical SEO & Search Analytics', specialty: 'Algorithmic Penalty Recovery & Schema Engineering' },
    { name: 'Rohan Mehta', role: 'Lead Full-Stack Software Architect', specialty: 'Laravel, CodeIgniter, Matx & Cloud Infrastructure' },
    { name: 'Ananya Roy', role: 'Senior Product & UI/UX Designer', specialty: 'Figma Systems, Conversion UX & Mobile Ergonomics' },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
              About Genmax IT Solution
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Empowering Businesses with <span className="gradient-text">Uncompromising Engineering</span> & Search Dominance
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              We are a premier digital marketing agency and custom software development company based in Noida, Delhi NCR. We architect high-converting web experiences, dominant Google search campaigns, and robust software tailored for measurable revenue growth.
            </p>
          </div>
        </div>
      </section>

      {/* Split Story Section with Real Studio Image */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xl">
                <img
                  src="/src/assets/images/agency_workspace_1793853537773.jpg"
                  alt="Genmax IT Solution workspace"
                  className="w-full h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest">
                Our Story
              </div>
              <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
                Built on Integrity, Technical Rigor, and Real Client Results
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  At Genmax IT Solution, our journey began with a clear realization: too many agencies sell generic templates, obscure their results behind vanity metrics, and disappear once the final invoice is paid.
                </p>
                <p>
                  We built our firm on the exact opposite principles: <strong>100% white-hat ethical SEO</strong> that withstands algorithmic updates, rapid <strong>7-14 business day agile delivery</strong>, complimentary <strong>domain registration</strong>, and an industry-leading <strong>1 full year of free technical support</strong> on every project.
                </p>
                <p>
                  Today, we are proud to serve over 500 businesses ranging from local medical clinics and specialized retailers to multinational logistics operators and high-growth SaaS founders.
                </p>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-2xl font-bold font-heading text-indigo-600 dark:text-cyan-400">500+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Completed Client Projects</div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-2xl font-bold font-heading text-indigo-700 dark:text-indigo-400">99.8%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Client Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Mission & Values */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
              Our Principles
            </div>
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
              The Values That Guide Every Sprint
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-3">Outcome Over Output</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We measure success not by lines of code or arbitrary keyword lists, but by the tangible commercial outcomes delivered: inbound phone calls, booked appointments, and paying customers.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-3">Absolute Transparency</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero black-box obscurity. You have direct access to your codebase repositories, live Google Search Console metrics, and weekly sprint progress notes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-3">Long-Term Partnership</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We view software and digital visibility as ongoing living assets. Our 365-day free technical support ensures your business never feels stranded.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Engineering Specialists */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
              Our Team
            </div>
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-3">
              Meet the Senior Specialists
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Direct access to seasoned software architects, SEO researchers, and UI designers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl font-bold font-heading text-indigo-600 dark:text-cyan-400 mb-4">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">{member.name}</h3>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-3">{member.role}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {member.specialty}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Journey */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
              Our Journey
            </div>
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Key Milestones of Excellence
            </h2>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-300 dark:before:bg-slate-800">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-12">
                <div className="absolute left-3 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-indigo-600 dark:bg-cyan-400 border-4 border-white dark:border-[#0B1020]" />
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 block mb-1">
                  {m.year}
                </span>
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-1">{m.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mb-4">
            Partner with an Agency That Prioritizes Your Growth
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
            Speak with our leadership team today to review your current website, SEO audit, or custom software project scope.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAudit}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-95 shadow-md transition-all cursor-pointer"
            >
              Request Free Consultation
            </button>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-sm transition-all"
            >
              Contact Our Noida Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
