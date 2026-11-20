import {
  ADD_ONS, APP_MODULES, AUTH_OPTIONS, CURRENCIES, GATEWAYS, LIMITS, PACKAGES, PROJECT_TYPES, TIMELINES, USER_ROLES,
  type AddOnId, type Currency, type GatewayId, type Selection, type Tier,
} from '../data/websitePricing.ts';

export const QUOTE_API = '/api/website-quotes';
export const CONTACT_LIMITS = { name: 120, company: 160, email: 254, phone: 32, country: 100, budget: 100, requirements: 3000 } as const;

export type QuoteContact = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  budget: string;
  timeline: string;
  requirements: string;
};

export type QuoteRequest = { id: string; currency: Currency; selection: Selection; contact: QuoteContact };
export type ContactErrors = Partial<Record<keyof QuoteContact, string>>;

export function validateContact(contact: QuoteContact): ContactErrors {
  const errors: ContactErrors = {};
  if (!contact.name) errors.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errors.email = 'Enter a valid email address.';
  if (!/^\+?[\d().\s-]+$/.test(contact.phone) || !/^\d{7,15}$/.test(contact.phone.replace(/\D/g, ''))) {
    errors.phone = 'Enter a phone number with 7 to 15 digits.';
  }
  if (!contact.country) errors.country = 'Enter your country.';
  for (const field of Object.keys(CONTACT_LIMITS) as (keyof typeof CONTACT_LIMITS)[]) {
    if (contact[field].length > CONTACT_LIMITS[field]) errors[field] = `Use ${CONTACT_LIMITS[field]} characters or fewer.`;
  }
  if (contact.timeline && !isOneOf(TIMELINES, contact.timeline)) errors.timeline = 'Choose an available timeline.';
  return errors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isOneOf<T extends string>(options: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && options.some((option) => option === value);
}

function isList<T extends string>(options: readonly T[], value: unknown): value is T[] {
  return Array.isArray(value) && value.length <= options.length && new Set(value).size === value.length && value.every((item) => isOneOf(options, item));
}

function isQuantity(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function parseSelection(value: unknown): Selection | null {
  if (!isRecord(value)) return null;
  const { type, tier, pages, products, addOns, gateways, scope } = value;
  if (type === 'application') {
    if (!isRecord(scope)) return null;
    const { project, authentication, roles, modules } = scope;
    if (!isOneOf(PROJECT_TYPES, project) || !isOneOf(AUTH_OPTIONS, authentication) || !isList(USER_ROLES, roles) || !isList(APP_MODULES, modules)) return null;
    return { type, scope: { project, authentication, roles, modules } };
  }

  if (type !== 'static' && type !== 'wordpress' && type !== 'ecommerce') return null;
  const tiers = Object.keys(PACKAGES[type]) as Tier[];
  if (!isOneOf(tiers, tier) || !isRecord(addOns) || !isList(Object.keys(GATEWAYS) as GatewayId[], gateways)) return null;
  if (!isQuantity(pages, type === 'ecommerce' ? 0 : 1, LIMITS.pages)) return null;
  if (!isQuantity(products, type === 'ecommerce' ? 1 : 0, type === 'ecommerce' ? LIMITS.products : 0)) return null;

  const options: Partial<Record<AddOnId, number>> = {};
  for (const [id, value] of Object.entries(addOns)) {
    if (!Object.hasOwn(ADD_ONS, id)) return null;
    const key = id as AddOnId;
    const item = ADD_ONS[key];
    if (!item.types.includes(type) || !isQuantity(value, 1, item.limit)) return null;
    if (!PACKAGES[type][tier].includedAddOns.includes(key)) options[key] = value;
  }
  return { type, tier, pages, products, addOns: options, gateways };
}

export function parseQuoteRequest(body: unknown): { quote: QuoteRequest } | { error: string; fields?: ContactErrors } {
  if (!isRecord(body)) return { error: 'Enter a valid quotation request.' };
  const { id, currency, contact, selection } = body;
  if (typeof id !== 'string' || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/.test(id) || !isOneOf(CURRENCIES, currency) || !isRecord(contact)) {
    return { error: 'Enter a valid quotation request.' };
  }

  const validSelection = parseSelection(selection);
  if (!validSelection) return { error: 'Review the selected package, quantities, and features.' };

  const fields = [...Object.keys(CONTACT_LIMITS), 'timeline'] as (keyof QuoteContact)[];
  const validContact = {} as QuoteContact;
  for (const field of fields) {
    const value = contact[field];
    if (typeof value !== 'string') return { error: 'Enter valid contact and project details.' };
    validContact[field] = value.trim();
  }
  validContact.email = validContact.email.toLowerCase();
  const errors = validateContact(validContact);
  if (Object.keys(errors).length) return { error: 'Review your contact and project details.', fields: errors };
  return { quote: { id, currency, selection: validSelection, contact: validContact } };
}
