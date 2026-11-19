import { SERVICES, type ServiceItem } from './websiteContent.ts';

const categoryNames = {
  seo: 'SEO & Organic Marketing',
  paid: 'Performance Marketing & Paid Ads',
  design: 'Website Design',
  development: 'Web Development',
  mobile: 'Mobile App Development',
  software: 'Software & AI Solutions',
  branding: 'Branding & Creative',
  support: 'Support & Maintenance',
};

export type ServiceCategoryId = keyof typeof categoryNames;

type ExistingService = { slug: string; title?: string };
type NewService = Pick<ServiceItem, 'slug' | 'title' | 'subtitle' | 'shortDescription' | 'deliverables'> & {
  overview: string;
};

const existing = (slug: string, title?: string): ExistingService => ({ slug, title });

function defineService(
  slug: string,
  title: string,
  subtitle: string,
  shortDescription: string,
  overview: string,
  deliverables: string[],
): NewService {
  return { slug, title, subtitle, shortDescription, overview, deliverables };
}

const catalog: Record<ServiceCategoryId, (ExistingService | NewService)[]> = {
  seo: [
    existing('local-seo', 'Local SEO & Google Maps Optimization'),
    existing('seo-services', 'Search Engine Optimization (SEO)'),
    defineService('technical-seo', 'Technical SEO Services', 'Crawlability, indexing and site architecture',
      'Identify and fix the technical issues that make it harder for search engines to find, render, and index your pages.',
      'We compare a site crawl with Search Console data to distinguish intentional exclusions from indexing problems. The remediation plan prioritizes affected templates and URLs so fixes can be tested before rollout.',
      ['Crawl and indexability audit', 'Canonical, redirect, and sitemap review', 'Prioritized fixes with validation steps']),
    existing('ecommerce-seo', 'E-commerce SEO'),
    existing('social-media-marketing', 'Social Media Management (SMO/SMM)'),
    existing('reputation-management'),
  ],
  paid: [
    existing('ppc-management', 'Google Ads Management'),
    defineService('meta-ads', 'Meta Ads (Facebook & Instagram)', 'Campaign planning, creative testing and measurement',
      'Run Facebook and Instagram campaigns with clear conversion goals, creative variants, and audience controls.',
      'We map each campaign to an action such as a lead or purchase, then check how that action is measured. Creative is tested across relevant placements with messaging and formats tailored to each stage of the funnel.',
      ['Meta Pixel and conversion event review', 'Facebook and Instagram campaign setup', 'Creative testing and budget review plan']),
    defineService('linkedin-ads', 'LinkedIn Ads Management', 'B2B campaigns for defined buying audiences',
      'Reach relevant decision-makers on LinkedIn and connect paid lead generation to your sales workflow.',
      'We use job functions, seniority, and account lists to define audiences around the actual buying process. Lead Gen Forms and landing pages are selected based on what the sales team needs to qualify a response.',
      ['Account and role-based audience planning', 'Sponsored Content or Lead Gen Form setup', 'Lead quality and conversion reporting']),
    defineService('youtube-advertising', 'YouTube Advertising', 'Video campaigns built around the viewer journey',
      'Plan YouTube campaigns with placement-appropriate video assets, audience targeting, and meaningful measurement.',
      'We plan placements and formats around awareness or action goals. The opening message, timing, and call to action are reviewed for the selected format, with reporting across view and conversion metrics.',
      ['Video format and audience plan', 'Placement and brand suitability controls', 'View and conversion measurement setup']),
    defineService('google-shopping-display-ads', 'Google Shopping & Display Ads', 'Product feeds and visual ad campaigns',
      'Prepare product feeds for Google Shopping and build Display campaigns that support your product and audience strategy.',
      'Shopping setup starts with feed eligibility, product identifiers, and consistency between listings and product pages. For Display, we review ad assets and placements against the campaign objective and budget.',
      ['Merchant Center feed diagnostics', 'Product grouping and Shopping campaign setup', 'Display asset and placement review']),
    defineService('remarketing-retargeting', 'Remarketing & Retargeting', 'Audience planning for returning prospects',
      'Reconnect with interested visitors using consent-aware audiences, relevant messaging, and sensible frequency limits.',
      'We group visitors by meaningful actions such as viewing an offer or leaving a cart, and exclude people who already converted where appropriate. Audience windows and messaging are set to match the buying cycle.',
      ['Audience and exclusion rules', 'Event and consent configuration review', 'Frequency and creative rotation plan']),
    defineService('microsoft-ads', 'Microsoft (Bing) Ads', 'Paid search on the Microsoft Advertising network',
      'Build or adapt paid search campaigns for Microsoft Advertising with channel-specific tracking and targeting.',
      'Existing campaigns can provide a starting point. Before launch, we review imported budgets, match types, geographic targeting, and conversion goals using Microsoft Advertising settings and reports.',
      ['Campaign import or account setup', 'Universal Event Tracking review', 'Search term and bid monitoring plan']),
    defineService('tiktok-snapchat-ads', 'TikTok & Snapchat Ads', 'Short-form paid social campaigns',
      'Build paid campaigns around mobile-first creative, clear conversion events, and audience testing for TikTok and Snapchat.',
      'We plan short vertical videos around the first few seconds of attention and keep key messages clear on mobile. Campaign setup accounts for each platform’s placements, asset requirements, and reporting.',
      ['Vertical video creative brief', 'Audience and campaign setup', 'Pixel and conversion event checks']),
  ],
  design: [
    existing('website-design-india', 'Business Website Design'),
    existing('wordpress-website-design'),
    existing('woocommerce-web-design', 'E-commerce Website Design'),
    existing('responsive-web-design', 'Responsive Website Design'),
    defineService('landing-page-design', 'Landing Page Design', 'Focused pages for campaigns and lead generation',
      'Design a landing page around one offer, a clear message, and a direct path to enquiry, signup, or purchase.',
      'We match the landing page to its traffic source, address questions visitors need answered, and check that calls to action and forms work across screen sizes. The design identifies the interactions to measure after launch.',
      ['Offer and message hierarchy', 'Responsive page and form design', 'Conversion event handoff']),
    existing('website-redesign'),
    defineService('ui-ux-design', 'UI/UX Design Services', 'Interface design based on real user tasks',
      'Translate user needs into accessible flows, prototypes, and interface components that developers can implement.',
      'We identify the tasks users must complete, then prototype the key journeys and review their states. Design handoff covers responsive behavior, interaction details, and the components that repeat across screens.',
      ['User flows and wireframes', 'Interactive screen prototypes', 'Component states and developer handoff']),
  ],
  development: [
    existing('website-development'),
    defineService('react-nextjs-development', 'React.js & Next.js Development', 'Component-based websites and web applications',
      'Build maintainable React interfaces and Next.js sites with rendering choices suited to the content and user journey.',
      'We design component boundaries and data fetching around the routes and interactions in scope. Public content, dashboards, and forms can have different rendering and caching needs, so we review each before implementation.',
      ['React component and routing architecture', 'Rendering and caching plan for Next.js routes', 'Performance, accessibility, and deployment checks']),
    existing('wordpress-development'),
    existing('woocommerce-development'),
    existing('laravel-development', 'Laravel & PHP Development'),
    defineService('nodejs-api-development', 'Node.js & API Development', 'Backends and documented API contracts',
      'Build Node.js services with clear API contracts, validated requests, and observable integrations.',
      'We define how clients authenticate, send data, and handle errors before building the endpoints. Logging, background work, and deployment checks are scoped to the traffic and reliability needs of the application.',
      ['API contract and request validation', 'Authentication and error handling', 'Integration tests and API documentation']),
    defineService('ecommerce-development', 'E-commerce Development', 'Storefronts, checkout and commerce integrations',
      'Build or extend an online store with product, checkout, payment, and fulfilment workflows tailored to your operation.',
      'We map the product data, order states, and fulfilment rules before choosing a platform or integration approach. Testing covers typical purchases and the edge cases your team needs to handle, including payment failures and refunds.',
      ['Catalog and storefront implementation', 'Checkout and payment integration', 'Order, inventory, and fulfilment testing']),
    defineService('web-application-development', 'Web Application Development', 'Browser-based tools for operational workflows',
      'Develop web applications with role-based access, reliable data flows, and interfaces suited to everyday business tasks.',
      'We map the roles, records, and actions that make up the workflow. Implementation covers the states users encounter in practice, including empty results, permission changes, interrupted requests, and failed submissions.',
      ['Workflow and data model design', 'Application screens and access controls', 'End-to-end workflow testing and release handoff']),
    existing('codeigniter-development'),
    existing('matx-development'),
  ],
  mobile: [
    existing('android-app-development', 'Android App Development'),
    existing('ios-app-development', 'iOS App Development'),
    defineService('flutter-app-development', 'Flutter App Development', 'Flutter apps for Android and iOS',
      'Develop a Flutter app with shared interface components, platform-aware behavior, and tested Android and iOS builds.',
      'We define the shared screens and identify features that need platform plugins or native code. Testing covers navigation, screen sizes, permissions, and app lifecycle events on the device types in scope.',
      ['Flutter and Dart project architecture', 'Responsive widgets and platform integrations', 'Device testing and release build handoff']),
    defineService('react-native-app-development', 'React Native App Development', 'Native mobile experiences using React',
      'Build React Native apps with reusable screens and platform integrations for Android and iOS.',
      'We evaluate dependencies and native module needs before building shared components. Platform-specific differences such as permissions, links, and navigation are checked separately on each target operating system.',
      ['React Native component and state architecture', 'Platform module and backend integration', 'Android and iOS build validation']),
    defineService('cross-platform-app-development', 'Cross-Platform App Development', 'Shared mobile code with a platform-specific release plan',
      'Choose and implement a shared mobile architecture based on device features, team skills, and release requirements.',
      'We check which features can share code and which depend on specific operating system capabilities. The technical plan accounts for native integrations, device coverage, and separate app store review and release steps.',
      ['Platform and framework assessment', 'Shared feature and integration development', 'Device QA and app store release preparation']),
    defineService('mobile-app-ui-ux-design', 'Mobile App UI/UX Design', 'Touch-friendly interfaces for mobile user journeys',
      'Design mobile app flows around touch, readable layouts, accessibility, and the tasks users need to complete on the go.',
      'We prototype core flows such as onboarding, navigation, and the primary task. Designs cover device insets, dynamic text, empty and error states, and motion preferences where those affect the experience.',
      ['Mobile task flows and navigation', 'Interactive screen prototypes', 'Touch, accessibility, and platform design specifications']),
  ],
  software: [
    defineService('custom-software-development', 'Custom Software Development', 'Business software scoped to your processes',
      'Develop custom software around your workflows, data, user roles, and integration requirements.',
      'We start with the day-to-day process and identify which steps need software support. A phased delivery plan lets users validate their most important workflows before less common cases and integrations are added.',
      ['Requirements and workflow definition', 'Software architecture and core feature implementation', 'Acceptance testing and operational handoff']),
    defineService('crm-erp-development', 'CRM & ERP Development', 'Connected customer and operational records',
      'Build CRM and ERP functionality for managing customer activity, records, approvals, and reporting.',
      'We define owners and permissions for shared records before configuring sales or operational workflows. Data migration is checked with representative records and reconciliation rules so teams can verify the transition.',
      ['Customer and operations data model', 'Role-based workflows and reporting', 'Migration mapping and reconciliation plan']),
    defineService('ai-chatbot-development', 'AI Chatbot Development', 'Assistants grounded in approved business content',
      'Build an AI chatbot that answers defined questions using approved sources and hands off requests that need human support.',
      'We scope the questions the assistant should handle, connect the approved sources, and test it against representative conversations. The workflow defines how to escalate uncertain answers and how to review feedback after launch.',
      ['Knowledge source and chatbot integration', 'Conversation evaluation and fallback rules', 'Human handoff and feedback workflow']),
    defineService('ai-automation-solutions', 'AI Automation Solutions', 'AI-assisted workflows with review where needed',
      'Use AI to assist with defined tasks such as document classification, information extraction, and response drafting.',
      'We select tasks with clear inputs and reviewable outputs, then evaluate representative examples before connecting them to live systems. Approval and escalation points are defined for sensitive or uncertain outputs.',
      ['Task selection and prototype workflow', 'Output evaluation and review thresholds', 'Monitoring and escalation setup']),
    defineService('saas-application-development', 'SaaS Application Development', 'Subscription software built for multiple customers',
      'Build a SaaS application with tenant data boundaries, account onboarding, and subscription workflows.',
      'We plan how customers join, manage access, and change their plans. Billing events and failed payments are tested alongside tenant access rules so account state stays consistent across the app and payment provider.',
      ['Tenant model and access controls', 'Onboarding and subscription billing integration', 'Account lifecycle and tenant isolation tests']),
    defineService('business-process-automation', 'Business Process Automation', 'Automated handoffs, approvals and reporting',
      'Connect routine business tasks across your existing tools with explicit approvals, exception handling, and activity records.',
      'We trace the current process before deciding what to automate. The workflow includes handling for missing data, repeated events, or failed handoffs so staff can resolve exceptions without restarting the entire process.',
      ['Process mapping and automation design', 'Approval, notification, and exception workflows', 'Retry behavior and activity logging']),
    defineService('api-third-party-integrations', 'API & Third-Party Integrations', 'Reliable connections between your business systems',
      'Connect business applications and vendors through documented APIs, webhooks, and validated data mappings.',
      'We identify the system of record for each data field, then plan authentication, rate limits, retries, and reconciliation. Integration testing covers both successful transfers and common provider or network failures.',
      ['API and data mapping specification', 'Webhook or scheduled sync implementation', 'Retry, reconciliation, and monitoring checks']),
  ],
  branding: [
    defineService('logo-brand-identity-design', 'Logo & Brand Identity Design', 'An identity system for digital and print',
      'Create a logo and visual identity with consistent typography, color, and practical usage guidelines.',
      'We use the brand brief to develop and refine the identity across representative applications. Final assets cover different backgrounds and sizes, with guidelines that explain how to use each variation.',
      ['Logo concepts and usage variations', 'Typography and color guidelines', 'Digital and print-ready asset exports']),
    defineService('graphic-design', 'Graphic Design Services', 'Consistent visual assets for business communications',
      'Design marketing and business materials that communicate clearly and fit the intended print or digital format.',
      'We establish the audience, message, and production requirements before creating layouts. Final files are prepared for their intended use, including dimensions, color modes, and handoff formats.',
      ['Layout and visual asset design', 'Design review against brand guidelines', 'Production-ready and editable file handoff']),
    defineService('social-media-creative-design', 'Social Media Creative Design', 'Reusable creative for social channels',
      'Design social posts, stories, and carousels that stay recognizable across platforms and campaigns.',
      'We create templates around repeatable content formats such as announcements, offers, and educational posts. Layouts account for mobile readability and the areas cropped or covered by each platform’s interface.',
      ['Platform-sized social templates', 'Post, story, and carousel assets', 'Editable source files and usage notes']),
    defineService('marketing-campaign-creatives', 'Marketing Campaign Creatives', 'Coordinated assets for a campaign and its channels',
      'Translate a campaign message into a consistent set of advertising, landing page, and promotional visuals.',
      'We establish a central visual and message, then adapt them to match the channel, audience, and placement. Variants are organized so your campaign team can identify the assets and compare test results.',
      ['Campaign visual concept', 'Channel and placement adaptations', 'Creative variants for testing']),
    defineService('corporate-branding', 'Corporate Branding', 'Brand consistency across teams and touchpoints',
      'Develop corporate brand standards for presentations, documents, and external communications.',
      'We review existing materials to see where inconsistent usage creates friction. The resulting standards cover recurring touchpoints and include templates that staff can use in their day-to-day work.',
      ['Brand touchpoint review', 'Corporate identity and usage standards', 'Presentation and document templates']),
    defineService('video-editing-motion-graphics', 'Video Editing & Motion Graphics', 'Edited videos and motion assets for digital channels',
      'Turn footage and brand assets into finished videos with purposeful pacing, graphics, and accessible captions.',
      'We establish the story and target duration, then review the edit for pacing and clarity. Graphics, captions, and aspect-ratio variants are prepared for the channels where the video will be used.',
      ['Video editing and motion graphics', 'Captions and aspect-ratio versions', 'Final exports for target channels']),
  ],
  support: [
    defineService('website-maintenance', 'Website Maintenance', 'Scheduled maintenance for an existing website',
      'Keep an existing website current with planned updates, backups, and checks on the pages and integrations visitors use.',
      'We establish maintenance windows and confirm that backups and rollback options are available before applying updates. After each change, we verify priority pages, forms, and integrations agreed during onboarding.',
      ['Maintenance and backup schedule', 'Updates with rollback planning', 'Post-update checks for critical workflows']),
    defineService('website-speed-optimization', 'Website Speed Optimization', 'Performance fixes based on measured bottlenecks',
      'Improve website loading and responsiveness by measuring key pages and addressing the assets, scripts, and requests that slow them down.',
      'We use lab tests and available field measurements to identify slow templates and repeated bottlenecks. Fixes can include image sizing, caching, or delaying nonessential scripts, followed by checks to confirm that key interactions still work.',
      ['Page loading and interaction performance assessment', 'Asset, script, and caching improvements', 'Before-and-after checks on representative pages']),
    defineService('website-security-updates', 'Website Security & Updates', 'Routine hardening and patch management',
      'Maintain website security through dependency updates, configuration review, access controls, and recovery planning.',
      'We review supported versions and administrative access before scheduling updates. Changes are checked in staging where available, with a backup and rollback path for the production release.',
      ['Dependency and configuration review', 'Staged security updates and access checks', 'Backup and recovery documentation']),
    defineService('hosting-domain-management', 'Hosting & Domain Management', 'Hosting, DNS and renewal coordination',
      'Manage website hosting and domain configuration, including DNS, certificates, renewals, and service continuity.',
      'We document ownership and existing DNS records before making changes, including records needed for email. Hosting work covers the agreed deployment, backup, and availability requirements.',
      ['Hosting, domain, and DNS inventory', 'Certificate and renewal coordination', 'Deployment and recovery documentation']),
    defineService('website-migration', 'Website Migration', 'Planned moves between hosts or platforms',
      'Move website content and functionality with a plan for redirects, DNS, verification, and rollback.',
      'We inventory the site and establish what must migrate, including media, forms, and URLs with incoming links. The destination is validated before cutover, with checks on redirects, key workflows, and email-related DNS records.',
      ['Content inventory and URL mapping', 'Staging migration and cutover plan', 'Post-cutover verification and rollback instructions']),
    defineService('technical-support-bug-fixes', 'Technical Support & Bug Fixes', 'Diagnosis and verified repairs for website issues',
      'Resolve reproducible issues in websites and web applications with clear triage, tested fixes, and a record of changes.',
      'We gather reproduction steps and relevant logs, then isolate the failure in a suitable environment. A fix is verified against the reported case and the related workflows most likely to be affected.',
      ['Issue triage and root-cause diagnosis', 'Scoped repair and regression checks', 'Deployment notes and verification steps']),
  ],
};

export type CatalogService = Omit<ServiceItem, 'category'> & {
  category: ServiceCategoryId;
  legacy: boolean;
  searchTitle?: string;
};

const existingServices = new Map(SERVICES.map((service) => [service.slug, service]));

function resolveService(entry: ExistingService | NewService, category: ServiceCategoryId): CatalogService {
  if ('overview' in entry) {
    const { overview, ...service } = entry;
    return {
      ...service,
      id: service.slug,
      category,
      legacy: false,
      fullDescription: [overview],
      features: service.deliverables,
      metrics: [],
      process: [],
      faqs: [],
    };
  }

  const service = existingServices.get(entry.slug);
  if (!service) throw new Error(`Missing existing service for ${entry.slug}`);
  return {
    ...service,
    title: entry.title ?? service.title,
    category,
    legacy: true,
    searchTitle: service.title,
  };
}

export const SERVICE_CATEGORIES = (Object.keys(categoryNames) as ServiceCategoryId[]).map((id) => ({
  id,
  title: categoryNames[id],
  services: catalog[id].map((entry) => resolveService(entry, id)),
}));

export const SERVICE_CATALOG = SERVICE_CATEGORIES.flatMap((category) => category.services);

export const servicePath = (slug: string) => `/services/${slug}`;
