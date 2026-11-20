export const CURRENCIES = ['INR', 'AED', 'USD'] as const;
export type Currency = typeof CURRENCIES[number];
export type Rates = Partial<Record<Currency, number>>;

export const WEBSITE_TYPES = {
  static: 'Static Website Development',
  wordpress: 'WordPress Website Development',
  ecommerce: 'eCommerce Website Development',
  application: 'Custom Web Application Development',
} as const;
export type WebsiteType = keyof typeof WEBSITE_TYPES;
export type PackagedType = Exclude<WebsiteType, 'application'>;
export type Tier = 'starter' | 'business' | 'advanced';
export const LIMITS = { pages: 500, products: 10_000 } as const;

type AddOn = {
  name: string;
  description: string;
  types: readonly PackagedType[];
  method: 'fixed' | 'quantity' | 'monthly';
  limit: number;
  rates: Rates;
};

const allTypes = ['static', 'wordpress', 'ecommerce'] as const;
const websiteTypes = ['static', 'wordpress'] as const;
const storeTypes = ['ecommerce'] as const;

function addOn(name: string, description: string, types: AddOn['types'], method: AddOn['method'] = 'fixed', limit = 1): AddOn {
  return { name, description, types, method, limit, rates: {} };
}

export const ADD_ONS = {
  cms: addOn('Content management system (CMS)', 'Edit site content from your own dashboard.', websiteTypes),
  forms: addOn('Additional forms', 'Forms beyond the contact or inquiry forms listed in the package.', websiteTypes, 'quantity', 30),
  blog: addOn('Blog functionality', 'Publish and manage articles with category pages.', websiteTypes),
  languages: addOn('Additional languages', 'Localized layouts and language switching for each extra language. Translation is scoped separately.', allTypes, 'quantity', 20),
  whatsapp: addOn('WhatsApp integration', 'Add click-to-chat links for customer inquiries.', allTypes),
  liveChat: addOn('Live chat', 'Connect a live chat tool for customer support.', allTypes),
  booking: addOn('Appointment booking', 'Add a booking flow for services and time slots.', websiteTypes),
  seo: addOn('Advanced SEO', 'Technical checks, structure, and metadata beyond basic setup.', allTypes),
  analytics: addOn('Analytics setup', 'Configure event tracking and reporting for agreed conversions.', allTypes),
  crm: addOn('CRM integration', 'Connect website leads or orders to your CRM.', allTypes),
  maintenance: addOn('Website maintenance', 'Ongoing updates, monitoring, and support billed monthly.', allTypes, 'monthly'),
  plugin: addOn('Custom plugin requirements', 'Scope new plugin development beyond standard plugin setup.', ['wordpress']),
  categories: addOn('Product categories', 'Organize products into navigable collections.', storeTypes),
  variations: addOn('Product variations', 'Offer options such as color or size.', storeTypes),
  inventory: addOn('Inventory management', 'Track stock levels and availability.', storeTypes),
  shippingSetup: addOn('Shipping configuration', 'Define shipping zones and rules in the store.', storeTypes),
  shipping: addOn('Shipping carrier integrations', 'Connect carrier rates, labels, or tracking.', storeTypes),
  tax: addOn('Tax configuration', 'Configure store tax settings using your approved tax rules.', storeTypes),
  coupons: addOn('Coupon functionality', 'Apply discount rules and promotions at checkout.', storeTypes),
  accounts: addOn('Customer accounts', 'Give customers access to profiles and order history.', storeTypes),
  wishlist: addOn('Wishlist', 'Let customers save products for later.', storeTypes),
  reviews: addOn('Product reviews', 'Collect and moderate customer reviews.', storeTypes),
  recovery: addOn('Abandoned cart recovery', 'Set up reminders for unfinished checkouts.', storeTypes),
  multiCurrency: addOn('Multi-currency support', 'Configure selling currencies and compatible checkout methods.', storeTypes),
  marketplace: addOn('Marketplace integrations', 'Connect an external marketplace for products or orders.', storeTypes),
};
export type AddOnId = keyof typeof ADD_ONS;

export const GATEWAYS = {
  razorpay: { name: 'Razorpay', rates: {} as Rates },
  stripe: { name: 'Stripe', rates: {} as Rates },
  paypal: { name: 'PayPal', rates: {} as Rates },
  paytabs: { name: 'PayTabs', rates: {} as Rates },
};
export type GatewayId = keyof typeof GATEWAYS;

export interface WebsitePackage {
  name: string;
  pages: number;
  products: number;
  /** null means payment methods are confirmed after scoping. */
  includedGateways: number | null;
  features: readonly string[];
  includedAddOns: readonly AddOnId[];
  rates: Rates;
  delivery?: string;
  revisions?: string;
  support?: string;
}

export const PACKAGES: Record<PackagedType, Record<Tier, WebsitePackage>> = {
  static: {
    starter: {
      name: 'Starter Static Website',
      pages: 3,
      products: 0,
      includedGateways: 0,
      rates: {},
      includedAddOns: [],
      features: [
        'Responsive, mobile-friendly design',
        'Basic contact form',
        'Basic SEO setup',
        'Social media links',
        'Deployment configuration',
      ],
    },
    business: {
      name: 'Business Static Website',
      pages: 7,
      products: 0,
      includedGateways: 0,
      rates: {},
      includedAddOns: [],
      features: [
        'Responsive custom design',
        'Contact and inquiry forms',
        'Basic SEO setup',
        'Performance optimization',
        'Deployment configuration',
      ],
    },
    advanced: {
      name: 'Advanced Static Website',
      pages: 15,
      products: 0,
      includedGateways: 0,
      rates: {},
      includedAddOns: [],
      features: [
        'Advanced responsive design',
        'Custom sections',
        'Animations and interactions',
        'SEO setup',
        'Performance optimization',
      ],
    },
  },
  wordpress: {
    starter: {
      name: 'WordPress Starter',
      pages: 5,
      products: 0,
      includedGateways: 0,
      rates: {},
      includedAddOns: ['cms'],
      features: [
        'WordPress CMS and editable content',
        'Responsive design',
        'Admin dashboard',
        'Contact form',
        'Basic SEO setup',
      ],
    },
    business: {
      name: 'WordPress Business',
      pages: 10,
      products: 0,
      includedGateways: 0,
      rates: {},
      includedAddOns: ['cms', 'blog', 'whatsapp'],
      features: [
        'WordPress CMS',
        'Professional business design',
        'Contact forms',
        'Blog functionality',
        'WhatsApp integration',
        'Basic SEO setup',
        'Performance optimization',
      ],
    },
    advanced: {
      name: 'WordPress Advanced',
      pages: 20,
      products: 0,
      includedGateways: 0,
      rates: {},
      includedAddOns: ['cms', 'blog', 'seo'],
      features: [
        'Advanced WordPress CMS and custom layouts',
        'Blog management',
        'Advanced forms',
        'Plugin integrations',
        'Advanced SEO configuration',
        'Performance optimization',
        'Website security configuration',
      ],
    },
  },
  ecommerce: {
    starter: {
      name: 'Starter eCommerce',
      pages: 0,
      products: 25,
      includedGateways: 1,
      rates: {},
      includedAddOns: ['categories'],
      features: [
        'Responsive storefront and product categories',
        'Shopping cart and checkout',
        'Basic order management',
        'One supported payment gateway',
      ],
    },
    business: {
      name: 'Business eCommerce',
      pages: 0,
      products: 100,
      includedGateways: 1,
      rates: {},
      includedAddOns: ['categories', 'variations', 'inventory', 'coupons', 'shippingSetup', 'accounts'],
      features: [
        'Product categories and variations',
        'Inventory management',
        'Coupon management',
        'Shipping configuration',
        'One supported payment gateway',
        'Order dashboard and customer accounts',
      ],
    },
    advanced: {
      name: 'Advanced eCommerce',
      pages: 0,
      products: 500,
      includedGateways: null,
      rates: {},
      includedAddOns: ['categories', 'variations', 'inventory', 'shippingSetup', 'shipping', 'accounts', 'analytics', 'coupons'],
      features: [
        'Advanced product catalog and inventory',
        'Multiple payment methods scoped in your quote',
        'Shipping integrations',
        'Advanced checkout configuration',
        'Customer management',
        'Analytics configuration',
        'Advanced promotions and coupons',
      ],
    },
  },
};

export const PROJECT_TYPES = ['CRM system', 'ERP system', 'SaaS application', 'Booking system', 'Customer portal', 'Admin dashboard', 'Business automation platform', 'API-based application', 'Custom eCommerce application'] as const;
export const APP_MODULES = ['Admin dashboard', 'API integrations', 'Payment integration', 'Reporting and analytics', 'Third-party integrations', 'Workflow automations', 'Notifications'] as const;
export const AUTH_OPTIONS = ['To be scoped', 'Email and password', 'Multi-factor authentication', 'Single sign-on', 'Public access'] as const;
export const USER_ROLES = ['Administrators', 'Staff', 'Customers', 'Partners', 'Other roles'] as const;
export const TIMELINES = ['Flexible', 'Within 1 month', '1–3 months', '3–6 months', 'More than 6 months'] as const;

export type ApplicationScope = {
  project: typeof PROJECT_TYPES[number];
  authentication: typeof AUTH_OPTIONS[number];
  roles: (typeof USER_ROLES[number])[];
  modules: (typeof APP_MODULES[number])[];
};

export type PackagedSelection = {
  type: PackagedType;
  tier: Tier;
  pages: number;
  products: number;
  addOns: Partial<Record<AddOnId, number>>;
  gateways: GatewayId[];
};

export type Selection = PackagedSelection | { type: 'application'; scope: ApplicationScope };

export interface PricingConfig {
  packages: typeof PACKAGES;
  addOns: typeof ADD_ONS;
  gateways: typeof GATEWAYS;
  extraPages: Record<PackagedType, Rates>;
  extraProducts: Rates;
}

// Amounts are in minor units for each independently configured currency.
// An absent rate means Price on Request. Set a rate to 0 only for a free item.
export const WEBSITE_PRICING: PricingConfig = {
  packages: PACKAGES,
  addOns: ADD_ONS,
  gateways: GATEWAYS,
  extraPages: { static: {}, wordpress: {}, ecommerce: {} },
  extraProducts: {},
};

export function defaultPackage(type: PackagedType): PackagedSelection {
  return { type, tier: 'starter', pages: type === 'ecommerce' ? 0 : PACKAGES[type].starter.pages, products: PACKAGES[type].starter.products, addOns: {}, gateways: [] };
}

export function availableAddOns(type: PackagedType) {
  return (Object.entries(ADD_ONS) as [AddOnId, AddOn][]).filter(([, item]) => item.types.includes(type));
}

export function formatMoney(amount: number, currency: Currency) {
  const locale = currency === 'INR' ? 'en-IN' : currency === 'AED' ? 'en-AE' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: amount % 100 === 0 ? 0 : 2 }).format(amount / 100);
}
