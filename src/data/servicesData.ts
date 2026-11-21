import { SERVICES, type ServiceItem } from './websiteContent.ts';
import { GROWTH_SERVICES_DETAIL, type DetailedServiceContent } from './servicesCatalogGrowth.ts';
import { TECH_SERVICES_DETAIL } from './servicesCatalogTech.ts';

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

const DETAILED_NEW_SERVICES: Record<string, DetailedServiceContent> = {
  ...GROWTH_SERVICES_DETAIL,
  ...TECH_SERVICES_DETAIL,
};

type ExistingService = { slug: string; title?: string };
type NewServiceRef = { slug: string; isDetailedRef: true };

const existing = (slug: string, title?: string): ExistingService => ({ slug, title });
const detailed = (slug: string): NewServiceRef => ({ slug, isDetailedRef: true });

const catalog: Record<ServiceCategoryId, (ExistingService | NewServiceRef)[]> = {
  seo: [
    existing('local-seo', 'Local SEO & Google Maps Optimization'),
    existing('seo-services', 'Search Engine Optimization (SEO)'),
    detailed('technical-seo'),
    existing('ecommerce-seo', 'E-commerce SEO'),
    existing('social-media-marketing', 'Social Media Management (SMO/SMM)'),
    existing('reputation-management'),
  ],
  paid: [
    existing('ppc-management', 'Google Ads Management'),
    detailed('meta-ads'),
    detailed('linkedin-ads'),
    detailed('youtube-advertising'),
    detailed('google-shopping-display-ads'),
    detailed('remarketing-retargeting'),
    detailed('microsoft-ads'),
    detailed('tiktok-snapchat-ads'),
  ],
  design: [
    existing('website-design-india', 'Business Website Design'),
    existing('wordpress-website-design'),
    existing('woocommerce-web-design', 'E-commerce Website Design'),
    existing('responsive-web-design', 'Responsive Website Design'),
    detailed('landing-page-design'),
    existing('website-redesign'),
    detailed('ui-ux-design'),
  ],
  development: [
    existing('website-development'),
    detailed('react-nextjs-development'),
    existing('wordpress-development'),
    existing('woocommerce-development'),
    existing('laravel-development', 'Laravel & PHP Development'),
    detailed('nodejs-api-development'),
    detailed('ecommerce-development'),
    detailed('web-application-development'),
    existing('codeigniter-development'),
    existing('matx-development'),
  ],
  mobile: [
    existing('android-app-development', 'Android App Development'),
    existing('ios-app-development', 'iOS App Development'),
    detailed('flutter-app-development'),
    detailed('react-native-app-development'),
    detailed('cross-platform-app-development'),
    detailed('mobile-app-ui-ux-design'),
  ],
  software: [
    detailed('custom-software-development'),
    detailed('crm-erp-development'),
    detailed('ai-chatbot-development'),
    detailed('ai-automation-solutions'),
    detailed('saas-application-development'),
    detailed('business-process-automation'),
    detailed('api-third-party-integrations'),
  ],
  branding: [
    detailed('logo-brand-identity-design'),
    detailed('graphic-design'),
    detailed('social-media-creative-design'),
    detailed('marketing-campaign-creatives'),
    detailed('corporate-branding'),
    detailed('video-editing-motion-graphics'),
  ],
  support: [
    detailed('website-maintenance'),
    detailed('website-speed-optimization'),
    detailed('website-security-updates'),
    detailed('hosting-domain-management'),
    detailed('website-migration'),
    detailed('technical-support-bug-fixes'),
  ],
};

export type CatalogService = Omit<ServiceItem, 'category'> & {
  category: ServiceCategoryId;
  legacy: boolean;
  searchTitle?: string;
};

const existingServices = new Map(SERVICES.map((service) => [service.slug, service]));

function resolveService(entry: ExistingService | NewServiceRef, category: ServiceCategoryId): CatalogService {
  if ('isDetailedRef' in entry) {
    const detail = DETAILED_NEW_SERVICES[entry.slug];
    if (!detail) throw new Error(`Missing detailed service content for ${entry.slug}`);
    return {
      ...detail,
      id: detail.slug,
      category,
      legacy: false,
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

