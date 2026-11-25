import aureliaCampaignThumb from '../assets/images/aurelia_hero_campaign_1794821314191.jpg';
import etoileRingThumb from '../assets/images/etoile_ring_hero_1794821313542.jpg';
import azureHeroThumb from '../assets/images/azure_hero_caldera_1794822423923.jpg';
import azureAmalfiThumb from '../assets/images/amalfi_villa_limone_1794822423810.jpg';
import healthlinkHeroThumb from '../assets/images/healthlink_hero_hospital_1794823198073.jpg';
import healthlinkDoctorThumb from '../assets/images/healthlink_doctor_consult_1794823199394.jpg';
import primusWorkspaceThumb from '../assets/images/primus_workspace_ui_1794823884241.jpg';
import primusMeridianThumb from '../assets/images/primus_meridian_logistics_1794823850949.jpg';
import aetherControlTowerThumb from '../assets/images/aether_control_tower_ui_1794824770591.jpg';
import aetherReeferThumb from '../assets/images/aether_reefer_highway_1794824769801.jpg';
import type { EngagementCategory } from './websiteContent';

export interface ShowcaseProject {
  id: string;
  slug: string;
  demoUrl?: string;
  conceptLabel?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  inquiryContext?: string;
  title: string;
  clientName: string;
  category: 'ecommerce' | 'travel' | 'healthtech' | 'fintech' | 'logistics';
  engagementCategories: readonly EngagementCategory[];
  categoryLabel: string;
  tagline: string;
  description: string;
  thumbnail: string;
  secondaryImage: string;
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
    demoUrl: '/showcase/aurelia',
    conceptLabel: 'Interactive Concept Store',
    primaryCtaLabel: 'Explore Storefront Demo',
    secondaryCtaLabel: 'Request a Similar Project',
    inquiryContext: 'Luxury e-commerce storefront',
    title: 'Aurélia & Co. High Jewelry & Couture',
    clientName: 'Aurélia & Co. Paris · Milan (Concept Store)',
    category: 'ecommerce',
    engagementCategories: ['ecommerce'],
    categoryLabel: 'Interactive Concept Store',
    tagline: 'Paris–Milan Fine Jewelry Editorial Flagship Concept',
    description: 'Explore a luxury jewelry storefront with shoppable collections, detailed product galleries, saved favorites, and an interactive checkout demo.',
    thumbnail: aureliaCampaignThumb,
    secondaryImage: etoileRingThumb,
    year: '2026',
    timeline: 'Multi-Page Demo',
    techStack: ['React 19', 'TypeScript', 'React Router', 'Tailwind CSS', 'INR Cart & Wishlist State'],
    metrics: [
      { label: 'Concept Catalog', value: '22 Pieces', change: '5 categories' },
      { label: 'Editorial Lines', value: '4 Collections', change: 'Filter & Search' },
      { label: 'Checkout Flow', value: 'INR Demo', change: 'Browser-local' },
    ],
    accentColor: '#9E7B42', // Restrained Antique Gold
    themeStyle: {
      bg: '#FAF7F2',
      text: '#141312',
      accent: '#9E7B42',
      badgeBg: 'rgba(158, 123, 66, 0.14)',
      cardBg: '#F3ECE1',
      borderColor: 'rgba(158, 123, 66, 0.35)',
    },
    livePreview: {
      heroTitle: 'Architecture of Timeless Radiance',
      heroSubtitle: 'Fictional Paris–Milan fine jewelry maison showcase featuring shoppable collections, interactive ring sizing, persistent favorites, and a local INR checkout demo.',
      heroCta: 'Explore Storefront Demo',
      heroSecondaryCta: 'House of Aurélia',
      stats: [
        { number: '22', text: 'Curated Concept Pieces' },
        { number: '4', text: 'Editorial Collections' },
        { number: 'INR (₹)', text: 'Browser-Local Checkout Demo' },
      ],
      featuresTitle: 'Storefront Capabilities',
      features: [
        { title: 'The Étoile Diamond Ring', desc: 'Interactive gallery zoom, EU ring sizing availability, and complete GIA-style dossier.', icon: 'gem' },
        { title: 'Faceted Catalog Filtering', desc: 'Filter live across category, collection, precious metal, gemstone, and INR brackets.', icon: 'sparkles' },
        { title: 'Persistent Bag & Checkout', desc: 'Save favorites, adjust variants in the bag drawer, and place simulated INR orders.', icon: 'shirt' },
      ],
    },
  },
  {
    id: 'azure-escapes',
    slug: 'azure-escapes-travel',
    demoUrl: '/showcase/azure-escapes',
    conceptLabel: 'Interactive Concept Website',
    primaryCtaLabel: 'Explore Villa Booking Demo',
    secondaryCtaLabel: 'Request a Similar Project',
    inquiryContext: 'Luxury travel & villa booking platform',
    title: 'Azure Escapes Luxury Coastal Villas',
    clientName: 'Azure Escapes · Santorini, Amalfi Coast & Bali (Concept Website)',
    category: 'travel',
    engagementCategories: ['development'],
    categoryLabel: 'Luxury Travel & Resort Booking',
    tagline: 'Interactive Luxury Coastal Villa Booking & Availability Showcase',
    description: 'Explore a luxury villa booking platform with destination pages, live demo availability, seasonal pricing, and a complete reservation flow.',
    thumbnail: azureHeroThumb,
    secondaryImage: azureAmalfiThumb,
    year: '2026',
    timeline: 'Multi-Page Concept Demo',
    techStack: ['React 19', 'TypeScript', 'React Router', 'Tailwind CSS', 'Seasonal Date & Quote Engine'],
    metrics: [
      { label: 'Concept Inventory', value: '12 Villas', change: '3 destinations' },
      { label: 'Tariff Engine', value: 'Seasonal Splits', change: 'EUR base + demo FX' },
      { label: 'Reservation Flow', value: '4-Step Demo', change: 'Instant confirmation' },
    ],
    accentColor: '#2E7D8C', // Mediterranean Sea-Glass Accent
    themeStyle: {
      bg: '#09263B',
      text: '#F6F2EB',
      accent: '#2E7D8C',
      badgeBg: 'rgba(46, 125, 140, 0.16)',
      cardBg: '#0F3854',
      borderColor: 'rgba(168, 132, 67, 0.35)',
    },
    livePreview: {
      heroTitle: 'Find your place by the sea',
      heroSubtitle: 'Interactive coastal hospitality platform across Santorini, the Amalfi Coast, and Bali featuring seasonal rate breakdowns, live calendar rules, and reservation flow.',
      heroCta: 'Explore Villa Booking Demo',
      heroSecondaryCta: 'View Coastal Destinations',
      stats: [
        { number: '12', text: 'Curated Coastal Villas' },
        { number: '3', text: 'Iconic Coastal Regions' },
        { number: 'EUR (€)', text: 'Seasonal Quote & Demo Checkout' },
      ],
      featuresTitle: 'Platform Capabilities',
      features: [
        { title: 'Caldera House (Santorini Flagship)', desc: 'Multi-view Cycladic gallery, relative availability calendar, and seasonal rate splits.', icon: 'compass' },
        { title: 'Villa Limone & Banyan Residence', desc: 'Regionally accurate Amalfi and Bali villas filterable by dates, guests, and bedrooms.', icon: 'sun' },
        { title: 'Complete Reservation Flow', desc: 'Experience extras calculation, guest details preview, and non-PII instant confirmation.', icon: 'map' },
      ],
    },
  },
  {
    id: 'healthlink-clinical',
    slug: 'healthlink-telemedicine-saas',
    demoUrl: '/showcase/healthlink',
    conceptLabel: 'Interactive Concept Demo',
    primaryCtaLabel: 'Explore HealthLink Demo',
    secondaryCtaLabel: 'Request a Similar Project',
    inquiryContext: 'Healthcare SaaS & hospital operations platform',
    title: 'HealthLink Clinical Telehealth Platform',
    clientName: 'HealthLink Clinical Operations (Concept Demo)',
    category: 'healthtech',
    engagementCategories: ['development'],
    categoryLabel: 'HealthTech SaaS',
    tagline: 'Connected Hospital Operations, Pharmacy, Billing & Patient Portal',
    description: 'Explore a hospital operations platform that connects reception, doctors, pharmacy, billing, and patients in one working demo.',
    thumbnail: healthlinkHeroThumb,
    secondaryImage: healthlinkDoctorThumb,
    year: '2026',
    timeline: 'Multi-Role Concept Demo',
    techStack: ['React 19', 'TypeScript', 'React Router', 'Tailwind CSS', 'Multi-Role Demo State'],
    metrics: [
      { label: 'Connected Modules', value: '5 Desks', change: 'Synced live' },
      { label: 'Sample Facilities', value: '2 Clinics', change: 'Switchable' },
      { label: 'Portal + Telehealth', value: 'Simulated', change: 'Browser-local' },
    ],
    accentColor: '#0F766E', // Clinical Deep Teal
    themeStyle: {
      bg: '#F7FAFC',
      text: '#0A2540',
      accent: '#0F766E',
      badgeBg: 'rgba(15, 118, 110, 0.12)',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(15, 118, 110, 0.25)',
    },
    livePreview: {
      heroTitle: 'From patient check-in to follow-up, one connected workspace',
      heroSubtitle: 'Explore three connected experiences—a public Healthcare SaaS website, a role-based hospital operations workspace, and a patient portal with simulated telehealth.',
      heroCta: 'Explore HealthLink Demo',
      heroSecondaryCta: 'Patient Portal Preview',
      stats: [
        { number: '6', text: 'Interactive Role Views' },
        { number: '2', text: 'Sample Outpatient Clinics' },
        { number: '100%', text: 'Browser-Local Concept Data' },
      ],
      featuresTitle: 'Connected Clinical Workflow Capabilities',
      features: [
        { title: 'Reception & Doctor Queue Sync', desc: 'Look up returning case history, prevent duplicate tokens, and enter stock-aware e-prescriptions.', icon: 'activity' },
        { title: 'Pharmacy Partial Dispensing', desc: 'Fulfill full or partial medicine batches with real stock enforcement and itemized slips.', icon: 'file-text' },
        { title: 'Billing & Patient Portal', desc: 'Prevent consultation double-billing and mirror receipts, summaries, and simulated telehealth into Portal.', icon: 'shield' },
      ],
    },
  },
  {
    id: 'primus-capital',
    slug: 'primus-capital-wealth',
    demoUrl: '/showcase/primus-capital',
    conceptLabel: 'Interactive Concept Demo',
    primaryCtaLabel: 'Explore Investment Platform',
    secondaryCtaLabel: 'Request a Similar Project',
    inquiryContext: 'Institutional real estate investment platform',
    title: 'Primus Capital Institutional Real Estate',
    clientName: 'Primus Capital Group · London & Singapore (Concept Demo)',
    category: 'fintech',
    engagementCategories: ['development'],
    categoryLabel: 'FinTech & Real Estate',
    tagline: 'Commercial Real Estate Discovery, Underwriting & Committee Governance',
    description: 'Discover commercial properties, compare deals, model investment returns, and track due diligence in one connected workspace.',
    thumbnail: primusWorkspaceThumb,
    secondaryImage: primusMeridianThumb,
    year: '2026',
    timeline: 'Multi-Role Concept Demo',
    techStack: ['React 19', 'TypeScript', 'Underwriting Engine', 'Tailwind CSS', 'Multi-Currency FX', 'Read-Only LP Portal'],
    metrics: [
      { label: 'Sample Properties', value: '12 Assets', change: '2 global markets' },
      { label: 'Valuation Engine', value: '3 Scenarios', change: 'Base / Upside / Down' },
      { label: 'Governance & LP', value: 'Role-Gated', change: 'Simulated IC & Portal' },
    ],
    accentColor: '#9E7C3B', // Brushed Architectural Brass
    themeStyle: {
      bg: '#0D1829',
      text: '#F6F4EF',
      accent: '#9E7C3B',
      badgeBg: 'rgba(158, 124, 59, 0.16)',
      cardBg: '#16243B',
      borderColor: 'rgba(158, 124, 59, 0.35)',
    },
    livePreview: {
      heroTitle: 'From first look to investment committee',
      heroSubtitle: 'Connect commercial asset discovery, multi-scenario return modeling, diligence checklists, frozen Committee revisions, and read-only LP reporting in one workspace.',
      heroCta: 'Explore Investment Platform',
      heroSecondaryCta: 'Meridian Flagship Dossier',
      stats: [
        { number: '12', text: 'Fictional London & Singapore Assets' },
        { number: '3', text: 'Live Modeled Underwriting Scenarios' },
        { number: '2', text: 'Scoped Sample LP Partner Profiles' },
      ],
      featuresTitle: 'Connected Real Estate Investment Modules',
      features: [
        { title: 'Underwriting Studio & Sensitivity', desc: 'Model Base, Upside, and Downside cash flows with Occupancy × Exit Cap matrices and zero-debt safety.', icon: 'trending-up' },
        { title: 'Blocking Diligence & Data Room', desc: 'Require verified checklist sign-offs before freezing underwriting packages for Committee review.', icon: 'pie-chart' },
        { title: 'Read-Only Investor Portal', desc: 'Switch between sample institutional LP profiles with scoped holdings, reports, and printable capital accounts.', icon: 'dollar-sign' },
      ],
    },
  },
  {
    id: 'aether-fleet',
    slug: 'aether-fleet-logistics',
    demoUrl: '/showcase/aether-fleet',
    conceptLabel: 'Interactive Concept Demo',
    primaryCtaLabel: 'Explore Logistics Platform',
    secondaryCtaLabel: 'Request a Similar Project',
    inquiryContext: 'IoT fleet & cold-chain logistics platform',
    title: 'Aether Fleet Telemetry & Supply Chain',
    clientName: 'Aether Fleet Operations · Pune, NCR & Bengaluru (Concept Demo)',
    category: 'logistics',
    engagementCategories: ['development'],
    categoryLabel: 'IoT Logistics',
    tagline: 'Connected Fleet Control Tower, Cold-Chain Monitoring & Driver Dispatch',
    description: 'Track shipments, monitor vehicle and sensor data, resolve cold-chain incidents, and verify delivery in one connected logistics workspace.',
    thumbnail: aetherControlTowerThumb,
    secondaryImage: aetherReeferThumb,
    year: '2026',
    timeline: '4-Experience Concept Demo',
    techStack: ['React 19', 'TypeScript', 'Cold-Chain Engine', 'Tailwind CSS', 'Telemetry Replay', 'Mobile Driver POD'],
    metrics: [
      { label: 'Sample Fleet', value: '15 Vehicles', change: '3 corridor depots' },
      { label: 'Active Orders', value: '30 Shipments', change: 'Dry & 2–8°C reefer' },
      { label: 'Connected Views', value: '4 Experiences', change: 'Tower · Driver · Track' },
    ],
    accentColor: '#06B6D4', // Electric Cyan Accent
    themeStyle: {
      bg: '#0C131F',
      text: '#F8FAFC',
      accent: '#06B6D4',
      badgeBg: 'rgba(6, 182, 212, 0.16)',
      cardBg: '#131D2E',
      borderColor: 'rgba(6, 182, 212, 0.35)',
    },
    livePreview: {
      heroTitle: 'Track every shipment, sensor stream, and delivery proof in one tower',
      heroSubtitle: 'Explore a complete multi-experience logistics platform uniting a dispatcher Control Tower, simulated Pune–Mumbai cold-chain excursion replay, a mobile Driver Workspace, and a public Customer Portal.',
      heroCta: 'Explore Logistics Platform',
      heroSecondaryCta: 'Inspect Shipment AFL-2048',
      stats: [
        { number: '15', text: 'Simulated Corridor Fleet Units' },
        { number: '30', text: 'Fictional Shipments Across 3 Depots' },
        { number: '4', text: 'Connected Web & Mobile Views' },
      ],
      featuresTitle: 'Connected IoT Logistics & Cold-Chain Capabilities',
      features: [
        { title: 'Corridor Map & Telemetry Replay', desc: 'Interactive Play/Pause/3x route replay plus sustained 2°C–8°C thermal excursion simulation on AFL-2048.', icon: 'truck' },
        { title: 'Dispatch Validation & Incidents', desc: 'Reject non-reefer or overweight truck pairings, acknowledge incidents, and push driver instructions live.', icon: 'shield-alert' },
        { title: 'Driver POD & Public Portal', desc: 'Capture photo/signature delivery proof on mobile driver view and expose clean milestones to customers.', icon: 'thermometer' },
      ],
    },
  },
];
