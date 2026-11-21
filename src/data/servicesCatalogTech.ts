import type { DetailedServiceContent } from './servicesCatalogGrowth.ts';

export const TECH_SERVICES_DETAIL: Record<string, DetailedServiceContent> = {
  'landing-page-design': {
    slug: 'landing-page-design',
    title: 'Landing Page Design',
    subtitle: 'Campaign-Focused Pages Engineered for Message Match & Lead Conversion',
    shortDescription:
      'Design high-converting landing pages tailored to one clear offer, matching ad intent with persuasive hierarchy, social proof, and frictionless enquiry or signup forms.',
    fullDescription: [
      'Sending paid Google Ads or Meta traffic to a cluttered homepage dilutes visitor focus and drives up cost-per-acquisition. Dedicated landing pages remove navigation distractions and answer a buyer’s exact search intent within seconds.',
      'We architect each landing page around clear message-to-market match: an unmistakable hero value proposition, scannable benefit blocks, objection-handling proof, mobile-first CTAs, and progressive lead capture forms.',
      'Designs include interactive Figma prototypes, responsive tablet/mobile breakpoints, form validation states, and explicit analytics event annotations (form submit, WhatsApp click, CTA scroll) ready for immediate developer build or direct implementation.',
    ],
    deliverables: [
      'Offer positioning, headline hierarchy & conversion wireframe blueprint',
      'Custom high-converting visual design in Figma (Desktop + Mobile views)',
      'Dedicated hero, social proof, comparison & objection-handling FAQ sections',
      'Frictionless lead form UX, multi-step toggle options & micro-copy',
      'Click, scroll & conversion event tracking annotations for GA4/Pixels',
      'Developer-ready asset specs or optional full responsive HTML/React build',
    ],
    features: ['Ad Message Match', 'Conversion Wireframes', 'Mobile-First Forms', 'Event Annotations'],
    metrics: [
      { label: 'Focus Goal', value: 'Single Offer CTA' },
      { label: 'Breakpoints', value: 'Desktop + Mobile' },
      { label: 'Delivery Sprint', value: '5-7 Days' },
    ],
    process: [
      {
        step: '01',
        title: 'Traffic & Offer Alignment',
        description: 'Review the exact ad copy, keywords, audience objections, and primary conversion action before sketching layout blocks.',
      },
      {
        step: '02',
        title: 'Conversion Wireframing',
        description: 'Sequence hero hooks, credibility badges, feature proofs, pricing/offer clarity, and sticky mobile CTAs.',
      },
      {
        step: '03',
        title: 'High-Craft Visual Design',
        description: 'Apply clean typography, high-contrast buttons, custom diagrams/mockups, and responsive spacing in Figma.',
      },
      {
        step: '04',
        title: 'Tracking & Build Handoff',
        description: 'Document hover/error states and conversion triggers for clean deployment and A/B split testing.',
      },
    ],
    faqs: [
      {
        question: 'Do you write the landing page copy as well as design the layout?',
        answer: 'Yes. We structure conversion-focused headlines, benefit bullets, proof callouts, and form CTAs matched directly to your ad campaigns.',
      },
      {
        question: 'Can you also develop and host the landing page after designing it?',
        answer: 'Yes—we can hand off clean Figma specs to your developers or build and deploy the live high-speed page directly on React, Next.js, or WordPress.',
      },
    ],
  },

  'ui-ux-design': {
    slug: 'ui-ux-design',
    title: 'UI/UX Design Services',
    subtitle: 'Task-Centered Interface Systems, Prototypes & Scalable Design Tokens',
    shortDescription:
      'Translate complex user workflows into clear information architecture, interactive Figma prototypes, and component libraries ready for smooth engineering handoff.',
    fullDescription: [
      'Great product design reduces cognitive load before a single line of frontend code is written. Fixing confusing navigation or missing workflow states in Figma costs a fraction of refactoring shipped code.',
      'We map user personas, task flows, and edge cases first—covering empty states, validation errors, loading skeletons, permission boundaries, and responsive breakpoints rather than designing only happy-path screens.',
      'Every engagement produces an organized Figma file backed by reusable Auto-Layout components, color/spacing variables, WCAG AA contrast verification, and clickable prototypes stakeholders can test early.',
    ],
    deliverables: [
      'Information architecture, sitemap & end-to-end user task flows',
      'Low-fidelity wireframes validating core workflows before styling',
      'Clickable interactive Figma prototypes for user & stakeholder testing',
      'Modular UI Design System (typography, color tokens, states & variants)',
      'Edge-case coverage (empty states, error feedback, permissions, responsive views)',
      'Clean developer handoff with Redlines, Figma Dev Mode specs & SVG icons',
    ],
    features: ['User Flows & IA', 'Clickable Prototypes', 'Figma Design System', 'Edge-Case Coverage'],
    metrics: [
      { label: 'Accessibility Target', value: 'WCAG 2.1 AA' },
      { label: 'System Format', value: 'Figma Tokens' },
      { label: 'Handoff Standard', value: 'Dev Mode Ready' },
    ],
    process: [
      {
        step: '01',
        title: 'User Task & Friction Mapping',
        description: 'Interview stakeholders, review existing usage drop-offs, and document step-by-step journeys for every user role.',
      },
      {
        step: '02',
        title: 'Wireframes & Flow Validation',
        description: 'Validate screen hierarchy, data density, and navigation architecture rapidly using clean grayscale wireframes.',
      },
      {
        step: '03',
        title: 'Design System & Hi-Fi UI',
        description: 'Build reusable Figma components with hover, focus, disabled, empty, and error variants across desktop and mobile.',
      },
      {
        step: '04',
        title: 'Prototype Review & Dev Handoff',
        description: 'Walk engineers through interactive prototypes, design tokens, and responsive rules for faithful implementation.',
      },
    ],
    faqs: [
      {
        question: 'Can you redesign an existing SaaS or portal interface without breaking familiar workflows?',
        answer: 'Yes. We audit existing user habits first, fix high-friction steps, and roll out modern visual hierarchy that feels intuitive to long-time users.',
      },
      {
        question: 'What does your developer handoff include?',
        answer: 'Developers receive structured Figma files with Auto-Layout components, spacing/color tokens, interactive prototype links, and exportable SVG icons.',
      },
    ],
  },

  'react-nextjs-development': {
    slug: 'react-nextjs-development',
    title: 'React.js & Next.js Development',
    subtitle: 'Type-Safe Frontend Engineering, SSR/ISR Routing & High-Speed Web Apps',
    shortDescription:
      'Build scalable React interfaces and Next.js applications with intentional rendering strategies, clean TypeScript state architecture, and strong Core Web Vitals.',
    fullDescription: [
      'Modern React and Next.js applications require deliberate architectural boundaries. Poor data-fetching waterfalls, oversized client bundles, and uncached server routes erase the speed and SEO advantages of the framework.',
      'We engineer modular TypeScript React and Next.js codebases that choose the right rendering mode per route—static generation or ISR for SEO marketing pages, server components for secure data assembly, and snappy client interactions for dashboards and configurators.',
      'From marketing platforms and headless CMS storefronts to interactive SaaS workspaces, our builds enforce strict type safety, accessible markup, bundle optimization, and automated build/lint verification.',
    ],
    deliverables: [
      'Type-safe React 18+ / Next.js App Router or Pages Router architecture',
      'Route-level rendering strategy (SSR, SSG, ISR & client state boundaries)',
      'Reusable accessible UI component library styled with Tailwind CSS',
      'Headless CMS, REST/GraphQL API & authentication integration',
      'SEO metadata, dynamic OpenGraph tags, sitemaps & Core Web Vitals tuning',
      'Git repository handover, environment documentation & CI/CD setup',
    ],
    features: ['Next.js SSR / ISR', 'Strict TypeScript', 'SEO Metadata Engine', 'Sub-Second Routing'],
    metrics: [
      { label: 'Code Standard', value: 'Strict TS + Lint' },
      { label: 'Performance Focus', value: '95+ Lighthouse' },
      { label: 'IP Ownership', value: '100% Source' },
    ],
    process: [
      {
        step: '01',
        title: 'Architecture & Rendering Plan',
        description: 'Map routes, auth boundaries, SEO pages vs. authenticated workspaces, and API caching rules.',
      },
      {
        step: '02',
        title: 'Component & State Engineering',
        description: 'Build composable TypeScript UI primitives, forms, validation schemas, and predictable API data layers.',
      },
      {
        step: '03',
        title: 'Performance & Accessibility QA',
        description: 'Optimize image loading, code-splitting, keyboard navigation, metadata tags, and Core Web Vitals.',
      },
      {
        step: '04',
        title: 'Automated Build & Production Deploy',
        description: 'Verify zero TypeScript/lint errors, configure Vercel/cloud deployment pipelines, and hand over documentation.',
      },
    ],
    faqs: [
      {
        question: 'When should we choose Next.js instead of a standard React Vite SPA?',
        answer: 'Next.js is ideal when you need server-side rendering, dynamic SEO metadata per page, or server-rendered CMS/product pages. Vite SPAs shine for authenticated dashboards and tools.',
      },
      {
        question: 'Can you integrate Next.js with our existing WordPress, Laravel, or Node backend?',
        answer: 'Yes. We frequently pair a fast React/Next.js frontend with headless WordPress, Laravel APIs, or Express/Node microservices.',
      },
    ],
  },

  'nodejs-api-development': {
    slug: 'nodejs-api-development',
    title: 'Node.js & API Development',
    subtitle: 'Type-Safe Backends, Validated Contracts, Webhooks & Cloud Integrations',
    shortDescription:
      'Architect reliable Node.js and Express/NestJS backends with strict request validation, authentication, background queues, and clear OpenAPI documentation.',
    fullDescription: [
      'A fragile backend turns every frontend sprint into a debugging firefight. Missing input validation, silent webhook failures, and undocumented payloads stall mobile apps, web dashboards, and partner integrations.',
      'We engineer Node.js services in TypeScript using Express, Fastify, or NestJS—backing every endpoint with schema validation (Zod/Joi), role-based authorization, rate limiting, and structured error envelopes.',
      'Whether powering a mobile app, processing payment webhooks, syncing ERP data on scheduled queues, or aggregating external APIs, our backends are tested under failure conditions and documented cleanly for client teams.',
    ],
    deliverables: [
      'REST or GraphQL API architecture with TypeScript Node.js',
      'Schema-based request/response validation & centralized error handling',
      'Authentication & authorization (JWT, OAuth2, API keys & RBAC)',
      'Idempotent webhook receivers, retry queues & background job workers',
      'PostgreSQL/MongoDB/Redis integration with clean migration scripts',
      'Interactive OpenAPI/Swagger or Postman collection & integration tests',
    ],
    features: ['Zod/Schema Validation', 'JWT & RBAC Auth', 'Idempotent Webhooks', 'OpenAPI Docs'],
    metrics: [
      { label: 'API Standards', value: 'OpenAPI 3.0' },
      { label: 'Security Hygiene', value: 'OWASP Aligned' },
      { label: 'Queue Reliability', value: 'Retry + Logging' },
    ],
    process: [
      {
        step: '01',
        title: 'API Contract & Data Modeling',
        description: 'Define endpoints, request/response schemas, authentication scopes, and database relationships upfront.',
      },
      {
        step: '02',
        title: 'Service & Middleware Build',
        description: 'Implement controllers, validation guards, rate limiters, database queries, and async job queues.',
      },
      {
        step: '03',
        title: 'Integration & Failure Testing',
        description: 'Test happy paths alongside malformed payloads, token expiry, duplicate webhooks, and upstream timeouts.',
      },
      {
        step: '04',
        title: 'Docs & Observability Deploy',
        description: 'Publish interactive API docs, structured health checks, and environment configuration for production hosting.',
      },
    ],
    faqs: [
      {
        question: 'Can your Node.js APIs support both our website and mobile apps simultaneously?',
        answer: 'Yes. We design clean, versioned REST or GraphQL contracts shared securely across web portals, iOS/Android apps, and external webhooks.',
      },
      {
        question: 'How do you protect against duplicate payment or webhook events?',
        answer: 'We verify cryptographic webhook signatures, enforce idempotency keys, and log event delivery states so repeated provider retries never create duplicate records.',
      },
    ],
  },

  'ecommerce-development': {
    slug: 'ecommerce-development',
    title: 'E-commerce Development',
    subtitle: 'Custom Storefronts, Multi-Variant Catalogs, Payments & Fulfilment Workflows',
    shortDescription:
      'Build or extend custom eCommerce platforms with fast catalog filtering, streamlined checkout, secure Indian/global payment gateways, and automated order fulfilment.',
    fullDescription: [
      'Modern online retail breaks quickly when stores bolt on conflicting plugins for pricing tiers, shipping rules, GST invoicing, and inventory sync. Shoppers abandon carts when filters lag or payment callbacks fail.',
      'We architect end-to-end eCommerce systems—across custom React storefronts, Shopify Plus, or hardened WooCommerce engines—mapping catalog attributes, stock reservations, promotional rules, and multi-warehouse shipping logic cleanly.',
      'Before launch, we stress-test the complete order lifecycle: card/UPI/wallet payment callbacks, webhook verification, partial refunds, automated GST/tax invoices, and courier tracking sync.',
    ],
    deliverables: [
      'Custom responsive storefront with fast faceted filtering & variant selection',
      'Streamlined mobile-first cart & one-page checkout flow',
      'Payment gateway integrations (Razorpay, Stripe, PayU, Cashfree, UPI)',
      'Order management, GST invoicing, coupon rules & refund state handling',
      'Courier & ERP sync (Shiprocket, Delhivery, BlueDart, Tally/Zoho Inventory)',
      'End-to-end checkout, webhook & abandoned-cart testing before go-live',
    ],
    features: ['Fast Faceted Catalog', 'Razorpay / Stripe / UPI', 'GST & Courier Sync', 'Edge-Case Checkout QA'],
    metrics: [
      { label: 'Payment Flows', value: 'UPI / Cards / COD' },
      { label: 'Checkout QA', value: 'Refund & Failure Tested' },
      { label: 'Post-Launch SLA', value: '1 Year Support' },
    ],
    process: [
      {
        step: '01',
        title: 'Catalog & Commerce Logic Map',
        description: 'Structure SKU variants, inventory sources, shipping zones, tax/GST slabs, and discount mechanics.',
      },
      {
        step: '02',
        title: 'Storefront & Cart Engineering',
        description: 'Build responsive product grids, quick-view drawers, real-time stock checks, and low-friction mobile checkouts.',
      },
      {
        step: '03',
        title: 'Payment & Fulfilment Integration',
        description: 'Wire payment webhooks, automated email/WhatsApp order confirmations, courier label APIs, and ERP sync.',
      },
      {
        step: '04',
        title: 'Transaction & Load Verification',
        description: 'Verify declined cards, payment retries, partial refunds, and inventory locks prior to store launch.',
      },
    ],
    faqs: [
      {
        question: 'Can you support custom B2B pricing tiers or minimum order quantities alongside retail?',
        answer: 'Yes. We implement role-based wholesale pricing, MOQ rules, quote-to-order flows, and GST invoice generation inside one unified storefront.',
      },
      {
        question: 'What happens if a shopper’s UPI payment succeeds but their browser closes early?',
        answer: 'We configure server-side payment webhooks from Razorpay/Stripe/Cashfree so orders update reliably even if a user closes the tab mid-redirect.',
      },
    ],
  },

  'web-application-development': {
    slug: 'web-application-development',
    title: 'Web Application Development',
    subtitle: 'Role-Based Operational Portals, Client Dashboards & Business Workflow Tools',
    shortDescription:
      'Engineer browser-based business applications with role-based permissions, clean relational data models, and responsive interfaces built for everyday operations.',
    fullDescription: [
      'Spreadsheets and disconnected forms break down the moment multiple departments update customer records, approvals, schedules, or financial documents simultaneously.',
      'We build bespoke browser-based web applications—client portals, booking engines, vendor marketplaces, compliance trackers, and internal operations consoles—designed around real staff workflows and granular access controls.',
      'Every screen handles practical operational realities cleanly: multi-role permissions, searchable/filterable data tables, CSV/PDF exports, optimistic state feedback, audit histories, and graceful handling of network errors.',
    ],
    deliverables: [
      'Workflow mapping, relational database schema & RBAC permission matrix',
      'Clean responsive web UI for operators, managers & client portals',
      'Multi-step forms, data tables, search/filter views & PDF/CSV reporting',
      'Secure authentication, session management & activity audit trails',
      'Email, WhatsApp or in-app operational alerts & notification triggers',
      'Full source code handover, deployment pipeline & 1 year technical support',
    ],
    features: ['Role-Based Access', 'Relational Data Flows', 'Audit & Export Tools', 'Full IP Handover'],
    metrics: [
      { label: 'Access Control', value: 'Granular RBAC' },
      { label: 'Browser Parity', value: 'Desktop + Tablet' },
      { label: 'Support Coverage', value: '365 Days Included' },
    ],
    process: [
      {
        step: '01',
        title: 'Workflow & Permission Scoping',
        description: 'Document user roles, state transitions, approval steps, and edge cases before designing the database schema.',
      },
      {
        step: '02',
        title: 'Database & API Core',
        description: 'Implement normalized tables, server-side permission guards, validation rules, and immutable activity logs.',
      },
      {
        step: '03',
        title: 'Interactive Workspace Build',
        description: 'Develop high-clarity operational dashboards, bulk actions, filters, empty states, and instant validation.',
      },
      {
        step: '04',
        title: 'UAT & Production Launch',
        description: 'Run role-by-role acceptance testing with your operators, deploy cleanly, and provide user documentation.',
      },
    ],
    faqs: [
      {
        question: 'Can different staff members have restricted views of sensitive data?',
        answer: 'Yes. We enforce role-based access control (RBAC) both in the UI and on every backend API endpoint so users only view and modify permitted records.',
      },
      {
        question: 'Will we be able to export reports or integrate our accounting tools later?',
        answer: 'Yes. Every web application is built with clean APIs and CSV/PDF report exports so future integrations connect smoothly.',
      },
    ],
  },

  'flutter-app-development': {
    slug: 'flutter-app-development',
    title: 'Flutter App Development',
    subtitle: '60fps Cross-Platform Android & iOS Apps from a Single Dart Codebase',
    shortDescription:
      'Develop responsive Flutter mobile apps with shared UI widgets, smooth native animations, hardware/plugin integrations, and Play Store + App Store release builds.',
    fullDescription: [
      'Flutter enables rapid dual-platform delivery without compromising visual fidelity—provided state management, platform channels, and native plugins are architected properly from day one.',
      'We engineer clean Dart/Flutter applications using structured state architectures (Riverpod or Bloc), adaptive Material/Cupertino navigation, local offline persistence, and smooth 60fps scrolling lists.',
      'Device-specific permissions (camera, GPS location, biometrics, push notifications via FCM/APNs) and edge cases such as background lifecycle states and deep linking are verified on physical Android and iOS hardware before release.',
    ],
    deliverables: [
      'Modular Flutter & Dart architecture with Riverpod/Bloc state management',
      'Adaptive Material & Cupertino widgets tested across phone & tablet sizes',
      'REST/GraphQL API integration, offline caching & secure token storage',
      'Push notifications (FCM & APNs), biometrics, maps & payment SDKs',
      'Signed Android AAB & iOS IPA builds with Play Store & App Store submission',
      '1 year of post-launch OS compatibility & bug-fix maintenance',
    ],
    features: ['Single Dart Codebase', 'Riverpod / Bloc State', 'Native Hardware Plugins', 'Dual-Store Release'],
    metrics: [
      { label: 'Target Platforms', value: 'Android + iOS' },
      { label: 'UI Frame Target', value: '60 FPS Smooth' },
      { label: 'Store Builds', value: 'AAB + IPA Ready' },
    ],
    process: [
      {
        step: '01',
        title: 'Architecture & Plugin Audit',
        description: 'Select state patterns, offline storage strategy, and verify native plugin requirements for camera, GPS, or payments.',
      },
      {
        step: '02',
        title: 'UI Widget & State Build',
        description: 'Implement reusable themed widgets, responsive layouts, form handling, and secure API integration layers.',
      },
      {
        step: '03',
        title: 'Real-Device Lifecycle QA',
        description: 'Test permissions, deep links, push notifications, slow networks, and low-memory recovery on real iOS and Android devices.',
      },
      {
        step: '04',
        title: 'App Store & Play Store Release',
        description: 'Prepare signed release bundles, store screenshots, privacy disclosures, and manage store review approvals.',
      },
    ],
    faqs: [
      {
        question: 'Does Flutter still support native iOS and Android features like Face ID or background GPS?',
        answer: 'Yes. Through vetted Flutter plugins and custom Swift/Kotlin platform channels, Flutter accesses camera, biometrics, Bluetooth, maps, and payments natively.',
      },
      {
        question: 'How much time does Flutter save compared to building two separate native apps?',
        answer: 'Sharing business logic and UI across iOS and Android typically reduces development and ongoing maintenance effort by 35% to 45%.',
      },
    ],
  },

  'react-native-app-development': {
    slug: 'react-native-app-development',
    title: 'React Native App Development',
    subtitle: 'Native Mobile Experiences Sharing TypeScript Patterns with Your Web Stack',
    shortDescription:
      'Build fast React Native apps for Android and iOS with TypeScript, native navigation, offline resilience, and seamless API synchronization.',
    fullDescription: [
      'For teams already investing in React and TypeScript on the web, React Native bridges mobile and web engineering while compiling to genuine native iOS and Android UI views.',
      'We build TypeScript React Native applications (Expo Dev Client or bare React Native) featuring native stack navigation, gesture-driven animations, secure keychain/keystore auth storage, and real-time API or WebSocket sync.',
      'Every dependency is vetted carefully before adoption, and platform nuances—keyboard avoidance, notch/safe-area insets, push notifications, and OTA update channels—are tested separately on iOS and Android hardware.',
    ],
    deliverables: [
      'TypeScript React Native (Expo / bare workflow) application architecture',
      'Native stack/tab navigation, Reanimated gestures & safe-area ergonomics',
      'Secure JWT/OAuth storage, offline queue & REST/WebSocket API sync',
      'Push notifications, deep linking, payment SDKs & analytics integration',
      'Physical iOS TestFlight & Android internal track QA builds',
      'App Store & Google Play release management + 1 year support',
    ],
    features: ['TypeScript & Native UI', 'Expo / Bare Workflow', 'Offline Sync & Push', 'Play & App Store Ready'],
    metrics: [
      { label: 'Codebase Language', value: 'TypeScript' },
      { label: 'Release Channels', value: 'iOS + Android' },
      { label: 'Post-Launch Support', value: '1 Year Included' },
    ],
    process: [
      {
        step: '01',
        title: 'Workflow & Native Scope',
        description: 'Choose Expo Dev Client vs. bare native workflow and audit required SDKs for payments, maps, or device sensors.',
      },
      {
        step: '02',
        title: 'Navigation & Screen Engineering',
        description: 'Build responsive TypeScript screens, custom native modules, and optimistic state management.',
      },
      {
        step: '03',
        title: 'OS-Specific QA Pass',
        description: 'Test iOS and Android separately for permissions, keyboard behavior, background transitions, and store compliance.',
      },
      {
        step: '04',
        title: 'Store Submission & OTA Setup',
        description: 'Publish signed builds to App Store Connect and Google Play Console with crash reporting active.',
      },
    ],
    faqs: [
      {
        question: 'Can React Native share code with our existing React web application?',
        answer: 'Yes. API types, validation schemas, business utilities, and state helpers can be shared cleanly across TypeScript web and mobile packages.',
      },
      {
        question: 'Do you handle both Apple App Store and Google Play submissions?',
        answer: 'Yes. We manage TestFlight/internal testing tracks, privacy questionnaire details, store screenshots, and full production approval.',
      },
    ],
  },

  'cross-platform-app-development': {
    slug: 'cross-platform-app-development',
    title: 'Cross-Platform App Development',
    subtitle: 'Unified Mobile Architecture Aligned to Device Features, Team Skills & Release Plans',
    shortDescription:
      'Select and deliver the ideal shared mobile codebase (Flutter, React Native, or Capacitor/PWA) tailored to your hardware needs and dual-store roadmap.',
    fullDescription: [
      'Picking a cross-platform framework blindly leads to painful rewrites when an app suddenly needs heavy background Bluetooth, low-latency media processing, or web-team maintainability.',
      'We evaluate your exact product constraints—required device APIs, offline sync complexity, UI animation demands, and long-term team skills—before recommending Flutter, React Native, or hybrid web-to-mobile packaging.',
      'From shared business logic to platform-specific permission flows and dual App Store + Play Store review compliance, you get one coordinated engineering team taking the product from prototype to both app stores.',
    ],
    deliverables: [
      'Framework & architecture selection matrix (Flutter vs. React Native vs. PWA)',
      'Shared core codebase with clean native platform bridging where required',
      'Unified API integration, push notifications & analytics instrumentation',
      'Responsive UI tested across compact Android phones, iPhones & tablets',
      'Coordinated iOS App Store & Google Play Store release pipelines',
      'Source repository handover, build runbooks & 1 year technical support',
    ],
    features: ['Stack Assessment', 'Shared Business Logic', 'Native Bridge Modules', 'Dual-Store Launch'],
    metrics: [
      { label: 'Efficiency Gain', value: 'Single Core Code' },
      { label: 'Store Targets', value: 'App Store + Play' },
      { label: 'QA Devices', value: 'iOS + Android Matrix' },
    ],
    process: [
      {
        step: '01',
        title: 'Technical Feasibility Audit',
        description: 'Benchmark frameworks against hardware APIs, offline needs, team hiring plans, and launch timeline.',
      },
      {
        step: '02',
        title: 'Core & Native Layer Build',
        description: 'Implement shared UI/logic alongside clean iOS and Android platform adaptations where OS conventions differ.',
      },
      {
        step: '03',
        title: 'Cross-Device & Network QA',
        description: 'Validate notch insets, low-bandwidth retries, push payloads, and cold-start speed on multiple OEMs.',
      },
      {
        step: '04',
        title: 'Staged Dual-Platform Release',
        description: 'Roll out beta builds via TestFlight and Play Internal Testing before full public store approval.',
      },
    ],
    faqs: [
      {
        question: 'How do you decide between Flutter and React Native for our project?',
        answer: 'We choose React Native if your team is TypeScript/React-heavy or shares web logic, and Flutter when custom brand-heavy animations or ultra-consistent multi-OS rendering matter most.',
      },
      {
        question: 'Will users be able to tell it is a cross-platform app?',
        answer: 'No. We respect OS-specific navigation idioms, typography scaling, haptics, and safe areas so the app feels completely native on both iOS and Android.',
      },
    ],
  },

  'mobile-app-ui-ux-design': {
    slug: 'mobile-app-ui-ux-design',
    title: 'Mobile App UI/UX Design',
    subtitle: 'Thumb-Friendly Ergonomics, Onboarding Flows & Native iOS/Android Interface Systems',
    shortDescription:
      'Design intuitive mobile app journeys built around one-handed touch ergonomics, clear onboarding, platform conventions, and complete dark/light & edge states.',
    fullDescription: [
      'Shrinking a desktop web layout onto a phone screen produces tiny tap targets, awkward modals, and frustrated users who uninstall after their first session.',
      'We design mobile-first product experiences anchored in thumb-reach ergonomics, clean gesture navigation, progressive onboarding, and platform-aware conventions aligned with Apple Human Interface Guidelines and Material Design 3.',
      'Every Figma deliverable covers real mobile constraints: Dynamic Island/status bar insets, on-screen keyboard occlusion, empty/offline/retry states, Dynamic Type accessibility scaling, and developer-ready tokens.',
    ],
    deliverables: [
      'Mobile journey mapping, onboarding strategy & core task wireframes',
      'Platform-aware UI screens aligned with Apple HIG & Material Design 3',
      'Interactive clickable Figma mobile prototype for live device testing',
      'Touch-target audit (44px+ ergonomics), keyboard & safe-area specs',
      'Complete state coverage (onboarding, offline, empty, loading & errors)',
      'Component library, SVG icon set & developer Dev Mode handoff',
    ],
    features: ['HIG & Material 3', 'Thumb Ergonomics', 'Interactive Mobile Proto', 'Offline & Empty States'],
    metrics: [
      { label: 'Minimum Tap Target', value: '44px x 44px' },
      { label: 'Design Standards', value: 'iOS HIG + M3' },
      { label: 'Test Mode', value: 'On-Device Figma' },
    ],
    process: [
      {
        step: '01',
        title: 'Mobile Flow & Onboarding Map',
        description: 'Eliminate signup friction and shorten the path to your app’s primary “aha” task in as few taps as possible.',
      },
      {
        step: '02',
        title: 'Wireframing & Thumb Ergonomics',
        description: 'Place primary actions within natural thumb arcs and design clean bottom-sheet / tab-bar hierarchies.',
      },
      {
        step: '03',
        title: 'Visual Craft & State System',
        description: 'Style light/dark themes, haptic/micro-interaction notes, skeletons, empty views, and accessible typography.',
      },
      {
        step: '04',
        title: 'On-Device Prototype & Handoff',
        description: 'Mirror interactive prototypes onto real phones for feedback before packaging organized specs for engineering.',
      },
    ],
    faqs: [
      {
        question: 'Can we test the app design on our own phone before coding starts?',
        answer: 'Yes. We deliver interactive Figma prototypes you can open full-screen on iOS or Android to tap through every flow before investing in development.',
      },
      {
        question: 'Do you design separate nuances for iOS and Android or one unified style?',
        answer: 'We craft a cohesive brand UI while adapting key system behaviors—navigation bars, share sheets, back gestures, and date pickers—to each OS cleanly.',
      },
    ],
  },

  'custom-software-development': {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    subtitle: 'Bespoke Operational Software Engineered Around Your Exact Business Rules',
    shortDescription:
      'Replace fragmented spreadsheets and rigid off-the-shelf tools with custom software architected around your workflows, user roles, and long-term scalability.',
    fullDescription: [
      'Off-the-shelf software forces profitable companies to bend their competitive workflows around generic SaaS limitations—or pay per-seat licensing fees forever for features only 20% fit.',
      'We architect bespoke software systems tailored to your operational blueprint: multi-branch management tools, automated dispatch & billing engines, custom inventory/production trackers, and compliance portals.',
      'Using phased milestone sprints, stakeholders validate high-value core workflows early while our engineers harden database integrity, role permissions, automated test coverage, and deployment runbooks.',
    ],
    deliverables: [
      'Business process discovery & Technical Requirements Specification (TRS)',
      'Custom relational database architecture & scalable API backend',
      'Clean responsive web or desktop interface with role-based permissions',
      'Legacy data import scripts & external tool/accounting integrations',
      'Automated QA test suite, security audit & deployment documentation',
      '100% source code ownership + 1 year of dedicated technical support',
    ],
    features: ['Tailored Workflows', 'Phased Sprint Delivery', 'Legacy Data Import', 'Full IP Ownership'],
    metrics: [
      { label: 'Code & IP Rights', value: '100% Client Owned' },
      { label: 'Delivery Model', value: 'Phased Milestones' },
      { label: 'Support Included', value: '1 Year SLA' },
    ],
    process: [
      {
        step: '01',
        title: 'Process Discovery & Scoping',
        description: 'Shadow existing operations, document edge-case business rules, and prioritize high-ROI Phase 1 deliverables.',
      },
      {
        step: '02',
        title: 'Architecture & Data Blueprint',
        description: 'Design normalized database schemas, security roles, API integrations, and interactive UI prototypes.',
      },
      {
        step: '03',
        title: 'Iterative Sprint Engineering',
        description: 'Ship working modules every two weeks to staging for hands-on operator feedback and validation.',
      },
      {
        step: '04',
        title: 'UAT, Cutover & Handover',
        description: 'Migrate historical records, train staff teams, deploy to production, and transfer complete source repositories.',
      },
    ],
    faqs: [
      {
        question: 'How do you prevent scope creep or surprises during a custom software build?',
        answer: 'We break builds into clear fixed milestones with staging demos every two weeks so you inspect real working software continuously.',
      },
      {
        question: 'Do we own the full source code and pay zero ongoing SaaS per-user license fees?',
        answer: 'Yes. Upon completion you own 100% of the custom codebase with zero vendor lock-in or per-seat licensing markups.',
      },
    ],
  },

  'crm-erp-development': {
    slug: 'crm-erp-development',
    title: 'CRM & ERP Development',
    subtitle: 'Unified Sales Pipelines, Inventory, Approvals, Billing & Operations Control',
    shortDescription:
      'Build custom CRM and ERP systems connecting lead capture, quotes, approvals, stock movement, invoicing, and executive reporting in one source of truth.',
    fullDescription: [
      'Growing teams often run leads in one SaaS tool, stock in Excel, approvals on WhatsApp, and invoicing in Tally—creating constant manual re-entry, stale reports, and revenue leaks.',
      'We engineer custom CRM and ERP modules tailored to your sales stages, multi-warehouse or multi-branch workflows, GST/tax billing, role-based approval hierarchies, and real-time executive KPIs.',
      'Data migration from legacy spreadsheets or older ERPs is handled with strict validation and reconciliation checks so teams switch over without losing historical customer ledgers or stock balances.',
    ],
    deliverables: [
      'Lead-to-cash CRM pipeline (lead capture, follow-ups, quotes & SLAs)',
      'Operations & ERP modules (inventory, procurement, POs & approvals)',
      'Multi-role access control (admin, branch manager, sales, finance)',
      'Automated GST/invoice PDF generation & payment reconciliation tracking',
      'Clean legacy CSV/Excel/ERP data migration & balance verification',
      'Real-time executive analytics dashboard & audit activity logs',
    ],
    features: ['Lead-to-Cash Pipeline', 'Inventory & Approvals', 'Verified Data Migration', 'Role Permissions'],
    metrics: [
      { label: 'Record Integrity', value: 'Audit Logged' },
      { label: 'Multi-Branch Support', value: 'Unified Ledger' },
      { label: 'Migration Check', value: 'Reconciled' },
    ],
    process: [
      {
        step: '01',
        title: 'Operational & Data Audit',
        description: 'Map customer touchpoints, inventory handoffs, approval limits, and duplicate spreadsheets across departments.',
      },
      {
        step: '02',
        title: 'Unified Schema & Role Matrix',
        description: 'Architect connected customer, order, stock, and ledger models with strict record-ownership rules.',
      },
      {
        step: '03',
        title: 'Module Build & Integrations',
        description: 'Develop CRM pipelines, PO/invoice workflows, WhatsApp/email triggers, and accounting software connectors.',
      },
      {
        step: '04',
        title: 'Dry-Run Migration & Rollout',
        description: 'Run test data imports with finance/ops sign-off before training teams and switching operations live.',
      },
    ],
    faqs: [
      {
        question: 'Can a custom ERP connect with Tally, Zoho Books, or our existing payment gateway?',
        answer: 'Yes. We build clean API and webhook bridges so invoices, payments, and customer balances sync automatically without double entry.',
      },
      {
        question: 'How do you make sure old Excel customer and inventory data migrates safely?',
        answer: 'We write automated cleanup and reconciliation scripts, run dry-run imports in staging, and verify row counts and ledger totals before cutover.',
      },
    ],
  },

  'ai-chatbot-development': {
    slug: 'ai-chatbot-development',
    title: 'AI Chatbot Development',
    subtitle: 'Grounded Support & Lead Qualification Assistants with Reliable Human Handoff',
    shortDescription:
      'Deploy AI assistants trained strictly on approved company knowledge bases to qualify leads, answer product FAQs, and escalate edge cases to live staff.',
    fullDescription: [
      'Unconstrained chatbots that invent pricing, promise unsupported terms, or trap users in endless loops damage customer trust fast. Production business assistants require strict grounding and predictable escalation.',
      'We build AI chatbots anchored on retrieval from your approved documents, service catalogs, FAQs, and policies—complete with prompt guardrails, citation/source checks, and structured lead-capture tools for WhatsApp and web chat.',
      'When confidence drops or a visitor requests human help, the assistant passes a clean conversation summary straight to your sales or support team via WhatsApp, email, or CRM ticket.',
    ],
    deliverables: [
      'Knowledge base ingestion & RAG indexing from approved docs/URLs',
      'Guardrail & fallback configuration preventing off-policy hallucinations',
      'Lead qualification & appointment booking tool integration',
      'Seamless human escalation handoff with structured chat summaries',
      'Responsive web widget or WhatsApp Business API integration',
      'Conversation review logs & post-launch prompt accuracy tuning',
    ],
    features: ['Approved RAG Grounding', 'Strict Guardrails', 'CRM & Booking Tools', 'Human Escalation'],
    metrics: [
      { label: 'Availability', value: '24/7 Instant' },
      { label: 'Answer Source', value: 'Approved Docs Only' },
      { label: 'Fallback Path', value: 'Live Staff Handoff' },
    ],
    process: [
      {
        step: '01',
        title: 'Intent & Knowledge Scoping',
        description: 'Define permitted topics, gather approved FAQs/pricing sheets, and establish clear “do not answer” boundaries.',
      },
      {
        step: '02',
        title: 'RAG & Tool Integration',
        description: 'Connect document retrieval, lead capture forms, calendar booking links, and CRM webhooks.',
      },
      {
        step: '03',
        title: 'Adversarial & Edge-Case Eval',
        description: 'Test real customer questions, off-topic prompts, and escalation triggers to verify reliable answers and tone.',
      },
      {
        step: '04',
        title: 'Channel Deploy & Review Loop',
        description: 'Embed on web/WhatsApp with transcript logging so teams can refine answers and expand approved knowledge.',
      },
    ],
    faqs: [
      {
        question: 'How do you stop the chatbot from making up pricing or wrong company policies?',
        answer: 'We ground responses strictly via Retrieval-Augmented Generation (RAG) over your approved files and configure fallback rules to escalate to a human whenever certainty is low.',
      },
      {
        question: 'Can the chatbot capture leads and push them directly to our CRM or WhatsApp?',
        answer: 'Yes. Through structured function calling, the assistant collects validated name, phone, email, and project intent and routes them instantly to your sales desk.',
      },
    ],
  },

  'ai-automation-solutions': {
    slug: 'ai-automation-solutions',
    title: 'AI Automation Solutions',
    subtitle: 'Human-in-the-Loop Document Extraction, Triage & Operational Intelligence',
    shortDescription:
      'Automate high-volume repetitive tasks—invoice parsing, ticket triage, lead enrichment, and draft generation—with confidence thresholds and human review queues.',
    fullDescription: [
      'Most practical business AI value comes not from flashy chatbots, but from quietly eliminating hours of manual data entry, PDF parsing, inbox sorting, and routine draft writing across back-office operations.',
      'We implement pragmatic AI workflows—structured JSON extraction from invoices, KYC documents, and purchase orders; automated support ticket routing; RFP/email draft preparation—using schema validation and confidence scoring.',
      'High-certainty items sync straight to your database or ERP, while low-confidence or high-value exceptions route automatically into a one-click human approval queue with full audit logging.',
    ],
    deliverables: [
      'Workflow ROI evaluation & automation feasibility blueprint',
      'Structured AI extraction/classification pipelines (PDF, email, forms)',
      'Schema validation & deterministic confidence threshold routing',
      'Human-in-the-loop approval & exception review dashboard',
      'Secure API integration with existing CRM, ERP, Slack, or Gmail tools',
      'Evaluation benchmark suite, cost monitoring & prompt versioning',
    ],
    features: ['Document/PDF Parsing', 'Confidence Thresholds', 'Human Review Queue', 'Audit & Cost Logs'],
    metrics: [
      { label: 'Output Format', value: 'Validated JSON' },
      { label: 'Safety Model', value: 'Human-in-the-Loop' },
      { label: 'Security', value: 'Zero Training Retention' },
    ],
    process: [
      {
        step: '01',
        title: 'Task Selection & Sample Audit',
        description: 'Identify repetitive bottlenecks with clear inputs and evaluate real sample documents/tickets.',
      },
      {
        step: '02',
        title: 'Prototype & Benchmark Eval',
        description: 'Build extraction/classification prompts with strict JSON schemas and benchmark accuracy across historical cases.',
      },
      {
        step: '03',
        title: 'Guardrails & Review Queue',
        description: 'Add confidence thresholds, anomaly checks, and an approval screen for exceptions before touching production data.',
      },
      {
        step: '04',
        title: 'Production Sync & Monitoring',
        description: 'Connect live triggers, log token costs and accuracy metrics, and iterate based on reviewer corrections.',
      },
    ],
    faqs: [
      {
        question: 'Is our confidential business data used to train public AI models?',
        answer: 'No. We configure enterprise API endpoints with zero-data-retention / no-training terms and keep sensitive credentials strictly server-side.',
      },
      {
        question: 'What happens if the AI misreads a scanned invoice or unusual document?',
        answer: 'Every pipeline includes schema/math checks (like line-item totals vs. grand total) and routes flagged items to a human reviewer before saving.',
      },
    ],
  },

  'saas-application-development': {
    slug: 'saas-application-development',
    title: 'SaaS Application Development',
    subtitle: 'Multi-Tenant Architecture, Subscription Billing, Onboarding & Admin Control',
    shortDescription:
      'Launch and scale subscription software with isolated tenant data boundaries, role-based team invites, Stripe/Razorpay billing webhooks, and usage metering.',
    fullDescription: [
      'Building a multi-tenant SaaS product involves far more than putting a login screen on a CRUD app. Tenant data isolation bugs, desynchronized subscription states, and clumsy onboarding quickly churn early customers.',
      'We architect complete SaaS foundations: clean organization/workspace scoping, invite & role workflows, subscription plan tiers, trial expiry logic, failed-payment grace periods, and super-admin telemetry dashboards.',
      'Whether launching an MVP for early adopters or scaling an established B2B SaaS platform, every release verifies billing webhook edge cases and strict tenant authorization boundaries.',
    ],
    deliverables: [
      'Multi-tenant database isolation & workspace/organization RBAC',
      'Self-serve signup, email verification, team invites & SSO/OAuth hooks',
      'Subscription billing integration (Stripe / Razorpay Subscriptions & webhooks)',
      'Plan limits, feature gating, trial countdowns & upgrade/downgrade flows',
      'Super-admin management console for tenants, plans & billing state',
      'Automated onboarding checklist & core tenant-isolation test suite',
    ],
    features: ['Tenant Data Isolation', 'Subscription Webhooks', 'Feature Plan Gating', 'Super-Admin Console'],
    metrics: [
      { label: 'Billing Integration', value: 'Stripe / Razorpay' },
      { label: 'Access Security', value: 'Tenant Scoped RBAC' },
      { label: 'MVP Delivery', value: 'Milestone Sprints' },
    ],
    process: [
      {
        step: '01',
        title: 'Product & Tenancy Blueprint',
        description: 'Define tenant boundaries, subscription pricing tiers, core user activation steps, and MVP vs. v2 scope.',
      },
      {
        step: '02',
        title: 'Auth, Billing & Core Workspace',
        description: 'Implement tenant-scoped APIs, role-based invites, subscription checkouts, and idempotent billing webhooks.',
      },
      {
        step: '03',
        title: 'Edge-Case & Isolation Testing',
        description: 'Verify upgrades, cancellations, failed renewals, and strict cross-tenant access prevention tests.',
      },
      {
        step: '04',
        title: 'Launch & Telemetry Setup',
        description: 'Deploy scalable cloud infrastructure, error monitoring, and billing health alerts for confident customer onboarding.',
      },
    ],
    faqs: [
      {
        question: 'Can you handle monthly/annual billing, coupons, and prorated plan upgrades?',
        answer: 'Yes. We configure Stripe or Razorpay subscription lifecycles cleanly—handling trials, prorated upgrades, invoice PDFs, and payment retry webhooks.',
      },
      {
        question: 'How do you ensure one customer workspace can never access another tenant’s records?',
        answer: 'Every database query and API handler enforces explicit authenticated tenant scoping, backed by automated cross-tenant access checks.',
      },
    ],
  },

  'business-process-automation': {
    slug: 'business-process-automation',
    title: 'Business Process Automation',
    subtitle: 'Connected Cross-Tool Workflows with Explicit Approvals & Exception Handling',
    shortDescription:
      'Eliminate manual copy-pasting across forms, CRM, billing, WhatsApp, and spreadsheets with fault-tolerant automations, retry rules, and clear activity logs.',
    fullDescription: [
      'Fragile point-and-click automations often fail silently when an API times out, a phone number is formatted differently, or an operator submits an incomplete form—leaving leads uncontacted or orders unfulfilled.',
      'We design resilient process automations combining clean webhook middleware, workflow orchestrators, and custom scripts across Google Workspace, CRMs, payment gateways, accounting systems, and WhatsApp notifications.',
      'Every automation enforces input normalization, duplicate detection, retry backoff on external outages, and instant exception alerts so your team always knows the status of every handoff.',
    ],
    deliverables: [
      'End-to-end current-state workflow audit & bottleneck elimination plan',
      'Cross-system triggers connecting Web Forms, CRM, Sheets, Billing & WhatsApp',
      'Deduplication, input sanitization & conditional approval routing',
      'Automatic retry queues & failure notifications for uninterrupted operations',
      'Execution history logs & operational runbook documentation',
      'Post-launch monitoring & edge-case tuning support',
    ],
    features: ['Zero Manual Re-Entry', 'Duplicate Safeguards', 'Retry & Alerting', 'Cross-App Sync'],
    metrics: [
      { label: 'Reliability Design', value: 'Retries + Alerts' },
      { label: 'Auditability', value: 'Full Execution Logs' },
      { label: 'Ecosystems', value: 'CRM / Sheets / Billing' },
    ],
    process: [
      {
        step: '01',
        title: 'Workflow & Exception Mapping',
        description: 'Trace manual steps today—including common missing fields, duplicates, and approval bottlenecks.',
      },
      {
        step: '02',
        title: 'Normalized Trigger Design',
        description: 'Standardize data formats, define deduplication keys, and map conditional branches cleanly.',
      },
      {
        step: '03',
        title: 'Fault-Tolerant Build',
        description: 'Implement webhook handlers, API bridges, retry policies, and Slack/email exception notifications.',
      },
      {
        step: '04',
        title: 'Live Shadowing & Handover',
        description: 'Verify parallel runs against manual checks before handing over clean workflow diagrams and logs.',
      },
    ],
    faqs: [
      {
        question: 'Can you automate WhatsApp confirmations, CRM updates, and invoice PDFs from a single inquiry?',
        answer: 'Yes. When a prospect submits a form or completes a checkout, we can automatically qualify the record, update your CRM, notify sales on WhatsApp, and generate documents.',
      },
      {
        question: 'What happens if one external service goes down temporarily during an automated sync?',
        answer: 'We implement queued retries with exponential backoff and send immediate admin alerts if a sync fails after maximum attempts so zero data is lost.',
      },
    ],
  },

  'api-third-party-integrations': {
    slug: 'api-third-party-integrations',
    title: 'API & Third-Party Integrations',
    subtitle: 'Reliable Two-Way Bridges Across Payment, Shipping, ERP & SaaS Platforms',
    shortDescription:
      'Integrate external vendor APIs, payment providers, shipping couriers, and internal databases with clean data mappings, rate-limit protection, and reconciliation.',
    fullDescription: [
      'Connecting two systems cleanly requires far more than grabbing an API key. Mismatched field formats, pagination limits, vendor rate throttling, and silent webhook drops quickly corrupt business data.',
      'We engineer production-grade integrations across Razorpay/Stripe, Shiprocket/Delhivery, Tally/Zoho, Salesforce/HubSpot, WhatsApp Business API, and custom partner SOAP/REST endpoints.',
      'Every bridge establishes a clear system of record per field, validates cryptographic webhook signatures, handles API rate limits gracefully, and provides reconciliation logs to catch any out-of-sync edge cases.',
    ],
    deliverables: [
      'System-of-record data dictionary & field transformation specification',
      'Secure OAuth2 / HMAC-signed API & webhook client implementation',
      'Rate-limit handling, pagination, batching & idempotent sync jobs',
      'Automated reconciliation script comparing source vs. destination state',
      'Mocked & sandboxed error testing (429 limits, 5xx timeouts, bad payloads)',
      'Integration health logs & credential rotation documentation',
    ],
    features: ['Two-Way Syncs', 'Rate-Limit Safe', 'Reconciliation Checks', 'HMAC / OAuth2 Auth'],
    metrics: [
      { label: 'Sync Reliability', value: 'Idempotent Retries' },
      { label: 'Verification', value: 'Signature Checked' },
      { label: 'Documentation', value: 'Field Mapping Spec' },
    ],
    process: [
      {
        step: '01',
        title: 'API & Field Mapping Audit',
        description: 'Inspect vendor API docs, rate limits, auth scopes, and define the authoritative source for every data field.',
      },
      {
        step: '02',
        title: 'Adapter & Queue Engineering',
        description: 'Build isolated adapter modules with schema validation, token refresh, and resilient retry logic.',
      },
      {
        step: '03',
        title: 'Sandbox & Fault Simulation',
        description: 'Test normal transfers alongside rate-limit bursts, expired tokens, duplicate webhooks, and network drops.',
      },
      {
        step: '04',
        title: 'Deployment & Reconciliation',
        description: 'Launch live syncs with daily/hourly reconciliation checks ensuring zero drifted records.',
      },
    ],
    faqs: [
      {
        question: 'Can you integrate older or poorly documented vendor APIs and XML/SOAP feeds?',
        answer: 'Yes. We wrap legacy SOAP, XML, or CSV/SFTP feeds behind clean modern JSON adapters so your main application stays fast and maintainable.',
      },
      {
        question: 'How do you make sure integrations don’t break our site during a vendor API outage?',
        answer: 'External calls run behind timeouts, circuit-breakers, and background queues so slow third-party servers never freeze your user checkout or dashboard.',
      },
    ],
  },

  'website-maintenance': {
    slug: 'website-maintenance',
    title: 'Website Maintenance',
    subtitle: 'Proactive Care, Tested Updates, Off-Site Backups & Workflow Verification',
    shortDescription:
      'Keep business websites stable, current, and protected through scheduled maintenance windows, verified backups, rollback plans, and post-update workflow testing.',
    fullDescription: [
      'Websites decay rapidly when plugins, packages, PHP versions, and SSL certificates are left unmaintained—or worse, updated blindly on Friday afternoon with no backup ready if a layout breaks.',
      'Our Website Maintenance retainer follows strict engineering hygiene: off-site automated backups before every change, staging previews for core/plugin updates, uptime monitoring, and active testing of your revenue paths.',
      'After every scheduled release window, we check contact forms, checkout flows, CRM hooks, and mobile layouts manually so you never discover a broken inquiry form days later.',
    ],
    deliverables: [
      'Scheduled core, CMS/framework, plugin & dependency updates',
      'Automated daily/weekly off-site database & file backup retention',
      'Pre-update staging verification & tested one-click rollback plan',
      'Post-update manual QA on contact forms, checkouts & key landing pages',
      '24/7 uptime & SSL certificate expiration monitoring',
      'Monthly maintenance summary covering updates applied & site health',
    ],
    features: ['Staged Updates', 'Off-Site Backups', 'Form & Checkout QA', 'Uptime Monitoring'],
    metrics: [
      { label: 'Backup Policy', value: 'Pre-Change + Daily' },
      { label: 'Rollback Readiness', value: 'Verified' },
      { label: 'Priority Flows', value: 'Tested Each Cycle' },
    ],
    process: [
      {
        step: '01',
        title: 'Site Onboarding & Priority Map',
        description: 'Catalog hosting access, active plugins/dependencies, daily backup schedules, and critical revenue/lead workflows.',
      },
      {
        step: '02',
        title: 'Pre-Update Backup & Staging',
        description: 'Snapshot production databases and files off-site, then test pending updates in staging first.',
      },
      {
        step: '03',
        title: 'Controlled Maintenance Rollout',
        description: 'Apply approved updates inside low-traffic windows with instant rollback checkpoints standing by.',
      },
      {
        step: '04',
        title: 'Workflow QA & Health Log',
        description: 'Verify forms, payments, search, and visual rendering across desktop/mobile and deliver a clear changelog.',
      },
    ],
    faqs: [
      {
        question: 'What happens if a plugin or library update breaks our site layout?',
        answer: 'Because we take verified backups and test in staging first, layout conflicts are caught before production—or rolled back cleanly within minutes.',
      },
      {
        question: 'Do you cover WordPress, WooCommerce, Laravel, and React websites?',
        answer: 'Yes. We maintain WordPress/WooCommerce installations as well as custom React, Next.js, Laravel, and Node.js properties.',
      },
    ],
  },

  'website-speed-optimization': {
    slug: 'website-speed-optimization',
    title: 'Website Speed Optimization',
    subtitle: 'Measured Bottleneck Diagnostics, Asset Compression & Core Web Vitals Tuning',
    shortDescription:
      'Accelerate slow websites by diagnosing real server, script, font, and image bottlenecks—raising Google PageSpeed scores and mobile responsiveness without breaking design.',
    fullDescription: [
      'One-click caching plugins cannot fix bloated unoptimized hero images, render-blocking scripts, slow database queries, or heavy third-party marketing tags firing before first paint.',
      'We profile your priority templates across Lighthouse lab benchmarks and real-user Core Web Vitals (LCP, INP, CLS), isolating exactly what stalls Time to First Byte (TTFB) and main-thread rendering.',
      'Fixes target real engineering wins: next-gen WebP/AVIF sizing, critical CSS extraction, deferred third-party scripts, Redis/page caching, and database query cleanup—followed by visual and functional QA.',
    ],
    deliverables: [
      'Before-and-after Lighthouse, WebPageTest & Core Web Vitals baseline audit',
      'TTFB & server/database query optimization (Redis, indexing, OPcache)',
      'Automated WebP/AVIF image conversion, responsive srcset & lazy-loading',
      'Render-blocking CSS/JS minification, critical path & script deferral',
      'Font subsetting, preload directives & CLS layout-shift stabilization',
      'Full interactive QA confirming forms, sliders & checkouts remain flawless',
    ],
    features: ['Core Web Vitals', 'TTFB & DB Tuning', 'WebP/AVIF & Caching', 'Zero Layout Breakage'],
    metrics: [
      { label: 'Core Vitals Targets', value: 'LCP < 2.5s · CLS < 0.1' },
      { label: 'Verification', value: 'Before / After Report' },
      { label: 'Compatibility', value: 'Desktop + Mobile' },
    ],
    process: [
      {
        step: '01',
        title: 'Waterfall & Vitals Profiling',
        description: 'Benchmark key landing, category, and product pages on mobile 4G throttling to isolate top latency culprits.',
      },
      {
        step: '02',
        title: 'Media & Asset Pipeline Cleanup',
        description: 'Compress oversized hero graphics, convert assets to WebP/AVIF, eliminate unused plugins/CSS, and stabilize image dimensions.',
      },
      {
        step: '03',
        title: 'Caching & Script Orchestration',
        description: 'Tune server/CDN edge caching, defer non-critical third-party trackers, and optimize database autoloads.',
      },
      {
        step: '04',
        title: 'Regression Check & Scorecard',
        description: 'Test dynamic carts, modals, tracking pixels, and animations alongside documented before-and-after speed metrics.',
      },
    ],
    faqs: [
      {
        question: 'Will aggressive JavaScript deferral break our contact forms, pixels, or sliders?',
        answer: 'Never. We whitelist interactive scripts and manually QA forms, menus, Analytics/Pixels, and WooCommerce carts after every optimization pass.',
      },
      {
        question: 'Can you fix slow TTFB (server response time) without forcing a full rebuild?',
        answer: 'Often yes. Database query cleanup, removing bloated plugins, enabling Redis object caching, and proper CDN page caching routinely cut TTFB dramatically.',
      },
    ],
  },

  'website-security-updates': {
    slug: 'website-security-updates',
    title: 'Website Security & Updates',
    subtitle: 'Proactive Hardening, Malware Cleanup, Patch Management & Access Hygiene',
    shortDescription:
      'Protect business websites from vulnerabilities, brute-force attacks, and outdated dependencies through staged security patches, WAF rules, and recovery drills.',
    fullDescription: [
      'Most website compromises happen through unpatched plugins, weak admin passwords, exposed staging copies, or abandoned legacy PHP/Node dependencies rather than sophisticated zero-day exploits.',
      'We harden your application and server surface cleanly: enforcing least-privilege admin accounts and 2FA, locking down file permissions and login endpoints, configuring Web Application Firewall (WAF) rules, and patching vulnerable packages in staging.',
      'If a website is already experiencing suspicious redirects, injected spam pages, or blacklist warnings, we perform forensic malware removal, rotate compromised keys, and submit clean Search Console reconsideration checks.',
    ],
    deliverables: [
      'Comprehensive vulnerability, dependency & admin user access audit',
      'Staged security patching across CMS cores, plugins, PHP & Node libraries',
      'Web Application Firewall (Cloudflare/WAF) & brute-force login hardening',
      'SSL/TLS, security headers (CSP, HSTS, X-Frame) & file permission locks',
      'Malware/spam injection scanning, cleanup & secret/API key rotation',
      'Tested off-site disaster recovery & incident response documentation',
    ],
    features: ['Staged Security Patches', 'WAF & 2FA Hardening', 'Security Headers', 'Malware Recovery'],
    metrics: [
      { label: 'Patch Workflow', value: 'Backup + Staged' },
      { label: 'Access Standard', value: 'Least Privilege + 2FA' },
      { label: 'Header Hygiene', value: 'HSTS / CSP Ready' },
    ],
    process: [
      {
        step: '01',
        title: 'Exposure & Dependency Audit',
        description: 'Scan installed plugins/packages against CVE advisories, review admin accounts, and check server headers and SSL.',
      },
      {
        step: '02',
        title: 'Backup & Hardening Pass',
        description: 'Establish immutable backups, remove dormant accounts, enable 2FA, tighten permissions, and configure WAF protections.',
      },
      {
        step: '03',
        title: 'Staged Patch Rollout',
        description: 'Apply core and dependency security updates in staging first before deploying smoothly to production.',
      },
      {
        step: '04',
        title: 'Verification & Recovery Playbook',
        description: 'Re-scan security headers and uptime monitors, handing over an updated credential and recovery checklist.',
      },
    ],
    faqs: [
      {
        question: 'My website was hacked or shows spam links in Google—can you clean and recover it?',
        answer: 'Yes. We isolate compromised files, restore clean core code, remove malicious database entries/cron jobs, rotate passwords and keys, and harden entry points.',
      },
      {
        question: 'How do you keep security updates from disrupting live business operations?',
        answer: 'Every update cycle starts with an off-site snapshot and staging verification so only clean, tested patches reach your production site.',
      },
    ],
  },

  'hosting-domain-management': {
    slug: 'hosting-domain-management',
    title: 'Hosting & Domain Management',
    subtitle: 'DNS Governance, Cloud Hosting Administration, SSL & Zero-Gap Renewals',
    shortDescription:
      'Centralize domain registrars, DNS records, business email routing, SSL certificates, and cloud hosting configuration with full ownership clarity and continuity.',
    fullDescription: [
      'A single misconfigured DNS edit or expired domain renewal can take down both your corporate website and company email simultaneously—while scattered registrar logins left with former contractors create major business risk.',
      'We document and manage your complete domain and hosting footprint while keeping legal registrar ownership firmly in your organization’s name: consolidating DNS cleanly (Cloudflare/Route53), protecting MX/SPF/DKIM/DMARC email records, and right-sizing VPS or cloud hosting.',
      'Proactive renewal calendars, automated SSL renewal monitoring, and documented disaster-recovery runbooks eliminate surprise outages.',
    ],
    deliverables: [
      'Full registrar, DNS zone & hosting ownership audit (client owns accounts)',
      'Clean DNS zone management protecting A/AAAA, CNAME & MX records',
      'Email deliverability records setup & validation (SPF, DKIM, DMARC)',
      'SSL/TLS certificate automation & expiration alert configuration',
      'Cloud/VPS hosting provisioning, resource monitoring & off-site backups',
      'Centralized renewal calendar & documented access/recovery handbook',
    ],
    features: ['Protected MX & DNS', 'SPF / DKIM / DMARC', 'Auto SSL & Renewals', 'Cloud Server Tuning'],
    metrics: [
      { label: 'Registrar Ownership', value: '100% Client Held' },
      { label: 'Email Auth', value: 'SPF + DKIM + DMARC' },
      { label: 'SSL Status', value: 'Auto-Renewed' },
    ],
    process: [
      {
        step: '01',
        title: 'Registrar & DNS Inventory',
        description: 'Audit domain locks, expiry dates, nameservers, hosting plans, and every active email/subdomain record.',
      },
      {
        step: '02',
        title: 'Consolidation & Email Shielding',
        description: 'Verify Google Workspace/Microsoft 365 MX, SPF, DKIM, and DMARC records so web changes never disrupt email.',
      },
      {
        step: '03',
        title: 'Hosting & Backup Hardening',
        description: 'Configure server scaling, HTTP/2-3 CDN routing, automated SSL, firewall ports, and off-site snapshots.',
      },
      {
        step: '04',
        title: 'Ongoing Renewal & Uptime Watch',
        description: 'Track domain/hosting renewals ahead of deadlines and maintain clear credential governance documentation.',
      },
    ],
    faqs: [
      {
        question: 'Will we retain direct ownership of our domain registrar and cloud accounts?',
        answer: 'Always. We believe clients must legally own their domains and billing accounts, and we operate via delegated/team access with documented runbooks.',
      },
      {
        question: 'Can you fix our business emails going into spam while managing DNS?',
        answer: 'Yes. We properly configure and validate SPF, DKIM, and DMARC TXT records alongside your mail provider.',
      },
    ],
  },

  'website-migration': {
    slug: 'website-migration',
    title: 'Website Migration',
    subtitle: 'Zero-Downtime Host, Domain & Platform Migrations with Complete SEO Continuity',
    shortDescription:
      'Move websites seamlessly between servers, domains, or platforms (Wix/Squarespace/Shopify to WordPress/Next.js) with 301 redirects, DNS planning, and rollback readiness.',
    fullDescription: [
      'Botched website migrations erase years of Google rankings overnight when old URLs return 404 errors, SSL breaks during DNS cutover, or business emails stop delivering after nameserver changes.',
      'We execute website migrations using strict pre-flight checklists: full existing URL inventories, 1-to-1 301 redirect matrices, pre-migrated staging builds verified under hosts-file testing, and lowered DNS TTLs ahead of cutover.',
      'After switching DNS live, we validate live forms, checkouts, sitemaps, Search Console coverage, and email MX continuity—keeping the prior environment intact as an instant safety rollback.',
    ],
    deliverables: [
      'Complete legacy URL, backlink, media & form inventory before moving',
      'Verified 1-to-1 301 redirect map preserving all SEO ranking equity',
      'Full staging clone & hosts-file pre-cutover testing on destination server',
      'Low-TTL DNS cutover plan protecting Google Workspace / M365 email records',
      'Post-cutover crawl verification, XML sitemap update & Search Console check',
      'Maintained legacy server snapshot for risk-free rollback guarantee',
    ],
    features: ['301 SEO Protection', 'Zero Email Disruption', 'Staging Hosts Check', 'Rollback Guarantee'],
    metrics: [
      { label: 'Downtime Target', value: 'Zero Cutover Gap' },
      { label: 'SEO Equity', value: '1-to-1 301 Map' },
      { label: 'Safety Window', value: 'Pre-Move Snapshot' },
    ],
    process: [
      {
        step: '01',
        title: 'URL, Asset & Email Inventory',
        description: 'Crawl existing pages, export indexed URLs from Search Console, catalog forms, and lock down existing MX/TXT records.',
      },
      {
        step: '02',
        title: 'Staging Build & Redirect Map',
        description: 'Migrate files, databases, and media to the destination host and configure every 301 redirect rule.',
      },
      {
        step: '03',
        title: 'Pre-Flight QA & TTL Cutover',
        description: 'Test the new host via local hosts preview, lower DNS TTL, switch traffic cleanly, and verify live SSL.',
      },
      {
        step: '04',
        title: 'Post-Launch Crawl & Monitor',
        description: 'Re-crawl production URLs, confirm zero 404 spikes, validate lead/order emails, and submit fresh sitemaps.',
      },
    ],
    faqs: [
      {
        question: 'Can you migrate our site from Wix, Squarespace, or old cPanel hosting without losing Google rankings?',
        answer: 'Yes. We capture every existing URL before moving, map clean 301 redirects for any changed slugs, carry over metadata/schema, and submit updated sitemaps.',
      },
      {
        question: 'Will our company email stop working when you switch hosting providers?',
        answer: 'No. Before touching DNS, we copy and verify all MX, SPF, DKIM, and autodiscover records so email delivery continues without a single missed message.',
      },
    ],
  },

  'technical-support-bug-fixes': {
    slug: 'technical-support-bug-fixes',
    title: 'Technical Support & Bug Fixes',
    subtitle: 'Rapid Root-Cause Diagnosis, Clean Code Repairs & Regression Verification',
    shortDescription:
      'Resolve stubborn website crashes, checkout errors, broken plugins, and frontend glitches through disciplined debugging, tested fixes, and clear change notes.',
    fullDescription: [
      'When a checkout stops firing webhooks, a WordPress update causes a fatal 500 error, or a Safari layout bug breaks mobile conversions, guesswork patches often introduce two new bugs elsewhere.',
      'We approach troubleshooting methodically: gathering exact reproduction steps, inspecting server/browser logs, isolating the failing component in staging, and repairing the actual root cause rather than masking symptoms.',
      'Every repair ships with regression testing across adjacent user flows and a concise summary explaining what failed, how it was fixed, and how to prevent recurrence.',
    ],
    deliverables: [
      'Structured issue triage, log inspection & minimal reproduction case',
      'Root-cause debugging across PHP/WordPress, React/JS, Node.js, CSS & SQL',
      'Clean, scoped code or configuration fix verified in staging',
      'Regression testing across checkout, forms, auth & mobile viewports',
      'Critical error recovery (500 errors, WSOD, broken builds, webhook drops)',
      'Clear root-cause incident summary & commit/deployment notes',
    ],
    features: ['Root-Cause Diagnosis', '500 / Checkout Recovery', 'Cross-Browser Fixes', 'Regression Tested'],
    metrics: [
      { label: 'Emergency Triage', value: 'Rapid Response' },
      { label: 'Repair Standard', value: 'No Band-Aid Hacks' },
      { label: 'Changelog', value: 'Documented Fixes' },
    ],
    process: [
      {
        step: '01',
        title: 'Triage & Log Inspection',
        description: 'Reproduce the reported failure and capture exact stack traces, network errors, PHP/Node logs, and browser context.',
      },
      {
        step: '02',
        title: 'Root-Cause Isolation',
        description: 'Trace conflicting hooks, race conditions, malformed queries, or CSS regressions to their exact source.',
      },
      {
        step: '03',
        title: 'Scoped Repair & Regression QA',
        description: 'Implement a clean fix in staging and verify both the failing path and related critical site journeys.',
      },
      {
        step: '04',
        title: 'Safe Deploy & Incident Note',
        description: 'Push to production with backup readiness and deliver a straightforward breakdown of the fix applied.',
      },
    ],
    faqs: [
      {
        question: 'Can you fix urgent issues on a codebase your team didn’t originally build?',
        answer: 'Yes. Our senior engineers regularly step into existing WordPress, WooCommerce, Laravel, CodeIgniter, React, and Node.js repositories to stabilize bugs quickly.',
      },
      {
        question: 'What if an issue only happens intermittently or only on certain mobile browsers?',
        answer: 'We debug using cross-browser/device inspection, network throttling, and server error logging to pin down intermittent race conditions and Safari/iOS quirks.',
      },
    ],
  },
};
