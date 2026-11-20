import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CURRENCIES, PACKAGES, WEBSITE_PRICING, defaultPackage, type PackagedType, type Tier } from '../src/data/websitePricing.ts';
import { calculateEstimate } from '../src/utils/websiteEstimate.ts';
import { parseQuoteRequest } from '../src/utils/websiteQuote.ts';

test('each packaged tier requests a quote in all currencies until its rates are configured', () => {
  const config = structuredClone(WEBSITE_PRICING);
  for (const type of Object.keys(PACKAGES) as PackagedType[]) {
    for (const tier of Object.keys(PACKAGES[type]) as Tier[]) {
      config.packages[type][tier].rates = {};
      for (const currency of CURRENCIES) {
        const estimate = calculateEstimate({ ...defaultPackage(type), tier }, currency, config);
        assert.equal(estimate.includedPages, PACKAGES[type][tier].pages);
        assert.equal(estimate.includedProducts, PACKAGES[type][tier].products);
        assert.equal(estimate.oneTime, null);
        assert.equal(estimate.hasMonthly, false);
      }
    }
  }
});

test('calculates separate page, product, gateway, quantity, fixed, and monthly charges', () => {
  const config = structuredClone(WEBSITE_PRICING);
  config.packages.ecommerce.starter.rates = { INR: 100_000, AED: 60_000 };
  config.extraPages.ecommerce.INR = 50_000;
  config.extraProducts.INR = 500;
  config.addOns.languages.rates.INR = 20_000;
  config.addOns.reviews.rates.INR = 15_000;
  config.addOns.maintenance.rates.INR = 10_000;
  config.gateways.stripe.rates.INR = 25_000;
  const selection = { ...defaultPackage('ecommerce'), pages: 2, products: 30, gateways: ['razorpay', 'stripe'] as const, addOns: { languages: 3, reviews: 1, maintenance: 1, categories: 1 } };
  const estimate = calculateEstimate({ ...selection, gateways: [...selection.gateways] }, 'INR', config);
  assert.equal(estimate.extraPages, 2);
  assert.equal(estimate.extraProducts, 5);
  assert.equal(estimate.oneTime, 302_500);
  assert.equal(estimate.monthly, 10_000);
  assert.equal(estimate.lines.find((line) => line.id === 'gateway-razorpay')?.included, true);
  assert.equal(estimate.lines.some((line) => line.id === 'categories'), false);

  const aed = calculateEstimate({ ...selection, gateways: [...selection.gateways] }, 'AED', config);
  assert.equal(aed.lines.find((line) => line.id === 'base')?.amount, 60_000);
  assert.equal(aed.oneTime, null);
  assert.equal(aed.monthly, null);
});

test('switching packages applies the new allowances and avoids charging twice for included features', () => {
  const config = structuredClone(WEBSITE_PRICING);
  config.packages.wordpress.starter.rates.USD = 100_000;
  config.packages.wordpress.business.rates.USD = 150_000;
  config.extraPages.wordpress.USD = 5000;
  config.addOns.whatsapp.rates.USD = 3000;
  config.addOns.blog.rates.USD = 0;
  const selection = { ...defaultPackage('wordpress'), pages: 8, addOns: { whatsapp: 1, blog: 1, cms: 1 } };
  const starter = calculateEstimate(selection, 'USD', config);
  assert.equal(starter.extraPages, 3);
  assert.equal(starter.oneTime, 118_000);
  const business = calculateEstimate({ ...selection, tier: 'business' }, 'USD', config);
  assert.equal(business.extraPages, 0);
  assert.equal(business.oneTime, 150_000);
  assert.deepEqual(business.lines.map((line) => line.id), ['base']);
});

test('scoped gateways and complex applications remain quote-only', () => {
  const config = structuredClone(WEBSITE_PRICING);
  config.packages.ecommerce.advanced.rates.INR = 80_000;
  config.gateways.stripe.rates.INR = 0;
  assert.equal(calculateEstimate({ ...defaultPackage('ecommerce'), tier: 'advanced', gateways: ['stripe'] }, 'INR', config).oneTime, null);
  assert.equal(calculateEstimate({ type: 'application', scope: { project: 'ERP system', authentication: 'To be scoped', roles: [], modules: [] } }, 'INR', config).oneTime, null);
});

const request = {
  id: 'b30e6991-7427-4cbe-b9aa-efa1780ba15d',
  currency: 'INR',
  selection: defaultPackage('ecommerce'),
  contact: { name: 'Test Customer', company: '', email: 'Customer@Example.com ', phone: '+91 99999 00000', country: 'India', budget: '', timeline: 'Flexible', requirements: '' },
};

test('validates the quote payload and strips any client-submitted estimate', () => {
  const result = parseQuoteRequest({ ...request, estimate: { oneTime: 1 } });
  if (!('quote' in result)) assert.fail(result.error);
  assert.equal(result.quote.contact.email, 'customer@example.com');
  assert.equal('estimate' in result.quote, false);
  for (const selection of [
    { ...request.selection, pages: 501 },
    { ...request.selection, products: 10_001 },
    { ...request.selection, products: 2.5 },
    { ...request.selection, addOns: { languages: 21 } },
    { ...request.selection, addOns: { plugin: 1 } },
    { ...request.selection, gateways: ['stripe', 'stripe'] },
  ]) assert.ok('error' in parseQuoteRequest({ ...request, selection }));

  const invalid = parseQuoteRequest({ ...request, contact: { ...request.contact, name: '', email: 'bad', phone: '123', country: '' } });
  if (!('error' in invalid)) assert.fail('Invalid contact was accepted');
  assert.deepEqual(Object.keys(invalid.fields ?? {}).sort(), ['country', 'email', 'name', 'phone']);
});
