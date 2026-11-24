import { ClipboardList } from 'lucide-react';
import { PACKAGES, WEBSITE_TYPES, formatMoney, type Currency, type Selection } from '../../data/websitePricing';
import { calculateEstimate } from '../../utils/websiteEstimate';

export const priceCard = 'genmax-card min-w-0 rounded-2xl';
export const inputStyle = 'min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-2 focus:outline-indigo-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:outline-cyan-400';
export const primaryButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl genmax-action px-5 py-3 text-center text-sm font-semibold text-white shadow-md hover:opacity-95 motion-safe:transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-cyan-400 disabled:cursor-wait disabled:opacity-60';

export function priceText(amount: number | null | undefined, currency: Currency) {
  return amount == null ? 'Price on Request' : formatMoney(amount, currency);
}

export function EstimateSummary({ selection, currency, onRequest }: { selection: Selection; currency: Currency; onRequest?: () => void }) {
  const estimate = calculateEstimate(selection, currency);
  const custom = selection.type === 'application';
  const plan = custom ? null : PACKAGES[selection.type][selection.tier];
  const store = selection.type === 'ecommerce';

  return (
    <div className={`${priceCard} box-zoom-sm self-start p-4 sm:p-6 ${onRequest ? 'lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto' : ''}`}>
      <div className="mb-4 flex items-center gap-2">
        <ClipboardList aria-hidden="true" className="size-5 shrink-0 text-indigo-600 dark:text-cyan-400" />
        <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Your project summary</h3>
      </div>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{WEBSITE_TYPES[selection.type]}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{custom ? selection.scope.project : plan?.name}</p>

      {custom ? (
        <dl className="my-4 grid gap-2 text-sm">
          <div><dt className="font-semibold">Authentication</dt><dd className="text-slate-600 dark:text-slate-400">{selection.scope.authentication}</dd></div>
          <div><dt className="font-semibold">User roles</dt><dd className="text-slate-600 dark:text-slate-400">{selection.scope.roles.join(', ') || 'To be scoped'}</dd></div>
          <div><dt className="font-semibold">Selected modules</dt><dd className="text-slate-600 dark:text-slate-400">{selection.scope.modules.join(', ') || 'To be scoped'}</dd></div>
        </dl>
      ) : (
        <>
          <dl className="genmax-card genmax-card-soft my-4 grid grid-cols-2 gap-3 rounded-xl p-3 text-xs">
            <div><dt className="text-slate-600 dark:text-slate-400">{store ? 'Informational pages' : 'Website pages'}</dt><dd className="mt-1 font-semibold">{selection.pages} requested</dd></div>
            <div><dt className="text-slate-600 dark:text-slate-400">Page allowance</dt><dd className="mt-1 font-semibold">{estimate.includedPages} included · {estimate.extraPages} extra</dd></div>
            {store && <>
              <div><dt className="text-slate-600 dark:text-slate-400">Products</dt><dd className="mt-1 font-semibold">{selection.products} requested</dd></div>
              <div><dt className="text-slate-600 dark:text-slate-400">Product allowance</dt><dd className="mt-1 font-semibold">{estimate.includedProducts} included · {estimate.extraProducts} extra</dd></div>
            </>}
          </dl>
          <dl className="space-y-2.5 text-sm">
            {estimate.lines.map((line) => (
              <div key={line.id} className="flex flex-wrap justify-between gap-x-3 gap-y-0.5">
                <dt className="text-slate-600 dark:text-slate-400">{line.label}{line.quantity > 1 && ` × ${line.quantity}`}</dt>
                <dd className="ml-auto text-right font-medium">
                  {line.included ? 'Included' : <span className="genmax-price">{priceText(line.amount, currency)}</span>}
                  {line.billing === 'monthly' && ' / month'}
                </dd>
              </div>
            ))}
          </dl>
          {plan?.delivery && <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">Estimated delivery <strong>{plan.delivery}</strong></p>}
        </>
      )}

      <div aria-live={onRequest ? 'polite' : undefined} aria-atomic="true" className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{custom ? `Quotation currency · ${currency}` : `One-time development estimate · ${currency}`}</p>
        <p className="genmax-price mt-1 break-words font-heading text-xl font-bold">{custom ? 'Custom Pricing — Request a Quote' : priceText(estimate.oneTime, currency)}</p>
        {estimate.hasMonthly && <p className="mt-2 text-sm font-semibold">Monthly maintenance · <span className="genmax-price">{priceText(estimate.monthly, currency)}</span></p>}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">Applicable taxes, provider fees, and paid third-party tools are separate from development and maintenance.</p>
      {onRequest && (
        <button type="button" className={`${primaryButton} mt-5 w-full`} onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          onRequest();
        }}>Request Custom Quote</button>
      )}
    </div>
  );
}
