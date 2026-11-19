import { SERVICE_CATALOG, servicePath } from './servicesData.ts';
import { COMPANY_DETAILS } from './websiteContent.ts';

export const SITE_ORIGIN = 'https://genmaxitsolution.vercel.app';

export const SERVICE_SEO = new Map([
  ['/services', {
    title: `Digital Marketing, Design & Technology Services | ${COMPANY_DETAILS.name}`,
    description: 'Explore SEO, paid advertising, web design, development, mobile apps, software and AI, branding, and technical support from Genmax IT Solution.',
  }] as const,
  ...SERVICE_CATALOG.map((service) => [servicePath(service.slug), {
    title: `${service.title} | ${COMPANY_DETAILS.name}`,
    description: service.shortDescription,
  }] as const),
]);
