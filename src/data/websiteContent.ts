export interface ServiceItem {
  id: string;
  slug: string;
  category: 'seo' | 'design' | 'development' | 'mobile';
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string[];
  deliverables: string[];
  features: string[];
  metrics: { label: string; value: string }[];
  process: { step: string; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  image: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  features: string[];
  buttonText: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
  };
  content: {
    intro: string;
    sections: { heading: string; body: string }[];
    conclusion: string;
  };
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  rating: number;
  review: string;
  projectType: string;
}

export const COMPANY_DETAILS = {
  name: 'Genmax IT Solution',
  tagline: 'Driving Measurable Business Growth Through Technology & Search Engine Dominance',
  phone: '+91 99383 07637',
  phoneDisplay: '+91 99383 07637',
  whatsappUrl: 'https://wa.me/919938307637?text=Hi%20Genmax%20IT%20Solution,%20I%20would%20like%20to%20discuss%20a%20project.',
  email: 'genmaxitsolution@gmail.com',
  address: 'C3M Aneja Market, Sadarpur, Sec-45, Noida, Delhi NCR, India - 201301',
  workingHours: 'Mon - Sat: 9:30 AM - 7:30 PM IST',
  social: {
    linkedin: 'https://linkedin.com/company/genmax-it-solution',
    facebook: 'https://facebook.com/genmaxitsolution',
    instagram: 'https://instagram.com/genmaxitsolution',
    twitter: 'https://twitter.com/genmaxit',
  },
  stats: [
    { label: 'Successful Projects', value: '500+' },
    { label: 'Client Satisfaction', value: '99.8%' },
    { label: 'Average Turnaround', value: '7-14 Days' },
    { label: 'Ethical White-Hat SEO', value: '100%' },
  ],
};

export const SERVICES: ServiceItem[] = [
  // 1. Digital Marketing & SEO Services
  {
    id: 'local-seo',
    slug: 'local-seo',
    category: 'seo',
    title: 'Local SEO Services',
    subtitle: 'Dominate Local Google Maps & Geo-Targeted Search Queries',
    shortDescription: 'Elevate your local business presence on Google Maps, local search 3-packs, and geo-targeted inquiries with high-intent local optimization.',
    fullDescription: [
      'Our Local SEO service ensures your business ranks at the very top of Google Maps and local 3-pack search results in your target city and service neighborhoods.',
      'We optimize your Google Business Profile (GBP), manage high-authority local citations, build localized backlink profiles, and implement hyper-local geo-targeted schema markup.',
      'Whether you are an established clinic, multi-location retail chain, or professional service provider, our ethical local ranking framework drives real phone calls, walk-in visits, and qualified customer leads.'
    ],
    deliverables: [
      'Complete Google Business Profile (GBP) audit & optimization',
      'Local 3-Pack geo-ranking roadmap & citation indexing',
      'Consistent NAP (Name, Address, Phone) cleanup across 60+ directories',
      'Geo-targeted schema markup implementation (LocalBusiness JSON-LD)',
      'Customer review generation & sentiment monitoring strategies',
      'Transparent monthly local keyword ranking & call tracking reports'
    ],
    features: ['Google Maps 3-Pack', 'Local Citations', 'NAP Consistency', 'Review Elevation'],
    metrics: [
      { label: 'Local Visibility Boost', value: '+185%' },
      { label: 'Average Phone Call Uplift', value: '3.4x' }
    ],
    process: [
      { step: '01', title: 'Local Citation Audit', description: 'Catalog all existing listings and correct conflicting business data across directories.' },
      { step: '02', title: 'GBP Engine Fortification', description: 'Optimize categories, service menus, operational hours, imagery, and keyword signals.' },
      { step: '03', title: 'Geo-Targeted Content & Schema', description: 'Inject precise geo-coordinates, service area polygons, and localized landing pages.' },
      { step: '04', title: 'Authority & Review Velocity', description: 'Acquire high-reputation regional citations and systematic customer reviews.' }
    ],
    faqs: [
      { question: 'How quickly can my business appear in the Google Maps 3-Pack?', answer: 'Most clients notice significant local rank improvements within 45 to 60 days following full NAP cleanup and profile optimization.' },
      { question: 'Do you help with multi-location businesses?', answer: 'Yes, we build dedicated localized sub-pages and distinct Google Business Profiles for each branch location.' }
    ]
  },
  {
    id: 'seo-services',
    slug: 'seo-services',
    category: 'seo',
    title: 'Comprehensive SEO Services',
    subtitle: 'Holistic On-Page, Technical & Off-Page Search Engine Optimization',
    shortDescription: 'Sustainable organic growth driven by technical architecture audits, high-intent keyword strategies, and authoritative backlink acquisition.',
    fullDescription: [
      'Search Engine Optimization is the bedrock of long-term sustainable online visibility. At Genmax IT Solution, we implement pure white-hat SEO that withstands algorithmic updates.',
      'We combine deep server-level crawlability audits, Core Web Vitals optimization, semantic keyword grouping, and industry-grade PR backlink campaigns to deliver top page-one rankings.',
      'Our team also specializes in Google algorithmic penalty recovery, resolving issues caused by low-quality legacy backlinks or thin content.'
    ],
    deliverables: [
      'Full technical SEO audit (Crawl errors, Indexing, Canonicalization, XML sitemaps)',
      'Keyword intent mapping & competitive gap analysis',
      'On-page title, meta, header, and structured schema optimization',
      'Core Web Vitals performance acceleration',
      'White-hat editorial link outreach & contextual guest articles',
      'Custom Google Analytics 4 & Google Search Console tracking dashboards'
    ],
    features: ['Technical Audit', 'Semantic Intent', 'Core Web Vitals', 'Link Acquisition'],
    metrics: [
      { label: 'Organic Traffic Growth', value: '+240%' },
      { label: 'Top 3 Keyword Ranks', value: '88%' }
    ],
    process: [
      { step: '01', title: 'Comprehensive Diagnostic', description: 'Examine server response, index status, crawl budgets, and backlink health.' },
      { step: '02', title: 'Keyword Intent Mapping', description: 'Target high-commercial intent keywords with high conversion probability.' },
      { step: '03', title: 'On-Page & Architecture', description: 'Refactor URL structures, metadata, internal linking, and content hierarchy.' },
      { step: '04', title: 'Authority Outreach', description: 'Acquire real, contextual backlinks from authoritative niche publications.' }
    ],
    faqs: [
      { question: 'Do you provide monthly keyword rank reports?', answer: 'Yes, you receive transparent weekly and monthly ranking dashboards showing keyword positions, impressions, and organic conversions.' },
      { question: 'Can you recover websites hit by Google core updates?', answer: 'Yes, our penalty recovery team audits link toxicity, thin content, and schema errors to systematically reinstate rankings.' }
    ]
  },
  {
    id: 'ecommerce-seo',
    slug: 'ecommerce-seo',
    category: 'seo',
    title: 'eCommerce SEO',
    subtitle: 'Maximize Product Rankings, Category Discoverability & Online Sales',
    shortDescription: 'Tailored eCommerce search strategies that turn high-intent product searches into paying shoppers across WooCommerce, Shopify, and custom stores.',
    fullDescription: [
      'Selling products online requires specialized SEO engineering. Generic SEO strategies do not resolve the unique challenges of faceted navigation, duplicate product descriptions, and category architecture.',
      'We optimize your product taxonomy, category silos, structured Product and Offer schema, and internal link distribution so your online store outranks major retail competitors.',
      'Every optimization is directly aligned with your bottom line: lowering cost-per-acquisition while accelerating repeat customer revenue.'
    ],
    deliverables: [
      'Faceted navigation and canonical tag structure resolution',
      'Product and Collection page on-page optimization',
      'Structured Product schema (Price, Availability, Review rating JSON-LD)',
      'Category page content depth and commercial search intent alignment',
      'Site speed optimization for high-SKU inventory catalogues',
      'eCommerce conversion rate analysis & cart abandonment reduction insights'
    ],
    features: ['Faceted Navigation', 'Product Schema', 'Category Silos', 'High-SKU Speed'],
    metrics: [
      { label: 'Average Revenue Uplift', value: '+190%' },
      { label: 'Cart Abandonment Drop', value: '-22%' }
    ],
    process: [
      { step: '01', title: 'Catalog Architecture', description: 'Analyze URL structures, duplicate variant queries, and category silos.' },
      { step: '02', title: 'Rich Snippet Markup', description: 'Inject verified Schema.org Product, AggregateRating, and Offer markup.' },
      { step: '03', title: 'Category Depth Engineering', description: 'Craft compelling commercial landing content for top-level collections.' },
      { step: '04', title: 'Conversion Funnel Tuning', description: 'Optimize product page UX and mobile checkout speeds.' }
    ],
    faqs: [
      { question: 'Do you work with WooCommerce and Shopify?', answer: 'Yes, we have deep hands-on expertise with WooCommerce, Shopify, Magento, and custom headless eCommerce architectures.' }
    ]
  },
  {
    id: 'social-media-marketing',
    slug: 'social-media-marketing',
    category: 'seo',
    title: 'Social Media Marketing (SMO/SMM)',
    subtitle: 'Build Community Trust, Brand Resonance & Social Acquisition Channels',
    shortDescription: 'Targeted campaigns across Meta, Instagram, LinkedIn, and YouTube that amplify your brand reach and generate qualified inbound inquiries.',
    fullDescription: [
      'Modern brands require an authoritative voice across today’s digital watering holes. Genmax IT Solution plans, designs, and executes cohesive social media strategies.',
      'From eye-catching creative assets to precise demographic ad targeting on LinkedIn and Instagram, we build an active community around your brand services.',
      'We combine organic brand storytelling with high-performing paid retargeting funnels to capture prospects at every stage of their buyer journey.'
    ],
    deliverables: [
      'Monthly social media content calendar & aesthetic grid design',
      'Custom graphic design, video shorts, and carousel templates',
      'High-converting Meta & LinkedIn lead generation campaigns',
      'Community engagement, DM response workflows, and follower growth',
      'Pixel tracking, custom audiences, and lookalike retargeting setup',
      'Monthly reach, engagement, and direct conversion performance reports'
    ],
    features: ['Meta Ads', 'LinkedIn B2B', 'Visual Content', 'Retargeting Funnels'],
    metrics: [
      { label: 'Engagement Growth', value: '4.2x' },
      { label: 'Lead Quality Rate', value: '+75%' }
    ],
    process: [
      { step: '01', title: 'Audience Discovery', description: 'Identify target persona demographics, interests, and peak active timeframes.' },
      { step: '02', title: 'Content Engine', description: 'Design branded graphics, informational carousels, and client success reels.' },
      { step: '03', title: 'Campaign Deployment', description: 'Launch targeted paid social ads with tight budget pacing and A/B ad creative testing.' },
      { step: '04', title: 'Community & Funneling', description: 'Direct social interest into website inquiries and direct WhatsApp chats.' }
    ],
    faqs: [
      { question: 'Will you manage both organic posting and paid ads?', answer: 'Yes, our social media packages include both cohesive organic content calendars and high-ROI paid ad campaigns.' }
    ]
  },
  {
    id: 'ppc-management',
    slug: 'ppc-management',
    category: 'seo',
    title: 'PPC Management Services',
    subtitle: 'Data-Driven Google Ads & Paid Search Campaigns with Positive ROAS',
    shortDescription: 'Stop wasting budget on irrelevant clicks. We build tightly engineered Google Ads campaigns that generate immediate, qualified sales inquiries.',
    fullDescription: [
      'Pay-Per-Click (PPC) advertising offers the fastest route to high-intent prospective buyers. However, without technical bidding discipline, ad budgets deplete rapidly.',
      'Genmax IT Solution engineers precision PPC campaigns on Google Search, Google Display, Performance Max, and YouTube Ads.',
      'We craft razor-sharp negative keyword lists, laser-focused single-keyword ad groups (SKAGs), high-converting landing page experiences, and continuous conversion rate optimizations.'
    ],
    deliverables: [
      'In-depth competitor PPC landscape & commercial keyword bidding audit',
      'Negative keyword list configuration to eliminate budget leakage',
      'High-converting landing page optimization & copy alignment',
      'Smart bidding strategy tuning (Target CPA, Target ROAS, Maximize Conversions)',
      'Multi-channel conversion tracking (calls, form submissions, purchases)',
      'Real-time live performance analytics dashboard'
    ],
    features: ['Google Search Ads', 'Performance Max', 'Negative Keywords', 'High ROAS'],
    metrics: [
      { label: 'Average ROAS', value: '480%' },
      { label: 'Cost Per Lead Drop', value: '-34%' }
    ],
    process: [
      { step: '01', title: 'Keyword & Competitor Audit', description: 'Uncover high-intent keywords and analyze competitor bidding tactics.' },
      { step: '02', title: 'Campaign Architecture', description: 'Structure tight ad groups, responsive search ads, and robust sitelink extensions.' },
      { step: '03', title: 'Landing Page Synchronization', description: 'Ensure the message on your landing page exactly matches search intent.' },
      { step: '04', title: 'Continuous Bidding Optimization', description: 'Refine bids weekly, prune negative keywords, and double down on winning keywords.' }
    ],
    faqs: [
      { question: 'What is the recommended minimum ad budget?', answer: 'We tailor campaigns for local businesses starting from ₹15,000/month as well as larger enterprise ad spends.' }
    ]
  },
  {
    id: 'reputation-management',
    slug: 'reputation-management',
    category: 'seo',
    title: 'Online Reputation Management (ORM)',
    subtitle: 'Protect, Restore & Elevate Your Brand’s Digital Standing',
    shortDescription: 'Shield your brand from defamatory mentions, suppress unfair negative search results, and establish a five-star credible online footprint.',
    fullDescription: [
      'Your digital reputation directly dictates customer trust and conversion rates. A single negative review or unfair review site listing can cost tens of thousands in lost revenue.',
      'Our Online Reputation Management (ORM) service implements proactive brand sentiment cultivation and assertive negative content suppression.',
      'We build high-authority positive assets that dominate Page 1 of Google brand searches, while guiding happy clients into leaving glowing verified reviews.'
    ],
    deliverables: [
      '24/7 brand mention & sentiment monitoring across the web',
      'Negative search result suppression through positive asset authority building',
      'Systematic review generation strategy for Google, Trustpilot, and Glassdoor',
      'Crisis PR mitigation and professional response protocols',
      'Executive personal branding and leadership profile optimization',
      'Quarterly brand sentiment & sentiment trend reporting'
    ],
    features: ['Sentiment Tracking', 'Negative Suppression', 'Review Velocity', 'Crisis Mitigation'],
    metrics: [
      { label: 'Positive Brand Share', value: '96%' },
      { label: 'Review Score Average', value: '4.8/5' }
    ],
    process: [
      { step: '01', title: 'Sentiment Audit', description: 'Index all search engine results, forum threads, and review aggregators mentioning your brand.' },
      { step: '02', title: 'Asset Elevation', description: 'Publish and rank high-authority corporate profiles, press releases, and case studies.' },
      { step: '03', title: 'Review Growth Funnel', description: 'Deploy SMS and email automated workflows prompting satisfied clients for feedback.' },
      { step: '04', title: 'Active Defense', description: 'Set up real-time probers that notify you within minutes of any new online mention.' }
    ],
    faqs: [
      { question: 'Can negative articles be pushed down in Google search?', answer: 'Yes, by creating and ranking authoritative positive web properties, we push negative mentions below the first page fold.' }
    ]
  },

  // 2. Website Design Services
  {
    id: 'website-design-india',
    slug: 'website-design-india',
    category: 'design',
    title: 'Website Design India',
    subtitle: 'World-Class Custom UI/UX Design Engineered for Global Brands',
    shortDescription: 'Clean, modern, and high-conversion web design crafted by senior designers, delivering international aesthetics at highly competitive pricing.',
    fullDescription: [
      'Genmax IT Solution is recognized as a premier website design agency in India. We design bespoke, visually captivating digital experiences that elevate brand prestige.',
      'We reject templated, generic WordPress themes. Every project begins with user journey mapping, design systems, modern typography hierarchy, and conversion wireframes.',
      'Our websites load with blazing speed, look immaculate on mobile devices, and effortlessly turn casual site visitors into committed paying clients.'
    ],
    deliverables: [
      'Custom visual identity and UI design system (Figma / Adobe XD)',
      'Mobile-first responsive layouts tested across 15+ screen resolutions',
      'Conversion-focused landing page layouts and micro-interactions',
      'Inclusive accessibility compliance (WCAG AA standards)',
      'Free domain registration included (worth ₹999)',
      '1 year of complimentary technical support & updates'
    ],
    features: ['Custom Figma Design', 'Mobile-First', 'Conversion Focused', 'WCAG AA Compliant'],
    metrics: [
      { label: 'Average Delivery Time', value: '7-14 Days' },
      { label: 'Bounce Rate Reduction', value: '-38%' }
    ],
    process: [
      { step: '01', title: 'Design Discovery', description: 'Analyze your target audience, competitor benchmarks, and aesthetic goals.' },
      { step: '02', title: 'Wireframes & UI Concept', description: 'Produce detailed interactive Figma layouts for client approval before writing code.' },
      { step: '03', title: 'Pixel-Perfect Build', description: 'Implement responsive markup with elegant typography, spacing, and micro-animations.' },
      { step: '04', title: 'Launch & Handoff', description: 'Deploy to fast servers, connect custom domains, and configure analytics.' }
    ],
    faqs: [
      { question: 'What is the turnaround time for a custom website?', answer: 'Our standard delivery timeframe is 7 to 14 business days, with clear review milestones along the way.' },
      { question: 'Do you offer a free domain with website packages?', answer: 'Yes! All standard website design packages include a free custom domain worth ₹999.' }
    ]
  },
  {
    id: 'wordpress-website-design',
    slug: 'wordpress-website-design',
    category: 'design',
    title: 'WordPress Website Design',
    subtitle: 'Bespoke WordPress Experiences with Intuitive Content Management',
    shortDescription: 'Custom, lightweight WordPress websites designed from scratch with zero page-builder bloat, maximum security, and effortless self-editing.',
    fullDescription: [
      'WordPress powers over 40% of the internet, but poorly designed templates lead to bloated scripts, slow load times, and frequent security vulnerabilities.',
      'Genmax IT Solution builds custom WordPress websites that are clean, fast, and engineered for high conversions.',
      'We empower marketing teams with simple, block-based page builders or custom Gutenberg blocks so you can publish new pages, blog posts, and service updates effortlessly without writing code.'
    ],
    deliverables: [
      'Custom WordPress theme design built to your brand guidelines',
      'Gutenberg block integration for effortless drag-and-drop page editing',
      'Speed optimization ensuring sub-1.5 second loading times',
      'Security hardening (brute-force defense, SSL, two-factor auth)',
      'SEO plugin configuration (RankMath / Yoast with optimized sitemaps)',
      'Staff training session with recorded video walkthroughs'
    ],
    features: ['Custom Themes', 'Zero Bloat', 'Gutenberg Ready', 'Speed Optimized'],
    metrics: [
      { label: 'Google PageSpeed Score', value: '95+' },
      { label: 'Average Client Edit Time', value: '<5 Mins' }
    ],
    process: [
      { step: '01', title: 'Brand & Structure Alignment', description: 'Define custom post types, taxonomies, and layout blocks.' },
      { step: '02', title: 'Theme Prototyping', description: 'Craft lightweight theme styles without clunky external builder dependencies.' },
      { step: '03', title: 'Security & Speed Tuning', description: 'Configure caching, image WebP conversion, and database indexing.' },
      { step: '04', title: 'Editor Training', description: 'Provide client teams with straightforward admin panels and tutorials.' }
    ],
    faqs: [
      { question: 'Can I easily edit text and images on my own?', answer: 'Absolutely. We configure intuitive visual editing areas so you can update anything in seconds without touching code.' }
    ]
  },
  {
    id: 'woocommerce-web-design',
    slug: 'woocommerce-web-design',
    category: 'design',
    title: 'WooCommerce Web Design',
    subtitle: 'Engaging, High-Conversion Online Stores Powered by WooCommerce',
    shortDescription: 'Turn store visitors into loyal customers with frictionless product exploration, streamlined checkout, and mobile-optimized eCommerce UX.',
    fullDescription: [
      'An exceptional eCommerce store requires more than a shopping cart—it demands an intuitive shopping experience that builds buyer confidence.',
      'We design custom WooCommerce storefronts with frictionless checkout flows, smart cross-sells, instant search filtering, and seamless payment gateway integrations.',
      'From boutique fashion brands to industrial B2B distributors with complex pricing, our WooCommerce designs scale smoothly as your order volume surges.'
    ],
    deliverables: [
      'Custom WooCommerce storefront & product detail page designs',
      'One-page streamlined checkout flow minimizing cart abandonment',
      'Multi-currency and localized payment gateway integration (Razorpay, Stripe, PayPal)',
      'Inventory tracking, coupon engine, and automated customer order notifications',
      'Wishlist, product comparison, and instant AJAX filter widgets',
      'Full shipping rule configuration and tax compliance setup'
    ],
    features: ['1-Page Checkout', 'AJAX Filters', 'Payment Gateways', 'Inventory Sync'],
    metrics: [
      { label: 'Checkout Completion Rate', value: '+31%' },
      { label: 'Average Order Value', value: '+18%' }
    ],
    process: [
      { step: '01', title: 'Shopping Journey Mapping', description: 'Map product discovery, filtering, cart additions, and payment paths.' },
      { step: '02', title: 'High-Conversion UI', description: 'Design distraction-free checkout interfaces and mobile-friendly product galleries.' },
      { step: '03', title: 'Payment & Logistics Integration', description: 'Integrate domestic & international payment gateways and shipping APIs.' },
      { step: '04', title: 'Load Testing & Go-Live', description: 'Stress-test concurrent transactions and certify PCI-DSS compliance.' }
    ],
    faqs: [
      { question: 'Which payment gateways do you support?', answer: 'We support all major gateways including Razorpay, Stripe, PayPal, PayU, Cashfree, and cash-on-delivery.' }
    ]
  },
  {
    id: 'responsive-web-design',
    slug: 'responsive-web-design',
    category: 'design',
    title: 'Responsive Web Design',
    subtitle: 'Flawless Visual Appeal Across Smartphones, Tablets & Ultrawide Displays',
    shortDescription: 'Every pixel meticulously adjusted for fluid responsiveness across all screen sizes, touch devices, and modern web browsers.',
    fullDescription: [
      'Over 65% of global internet traffic originates from mobile devices. If your website stutters, misaligns text, or forces pinch-to-zoom on phones, you are losing valuable business.',
      'We build websites using fluid grid systems, adaptive media queries, and touch-first interaction paradigms.',
      'Your website will look immaculate whether viewed on an iPhone, an Android tablet, an executive MacBook, or a 4K ultrawide desktop monitor.'
    ],
    deliverables: [
      'Fluid CSS layouts with scalable typography and responsive vector assets',
      'Touch-friendly navigation drawers, button tap targets, and gesture carousels',
      'Cross-browser testing (Chrome, Safari, Firefox, Edge) across iOS and Android',
      'Adaptive image delivery using modern WebP formats for reduced mobile data consumption',
      'Zero horizontal overflow guarantees across all screen viewports'
    ],
    features: ['Fluid Grids', 'Touch Gestures', 'Adaptive Images', 'Zero Overflow'],
    metrics: [
      { label: 'Mobile Conversion Rate', value: '+42%' },
      { label: 'Cross-Device Parity', value: '100%' }
    ],
    process: [
      { step: '01', title: 'Viewport Strategy', description: 'Plan layouts for mobile (320px-425px), tablet (768px), and desktop (1024px-1920px).' },
      { step: '02', title: 'Touch Optimization', description: 'Ensure touch targets meet strict 44px+ minimum sizing guidelines.' },
      { step: '03', title: 'Adaptive Testing', description: 'Validate performance on real hardware across iOS, iPadOS, and Android.' },
      { step: '04', title: 'Optimization Sweep', description: 'Eliminate layout shifts (CLS) to secure a pristine Core Web Vitals score.' }
    ],
    faqs: [
      { question: 'Do you design mobile-first?', answer: 'Yes, our default design philosophy begins with mobile ergonomics before expanding to desktop canvases.' }
    ]
  },
  {
    id: 'website-redesign',
    slug: 'website-redesign',
    category: 'design',
    title: 'Website Redesign Services',
    subtitle: 'Modernize Your Legacy Website into a High-Performing Growth Engine',
    shortDescription: 'Revitalize your outdated website with cutting-edge visual aesthetics, faster load times, and superior conversion rates while preserving existing SEO authority.',
    fullDescription: [
      'Has your website fallen behind modern design trends, loading sluggishly, or failing to convert visitors into inquiries? It is time for a strategic redesign.',
      'At Genmax IT Solution, website redesign is more than a cosmetic coat of paint. We analyze your historic analytics, identify user drop-off points, and restructure your site for maximum engagement.',
      'Most importantly, we safeguard your hard-earned search engine rankings through rigorous 301 redirect mapping, preserving all existing SEO equity and organic traffic.'
    ],
    deliverables: [
      'Comprehensive audit of existing website bottlenecks, UX flaws, and SEO assets',
      'Complete 301 URL redirect mapping ensuring zero lost rankings or broken links',
      'Modern, award-grade visual redesign aligned with your evolving business status',
      'Dramatic performance acceleration (sub-1.5 second loading target)',
      'Fresh conversion funnels, lead magnets, and WhatsApp chat integrations',
      'Seamless content migration with zero downtime during cutover'
    ],
    features: ['SEO Protection', '301 URL Mapping', 'Zero Downtime', 'Performance Boost'],
    metrics: [
      { label: 'Post-Launch Inquiries', value: '+140%' },
      { label: 'Average Page Speed Gain', value: '3.2x' }
    ],
    process: [
      { step: '01', title: 'Legacy Audit & URL Inventory', description: 'Catalog every ranking URL and backlink to create a foolproof 301 migration plan.' },
      { step: '02', title: 'Next-Gen UI Prototype', description: 'Design modern layouts that solve previous UX friction points.' },
      { step: '03', title: 'Staging Build & Migration', description: 'Develop on a private staging server while your current website remains fully live.' },
      { step: '04', title: 'Zero-Downtime Launch', description: 'Execute domain cutover, submit new sitemaps to Google, and verify indexing.' }
    ],
    faqs: [
      { question: 'Will a redesign hurt my existing Google rankings?', answer: 'Not with us. We map 1-to-1 301 redirects and preserve your high-ranking content and metadata so you maintain and grow your rankings.' }
    ]
  },

  // 3. Web Development Services
  {
    id: 'website-development',
    slug: 'website-development',
    category: 'development',
    title: 'Custom Website Development',
    subtitle: 'Enterprise-Grade Full-Stack Web Development Tailored to Your Architecture',
    shortDescription: 'Robust, clean-code web applications and bespoke digital platforms engineered with scalable, modern architectures for long-term growth.',
    fullDescription: [
      'When off-the-shelf templates cannot meet your operational requirements, custom web development provides the flexibility, performance, and security your business needs.',
      'Our senior software engineers build custom web applications using modern, maintainable stacks. From complex customer portals and booking systems to API-driven SaaS platforms, we architect software that scales.',
      'Every codebase adheres to strict security standards, automated testing, and comprehensive documentation for seamless future maintainability.'
    ],
    deliverables: [
      'Clean, modular, well-documented source code with complete IP ownership',
      'High-performance REST / GraphQL API integrations and third-party service connections',
      'Role-based access control (RBAC) and enterprise database architecture',
      'Automated deployment pipelines (CI/CD) and cloud hosting configuration',
      '1 year of comprehensive free technical support and bug fixes',
      'End-to-end security audits including OWASP vulnerability mitigation'
    ],
    features: ['Custom Stack', 'REST APIs', 'Scalable DB', 'Full IP Rights'],
    metrics: [
      { label: 'Uptime Reliability', value: '99.9%' },
      { label: 'Security Vulnerabilities', value: '0' }
    ],
    process: [
      { step: '01', title: 'Technical Architecture', description: 'Define database schemas, API contracts, security protocols, and tech stack.' },
      { step: '02', title: 'Agile Sprint Sprints', description: 'Develop features in transparent bi-weekly sprints with interactive preview builds.' },
      { step: '03', title: 'Automated QA & Security', description: 'Conduct unit testing, penetration scans, and edge-case load testing.' },
      { step: '04', title: 'Production Deployment', description: 'Deploy to enterprise cloud infrastructure with continuous monitoring and backups.' }
    ],
    faqs: [
      { question: 'Do I own the complete source code upon project completion?', answer: 'Yes, 100%. You receive full legal ownership of the source code, repositories, and intellectual property.' }
    ]
  },
  {
    id: 'wordpress-development',
    slug: 'wordpress-development',
    category: 'development',
    title: 'WordPress Development',
    subtitle: 'Custom Themes, Headless Architectures & Custom Plugin Engineering',
    shortDescription: 'Enterprise WordPress solutions built with precision code, custom plugin integrations, and scalable database schemas for demanding web properties.',
    fullDescription: [
      'We elevate WordPress from a blogging tool into an enterprise publishing powerhouse.',
      'Our engineers create custom WordPress plugins, bespoke themes using the Roots Sage/Bedrock modern developer stack, and headless WordPress setups powered by React/Next.js.',
      'We eliminate sluggish third-party plugin dependencies, ensuring your WordPress installation is lean, secure, and blazingly fast.'
    ],
    deliverables: [
      'Bespoke WordPress theme and custom plugin development',
      'Headless WordPress API endpoints for modern frontend apps',
      'Database query optimization and custom post type architectures',
      'Enterprise security fortification (WP-hardening, firewall rules, automated malware scanning)',
      'Automated off-site database and asset backups',
      'Migration from proprietary platforms (Wix, Squarespace, Drupal, Joomla)'
    ],
    features: ['Custom Plugins', 'Headless WP', 'Database Tuning', 'Zero Clutter'],
    metrics: [
      { label: 'Database Query Time', value: '<50ms' },
      { label: 'Security Score', value: '100/100' }
    ],
    process: [
      { step: '01', title: 'Requirements & Schema Design', description: 'Structure custom fields and post relationships cleanly.' },
      { step: '02', title: 'Precision Code Build', description: 'Develop lightweight PHP/JS templates adhering to WordPress Core standards.' },
      { step: '03', title: 'Integration & Optimization', description: 'Connect CRM, newsletter, and payment APIs without extraneous plugin bloat.' },
      { step: '04', title: 'Deployment & Cache Warmup', description: 'Deploy with Redis object caching and CDN edge routing.' }
    ],
    faqs: [
      { question: 'Can you migrate our current site from Wix or Squarespace to WordPress?', answer: 'Yes, we execute seamless migrations preserving all blog articles, pages, images, and SEO URLs.' }
    ]
  },
  {
    id: 'woocommerce-development',
    slug: 'woocommerce-development',
    category: 'development',
    title: 'WooCommerce Development',
    subtitle: 'Custom Extensions, ERP Integrations & Scalable Online Store Architectures',
    shortDescription: 'Advanced WooCommerce engineering including custom payment gateways, live ERP/CRM sync, subscription engines, and B2B wholesale portals.',
    fullDescription: [
      'When your eCommerce operations outgrow basic store capabilities, our WooCommerce development team delivers custom technical solutions.',
      'We engineer custom WooCommerce extensions, automate inventory synchronization with your warehouse ERP (SAP, Tally, Zoho), and build complex subscription pricing models.',
      'Whether handling tens of thousands of SKUs or processing thousands of simultaneous flash-sale transactions, we optimize your WooCommerce store for uninterrupted reliability.'
    ],
    deliverables: [
      'Custom WooCommerce plugin development and custom checkout workflows',
      'ERP, CRM, and accounting software synchronization (Tally, Zoho, SAP)',
      'B2B wholesale pricing tiers and minimum order quantity rules',
      'Recurring subscription, membership, and recurring billing systems',
      'High-concurrency database optimization for high-traffic sales events',
      'Custom shipping courier API integrations (Shiprocket, Delhivery, FedEx)'
    ],
    features: ['ERP Sync', 'B2B Wholesale', 'Subscriptions', 'Courier APIs'],
    metrics: [
      { label: 'Catalog SKU Capacity', value: '100k+' },
      { label: 'Order Processing Speed', value: 'Instant' }
    ],
    process: [
      { step: '01', title: 'Business Logic Scoping', description: 'Map unique inventory flows, wholesale price matrices, and courier hooks.' },
      { step: '02', title: 'Custom Extension Development', description: 'Write native WooCommerce extensions utilizing action hooks and filters.' },
      { step: '03', title: 'ERP/API Bridging', description: 'Establish secure bi-directional webhooks with external warehouse systems.' },
      { step: '04', title: 'Stress & Concurrency Testing', description: 'Simulate high transaction loads to verify zero database deadlocks.' }
    ],
    faqs: [
      { question: 'Can WooCommerce handle large catalogs with over 50,000 products?', answer: 'Yes, with proper database indexing, Elasticsearch, and Redis caching, WooCommerce comfortably manages 100,000+ SKUs.' }
    ]
  },
  {
    id: 'codeigniter-development',
    slug: 'codeigniter-development',
    category: 'development',
    title: 'CodeIgniter Development',
    subtitle: 'Lightweight, Blazing-Fast PHP Applications Engineered with Precision',
    shortDescription: 'High-speed PHP web applications built on CodeIgniter 3 and 4, offering minimal footprint, exceptional execution speed, and robust MVC architecture.',
    fullDescription: [
      'CodeIgniter is renowned for its exceptional execution speed and remarkably lightweight footprint, making it ideal for applications where rapid server response times are critical.',
      'Our CodeIgniter developers build custom web portals, CRM systems, accounting back-offices, and dynamic data-driven applications.',
      'We also assist enterprises with upgrading legacy CodeIgniter 2 and 3 codebases to modern, secure CodeIgniter 4 standards with PHP 8+ compatibility.'
    ],
    deliverables: [
      'Custom CodeIgniter web application development following MVC design patterns',
      'CodeIgniter 3 to CodeIgniter 4 legacy migration and PHP 8+ refactoring',
      'RESTful API development for mobile and single-page application backends',
      'Database query optimization, Active Record tuning, and security audits',
      'Custom admin dashboards with fine-grained role permissions',
      '1 year of dedicated maintenance and bug fixing'
    ],
    features: ['Lightweight Footprint', 'MVC Architecture', 'CI3 to CI4 Upgrade', 'Fast Response'],
    metrics: [
      { label: 'Server Execution Time', value: '<25ms' },
      { label: 'Framework Overhead', value: 'Minimal' }
    ],
    process: [
      { step: '01', title: 'MVC Architecture Design', description: 'Organize models, views, and controllers cleanly for long-term scalability.' },
      { step: '02', title: 'Core Logic Implementation', description: 'Develop database helpers, authentication middleware, and input sanitizers.' },
      { step: '03', title: 'API & Front-End Hookup', description: 'Build REST endpoints with robust JWT token authentication.' },
      { step: '04', title: 'Optimization & Security Verification', description: 'Audit CSRF protection, SQL injection defenses, and XSS sanitization.' }
    ],
    faqs: [
      { question: 'Do you provide legacy CodeIgniter maintenance?', answer: 'Yes, we actively maintain, secure, and modernize existing CodeIgniter projects without needing to rebuild from scratch.' }
    ]
  },
  {
    id: 'matx-development',
    slug: 'matx-development',
    category: 'development',
    title: 'Matx Web Development',
    subtitle: 'Cutting-Edge React & Material Design Enterprise Admin Systems',
    shortDescription: 'High-performance administrative dashboards, ERP controls, and interactive data hubs developed with the modern Matx React framework.',
    fullDescription: [
      'Modern enterprise software requires responsive, intuitive, and data-dense dashboards. Genmax IT Solution specializes in Matx React development.',
      'Using the battle-tested Matx Material-UI architecture, we build real-time monitoring consoles, customer relationship managers, and complex analytical systems.',
      'Our Matx web apps offer snappy client-side routing, modular component hierarchies, role-based view switching, and effortless third-party API data visualization.'
    ],
    deliverables: [
      'Custom Matx React dashboard and enterprise portal development',
      'Integration of interactive real-time charting (ApexCharts, Recharts, Chart.js)',
      'Role-based permission gateways and multi-tenant authentication workflows',
      'REST and WebSocket backend integration for live operational feeds',
      'Dark and light mode responsive styling crafted to brand specifications',
      'Comprehensive codebase handover with full component documentation'
    ],
    features: ['React & MUI', 'Real-Time Charts', 'Role Permissions', 'Data-Dense UX'],
    metrics: [
      { label: 'Data Processing Speed', value: 'Sub-Second' },
      { label: 'Workflow Efficiency Gain', value: '+45%' }
    ],
    process: [
      { step: '01', title: 'Dashboard UX Architecture', description: 'Map critical KPI widgets, table filters, and operational drill-down panels.' },
      { step: '02', title: 'Component Engineering', description: 'Construct reusable Matx cards, data tables, and modal forms.' },
      { step: '03', title: 'State & API Binding', description: 'Bind Redux/Zustand state managers to backend endpoints with optimistic UI updates.' },
      { step: '04', title: 'Production Hardening', description: 'Conduct cross-browser testing and performance bundle size optimization.' }
    ],
    faqs: [
      { question: 'What is Matx Development?', answer: 'Matx is an advanced React Material Design dashboard framework that provides a rich, enterprise-ready foundation for CRM, ERP, and SaaS management back-offices.' }
    ]
  },
  {
    id: 'laravel-development',
    slug: 'laravel-development',
    category: 'development',
    title: 'Laravel Development',
    subtitle: 'Elegant, High-Performance Enterprise Web Solutions & Microservices',
    shortDescription: 'Sophisticated backend architectures, RESTful APIs, and SaaS applications crafted with the expressive power of PHP’s premier framework.',
    fullDescription: [
      'Laravel is the world’s leading modern PHP framework, offering unparalleled developer productivity, built-in security, and scalable architecture.',
      'At Genmax IT Solution, our certified Laravel engineers construct mission-critical software: multi-tenant SaaS applications, custom CRM engines, payment orchestration platforms, and headless backends.',
      'We leverage Laravel’s powerful ecosystem—including Horizon for queue processing, Sanctum for authentication, and Livewire / Inertia.js for modern reactive frontends.'
    ],
    deliverables: [
      'Custom Laravel web application and SaaS platform engineering',
      'High-throughput RESTful / GraphQL API development with OpenAPI documentation',
      'Eloquent ORM optimization, Redis caching, and database indexing',
      'Asynchronous background job processing and queue management (Laravel Horizon)',
      'Third-party software integrations (Stripe, Twilio, AWS S3, Salesforce)',
      'Comprehensive automated PHPUnit test suites and 1 year of support'
    ],
    features: ['Eloquent ORM', 'Queue Processing', 'SaaS Multi-Tenancy', 'Modern Security'],
    metrics: [
      { label: 'API Response Time', value: '<40ms' },
      { label: 'Test Coverage', value: '90%+' }
    ],
    process: [
      { step: '01', title: 'Domain-Driven Modeling', description: 'Architect entities, relationships, database migrations, and business rules.' },
      { step: '02', title: 'API & Core Logic Build', description: 'Write clean controllers, services, repositories, and form request validations.' },
      { step: '03', title: 'Queue & Cache Optimization', description: 'Implement Redis queues for asynchronous emails, notifications, and webhooks.' },
      { step: '04', title: 'Continuous Integration Deploy', description: 'Configure automated testing pipelines and zero-downtime deployment scripts.' }
    ],
    faqs: [
      { question: 'Can Laravel handle high volumes of simultaneous traffic?', answer: 'Yes, when paired with Redis caching, queue workers, and horizontal container scaling, Laravel comfortably handles millions of requests.' }
    ]
  },

  // 4. Mobile App Development
  {
    id: 'ios-app-development',
    slug: 'ios-app-development',
    category: 'mobile',
    title: 'iOS Mobile App Development',
    subtitle: 'Premium Apple Ecosystem Applications Built with Swift & React Native',
    shortDescription: 'Delightful, high-performance iOS apps for iPhone, iPad, and Apple Watch that meet Apple’s stringent Human Interface Guidelines and App Store standards.',
    fullDescription: [
      'The Apple ecosystem represents high-value, discerning digital consumers who expect fluid animations, airtight security, and intuitive user experiences.',
      'Genmax IT Solution engineers native Swift and high-performance React Native iOS apps that delight users and capture high App Store ratings.',
      'From hardware camera and FaceID integrations to in-app purchases and Apple Pay checkouts, we build iOS apps that convert interest into loyal engagement.'
    ],
    deliverables: [
      'Custom iOS user experience designed to Apple Human Interface Guidelines',
      'Native Swift or high-performance React Native iOS development',
      'Biometric authentication (Face ID / Touch ID) and Apple Pay integration',
      'Push notification setup via Apple Push Notification Service (APNs)',
      'Guaranteed App Store review approval and submission management',
      '1 year of free bug fixes and iOS version compatibility updates'
    ],
    features: ['Swift & React Native', 'Apple Pay', 'Face ID', 'App Store Guarantee'],
    metrics: [
      { label: 'App Store Approval Rate', value: '100%' },
      { label: 'Average User Crash Rate', value: '<0.05%' }
    ],
    process: [
      { step: '01', title: 'iOS UX Prototyping', description: 'Design screens following Apple HIG principles with fluid native transitions.' },
      { step: '02', title: 'Clean Architecture Build', description: 'Develop using MVVM pattern with offline caching and background data sync.' },
      { step: '03', title: 'TestFlight Beta Testing', description: 'Distribute internal builds to your team for real-device testing and feedback.' },
      { step: '04', title: 'App Store Submission', description: 'Manage metadata, screenshots, privacy declarations, and review approvals.' }
    ],
    faqs: [
      { question: 'Do you guarantee App Store approval?', answer: 'Yes! We follow Apple Developer guidelines strictly and manage the complete review process until your app is live.' }
    ]
  },
  {
    id: 'android-app-development',
    slug: 'android-app-development',
    category: 'mobile',
    title: 'Android Mobile App Development',
    subtitle: 'Scalable Android Apps Reaching Billions Across Diverse Devices',
    shortDescription: 'High-performance Android applications built with Kotlin and modern frameworks, tested across hundreds of screen resolutions and hardware devices.',
    fullDescription: [
      'Android powers the overwhelming majority of global smartphone users. However, creating a flawless Android app requires engineering for immense device diversity.',
      'At Genmax IT Solution, our Android engineers build rock-solid apps using Kotlin, Jetpack Compose, and modern cross-platform technologies.',
      'We test rigorously across various Android OEM versions (Samsung, Xiaomi, Pixel, OnePlus) to guarantee silky-smooth performance and zero battery drain.'
    ],
    deliverables: [
      'Intuitive Android UI designed adhering to Material Design 3 guidelines',
      'Native Kotlin or React Native Android app engineering',
      'Google Play Services, Maps, and In-App Billing integrations',
      'FCM (Firebase Cloud Messaging) rich push notifications',
      'Google Play Store submission and compliance clearance',
      '1 year of post-launch technical maintenance and OS updates'
    ],
    features: ['Kotlin & Jetpack', 'Material Design 3', 'Google Play Ready', 'Cross-Device QA'],
    metrics: [
      { label: 'Google Play Approval', value: 'Fast-Track' },
      { label: 'Supported Devices', value: '10,000+' }
    ],
    process: [
      { step: '01', title: 'Material UI Wireframing', description: 'Craft accessible, high-contrast layouts tailored to Android ergonomics.' },
      { step: '02', title: 'Modular Engineering', description: 'Implement Kotlin coroutines, Room database, and clean repositories.' },
      { step: '03', title: 'Device Lab Testing', description: 'Verify performance on multiple screen densities and low-memory conditions.' },
      { step: '04', title: 'Play Store Launch', description: 'Deploy app bundles (AAB), setup store listing optimization, and launch.' }
    ],
    faqs: [
      { question: 'Can you build an app that runs on both iOS and Android?', answer: 'Yes! Using cross-platform technologies like React Native, we can build a unified codebase that runs natively on both platforms, saving time and budget.' }
    ]
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Local SEO & Web Starter',
    badge: 'Popular for Local Businesses',
    price: '₹4,999',
    period: '/ month',
    description: 'Perfect for local service providers looking to dominate Google Maps and build their initial online customer acquisition engine.',
    features: [
      'Up to 10 Target Local Keywords',
      'Complete Google Business Profile (GBP) Optimization',
      'Monthly NAP Citation Audit & Submissions',
      'On-Page Meta & Keyword Optimization',
      'Local Schema Markup Implementation',
      'Free Domain Registration Included (worth ₹999)*',
      'Monthly Ranking & Call Tracking Report',
      'Email & WhatsApp Support'
    ],
    buttonText: 'Get Started with Starter'
  },
  {
    id: 'growth',
    name: 'Growth SEO & Custom Web',
    badge: 'Recommended',
    price: '₹9,999',
    period: '/ month',
    popular: true,
    description: 'The ultimate growth package for scaling businesses ready to dominate competitive search categories and accelerate online revenue.',
    features: [
      'Up to 25 Competitive Target Keywords',
      'Full Technical SEO & Core Web Vitals Audit',
      'Google Maps 3-Pack Authority Accelerator',
      '2 High-Quality Contextual Guest Articles Monthly',
      'High DA Backlink Acquisition & Outreach',
      'Conversion Rate Optimization (CRO) Advice',
      'Free Domain Registration (worth ₹999)',
      '1 Year of Free Dedicated Technical Support',
      'Dedicated Senior SEO Account Manager',
      'Bi-Weekly Video Reporting & Strategy Calls'
    ],
    buttonText: 'Claim Growth Package'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale & App Dev',
    badge: 'Comprehensive Full-Stack',
    price: '₹19,999',
    period: '/ month',
    description: 'Full-service digital dominance: custom software development, enterprise eCommerce optimization, and multi-location SEO campaigns.',
    features: [
      '50+ High-Volume Commercial Keywords',
      'Multi-Location / Pan-India SEO Campaigns',
      'Custom Web & App Feature Development / Maintenance',
      'Dedicated Full-Stack Developer + SEO Lead',
      'Competitor Backlink Intercept & Disavow Audits',
      'Continuous Conversion Funnel & A/B Testing',
      'Free Domain & SSL Hardening Included',
      '1 Year Priority 24/7 SLA Technical Support',
      'Quarterly In-Person or Executive Strategy Reviews'
    ],
    buttonText: 'Request Enterprise Proposal'
  }
];

export const WHY_CHOOSE_US = [
  {
    id: '01',
    title: '1 Year Free Technical Support',
    description: 'We do not abandon you after launch. Every website and software build comes backed by 365 days of comprehensive technical support and updates.'
  },
  {
    id: '02',
    title: 'Free Domain Included',
    description: 'Kickstart your digital footprint without hidden costs. All standard web packages include complimentary custom domain registration worth ₹999.'
  },
  {
    id: '03',
    title: '7-14 Business Days Delivery',
    description: 'Speed to market is critical. Our disciplined agile sprints deliver high-polish, fully responsive websites in as little as 7 to 14 business days.'
  },
  {
    id: '04',
    title: '100% Ethical White-Hat SEO',
    description: 'We strictly follow Google Webmaster guidelines. Zero risky shortcuts, ensuring your search rankings survive and thrive across all algorithmic updates.'
  },
  {
    id: '05',
    title: 'Transparent Weekly Reporting',
    description: 'No marketing smoke and mirrors. You receive crystal-clear reports detailing keyword movements, organic traffic growth, and conversion metrics.'
  },
  {
    id: '06',
    title: 'Dedicated Senior IT Specialists',
    description: 'Work directly with senior developers and certified digital strategists who take ownership of your business KPIs, not junior interns.'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'apex-retail',
    title: 'Enterprise eCommerce Revenue Acceleration',
    client: 'Apex Retail Co.',
    category: 'eCommerce SEO & WooCommerce',
    summary: 'Restructured catalog architecture, migrated from bloated legacy theme to headless WooCommerce, and optimized 2,400+ product SKUs for Google search.',
    metrics: [
      { label: 'Organic Revenue', value: '+214%' },
      { label: 'Load Time', value: '1.2s' },
      { label: 'Top 3 Product Ranks', value: '142' }
    ],
    tags: ['WooCommerce', 'eCommerce SEO', 'Core Web Vitals'],
    image: '/src/assets/images/ecommerce_analytics_case_1793853539739.jpg'
  },
  {
    id: 'medicare-clinic',
    title: 'Local Clinic Multi-Location Search Dominance',
    client: 'MediCare Multispecialty Clinics',
    category: 'Local SEO & Web Redesign',
    summary: 'Captured the Google Maps 3-Pack across 4 clinic branches in Delhi NCR, executing complete NAP synchronization and automated patient review funnels.',
    metrics: [
      { label: 'Patient Calls Uplift', value: '3.8x' },
      { label: 'Map 3-Pack Ranks', value: '#1 for 18 Keys' },
      { label: 'Google Reviews', value: '4.9★ (380+)' }
    ],
    tags: ['Local SEO', 'Google Business Profile', 'Responsive Web'],
    image: '/src/assets/images/digital_product_showcase_1793853538253.jpg'
  },
  {
    id: 'fleetpro-logistics',
    title: 'Real-Time Logistics Fleet Management Portal',
    client: 'FleetPro Logistics Ltd.',
    category: 'Laravel & Matx React Development',
    summary: 'Engineered a mission-critical web application with live telematics, driver dispatch tracking, automated billing invoicing, and role-based permissions.',
    metrics: [
      { label: 'Monthly Active Fleet', value: '45,000+' },
      { label: 'Server Latency', value: '<30ms' },
      { label: 'Dispatch Errors', value: '-82%' }
    ],
    tags: ['Laravel', 'Matx React', 'Real-Time APIs'],
    image: '/src/assets/images/agency_workspace_1793853537773.jpg'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    clientName: 'Rajesh Sharma',
    role: 'Managing Director',
    company: 'Apex Healthtech India',
    rating: 5,
    review: 'Genmax IT Solution completely transformed our online presence. Our previous website took 6 seconds to load and generated almost zero inquiries. Within 60 days of the redesign and Local SEO campaign, our inbound calls increased threefold. Their 1-year free support promise is real—they resolve questions within hours.',
    projectType: 'Website Redesign & Local SEO'
  },
  {
    id: '2',
    clientName: 'Sunita Verma',
    role: 'Founder & CEO',
    company: 'Verma Artisanal Goods',
    rating: 5,
    review: 'We were skeptical about digital agencies after poor past experiences, but the team at Genmax delivered beyond our expectations. They launched our WooCommerce store in just 10 business days, fully configured payments, and our organic search traffic has grown by 190% over 6 months.',
    projectType: 'WooCommerce Web Design & SEO'
  },
  {
    id: '3',
    clientName: 'Amitabh Sen',
    role: 'Operations VP',
    company: 'Zenith Logistics Systems',
    rating: 5,
    review: 'The Laravel and Matx dashboard engineered by Genmax IT Solution handles our entire dispatch network without a hitch. Exceptional technical expertise, clean code, and zero downtime during deployment. Truly an award-caliber development partner in India.',
    projectType: 'Custom Laravel & Matx Development'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'local-seo-checklist-google-maps-3-pack',
    title: 'The 2026 Local SEO Master Checklist: How to Rank #1 on Google Maps',
    excerpt: 'Step-by-step blueprint to optimize your Google Business Profile, conquer the local 3-pack, and outrank regional competitors.',
    category: 'Local SEO',
    readTime: '6 min read',
    publishedDate: 'November 2, 2026',
    author: {
      name: 'Genmax SEO Research Team',
      role: 'Search Optimization Leads'
    },
    content: {
      intro: 'In an era where localized buyer searches account for over 46% of all Google queries, dominating the Google Maps 3-Pack is the single most lucrative channel for regional businesses.',
      sections: [
        {
          heading: '1. Claiming and Fortifying Google Business Profile (GBP)',
          body: 'Your business profile is the nucleus of local search. Ensure your primary business category is exact, upload high-resolution geotagged photography monthly, and keep operating hours up to date.'
        },
        {
          heading: '2. The Mathematical Power of NAP Consistency',
          body: 'Search algorithms cross-reference hundreds of external directories to verify your business legitimacy. Even minor discrepancies—such as "Street" vs "St."—dilute ranking confidence. Standardize your NAP across all platforms.'
        },
        {
          heading: '3. Strategic Review Velocity and Sentiment',
          body: 'It is not just about having 5-star ratings; Google rewards the consistency and velocity of incoming reviews. Implement an automated SMS trigger asking customers for feedback 2 hours after service completion.'
        }
      ],
      conclusion: 'By treating local SEO as a continuous engine of authority rather than a one-time setup, local businesses can systematically capture top positions and drive sustainable foot traffic.'
    }
  },
  {
    id: '2',
    slug: 'why-website-speed-dictates-ecommerce-revenue',
    title: 'Why 1 Second of Page Latency Costs eCommerce Brands 20% in Conversions',
    excerpt: 'Analyzing real conversion metrics: how modern web architecture, image optimization, and caching dramatically elevate digital sales.',
    category: 'Web Development',
    readTime: '5 min read',
    publishedDate: 'October 28, 2026',
    author: {
      name: 'Technical Architecture Team',
      role: 'Lead Systems Engineers'
    },
    content: {
      intro: 'Modern digital shoppers have zero tolerance for sluggish storefronts. Industry data proves that every additional second of page load time slashes eCommerce conversion rates by up to 20%.',
      sections: [
        {
          heading: 'The Core Web Vitals Reality',
          body: 'Google’s Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) directly impact both your search engine rankings and your shoppers’ willingness to proceed through checkout.'
        },
        {
          heading: 'Eliminating Heavy Plugin Bloat',
          body: 'Many WordPress and WooCommerce sites suffer from 40+ plugins executing redundant database queries on every page hit. By replacing multi-vendor builders with custom native code, load times drop under 1.5 seconds.'
        },
        {
          heading: 'Edge Caching and Asset Delivery',
          body: 'Serving media in modern WebP formats and leveraging edge CDN caching ensures international buyers experience instantaneous page transitions regardless of their physical location.'
        }
      ],
      conclusion: 'Speed is not a technical luxury—it is your highest-leverage conversion optimization tool. Prioritizing performance directly enhances revenue.'
    }
  },
  {
    id: '3',
    slug: 'laravel-vs-codeigniter-choosing-the-right-php-framework',
    title: 'Laravel vs CodeIgniter: Choosing the Ideal Framework for Your Web Application',
    excerpt: 'A comprehensive technical comparison between PHP’s two powerhouses to help you choose the right stack for speed, scalability, and maintainability.',
    category: 'Web Development',
    readTime: '7 min read',
    publishedDate: 'October 15, 2026',
    author: {
      name: 'Software Engineering Desk',
      role: 'Senior Full-Stack Specialists'
    },
    content: {
      intro: 'When embarking on custom web application development, selecting the appropriate framework forms the bedrock of long-term maintainability and operational efficiency.',
      sections: [
        {
          heading: 'When to Choose CodeIgniter',
          body: 'CodeIgniter is unbeatable when lightweight execution, minimal server resource footprints, and straightforward MVC structures are needed. It performs exceptionally well on shared hosting environments and legacy systems.'
        },
        {
          heading: 'When Laravel Takes the Crown',
          body: 'For enterprise multi-tenant SaaS applications, complex queue processing, and event-driven architectures, Laravel’s rich ecosystem (Eloquent ORM, Horizon, Sanctum) provides unrivaled development velocity and security.'
        },
        {
          heading: 'Maintenance and Team Long-Term Costs',
          body: 'Both frameworks offer mature stability. CodeIgniter requires less overhead for simple apps, while Laravel minimizes custom boilerplate code for large-scale enterprise workflows.'
        }
      ],
      conclusion: 'Our engineering team helps clients evaluate requirements, ensuring the chosen technology aligns with their budget, team capabilities, and projected user growth.'
    }
  }
];

export const GENERAL_FAQS = [
  {
    question: 'How long does it take to design and launch a new website?',
    answer: 'Our standard timeline for professional websites is 7 to 14 business days. For complex web applications, custom ERPs, or extensive mobile apps, we establish clear milestone timelines during our initial discovery session.'
  },
  {
    question: 'Do you really provide 1 year of free technical support?',
    answer: 'Yes! Every website and custom software solution delivered by Genmax IT Solution comes with 365 days of comprehensive technical support. This covers bug fixes, server maintenance assistance, security updates, and general advisory.'
  },
  {
    question: 'What is included in the free domain registration?',
    answer: 'All standard website packages include a free custom domain registration (such as .com, .in, or .org worth ₹999) for your first year.'
  },
  {
    question: 'How do you ensure our SEO results are sustainable and safe?',
    answer: 'We practice 100% white-hat SEO strictly adhering to Google Search Essentials and Webmaster guidelines. We focus on technical excellence, high-value content architecture, and authoritative editorial backlinks that withstand algorithm updates.'
  },
  {
    question: 'Can you work with international clients outside of India?',
    answer: 'Yes! We actively serve clients across the USA, UK, Canada, Australia, the UAE, and Europe. Our team provides flexible communication schedules, transparent video reporting, and international payment processing.'
  },
  {
    question: 'What technologies and frameworks do you specialize in?',
    answer: 'Our core tech competencies span WordPress, WooCommerce, React, TypeScript, Next.js, Laravel, CodeIgniter, Matx, Swift (iOS), Kotlin (Android), Tailwind CSS, and cloud architectures.'
  }
];

export const CLIENT_LOGOS = [
  { name: 'Apex Healthtech', symbol: 'AH' },
  { name: 'Verma Crafts', symbol: 'VC' },
  { name: 'Zenith Logistics', symbol: 'ZL' },
  { name: 'UrbanNest Realty', symbol: 'UN' },
  { name: 'Novus Medias', symbol: 'NM' },
  { name: 'Skyline Capital', symbol: 'SC' },
  { name: 'Global TransLog', symbol: 'GT' },
  { name: 'Matrix Retail', symbol: 'MR' },
];
