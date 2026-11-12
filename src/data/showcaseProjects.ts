export interface ShowcaseProject {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  category: 'ecommerce' | 'travel' | 'healthtech' | 'fintech' | 'logistics';
  categoryLabel: string;
  tagline: string;
  description: string;
  thumbnail: string;
  year: string;
  timeline: string;
  techStack: string[];
  metrics: { label: string; value: string; change?: string }[];
  accentColor: string;
  themeStyle: {
    bg: string;
    text: string;
    accent: string;
    badgeBg: string;
    cardBg: string;
    borderColor: string;
  };
  livePreview: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroSecondaryCta: string;
    stats: { number: string; text: string }[];
    featuresTitle: string;
    features: { title: string; desc: string; icon: string }[];
  };
}

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'aurelia-luxury',
    slug: 'aurelia-luxury-ecommerce',
    title: 'Aurélia & Co. High Jewelry & Couture',
    clientName: 'Aurélia Luxury Paris / Milan',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce & High-Fashion',
    tagline: 'High-Jewelry Direct-to-Consumer Flagship Experience',
    description: 'Designed and engineered an ultra-luxurious, headless WooCommerce & Next.js flagship e-commerce platform for international jewelry collectors. Achieved sub-second page loads with 3D product previews and localized multi-currency checkout.',
    thumbnail: '/src/assets/images/ecommerce_showcase_1794460734442.jpg',
    year: '2026',
    timeline: '12 Business Days Delivery',
    techStack: ['WooCommerce Headless', 'Next.js 14', 'Tailwind CSS', 'Stripe Global', 'Redis Cache', 'Cloudflare CDN'],
    metrics: [
      { label: 'Organic Revenue', value: '+318%', change: 'Post-launch' },
      { label: 'Mobile Conversion', value: '4.85%', change: 'Up from 1.2%' },
      { label: 'Core Web Vitals', value: '99/100', change: '0.8s LCP' },
    ],
    accentColor: '#D4AF37', // Champagne Gold
    themeStyle: {
      bg: '#0A0E17',
      text: '#F8FAFC',
      accent: '#D4AF37',
      badgeBg: 'rgba(212, 175, 55, 0.15)',
      cardBg: '#111726',
      borderColor: 'rgba(212, 175, 55, 0.25)',
    },
    livePreview: {
      heroTitle: 'Elevate Your Elegance with High Jewelry Collections',
      heroSubtitle: 'Handcrafted in Paris and Milan using ethically sourced 18K recycled gold, certified diamonds, and rare gemstones. Explore the new Serpentine and Atelier collections.',
      heroCta: 'Explore Collections',
      heroSecondaryCta: 'Book Private Viewing',
      stats: [
        { number: '$34,000+', text: 'Average Order Value' },
        { number: '180+', text: 'Certified Masterpieces' },
        { number: '48h', text: 'Insured Global Vault Dispatch' },
      ],
      featuresTitle: 'Curated High Jewelry & Haute Horlogerie',
      features: [
        { title: 'The Serpentine Diamond Choker', desc: '14.5 carats of VVS emerald-cut diamonds cast in handcrafted white gold.', icon: 'gem' },
        { title: 'Emerald Cascade Earrings', desc: 'Columbian untreated emeralds with diamond-pavé teardrop clasps.', icon: 'sparkles' },
        { title: 'Atelier Velvet Dinner Blazer', desc: 'Italian silk velvet tailored to bespoke millimeter specifications.', icon: 'shirt' },
      ],
    },
  },
  {
    id: 'azure-escapes',
    slug: 'azure-escapes-travel',
    title: 'Azure Escapes Luxury Coastal Villas',
    clientName: 'Azure Hospitality Group (Santorini, Amalfi & Bali)',
    category: 'travel',
    categoryLabel: 'Luxury Travel & Resort Booking',
    tagline: 'Private Mediterranean & Tropical Villa Reservation Engine',
    description: 'Engineered a booking engine for ultra-luxury coastal villas and private island charters. Integrated real-time room availability, interactive 360° drone tours, dynamic seasonal pricing, and multi-currency payments with instant WhatsApp concierge.',
    thumbnail: '/src/assets/images/travel_showcase_1794460750941.jpg',
    year: '2026',
    timeline: '10 Business Days Delivery',
    techStack: ['Laravel REST API', 'React Vite', 'Google Maps Platform', 'Stripe Connect', 'AWS S3', 'PostgreSQL'],
    metrics: [
      { label: 'Direct Bookings', value: '+240%', change: 'Zero OTA fees' },
      { label: 'Booking Inquiry Rate', value: '7.2%', change: 'Industry avg 2.1%' },
      { label: 'Google Search Traffic', value: '185,000/mo', change: 'Top 3 rankings' },
    ],
    accentColor: '#0284C7', // Mediterranean Azure Sky
    themeStyle: {
      bg: '#041B2D',
      text: '#F0F9FF',
      accent: '#38BDF8',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      cardBg: '#082842',
      borderColor: 'rgba(56, 189, 248, 0.3)',
    },
    livePreview: {
      heroTitle: 'Discover Your Ultimate Coastal Sanctuary',
      heroSubtitle: 'Exclusive cliffside villas, private infinity pools, and superyacht charters in Santorini, the Amalfi Coast, Ibiza, and Bali with 24/7 dedicated butler service.',
      heroCta: 'Search Available Villas',
      heroSecondaryCta: 'Curated Itineraries',
      stats: [
        { number: '140+', text: 'Verified Private Estates' },
        { number: '99.4%', text: 'Guest Satisfaction Index' },
        { number: '100%', text: 'Direct Best-Rate Guarantee' },
      ],
      featuresTitle: 'Iconic Coastal Destinations & Curated Stays',
      features: [
        { title: 'Villa Oia Caldera (Santorini)', desc: 'Unobstructed Aegean sunset views, heated infinity plunge pool, and private sommelier.', icon: 'compass' },
        { title: 'Ravello Cliffside Manor (Amalfi)', desc: 'Century-old lemon orchards, private helicopter pad, and Michelin-starred private chef.', icon: 'sun' },
        { title: 'Uluwatu Sunset Estate (Bali)', desc: 'Perched 80 meters above the Indian Ocean with private beach staircase access.', icon: 'map' },
      ],
    },
  },
  {
    id: 'healthlink-clinical',
    slug: 'healthlink-telemedicine-saas',
    title: 'HealthLink Clinical Telehealth Platform',
    clientName: 'HealthLink Healthcare Network',
    category: 'healthtech',
    categoryLabel: 'Healthcare SaaS & Patient Portal',
    tagline: 'HIPAA-Compliant Remote Telemedicine & Vitals Telemetry',
    description: 'Built an enterprise telemedicine portal allowing patients to schedule encrypted HD video consultations, sync Bluetooth smart vitals monitors, access electronic medical prescriptions, and process insurance claims in seconds.',
    thumbnail: '/src/assets/images/healthtech_showcase_1794460765217.jpg',
    year: '2026',
    timeline: '14 Business Days Delivery',
    techStack: ['Node.js Express', 'React 19', 'WebRTC Video', 'Socket.io', 'PostgreSQL', 'HIPAA Secure Cloud'],
    metrics: [
      { label: 'Patient Consults', value: '1.2M+', change: 'Completed safely' },
      { label: 'Wait Time Reduction', value: '-74%', change: 'Down to 4 mins' },
      { label: 'Patient Retention', value: '96.2%', change: '5-star satisfaction' },
    ],
    accentColor: '#2563EB', // Royal Clinical Cobalt
    themeStyle: {
      bg: '#F8FAFC',
      text: '#0F172A',
      accent: '#2563EB',
      badgeBg: 'rgba(37, 99, 235, 0.1)',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(37, 99, 235, 0.2)',
    },
    livePreview: {
      heroTitle: 'Seamless Clinical Care from Anywhere on Earth',
      heroSubtitle: 'Connect with board-certified physicians, cardiologists, and pediatricians in under 5 minutes. Real-time SpO2, blood pressure, and ECG telemetry syncing with electronic health records.',
      heroCta: 'Book Instant Consultation',
      heroSecondaryCta: 'View Medical Specialists',
      stats: [
        { number: '4,500+', text: 'Licensed Medical Doctors' },
        { number: '< 4 Mins', text: 'Average Triage Wait Time' },
        { number: '256-bit', text: 'HIPAA & GDPR End-to-End Encryption' },
      ],
      featuresTitle: 'Smart Clinical Telemetry & Patient Management',
      features: [
        { title: 'Real-Time Vitals Telemetry', desc: 'Continuous SpO2, ECG, and blood glucose streaming directly to attending doctors.', icon: 'activity' },
        { title: 'Instant e-Prescription Routing', desc: 'Secure prescriptions sent directly to patient-preferred local partner pharmacies.', icon: 'file-text' },
        { title: 'Automated Insurance Claim Sync', desc: 'Direct digital verification with major health insurance networks.', icon: 'shield' },
      ],
    },
  },
  {
    id: 'primus-capital',
    slug: 'primus-capital-wealth',
    title: 'Primus Capital Institutional Real Estate',
    clientName: 'Primus Capital Group (London & Singapore)',
    category: 'fintech',
    categoryLabel: 'FinTech & Real Estate Wealth',
    tagline: 'Commercial Real Estate Investment & High-Frequency Yield Analytics',
    description: 'Developed an institutional investment intelligence dashboard showcasing commercial office towers, industrial logistics parks, and multi-family residential funds with live IRR modeling and risk-weighted returns analytics.',
    thumbnail: '/src/assets/images/fintech_showcase_1794460779254.jpg',
    year: '2026',
    timeline: '14 Business Days Delivery',
    techStack: ['Python FastAPI', 'React TypeScript', 'D3.js Financial Charts', 'Tailwind CSS', 'Docker', 'PostgreSQL'],
    metrics: [
      { label: 'Assets Under Analytics', value: '$16.4B', change: '142 Properties' },
      { label: 'Average Portfolio IRR', value: '14.9%', change: '+380 bps index beat' },
      { label: 'Investor Capital Raised', value: '$2.7B', change: 'Institutional LP inflows' },
    ],
    accentColor: '#F59E0B', // Amber Bronze / Copper Gold
    themeStyle: {
      bg: '#0F131C',
      text: '#F1F5F9',
      accent: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      cardBg: '#161D2B',
      borderColor: 'rgba(245, 158, 11, 0.25)',
    },
    livePreview: {
      heroTitle: 'Unlocking Institutional Value Through Global Real Estate',
      heroSubtitle: 'Data-driven capital allocation in prime global logistics, medical life-science campuses, and prime central business district commercial towers with automated yield distributions.',
      heroCta: 'Request Institutional Access',
      heroSecondaryCta: 'Download Q4 Fund Report',
      stats: [
        { number: '$16.4B', text: 'Total Gross Asset Value' },
        { number: '96.7%', text: 'Occupancy Rate Across 142 Assets' },
        { number: '14.9%', text: '10-Year Annualized Investor IRR' },
      ],
      featuresTitle: 'High-Frequency Real Estate Investment Analytics',
      features: [
        { title: 'Commercial Portfolio Valuation', desc: 'Algorithmic discounted cash-flow valuation refreshed with live market lease comps.', icon: 'trending-up' },
        { title: 'Cap Rate & Yield Optimizer', desc: 'Interactive sensitivity modeling for debt financing, tenant covenants, and inflation.', icon: 'pie-chart' },
        { title: 'Automated LP Distributions', desc: 'Direct ACH/SWIFT quarterly dividend distributions with instant tax statement generation.', icon: 'dollar-sign' },
      ],
    },
  },
  {
    id: 'aether-fleet',
    slug: 'aether-fleet-logistics',
    title: 'Aether Fleet Telemetry & Supply Chain',
    clientName: 'Aether Logistics International',
    category: 'logistics',
    categoryLabel: 'IoT Logistics & Telemetry Dashboard',
    tagline: 'Real-Time Global Fleet Tracking & Supply Chain Optimization',
    description: 'Designed a mission-critical fleet tracking web application tracking 45,000+ commercial trucks, cargo vessels, and air freight shipments with live IoT temperature logs, predictive maintenance alerts, and automated driver dispatch.',
    thumbnail: '/src/assets/images/logistics_showcase_1794460794708.jpg',
    year: '2026',
    timeline: '11 Business Days Delivery',
    techStack: ['Node.js Microservices', 'React 19', 'Leaflet / Google Maps API', 'Kafka Streams', 'TimescaleDB'],
    metrics: [
      { label: 'Active Shipments', value: '45,000+', change: 'Tracked 24/7' },
      { label: 'Fuel Cost Savings', value: '-22.4%', change: 'Route optimization' },
      { label: 'Delivery On-Time Rate', value: '99.1%', change: 'Zero cargo loss' },
    ],
    accentColor: '#F97316', // Industrial Safety Amber
    themeStyle: {
      bg: '#111215',
      text: '#F3F4F6',
      accent: '#F97316',
      badgeBg: 'rgba(249, 115, 22, 0.15)',
      cardBg: '#191A20',
      borderColor: 'rgba(249, 115, 22, 0.3)',
    },
    livePreview: {
      heroTitle: 'Real-Time Global Fleet Tracking & Telemetry Dashboard',
      heroSubtitle: 'Command your worldwide logistics network with sub-second GPS tracking, driver behavioral analytics, predictive fuel routing, and cold-chain temperature telemetry.',
      heroCta: 'Launch Live Fleet Console',
      heroSecondaryCta: 'Explore Sensor Telemetry',
      stats: [
        { number: '1,245', text: 'Active Transcontinental Vehicles' },
        { number: '987', text: 'Cargo Shipments In-Transit' },
        { number: '88.4%', text: 'Global Fleet Efficiency Score' },
      ],
      featuresTitle: 'Mission-Critical Logistics Telemetry Architecture',
      features: [
        { title: 'Global Shipment Route Mapping', desc: 'Real-time multi-modal route tracking across maritime shipping lanes and interstate highways.', icon: 'truck' },
        { title: 'Driver Telemetry & Safety Index', desc: 'Continuous speed, engine RPM, Hours-of-Service (HOS), and safety compliance monitoring.', icon: 'shield-alert' },
        { title: 'IoT Cold-Chain Sensor Logs', desc: 'Instant crimson alerts if temperature deviates by even 0.5°C in pharmaceutical cargo.', icon: 'thermometer' },
      ],
    },
  },
];
