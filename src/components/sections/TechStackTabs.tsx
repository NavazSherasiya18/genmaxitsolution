import React, { useState } from 'react';
import { Code2, Server, Globe, Smartphone, ShieldCheck, Zap, Layers } from 'lucide-react';

export const TechStackTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cms' | 'backend' | 'frontend' | 'mobile'>('cms');

  const techCategories = {
    cms: {
      title: 'WordPress & WooCommerce Ecosystem',
      badge: 'High-Speed Custom Architectures',
      description: 'We do not rely on bloated commercial templates. We build custom, lightweight WordPress themes and WooCommerce stores engineered for instant sub-1.5s load times and seamless self-editing.',
      technologies: [
        { name: 'Custom Gutenberg', detail: 'Native block editor without clunky page-builder drag' },
        { name: 'WooCommerce Core', detail: 'Frictionless single-page checkout & multi-currency' },
        { name: 'Headless WP', detail: 'Decoupled REST & GraphQL endpoints powering modern web apps' },
        { name: 'Redis Cache', detail: 'Sub-30ms database object caching under heavy traffic surges' },
      ],
    },
    backend: {
      title: 'Enterprise Backend: Laravel & CodeIgniter',
      badge: 'Scalable Microservices & APIs',
      description: 'Robust PHP engineering capable of orchestrating complex business portals, logistics tracking platforms, and multi-tenant SaaS backends with airtight security.',
      technologies: [
        { name: 'Laravel 11+ & Horizon', detail: 'Eloquent ORM, background queues, and Sanctum auth' },
        { name: 'CodeIgniter 4', detail: 'Ultra-lightweight footprint and blazing server response' },
        { name: 'REST & GraphQL APIs', detail: 'Standardized OpenAPI endpoints with JWT token validation' },
        { name: 'MySQL & PostgreSQL', detail: 'Optimized indexed relational database schemas' },
      ],
    },
    frontend: {
      title: 'Matx React & Modern Frontend',
      badge: 'Data-Dense Executive Dashboards',
      description: 'Interactive single-page applications, real-time analytics hubs, and enterprise admin portals built with the modern Matx React Material-UI architecture.',
      technologies: [
        { name: 'React 19 & TypeScript', detail: 'Type-safe component hierarchy and instant client rendering' },
        { name: 'Matx Dashboard UI', detail: 'Enterprise-grade Material Design administrative framework' },
        { name: 'Tailwind CSS v4', detail: 'Zero runtime utility styling with seamless responsive design' },
        { name: 'Motion Engine', detail: 'Hardware-accelerated 60fps micro-animations' },
      ],
    },
    mobile: {
      title: 'Native iOS & Android Mobile Engineering',
      badge: 'App Store & Google Play Ready',
      description: 'Delightful native and cross-platform mobile applications engineered to meet strict Apple Human Interface Guidelines and Google Material Design 3 standards.',
      technologies: [
        { name: 'iOS Swift & SwiftUI', detail: 'Native iOS performance with Face ID and Apple Pay' },
        { name: 'Android Kotlin & Jetpack', detail: 'Smooth execution across 10,000+ Android device profiles' },
        { name: 'React Native', detail: 'Unified high-performance codebase for iOS and Android' },
        { name: 'Firebase FCM', detail: 'Rich real-time push notifications and crash reporting' },
      ],
    },
  };

  const current = techCategories[activeTab];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Category Navigation Bar */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none bg-slate-50/60 dark:bg-slate-900/60">
        <button
          onClick={() => setActiveTab('cms')}
          className={`flex-1 min-w-[160px] py-4 px-6 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'cms'
              ? 'border-indigo-600 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>WordPress & Woo</span>
        </button>

        <button
          onClick={() => setActiveTab('backend')}
          className={`flex-1 min-w-[160px] py-4 px-6 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'backend'
              ? 'border-indigo-600 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Laravel & CodeIgniter</span>
        </button>

        <button
          onClick={() => setActiveTab('frontend')}
          className={`flex-1 min-w-[160px] py-4 px-6 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'frontend'
              ? 'border-indigo-600 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Matx React UI</span>
        </button>

        <button
          onClick={() => setActiveTab('mobile')}
          className={`flex-1 min-w-[160px] py-4 px-6 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'mobile'
              ? 'border-indigo-600 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>iOS & Android Apps</span>
        </button>
      </div>

      {/* Tab Panel Content */}
      <div className="p-8 sm:p-12 animate-in fade-in duration-200">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>{current.badge}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mb-3">
            {current.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {current.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {current.technologies.map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-bold font-heading text-slate-900 dark:text-white mb-1">
                <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-cyan-400" />
                <span>{t.name}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-4 leading-relaxed">
                {t.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
