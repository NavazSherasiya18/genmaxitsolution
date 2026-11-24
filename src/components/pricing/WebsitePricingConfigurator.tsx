import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Layers3, LayoutTemplate, Rocket } from 'lucide-react';
import {
  APP_MODULES, AUTH_OPTIONS, CURRENCIES, GATEWAYS, LIMITS, PACKAGES, PROJECT_TYPES, TIMELINES, USER_ROLES, WEBSITE_TYPES,
  availableAddOns, defaultPackage, type ApplicationScope, type Currency, type GatewayId,
  type PackagedSelection, type PackagedType, type Selection, type Tier, type WebsiteType,
} from '../../data/websitePricing';
import { CONTACT_LIMITS } from '../../utils/websiteQuote';
import { EstimateSummary, inputStyle, priceCard, priceText, primaryButton } from './EstimateSummary';
import { WebsiteQuoteDialog } from './WebsiteQuoteDialog';

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-cyan-400';
const checkboxStyle = 'mt-0.5 size-4 shrink-0 accent-indigo-600 dark:accent-cyan-400';
const accent = 'text-indigo-700 dark:text-cyan-300';
const tierIcons = { starter: LayoutTemplate, business: Layers3, advanced: Rocket } satisfies Record<Tier, typeof Rocket>;

function toggleItem<T>(items: T[], item: T, checked: boolean): T[] {
  return checked ? [...items, item] : items.filter((selected) => selected !== item);
}

function QuantityField({ label, value, min = 0, max, onChange }: {
  label: string;
  value: number;
  min?: number;
  max: number;
  onChange: (quantity: number) => void;
}) {
  const [cleared, setCleared] = useState(false);
  return (
    <label className="grid min-w-0 gap-1.5 text-sm font-medium">
      {label}
      <input
        type="number"
        inputMode="numeric"
        className={inputStyle}
        min={min}
        max={max}
        step={1}
        value={cleared ? '' : value}
        onChange={(event) => {
          const next = event.currentTarget.valueAsNumber;
          if (!Number.isFinite(next)) {
            setCleared(true);
            return;
          }
          setCleared(false);
          onChange(Math.min(max, Math.max(min, Math.trunc(next))));
        }}
        onBlur={() => setCleared(false)}
      />
    </label>
  );
}

function PackageCards({ selection, currency, onSelect }: { selection: PackagedSelection; currency: Currency; onSelect: (tier: Tier) => void }) {
  const options = availableAddOns(selection.type);
  const packages = Object.entries(PACKAGES[selection.type]) as [Tier, typeof PACKAGES.static.starter][];
  return (
    <div className="mt-8">
      <h3 className="mb-4 font-heading text-xl font-bold text-slate-900 dark:text-white">Choose a package</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {packages.map(([tier, pkg]) => {
          const isSelected = tier === selection.tier;
          const rate = pkg.rates[currency];
          const Icon = tierIcons[tier];
          return (
            <article key={tier} className={`${priceCard} genmax-card-orbit flex flex-col p-5 sm:p-6 ${isSelected ? 'genmax-card-emphasis' : ''}`}>
              <span className="genmax-card-icon mb-4" aria-hidden="true">
                <Icon className="size-5" />
              </span>
              <h4 className="font-heading text-xl font-bold text-slate-900 dark:text-white">{pkg.name}</h4>
              <div className="genmax-card-divider my-3 border-b pb-4">
                <p className="genmax-price break-words font-heading text-2xl font-bold">{rate === undefined ? 'Request Pricing' : priceText(rate, currency)}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{rate !== undefined ? `Starting price · ${currency}` : currency}</p>
              </div>
              <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                {selection.type === 'ecommerce' ? `Up to ${pkg.products} products` : selection.type === 'static' && tier === 'starter' ? '1–3 pages' : `Up to ${pkg.pages} pages`}
              </p>
              {selection.type === 'ecommerce' && <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">{pkg.pages ? `Up to ${pkg.pages} informational pages included` : 'Informational pages scoped separately'}</p>}
              <ul className="mb-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2"><CheckCircle2 aria-hidden="true" className={`mt-0.5 size-4 shrink-0 ${accent}`} /><span>{feature}</span></li>
                ))}
              </ul>
              <div className="mt-auto">
                <dl className="genmax-card-divider grid gap-2 border-t pt-4 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex flex-wrap justify-between gap-x-3"><dt>Estimated delivery</dt><dd className="font-medium">{pkg.delivery ?? 'Confirmed in quote'}</dd></div>
                  <div className="flex flex-wrap justify-between gap-x-3"><dt>Revision policy</dt><dd className="font-medium">{pkg.revisions ?? 'Confirmed in quote'}</dd></div>
                  <div className="flex flex-wrap justify-between gap-x-3"><dt>Support period</dt><dd className="font-medium">{pkg.support ?? 'Confirmed in quote'}</dd></div>
                </dl>
                <details className="genmax-card-divider group mt-3 border-b">
                  <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-md text-sm font-semibold ${accent} ${focusRing}`}>
                    Optional add-ons <ChevronDown aria-hidden="true" className="size-4 shrink-0 group-open:rotate-180 motion-safe:transition-transform" />
                  </summary>
                  <p className="pb-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {['Extra pages', ...(selection.type === 'ecommerce' ? ['Extra products'] : []), 'Payment gateways', ...options.filter(([id]) => !pkg.includedAddOns.includes(id)).map(([, item]) => item.name)].join(' · ')}
                  </p>
                </details>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Select ${pkg.name}`}
                  onClick={() => onSelect(tier)}
                  className={`${isSelected ? primaryButton : `min-h-11 rounded-xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700/80 border border-indigo-400/25 ${focusRing}`} mt-4 w-full`}
                >
                  {isSelected ? 'Selected Plan' : 'Select Plan'}
                  {isSelected ? <CheckCircle2 aria-hidden="true" className="inline size-4" /> : <ArrowRight aria-hidden="true" className="ml-1 inline size-4" />}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PackageRequirements({ selection, onChange }: { selection: PackagedSelection; onChange: (selection: PackagedSelection) => void }) {
  const pkg = PACKAGES[selection.type][selection.tier];
  const store = selection.type === 'ecommerce';
  const gatewayAllowance = pkg.includedGateways === null
    ? 'Payment methods are scoped with this package.'
    : pkg.includedGateways > 0
      ? `This package includes ${pkg.includedGateways === 1 ? 'one supported gateway' : `${pkg.includedGateways} supported gateways`}. Selected gateways are included in the order chosen.`
      : 'Gateway integration is optional for this package.';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <QuantityField label={store ? 'Informational pages' : 'Total website pages'} min={store ? 0 : 1} max={LIMITS.pages} value={selection.pages} onChange={(pages) => onChange({ ...selection, pages })} />
        {store && <QuantityField label="Number of products" min={1} max={LIMITS.products} value={selection.products} onChange={(products) => onChange({ ...selection, products })} />}
      </div>

      <fieldset className="min-w-0 border-t border-slate-100 pt-4 dark:border-slate-800">
        <legend className="pr-3 font-heading font-bold text-slate-900 dark:text-white">Payment gateways</legend>
        <p className="mb-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{gatewayAllowance} Integration covers configuration and test payments. Provider approval, transaction fees, paid plugins, and third-party charges are separate.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(GATEWAYS) as GatewayId[]).map((id) => (
            <label key={id} className="genmax-card genmax-card-soft flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm">
              <input className={checkboxStyle} type="checkbox" checked={selection.gateways.includes(id)} onChange={(event) => onChange({ ...selection, gateways: toggleItem(selection.gateways, id, event.target.checked) })} />
              {GATEWAYS[id].name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="min-w-0 border-t border-slate-100 pt-4 dark:border-slate-800">
        <legend className="pr-3 font-heading font-bold text-slate-900 dark:text-white">Features & add-ons</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {availableAddOns(selection.type).map(([id, item]) => {
            const included = pkg.includedAddOns.includes(id);
            const quantity = selection.addOns[id] ?? 0;
            function setQuantity(amount: number) {
              const addOns = { ...selection.addOns };
              if (amount) addOns[id] = amount; else delete addOns[id];
              onChange({ ...selection, addOns });
            }
            return (
              <div key={id} className="genmax-card genmax-card-soft min-w-0 rounded-xl px-3 box-zoom-sm">
                <label className="flex min-h-11 items-start gap-2.5 py-3">
                  <input className={checkboxStyle} type="checkbox" checked={included || quantity > 0} disabled={included} onChange={(event) => setQuantity(event.target.checked ? 1 : 0)} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">{item.name}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-600 dark:text-slate-400">{included ? 'Included in this package' : item.description}</span>
                  </span>
                </label>
                {!included && quantity > 0 && item.method === 'quantity' && (
                  <div className="mb-3 ml-6.5">
                    <QuantityField label={`Quantity · ${item.name}`} min={1} max={item.limit} value={quantity} onChange={setQuantity} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

function ScopeChecks<T extends string>({ label, options, selected, onChange }: {
  label: string; options: readonly T[]; selected: T[]; onChange: (values: T[]) => void;
}) {
  return (
    <fieldset className="min-w-0 border-t border-slate-100 pt-3 dark:border-slate-800">
      <legend className="pr-3 font-heading font-bold text-slate-900 dark:text-white">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="genmax-card genmax-card-soft flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-2 text-sm">
            <input type="checkbox" className={checkboxStyle} checked={selected.includes(option)} onChange={(event) => onChange(toggleItem(selected, option, event.target.checked))} />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function WebsitePricingConfigurator() {
  const [type, setType] = useState<WebsiteType>('static');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [packages, setPackages] = useState<Record<PackagedType, PackagedSelection>>(() => ({ static: defaultPackage('static'), wordpress: defaultPackage('wordpress'), ecommerce: defaultPackage('ecommerce') }));
  const [scope, setScope] = useState<ApplicationScope>({ project: PROJECT_TYPES[0], authentication: AUTH_OPTIONS[0], roles: [], modules: [] });
  const [budgets, setBudgets] = useState<Partial<Record<Currency, string>>>({});
  const [timeline, setTimeline] = useState('');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const requirements = useRef<HTMLHeadingElement>(null);
  const selection: Selection = type === 'application' ? { type, scope } : packages[type];
  const budget = budgets[currency] ?? '';

  function updatePackage(next: PackagedSelection) {
    setPackages((current) => ({ ...current, [next.type]: next }));
  }

  function selectTier(tier: Tier) {
    if (selection.type === 'application') return;
    updatePackage({ ...selection, tier });
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    requirements.current?.focus({ preventScroll: true });
    requirements.current?.scrollIntoView({ block: 'start', behavior: motion });
  }

  return (
    <section id="website-development-pricing" aria-labelledby="website-pricing-title" className="scroll-mt-24 border-y border-slate-200 py-14 sm:py-20 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 id="website-pricing-title" className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Website Development Plans & Pricing</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">Choose the right website solution for your business. Customize pages, features, integrations, and functionality to match your requirements and budget.</p>
        </div>
        <div className="mt-7 grid items-end gap-4 lg:grid-cols-[minmax(0,1fr)_9rem]">
          <fieldset className="min-w-0">
            <legend className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Website type</legend>
            <div className="genmax-card genmax-card-soft grid grid-cols-2 gap-1.5 rounded-2xl p-1.5 md:grid-cols-4">
              {(Object.keys(WEBSITE_TYPES) as WebsiteType[]).map((key) => (
                <button key={key} type="button" aria-pressed={key === type} onClick={() => setType(key)} className={`min-h-12 rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-snug transition-all cursor-pointer sm:px-3 sm:text-sm ${focusRing} ${key === type ? 'genmax-action text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                  {WEBSITE_TYPES[key]}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="grid gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            Quote currency
            <select className={inputStyle} value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
              {CURRENCIES.map((code) => <option key={code}>{code}</option>)}
            </select>
          </label>
        </div>

        {selection.type !== 'application' && <PackageCards key={selection.type} selection={selection} currency={currency} onSelect={selectTier} />}

        <div className="mt-8 grid items-start gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-6">
          <div className={`${priceCard} p-4 sm:p-6`}>
            <h3 tabIndex={-1} ref={requirements} className={`mb-5 scroll-mt-28 rounded font-heading text-xl font-bold text-slate-900 dark:text-white ${focusRing}`}>
              {selection.type === 'application' ? 'Define your application scope' : 'Configure your website'}
            </h3>
            {selection.type !== 'application' ? (
              <PackageRequirements key={selection.type} selection={selection} onChange={updatePackage} />
            ) : (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium">
                    Project type
                    <select className={inputStyle} value={scope.project} onChange={(event) => setScope({ ...scope, project: event.target.value as ApplicationScope['project'] })}>
                      {PROJECT_TYPES.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Authentication
                    <select className={inputStyle} value={scope.authentication} onChange={(event) => setScope({ ...scope, authentication: event.target.value as ApplicationScope['authentication'] })}>
                      {AUTH_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                </div>
                <ScopeChecks label="Required modules and integrations" options={APP_MODULES} selected={scope.modules} onChange={(modules) => setScope({ ...scope, modules })} />
                <ScopeChecks label="User roles" options={USER_ROLES} selected={scope.roles} onChange={(roles) => setScope({ ...scope, roles })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium">
                    Expected timeline
                    <select className={inputStyle} value={timeline} onChange={(event) => setTimeline(event.target.value)}>
                      <option value="">Choose a timeline</option>
                      {TIMELINES.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Budget range ({currency})
                    <input className={inputStyle} maxLength={CONTACT_LIMITS.budget} value={budget} onChange={(event) => setBudgets({ ...budgets, [currency]: event.target.value })} />
                  </label>
                </div>
              </div>
            )}
          </div>
          <EstimateSummary selection={selection} currency={currency} onRequest={() => setQuoteOpen(true)} />
        </div>
      </div>
      {quoteOpen && <WebsiteQuoteDialog selection={selection} currency={currency} timeline={type === 'application' ? timeline : ''} budget={type === 'application' ? budget : ''} onClose={() => setQuoteOpen(false)} />}
    </section>
  );
}
