import { WEBSITE_PRICING, type Currency, type PricingConfig, type Selection } from '../data/websitePricing.ts';

export type PriceLine = {
  id: string;
  label: string;
  quantity: number;
  amount: number | null;
  billing: 'once' | 'monthly';
  included?: true;
};

function amountFor(rate: number | undefined, quantity: number): number | null {
  if (rate === undefined || !Number.isSafeInteger(rate) || rate < 0) return null;
  const total = rate * quantity;
  return Number.isSafeInteger(total) ? total : null;
}

function totalFor(lines: PriceLine[], billing: PriceLine['billing']): number | null {
  let total = 0;
  for (const line of lines) {
    if (line.billing !== billing) continue;
    if (line.amount === null) return null;
    total += line.amount;
  }
  return Number.isSafeInteger(total) ? total : null;
}

export function calculateEstimate(selection: Selection, currency: Currency, config: PricingConfig = WEBSITE_PRICING) {
  const lines: PriceLine[] = [];
  let includedPages = 0;
  let includedProducts = 0;
  let extraPages = 0;
  let extraProducts = 0;

  if (selection.type === 'application') {
    return { lines, includedPages, includedProducts, extraPages, extraProducts, oneTime: null, monthly: null, hasMonthly: false };
  }

  const pkg = config.packages[selection.type][selection.tier];
  includedPages = pkg.pages;
  includedProducts = pkg.products;
  extraPages = Math.max(0, selection.pages - includedPages);
  extraProducts = Math.max(0, selection.products - includedProducts);
  lines.push({ id: 'base', label: 'Base package', quantity: 1, amount: amountFor(pkg.rates[currency], 1), billing: 'once' });
  if (extraPages) lines.push({ id: 'pages', label: 'Additional pages', quantity: extraPages, amount: amountFor(config.extraPages[selection.type][currency], extraPages), billing: 'once' });
  if (extraProducts) lines.push({ id: 'products', label: 'Additional products', quantity: extraProducts, amount: amountFor(config.extraProducts[currency], extraProducts), billing: 'once' });

  for (const id of Object.keys(config.addOns) as (keyof typeof config.addOns)[]) {
    const item = config.addOns[id];
    const quantity = selection.addOns[id] ?? 0;
    if (!quantity || !item.types.includes(selection.type) || pkg.includedAddOns.includes(id)) continue;
    lines.push({ id, label: item.name, quantity, amount: amountFor(item.rates[currency], quantity), billing: item.method === 'monthly' ? 'monthly' : 'once' });
  }

  for (const [index, gateway] of selection.gateways.entries()) {
    const item = config.gateways[gateway];
    const included = pkg.includedGateways !== null && index < pkg.includedGateways;
    lines.push({
      id: `gateway-${gateway}`,
      label: `${item.name} integration`,
      quantity: 1,
      amount: included ? 0 : pkg.includedGateways === null ? null : amountFor(item.rates[currency], 1),
      billing: 'once',
      ...(included && { included: true }),
    });
  }

  return {
    lines, includedPages, includedProducts, extraPages, extraProducts,
    oneTime: totalFor(lines, 'once'),
    monthly: totalFor(lines, 'monthly'),
    hasMonthly: lines.some((line) => line.billing === 'monthly'),
  };
}
