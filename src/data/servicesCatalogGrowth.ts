export interface DetailedServiceContent {
  slug: string;
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

export const GROWTH_SERVICES_DETAIL: Record<string, DetailedServiceContent> = {
  'technical-seo': {
    slug: 'technical-seo',
    title: 'Technical SEO Services',
    subtitle: 'Crawlability, Indexing, JavaScript Rendering & Site Architecture',
    shortDescription:
      'Identify and resolve technical bottlenecks that prevent search engines from discovering, rendering, and indexing your highest-value pages cleanly.',
    fullDescription: [
      'Even authoritative content fails to rank when search crawlers waste crawl budget on parameter loops, orphan pages, broken canonicals, or slow client-side rendering. Our Technical SEO engineering service inspects the infrastructure layer between your server, DOM, and search engine bots.',
      'We cross-reference full site crawls with Google Search Console coverage reports, server response codes, XML sitemaps, and robots directives to separate intentional exclusions from silent indexing failures across dynamic templates.',
      'Every remediation blueprint prioritizes high-impact templates—canonicals, hreflang, pagination, redirect chains, structured JSON-LD schema, and Core Web Vitals—with clear staging validation steps before production rollout.',
    ],
    deliverables: [
      'Full site crawl diagnostics & Search Console indexation reconciliation',
      'Robots.txt, XML sitemap & crawl budget optimization roadmap',
      'Canonical tag, pagination & multi-hop redirect chain remediation',
      'Core Web Vitals (LCP, INP, CLS) & JavaScript hydration audit',
      'Validated Schema.org JSON-LD implementation across key templates',
      'Developer-ready ticket specs with staging & post-release QA checks',
    ],
    features: ['Crawl & Index Audit', 'Core Web Vitals', 'Schema Architecture', 'Redirect & Canonicals'],
    metrics: [
      { label: 'Audit Scope', value: '50+ Checks' },
      { label: 'Core Web Vitals Target', value: 'Green' },
      { label: 'Validation Window', value: 'Pre & Post Release' },
    ],
    process: [
      {
        step: '01',
        title: 'Crawl & Search Console Reconciliation',
        description: 'Run deep site crawls and compare discovered URLs against Search Console indexing, canonical selections, and server logs.',
      },
      {
        step: '02',
        title: 'Template & Rendering Diagnostics',
        description: 'Inspect SSR/CSR HTML parity, internal link equity flow, duplicate URL parameters, and structured data validity.',
      },
      {
        step: '03',
        title: 'Prioritized Engineering Spec',
        description: 'Deliver exact canonical, header, sitemap, and Core Web Vitals fixes ordered by revenue impact and implementation effort.',
      },
      {
        step: '04',
        title: 'Staging QA & Re-Crawl Verification',
        description: 'Verify every fix in staging and run post-deployment re-crawls to confirm clean indexation and zero regressions.',
      },
    ],
    faqs: [
      {
        question: 'How is Technical SEO different from regular on-page SEO?',
        answer: 'On-page SEO focuses on page copy, headings, and keyword targeting, whereas Technical SEO fixes how bots crawl, render JavaScript, follow links, parse schema, and measure page speed.',
      },
      {
        question: 'Do you coordinate directly with our web development team?',
        answer: 'Yes. We write actionable, developer-friendly specifications with exact headers, canonical rules, and JSON-LD payloads—or implement fixes directly in WordPress, React, or Next.js codebases.',
      },
      {
        question: 'Will you preserve rankings during URL or architecture changes?',
        answer: 'Yes. Every structural update includes 1-to-1 301 redirect mapping, internal link updates, and sitemap refresh checks so existing authority transfers cleanly.',
      },
    ],
  },

  'meta-ads': {
    slug: 'meta-ads',
    title: 'Meta Ads (Facebook & Instagram)',
    subtitle: 'Full-Funnel Campaign Planning, Creative Testing & Conversions API Measurement',
    shortDescription:
      'Run structured Facebook and Instagram campaigns with clean event tracking, disciplined creative testing, and audience controls focused on qualified leads and sales.',
    fullDescription: [
      'Profitable Meta advertising depends equally on clean signal tracking and creative variety. Running boosted posts or unsegmented ad sets burns spend without giving the delivery algorithm clear conversion signals.',
      'We architect Meta Ads accounts with distinct prospecting and retargeting layers, pairing Meta Pixel browser events with server-side Conversions API (CAPI) deduplication so attribution stays reliable across iOS and browser privacy restrictions.',
      'Each sprint introduces structured creative hypotheses across static cards, carousels, and Reels formats, testing hooks, offers, and landing experiences while pacing budgets toward cost-per-lead or ROAS guardrails.',
    ],
    deliverables: [
      'Meta Business Suite audit, Pixel & Conversions API (CAPI) event verification',
      'Full-funnel campaign structure across Facebook Feed, Stories & Instagram Reels',
      'Audience segmentation, lookalike modeling & customer exclusion lists',
      'Structured A/B creative testing matrix (hooks, formats & CTA variants)',
      'Instant Lead Form vs. landing page split-testing & CRM webhook sync',
      'Weekly CPA, ROAS, frequency & creative fatigue reporting',
    ],
    features: ['Pixel & CAPI Setup', 'Reels & Carousel Ads', 'Creative A/B Matrix', 'Audience Exclusions'],
    metrics: [
      { label: 'Attribution Setup', value: 'Pixel + CAPI' },
      { label: 'Creative Review Cadence', value: 'Weekly' },
      { label: 'Placement Coverage', value: 'FB + IG + Reels' },
    ],
    process: [
      {
        step: '01',
        title: 'Signal & Funnel Audit',
        description: 'Verify domain ownership, Pixel events, Conversions API parameters, and lead routing into your CRM or WhatsApp workflow.',
      },
      {
        step: '02',
        title: 'Audience & Offer Architecture',
        description: 'Map cold interest/broad audiences, high-intent retargeting windows, and customer exclusion rules to prevent overlap.',
      },
      {
        step: '03',
        title: 'Creative Matrix Launch',
        description: 'Deploy placement-native Reels, carousels, and static creatives with distinct angles and clear call-to-action alignment.',
      },
      {
        step: '04',
        title: 'Pacing & Creative Refresh',
        description: 'Reallocate spend toward winning ad sets, watch frequency metrics, and rotate fresh variations before performance fatigues.',
      },
    ],
    faqs: [
      {
        question: 'Should we use Meta Instant Forms or send traffic to a landing page?',
        answer: 'We evaluate both based on your sales process. Instant Forms with qualifying questions reduce friction for service leads, while dedicated landing pages improve lead depth and eCommerce checkout volume.',
      },
      {
        question: 'Do you set up the Conversions API in addition to the standard Pixel?',
        answer: 'Yes. Pairing browser Pixel tracking with server-side Conversions API deduplication improves event match quality and conversion reporting accuracy.',
      },
      {
        question: 'Who creates the ad visuals and ad copy?',
        answer: 'Our team writes ad copy variants and designs campaign-ready static, carousel, and short-form video templates aligned with your brand guidelines.',
      },
    ],
  },

  'linkedin-ads': {
    slug: 'linkedin-ads',
    title: 'LinkedIn Ads Management',
    subtitle: 'Account-Based & Role-Targeted B2B Campaigns for High-Value Buying Committees',
    shortDescription:
      'Reach verified decision-makers on LinkedIn by job title, seniority, industry, and target company lists, connected directly to your B2B sales pipeline.',
    fullDescription: [
      'LinkedIn clicks carry a higher CPM than consumer social networks, making precision targeting and buyer-stage messaging essential for B2B ROI. Broad targeting wastes budget on students, non-decision-makers, and out-of-market regions.',
      'We structure campaigns around your Ideal Customer Profile (ICP)—combining job function, seniority, company headcount, and uploaded Account-Based Marketing (ABM) target account lists with strict audience exclusions.',
      'Formats are chosen per objective: Thought Leader Ads and Document Ads build authority across buying committees, while Lead Gen Forms and matched landing pages feed qualified SQLs cleanly into HubSpot, Zoho, or Salesforce.',
    ],
    deliverables: [
      'ICP & Account-Based Marketing (ABM) audience sizing & exclusion setup',
      'LinkedIn Insight Tag installation, conversion events & UTM governance',
      'Sponsored Content, Document Ads, Message Ads & Lead Gen Form builds',
      'CRM lead sync (HubSpot, Salesforce, Zoho) & sales qualification alignment',
      'Dedicated B2B landing page recommendations & gated asset hooks',
      'Account engagement & pipeline cost-per-opportunity reporting',
    ],
    features: ['ABM Company Lists', 'Role & Seniority Targeting', 'Lead Gen Forms', 'CRM Pipeline Sync'],
    metrics: [
      { label: 'Targeting Precision', value: 'Role + ABM' },
      { label: 'Tracking Stack', value: 'Insight Tag + UTM' },
      { label: 'B2B Format Suite', value: 'Full Funnel' },
    ],
    process: [
      {
        step: '01',
        title: 'ICP & Account Segmentation',
        description: 'Define target company tiers, buyer personas, technical influencers, and exclusion lists (competitors, existing clients, junior roles).',
      },
      {
        step: '02',
        title: 'Insight Tag & CRM Wiring',
        description: 'Configure LinkedIn Insight Tag conversions, UTM standards, and instant Lead Gen Form sync to sales teams.',
      },
      {
        step: '03',
        title: 'Multi-Format Campaign Launch',
        description: 'Launch problem-aware carousel/document ads alongside high-intent demo or consultation conversion campaigns.',
      },
      {
        step: '04',
        title: 'Demographic & Bid Tuning',
        description: 'Audit LinkedIn Company Engagement and Job Title breakdowns weekly to cut waste and sharpen pipeline quality.',
      },
    ],
    faqs: [
      {
        question: 'Can we target a specific list of enterprise companies we want to close?',
        answer: 'Yes. We upload matched company lists (Account-Based Marketing) layered with specific seniority and department filters so only relevant stakeholders see your ads.',
      },
      {
        question: 'What budget works best for LinkedIn B2B campaigns?',
        answer: 'Because B2B deals have higher order values and LinkedIn CPCs are higher than Google Display or Meta, we calibrate daily budgets around your audience size so campaigns exit learning cleanly.',
      },
      {
        question: 'How do you prevent leads with personal Gmail addresses or irrelevant job titles?',
        answer: 'We layer seniority and function exclusions, restrict Audience Expansion where appropriate, and configure qualifying form fields tailored to work emails.',
      },
    ],
  },

  'youtube-advertising': {
    slug: 'youtube-advertising',
    title: 'YouTube Advertising',
    subtitle: 'Intent-Driven In-Stream, In-Feed & Shorts Video Campaigns Built Around the Viewer Journey',
    shortDescription:
      'Engage buyers on YouTube with skippable in-stream, in-feed, and Shorts campaigns paired with custom intent audiences, placement controls, and conversion tracking.',
    fullDescription: [
      'YouTube combines search-level intent with high-attention sight, sound, and motion—yet default YouTube campaign settings often push spend into low-intent mobile apps or children’s channels.',
      'We structure campaigns around specific funnel goals: Demand Gen and Video Action campaigns for direct signups or store sales, alongside TrueView discovery and brand awareness flights with strict placement exclusions and brand suitability filters.',
      'Every video asset is evaluated for its crucial opening five seconds, clear pacing, audio/caption readability on mute, and end-card call to action so viewers remember your offer and take measurable next steps.',
    ],
    deliverables: [
      'YouTube funnel strategy across In-Stream, In-Feed & YouTube Shorts',
      'Custom intent keyword, in-market & remarketing audience layering',
      'Brand suitability controls, channel allowlists & mobile app exclusions',
      '5-second hook script feedback, end-screen CTA & companion banner setup',
      'Google Ads conversion tracking & view-through attribution alignment',
      'Weekly view rate, CPV, CTR & assisted conversion reporting',
    ],
    features: ['In-Stream & Shorts', 'Custom Intent Audiences', 'Placement Safeguards', 'View-Through Tracking'],
    metrics: [
      { label: 'Creative Hook Window', value: 'First 5 Sec' },
      { label: 'Placement Controls', value: 'App & Kid Safe' },
      { label: 'Formats Covered', value: 'In-Stream + Shorts' },
    ],
    process: [
      {
        step: '01',
        title: 'Audience & Intent Mapping',
        description: 'Build Custom Segments from high-intent Google Search terms, competitor topics, and website visitor lists.',
      },
      {
        step: '02',
        title: 'Creative Hook & Format Prep',
        description: 'Structure 15s, 30s, and vertical Shorts edits with fast opening hooks, burned-in captions, and unmistakable CTAs.',
      },
      {
        step: '03',
        title: 'Placement Hygiene & Launch',
        description: 'Apply topic exclusions, block mobile game placements, and launch tightly grouped ad sets with frequency caps.',
      },
      {
        step: '04',
        title: 'Retention & Conversion Tuning',
        description: 'Analyze quartile drop-off curves, prune underperforming channels, and scale segments driving assisted and direct conversions.',
      },
    ],
    faqs: [
      {
        question: 'How do you stop YouTube ads from showing on kids channels and mobile games?',
        answer: 'We configure content suitability exclusions, exclude mobile app categories at launch, and review the Where Ads Showed placement report weekly to block irrelevant channels.',
      },
      {
        question: 'Can we target people who recently searched for our services on Google?',
        answer: 'Yes. Using Custom Intent segments inside Google Ads, we reach YouTube viewers actively researching relevant Google search keywords.',
      },
      {
        question: 'What video ratios should we prepare?',
        answer: 'For maximum reach across living-room TVs, desktop, and mobile Shorts, we recommend pairing a 16:9 landscape edit with a 9:16 vertical version.',
      },
    ],
  },

  'google-shopping-display-ads': {
    slug: 'google-shopping-display-ads',
    title: 'Google Shopping & Display Ads',
    subtitle: 'Clean Merchant Center Feeds, Product Tiering & Visual Campaign Architecture',
    shortDescription:
      'Optimize Merchant Center product feeds for Google Shopping visibility and run disciplined Display campaigns that reinforce product discovery without wasted impressions.',
    fullDescription: [
      'Your Google Shopping performance starts inside Google Merchant Center long before a bid is placed. Missing GTINs, disapproved shipping rules, generic product titles, or mismatched landing page prices quietly suppress impressions and tank ROAS.',
      'We audit and enrich your product feed—rewriting titles around high-converting buyer attributes (brand, model, size, material, category), fixing feed disapprovals, and organizing SKU groups by margin and velocity rather than lumping every product into one bucket.',
      'For Google Display campaigns, we replace broad automated placements with curated audience segments, brand-safe placement controls, and crisp responsive display assets tailored to prospect education and catalog remarketing.',
    ],
    deliverables: [
      'Google Merchant Center account audit & feed disapproval resolution',
      'Product title, description, GTIN & custom label feed enrichment',
      'Segmented Standard Shopping & Performance Max asset group setup',
      'Margin-based bidding tiers & negative keyword sculpting for Shopping',
      'Responsive Display ad design & strict placement/app exclusion lists',
      'SKU-level ROAS, impression share & feed health diagnostics',
    ],
    features: ['Merchant Center Fixes', 'Feed Title Optimization', 'Margin SKU Tiers', 'Display Placement Control'],
    metrics: [
      { label: 'Feed Hygiene Check', value: '100% SKUs' },
      { label: 'Segmentation Strategy', value: 'Margin & Margin' },
      { label: 'Networks', value: 'Shopping + GDN' },
    ],
    process: [
      {
        step: '01',
        title: 'Merchant Center & Feed Audit',
        description: 'Resolve policy warnings, price/availability mismatches, tax/shipping configuration errors, and missing product identifiers.',
      },
      {
        step: '02',
        title: 'Title & Custom Label Enrichment',
        description: 'Front-load high-intent search attributes in product titles and tag SKUs by margin, seasonality, and bestseller status.',
      },
      {
        step: '03',
        title: 'Shopping & Display Buildout',
        description: 'Launch structured Shopping/PMax campaigns with clean brand vs. non-brand exclusions alongside curated Display creative.',
      },
      {
        step: '04',
        title: 'SKU Pruning & Search Term Control',
        description: 'Trim zero-conversion spenders, add negative keywords, and double budget behind profitable hero products.',
      },
    ],
    faqs: [
      {
        question: 'Can you sync our WooCommerce or Shopify store feed automatically?',
        answer: 'Yes. We configure scheduled Content API or XML feed pipelines from WooCommerce, Shopify, or custom catalogs so inventory and pricing stay synced in real time.',
      },
      {
        question: 'How do you handle high-margin vs. low-margin products in Google Shopping?',
        answer: 'We assign custom labels in the feed by profit margin or return rate so we can set stricter ROAS targets on low-margin items and bid aggressively on high-margin winners.',
      },
      {
        question: 'Do you help fix suspended or disapproved Merchant Center items?',
        answer: 'Yes. We diagnose policy, schema markup, shipping, and misrepresentation flags and resolve feed discrepancies directly.',
      },
    ],
  },

  'remarketing-retargeting': {
    slug: 'remarketing-retargeting',
    title: 'Remarketing & Retargeting',
    subtitle: 'Consent-Aware Multi-Channel Audience Sequencing for High-Intent Visitors',
    shortDescription:
      'Reconnect with high-intent website visitors, video viewers, and cart abandoners across Google, Meta, and LinkedIn with tailored messaging and smart frequency caps.',
    fullDescription: [
      'Most high-consideration B2B and eCommerce buyers do not convert on their first visit. Showing every past visitor the exact same generic ad for 90 days causes ad fatigue and wastes budget on people who bounced after three seconds.',
      'We design sequential remarketing architectures that segment users by behavioral depth—pricing page viewers, service comparison visitors, cart abandoners, and CRM pipeline stages—while cleanly excluding converters and low-intent traffic.',
      'Tracking lists are built around consent settings, crisp membership windows (7-day urgency vs. 30-day trust proof), and rotating creative angles such as case studies, objections handled, and limited offers.',
    ],
    deliverables: [
      'Cross-platform audience taxonomy across Google Ads, Meta & LinkedIn',
      'Event-based funnel segments (pricing view, cart abandon, form drop-off)',
      'Clean converter, employee & existing-customer exclusion rules',
      'Dynamic product remarketing feed setup for eCommerce catalogs',
      'Frequency cap planning & sequential ad creative rotation',
      'Consent Mode v2 / pixel compliance verification & assisted ROAS tracking',
    ],
    features: ['Intent Segmentation', 'Converter Exclusions', 'Dynamic Catalog Ads', 'Frequency Governance'],
    metrics: [
      { label: 'Audience Windows', value: '7 / 14 / 30d' },
      { label: 'Platform Reach', value: 'Google + Meta + LI' },
      { label: 'Ad Fatigue Control', value: 'Frequency Capped' },
    ],
    process: [
      {
        step: '01',
        title: 'Drop-Off & Pixel Diagnostic',
        description: 'Verify remarketing tags, dynamic product IDs, Consent Mode parameters, and CRM customer match lists.',
      },
      {
        step: '02',
        title: 'Funnel Window Segmentation',
        description: 'Separate high-intent abandoners from casual blog readers with tailored lookback windows and immediate converter exclusions.',
      },
      {
        step: '03',
        title: 'Sequential Creative Mapping',
        description: 'Pair each window with relevant proof—testimonials, product reminders, comparison guides, or consultation incentives.',
      },
      {
        step: '04',
        title: 'Frequency & Lift Review',
        description: 'Monitor impression frequency, click-through decay, and assisted conversions to keep retargeting profitable and non-intrusive.',
      },
    ],
    faqs: [
      {
        question: 'How do you stop ads from following people after they already bought or booked?',
        answer: 'We configure automatic thank-you page exclusions, purchase event exclusions, and uploaded CRM customer suppression lists across all active ad networks.',
      },
      {
        question: 'Can you run dynamic remarketing showing the exact product a user viewed?',
        answer: 'Yes. For WooCommerce, Shopify, and custom stores, we link product view/cart events with your Merchant Center or Meta Catalog to serve exact product cards.',
      },
      {
        question: 'How long do retargeting audiences stay active?',
        answer: 'We align membership windows with your sales cycle—typically 7 to 14 days for eCommerce offers and 30 to 90 days for longer B2B decisions.',
      },
    ],
  },

  'microsoft-ads': {
    slug: 'microsoft-ads',
    title: 'Microsoft (Bing) Ads',
    subtitle: 'High-Intent Paid Search Across Bing, Edge, Windows & LinkedIn Profile Targeting',
    shortDescription:
      'Capture desktop, B2B, and enterprise search demand on the Microsoft Advertising network with UET tracking, adapted match types, and lower-competition CPCs.',
    fullDescription: [
      'Clicking “Import from Google Ads” blindly inside Microsoft Advertising often leaves default Audience Network placements, broad match defaults, and unadjusted budgets active—creating silent wasted spend.',
      'We build and audit Microsoft Ads accounts deliberately, preserving clean search-only intent, tuning match types and bids specifically for Bing search behavior, and verifying Microsoft Universal Event Tracking (UET) tags on forms and checkouts.',
      'Microsoft Ads also unlocks unique LinkedIn Company, Industry, and Job Function bid modifiers right inside search campaigns—making it a secret weapon for B2B service firms and enterprise software vendors targeting desktop office users.',
    ],
    deliverables: [
      'Clean Google-to-Microsoft Ads import audit or ground-up campaign build',
      'Universal Event Tracking (UET) tag & revenue goal verification',
      'Microsoft Audience Network & syndicated partner placement filtering',
      'LinkedIn profile targeting modifiers (Industry, Company, Job Function)',
      'Bing-specific search term pruning, negative lists & bid calibration',
      'Side-by-side Google vs. Microsoft CPA and impression share reporting',
    ],
    features: ['UET Tag Setup', 'LinkedIn Search Filters', 'Clean Search Filtering', 'Lower CPC Reach'],
    metrics: [
      { label: 'Tracking Tag', value: 'Microsoft UET' },
      { label: 'B2B Layering', value: 'LinkedIn Modifiers' },
      { label: 'Import Audit', value: '100% Sanitized' },
    ],
    process: [
      {
        step: '01',
        title: 'Network & Import Audit',
        description: 'Inspect existing imports or account defaults for unaligned budgets, broad keywords, and unwanted syndicated display partners.',
      },
      {
        step: '02',
        title: 'UET Conversion Setup',
        description: 'Deploy and test Universal Event Tracking tags across lead submissions, phone clicks, and checkout confirmations.',
      },
      {
        step: '03',
        title: 'Search & LinkedIn Layering',
        description: 'Structure exact/phrase ad groups and layer LinkedIn job function/industry bid adjustments for desktop B2B buyers.',
      },
      {
        step: '04',
        title: 'Bid & Search Term Refinement',
        description: 'Review Bing search term reports weekly, prune irrelevant partners, and scale profitable desktop/mobile queries.',
      },
    ],
    faqs: [
      {
        question: 'Why run Microsoft Ads if we already advertise on Google?',
        answer: 'Microsoft Search captures default Edge and corporate Windows desktop users that often do not search on Google, frequently at lower cost-per-click and stronger B2B demographics.',
      },
      {
        question: 'Does syncing from Google Ads break anything?',
        answer: 'Automated imports can accidentally overwrite Bing-specific bids or re-enable unwanted network settings if unmonitored. We configure selective import rules and manual guardrails.',
      },
    ],
  },

  'tiktok-snapchat-ads': {
    slug: 'tiktok-snapchat-ads',
    title: 'TikTok & Snapchat Ads',
    subtitle: 'Mobile-First Vertical Video Campaigns, Pixel Events & Creative Testing',
    shortDescription:
      'Launch high-attention vertical video campaigns on TikTok and Snapchat engineered around native storytelling, thumb-stopping hooks, and reliable event attribution.',
    fullDescription: [
      'Polished corporate banner ads fail immediately on TikTok and Snapchat. Users scroll past anything that feels like a traditional commercial within the first second.',
      'We structure campaigns around native vertical (9:16) storytelling—UGC-style demonstrations, creator hooks, fast problem-solution pacing, and mobile safe-zone framing that avoids overlap with platform buttons and captions.',
      'On the measurement side, we configure TikTok Pixel, Snap Pixel, and Events API checks alongside UTMs and dedicated mobile-first landing pages so you can scale winning creative variants with verified conversion data.',
    ],
    deliverables: [
      'Platform-tailored vertical (9:16) creative briefs & hook variations',
      'TikTok Pixel / Snap Pixel & server-side Events API setup & verification',
      'Safe-zone layout audit ensuring copy clears platform UI overlays',
      'Spark Ads, Collection Ads & dynamic mobile campaign configuration',
      'Broad vs. interest/behavior audience testing & frequency pacing',
      'Creative hook hold-rate, thumb-stop ratio & CPA performance reporting',
    ],
    features: ['9:16 Native Video', 'Pixel & Events API', 'Safe-Zone Checked', 'Hook Split-Testing'],
    metrics: [
      { label: 'Aspect Ratio', value: '9:16 Vertical' },
      { label: 'Hook Evaluation', value: 'First 2-3s' },
      { label: 'Attribution', value: 'Pixel + API' },
    ],
    process: [
      {
        step: '01',
        title: 'Creative Angle & Hook Briefs',
        description: 'Script multiple 2-second visual and verbal hooks suited to native TikTok and Snapchat feeds.',
      },
      {
        step: '02',
        title: 'Pixel & Mobile Landing Check',
        description: 'Validate purchase/lead pixel events, UTM parameters, and sub-2-second mobile landing speed.',
      },
      {
        step: '03',
        title: 'Multi-Variant Campaign Launch',
        description: 'Deploy segmented testing ad groups comparing native creator-style cuts, captions, and offers.',
      },
      {
        step: '04',
        title: 'Hold-Rate & Scale Tuning',
        description: 'Identify creatives with strong 2s/6s view retention, cut fatigued variations, and scale profitable winners.',
      },
    ],
    faqs: [
      {
        question: 'Can we reuse Instagram Reels assets directly on TikTok and Snapchat?',
        answer: 'We adapt assets cleanly without platform watermarks and verify captions and overlays sit inside each app’s distinct mobile safe zones.',
      },
      {
        question: 'What industries see strong results on TikTok and Snapchat Ads?',
        answer: 'D2C eCommerce, beauty, apparel, food & beverage, mobile apps, fitness, hospitality, and regional consumer services perform especially well when paired with native-style vertical video.',
      },
    ],
  },

  'logo-brand-identity-design': {
    slug: 'logo-brand-identity-design',
    title: 'Logo & Brand Identity Design',
    subtitle: 'Distinctive Mark Construction, Typography, Color Systems & Brand Guidelines',
    shortDescription:
      'Build a memorable logo and complete visual identity system with responsive lockups, color tokens, typography rules, and print-and-digital-ready files.',
    fullDescription: [
      'A real brand identity works everywhere—at 16px inside a browser favicon, embroidered on uniforms, stamped on packaging, and stretched across trade show banners—without losing clarity or proportion.',
      'We start from strategic positioning and competitor differentiation, crafting original geometric or typographic wordmarks with primary, stacked, icon-only, and monochrome variations.',
      'Your handoff includes a practical Brand Guidelines book and cleanly organized vector/raster asset packages (SVG, EPS, PDF, transparent PNGs) so every designer, developer, and print vendor applies your identity consistently.',
    ],
    deliverables: [
      'Multiple distinct logo design directions & structured refinement rounds',
      'Full logo lockup suite (primary, horizontal, stacked, icon mark, monochrome)',
      'Curated brand color palette (HEX, RGB, CMYK & Pantone specifications)',
      'Primary & secondary typography hierarchy for web and print',
      'Comprehensive Brand Usage Guidelines PDF (spacing, sizing, misuse rules)',
      'Master vector & web exports (AI, EPS, SVG, PDF, PNG, favicon pack)',
    ],
    features: ['Vector Logo Suite', 'Color & Type System', 'Brand Guidelines PDF', 'Print & Web Exports'],
    metrics: [
      { label: 'Export Formats', value: 'SVG/EPS/AI/PNG' },
      { label: 'Scalability', value: 'Favicon to Billboard' },
      { label: 'Ownership', value: '100% Full Rights' },
    ],
    process: [
      {
        step: '01',
        title: 'Brand Discovery & Audit',
        description: 'Explore brand values, industry landscape, target perception, and visual territory opportunities.',
      },
      {
        step: '02',
        title: 'Concept Directions',
        description: 'Present original concept routes in black-and-white and real-world mockups to test silhouette strength first.',
      },
      {
        step: '03',
        title: 'System & Palette Refinement',
        description: 'Refine geometry, optical kerning, responsive icon marks, accessible color contrast, and type pairings.',
      },
      {
        step: '04',
        title: 'Guidelines & Master Handoff',
        description: 'Package organized digital and print folders alongside clear usage documentation for internal teams and vendors.',
      },
    ],
    faqs: [
      {
        question: 'What source files do we receive upon completion?',
        answer: 'You receive editable master vector files (AI, EPS, SVG), print-ready CMYK PDFs, high-resolution transparent PNGs, and social profile/favicon exports.',
      },
      {
        question: 'Do we get full legal ownership and copyright of the final logo?',
        answer: 'Yes. Upon project completion, full commercial rights and source files transfer exclusively to your business.',
      },
      {
        question: 'Can you refresh an outdated existing logo without losing brand recognition?',
        answer: 'Yes. We frequently modernize legacy logos by cleaning proportions, updating typography, and creating crisp responsive marks while keeping familiar brand equity.',
      },
    ],
  },

  'graphic-design': {
    slug: 'graphic-design',
    title: 'Graphic Design Services',
    subtitle: 'Print-Ready Brochures, Sales Collateral, Packaging & Digital Visual Assets',
    shortDescription:
      'Design sharp business and marketing collateral—from pitch decks and product brochures to packaging, event banners, and digital infographics—ready for press or web.',
    fullDescription: [
      'Inconsistent layouts, cramped typography, and blurry graphics undermine credibility before a prospect reads a single sentence. Clear visual hierarchy helps readers absorb your offer immediately.',
      'Our graphic design desk handles both high-impact digital visuals and technical print production—ensuring bleed margins, CMYK color profiles, vector sharpness, and legible typographic spacing across every piece.',
      'Whether launching a product catalog, refreshing corporate stationery, or preparing exhibition signage, every file is delivered in both press-ready formats and editable source layouts.',
    ],
    deliverables: [
      'Company profiles, tri-fold brochures & multi-page product catalogs',
      'Sales pitch decks, whitepapers, one-pagers & interactive PDFs',
      'Event roll-up standees, trade show backdrops & outdoor signage',
      'Product packaging labels, dielines & unboxing insert cards',
      'Business cards, letterheads, ID badges & corporate stationery',
      'CMYK print-ready PDFs (with bleed/crop marks) + editable source files',
    ],
    features: ['Print & Digital Prep', 'CMYK & Bleed Safe', 'Pitch Decks & Catalogs', 'Editable Source Files'],
    metrics: [
      { label: 'Print Compliance', value: '300 DPI CMYK' },
      { label: 'Turnaround', value: 'Rapid Sprint' },
      { label: 'File Handoff', value: 'Print + Editable' },
    ],
    process: [
      {
        step: '01',
        title: 'Brief & Spec Gathering',
        description: 'Confirm target audience, exact print/digital dimensions, folds/dielines, and mandatory brand elements.',
      },
      {
        step: '02',
        title: 'Layout & Hierarchy Exploration',
        description: 'Establish grid balance, typographic contrast, custom iconography, and clean scannable sections.',
      },
      {
        step: '03',
        title: 'Revision & Brand Alignment',
        description: 'Iterate rapidly with stakeholder feedback until copy, imagery, and visual rhythm lock together.',
      },
      {
        step: '04',
        title: 'Pre-Press & Digital Export',
        description: 'Package outlined print PDFs with bleed marks, web-optimized lightweight PDFs, and master source packages.',
      },
    ],
    faqs: [
      {
        question: 'Do you prepare files directly to our printer’s dieline and bleed specifications?',
        answer: 'Yes. Share your vendor’s dimensions or dieline template and we export 300 DPI CMYK PDFs with exact bleed, trim, and fold marks.',
      },
      {
        question: 'Can you match our existing company brand guidelines?',
        answer: 'Absolutely. We follow your existing fonts, color hex/CMYK codes, and tone cleanly—or establish consistent visual standards if none exist yet.',
      },
    ],
  },

  'social-media-creative-design': {
    slug: 'social-media-creative-design',
    title: 'Social Media Creative Design',
    subtitle: 'Scroll-Stopping Carousels, Stories, Reels Covers & Reusable Brand Templates',
    shortDescription:
      'Elevate Instagram, LinkedIn, Facebook, and YouTube channels with cohesive feed grids, educational carousels, and editable template packs built for mobile readability.',
    fullDescription: [
      'Social feeds move fast on small smartphone screens. Busy graphics loaded with tiny paragraphs get skipped, while cohesive, high-contrast visual templates train followers to recognize your brand instantly.',
      'We build modular social creative systems covering educational multi-slide carousels, announcement graphics, customer testimonial cards, hiring posts, Stories, and Reels cover templates.',
      'Every template honors platform safe zones—ensuring captions, profile icons, and Like/Share buttons never obscure your headline—and ships with editable Figma or Canva files so your team can scale daily posting effortlessly.',
    ],
    deliverables: [
      'Custom cohesive visual grid direction for Instagram & LinkedIn',
      'Educational swipeable carousel templates & infographic post formats',
      'Platform-sized kits (Feed 4:5, Stories/Reels 9:16, LinkedIn banners)',
      'Reels cover frames, YouTube thumbnails & Highlight icons',
      'Mobile legibility & UI safe-zone verification across all formats',
      'Editable Figma / Canva templates + ready-to-publish PNG/JPG packs',
    ],
    features: ['4:5 & 9:16 Formats', 'Carousel Systems', 'Editable Templates', 'UI Safe-Zone Tested'],
    metrics: [
      { label: 'Format Coverage', value: 'IG / LI / FB / YT' },
      { label: 'Readability Standard', value: 'Mobile-First' },
      { label: 'Handoff', value: 'Figma / Canva + PNG' },
    ],
    process: [
      {
        step: '01',
        title: 'Channel & Grid Audit',
        description: 'Review existing social feeds, competitor visual standards, and core content pillars (education, proof, offers, culture).',
      },
      {
        step: '02',
        title: 'Modular System Design',
        description: 'Establish repeatable typography sizes, accent badges, image frames, and high-contrast layouts readable on mobile.',
      },
      {
        step: '03',
        title: 'Multi-Format Production',
        description: 'Produce launch packs across 4:5 portrait feeds, 9:16 Stories/Reels covers, and wide LinkedIn document carousels.',
      },
      {
        step: '04',
        title: 'Template & Usage Handoff',
        description: 'Deliver organized editable templates with clear export rules so marketing teams can swap copy and imagery in minutes.',
      },
    ],
    faqs: [
      {
        question: 'Can our internal social media team edit the templates later in Canva or Figma?',
        answer: 'Yes. We provide neatly layered Figma or Canva template links depending on your team’s preferred workflow.',
      },
      {
        question: 'Do you design LinkedIn PDF carousels as well as Instagram graphics?',
        answer: 'Yes. We design clean multi-page LinkedIn document carousels tailored specifically for B2B storytelling, frameworks, and case study breakdowns.',
      },
    ],
  },

  'marketing-campaign-creatives': {
    slug: 'marketing-campaign-creatives',
    title: 'Marketing Campaign Creatives',
    subtitle: 'Coordinated Multi-Channel Ad Banners, Promo Visuals & Split-Test Variants',
    shortDescription:
      'Turn your campaign message into a unified kit of performance ad visuals, landing page hero graphics, email headers, and structured A/B split-test variants.',
    fullDescription: [
      'When paid ads, email blasts, and landing pages look disconnected, conversion rates drop because prospects feel uncertain they clicked into the right place.',
      'We build end-to-end campaign creative kits anchored on one unmistakable offer hook, then adapt that visual language cleanly across Meta feeds, Google Responsive Display banners, YouTube companion assets, email headers, and hero sections.',
      'Each asset batch is organized with clear naming conventions and distinct test variables—different value props, visual styles, and CTA treatments—so media buyers can identify winning concepts fast.',
    ],
    deliverables: [
      'Core campaign art direction & visual offer-hierarchy concept',
      'Multi-size performance banner suite (Meta, Display Network, LinkedIn)',
      'Structured A/B testing variants (headline hook, visual & CTA swaps)',
      'Synchronized landing page hero graphics & email campaign headers',
      'Organized campaign asset folder with test-variant naming taxonomy',
      'Platform file-size & text-density compliance across ad networks',
    ],
    features: ['Cross-Channel Sync', 'A/B Test Variants', 'Ad Network Specs', 'Landing Continuity'],
    metrics: [
      { label: 'Variant Structure', value: 'Hook / Visual / CTA' },
      { label: 'Channel Parity', value: 'Ad + Email + Web' },
      { label: 'Spec Compliance', value: '100% Network Ready' },
    ],
    process: [
      {
        step: '01',
        title: 'Offer & Funnel Alignment',
        description: 'Define the core campaign promise, target objections, mandatory disclaimers, and destination landing experience.',
      },
      {
        step: '02',
        title: 'Hero Concept & Test Angles',
        description: 'Design 2–3 distinct creative angles (e.g., pain-point contrast, social proof showcase, direct offer spotlight).',
      },
      {
        step: '03',
        title: 'Cross-Placement Adaptation',
        description: 'Scale winning concepts cleanly across square, portrait, story, leaderboard, and email header dimensions.',
      },
      {
        step: '04',
        title: 'Packaged Campaign Handoff',
        description: 'Deliver compressed, clearly named creative packs ready for immediate ad-manager upload and multivariate testing.',
      },
    ],
    faqs: [
      {
        question: 'How many ad sizes and variants are typically included in a campaign kit?',
        answer: 'A standard sprint covers the key aspect ratios needed for Meta, Google Display, and LinkedIn (1:1, 4:5, 9:16, 1.91:1, and IAB banners) across 2–3 test angles.',
      },
      {
        question: 'Can you collaborate directly with our media buying team or agency?',
        answer: 'Yes. We align creative variants around your media buyer’s exact testing hypotheses and rapidly produce follow-up iterations on top-performing hooks.',
      },
    ],
  },

  'corporate-branding': {
    slug: 'corporate-branding',
    title: 'Corporate Branding',
    subtitle: 'Enterprise Visual Systems, Executive Decks, Stationery & Internal Governance',
    shortDescription:
      'Unify how your organization presents itself to enterprise clients, investors, and partners with cohesive brand architecture, decks, and governance standards.',
    fullDescription: [
      'As companies scale across departments, regional offices, and sales teams, brand inconsistency creeps in—proposals use mismatched fonts, decks look improvised, and partner teams invent conflicting slide styles.',
      'Our Corporate Branding service audits every customer-facing touchpoint and establishes a disciplined visual framework built for real enterprise workflows—sales proposals, board presentations, RFP templates, signage, and digital properties.',
      'Instead of an abstract stylebook no one opens, we equip leadership and operations teams with turnkey PowerPoint/Google Slides master decks, Word/Docs templates, email signatures, and clear compliance rules.',
    ],
    deliverables: [
      'Audit of existing corporate collateral & touchpoint inconsistencies',
      'Enterprise brand architecture & sub-brand/product naming system',
      'Master PowerPoint & Google Slides presentation deck (25+ slide layouts)',
      'Word/Docs proposal, RFP cover, invoice & letterhead templates',
      'Standardized corporate email signature & LinkedIn team banner kit',
      'Executive Brand Governance Manual & team onboarding checklist',
    ],
    features: ['Master Slide Decks', 'RFP & Doc Templates', 'Brand Architecture', 'Governance Manual'],
    metrics: [
      { label: 'Slide Library', value: '25+ Layouts' },
      { label: 'Touchpoint Audit', value: 'Print + Digital' },
      { label: 'Team Adoption', value: 'Turnkey Templates' },
    ],
    process: [
      {
        step: '01',
        title: 'Touchpoint & Perception Audit',
        description: 'Collect active pitch decks, proposals, PDFs, email signatures, and digital assets to pinpoint visual fragmentation.',
      },
      {
        step: '02',
        title: 'System & Grid Definition',
        description: 'Formalize corporate typography, color hierarchy, chart/table styling, photography treatment, and co-branding rules.',
      },
      {
        step: '03',
        title: 'Turnkey Template Engineering',
        description: 'Build reusable master presentation decks, proposal documents, report covers, and corporate stationery packages.',
      },
      {
        step: '04',
        title: 'Rollout & Governance Guide',
        description: 'Deliver an accessible brand portal/PDF handbook so sales, HR, and marketing teams execute cleanly every time.',
      },
    ],
    faqs: [
      {
        question: 'Can you redesign our company pitch deck and sales proposal templates?',
        answer: 'Yes. Master PowerPoint/Google Slides decks and editable proposal documents are core deliverables so your sales team always looks enterprise-ready.',
      },
      {
        question: 'Do you support companies with multiple divisions or product lines?',
        answer: 'Yes. We design structured sub-brand rules that clarify how product lines relate visually to the parent corporate brand.',
      },
    ],
  },

  'video-editing-motion-graphics': {
    slug: 'video-editing-motion-graphics',
    title: 'Video Editing & Motion Graphics',
    subtitle: 'Product Explainers, Performance Reels, UI Animations & Captioned Social Cuts',
    shortDescription:
      'Transform raw footage, screen captures, and brand assets into sharp edited videos with kinetic typography, smooth motion graphics, color polish, and accessible captions.',
    fullDescription: [
      'Clean editing and purposeful motion graphics turn ordinary screen recordings or founder clips into persuasive product stories and high-retention ad creatives.',
      'We handle narrative pacing, sound balancing, color grading, custom animated titles, SaaS UI zoom callouts, and kinetic typography—stripping away dead air so every second moves the story forward.',
      'Deliverables ship in the aspect ratios your distribution channels need (16:9 web/YouTube, 9:16 Reels/Shorts/TikTok, 1:1/4:5 feeds) along with burned-in stylized captions and SRT files for silent auto-play feeds.',
    ],
    deliverables: [
      'Narrative editing, pacing cleanup, B-roll assembly & audio mastering',
      'Custom 2D motion graphics, lower thirds & kinetic typography overlays',
      'Animated SaaS/app screen walkthroughs & product feature callouts',
      'Animated brand logo intro/outro stings',
      'Stylized burned-in captions + standalone SRT subtitle tracks',
      'Multi-aspect exports (16:9 landscape, 9:16 vertical, 1:1/4:5 feed)',
    ],
    features: ['Kinetic Motion', 'UI Walkthroughs', 'Captions & SRT', 'Multi-Ratio Cuts'],
    metrics: [
      { label: 'Export Resolution', value: 'Up to 4K' },
      { label: 'Aspect Ratios', value: '16:9 / 9:16 / 4:5' },
      { label: 'Audio Polish', value: 'Noise Clean + Mix' },
    ],
    process: [
      {
        step: '01',
        title: 'Footage Review & Storyboarding',
        description: 'Audit raw clips, screen recordings, voiceovers, and script flow to establish tight narrative pacing.',
      },
      {
        step: '02',
        title: 'Assembly Cut & Audio Mix',
        description: 'Construct the rough cut, tighten pauses, level dialogue audio, and pair licensed background music/SFX.',
      },
      {
        step: '03',
        title: 'Motion Graphics & Color Grade',
        description: 'Animate lower thirds, UI highlights, transitions, brand stings, and consistent color correction.',
      },
      {
        step: '04',
        title: 'Captions & Multi-Format Export',
        description: 'Sync accurate stylized captions, check mobile UI safe zones, and export optimized masters for each platform.',
      },
    ],
    faqs: [
      {
        question: 'Can you create product promo videos from our software screenshots or Figma flows?',
        answer: 'Yes. We frequently build crisp SaaS and mobile app explainers using live screen captures, Figma mockups, smooth camera pans, and animated callouts.',
      },
      {
        question: 'Do you include subtitles for viewers watching on mute?',
        answer: 'Yes. Nearly all social feeds default to muted autoplay, so we include clean stylized captions plus optional SRT files.',
      },
    ],
  },
};
