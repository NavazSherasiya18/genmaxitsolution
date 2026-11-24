import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, LoaderCircle, X } from 'lucide-react';
import { TIMELINES, type Currency, type Selection } from '../../data/websitePricing';
import { CONTACT_LIMITS, QUOTE_API, validateContact, type ContactErrors, type QuoteContact } from '../../utils/websiteQuote';
import { EstimateSummary, inputStyle, primaryButton } from './EstimateSummary';

const fields = [
  { id: 'name', name: 'Full Name', type: 'text', autoComplete: 'name', required: true },
  { id: 'company', name: 'Company Name', type: 'text', autoComplete: 'organization', required: false },
  { id: 'email', name: 'Email Address', type: 'email', autoComplete: 'email', required: true },
  { id: 'phone', name: 'Phone Number', type: 'tel', autoComplete: 'tel', required: true },
  { id: 'country', name: 'Country', type: 'text', autoComplete: 'country-name', required: true },
] as const;

export function WebsiteQuoteDialog({ selection, currency, budget, timeline, onClose }: {
  selection: Selection;
  currency: Currency;
  budget: string;
  timeline: string;
  onClose: () => void;
}) {
  const modal = useRef<HTMLDialogElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const request = useRef<{ snapshot: string; id: string } | null>(null);
  const busy = useRef(false);
  const id = useId();
  const [contact, setContact] = useState<QuoteContact>({ name: '', company: '', email: '', phone: '', country: '', budget, timeline, requirements: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState('');

  useEffect(() => {
    const dialog = modal.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  useEffect(() => {
    if (receipt || message) statusRef.current?.focus();
  }, [receipt, message]);

  function change(field: keyof QuoteContact, value: string) {
    setContact((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function close() {
    if (busy.current) return;
    modal.current?.close();
    onClose();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    setMessage('');

    const normalized = Object.fromEntries(Object.entries(contact).map(([key, value]) => [key, value.trim()])) as QuoteContact;
    const problems = validateContact(normalized);
    setErrors(problems);
    const first = Object.keys(problems)[0];
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }

    busy.current = true;
    setSubmitting(true);
    try {
      const snapshot = JSON.stringify(normalized);
      if (request.current?.snapshot !== snapshot) request.current = { snapshot, id: crypto.randomUUID() };
      const quoteId = request.current.id;
      const response = await fetch(QUOTE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: quoteId, currency, selection, contact: normalized }),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json().catch(() => null);
      if (response.ok && result?.ok === true && result.id === quoteId) {
        setReceipt(quoteId);
      } else {
        if (result?.fields) setErrors(result.fields);
        setMessage(typeof result?.error === 'string' ? result.error : 'Your request could not be confirmed. Please try again.');
      }
    } catch {
      setMessage('Your request could not be confirmed. Please check your connection and try again.');
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  function fieldError(field: keyof QuoteContact) {
    return errors[field] ? <span id={`${id}-${field}-error`} className="text-xs font-medium text-red-700 dark:text-red-300">{errors[field]}</span> : null;
  }

  function validationProps(field: keyof QuoteContact) {
    return { id: `${id}-${field}`, 'aria-invalid': !!errors[field], 'aria-describedby': errors[field] ? `${id}-${field}-error` : undefined };
  }

  return (
    <dialog
      ref={modal}
      aria-labelledby={`${id}-title`}
      onCancel={(event) => { event.preventDefault(); close(); }}
      className="genmax-card fixed inset-0 m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-5xl overflow-y-auto overscroll-contain rounded-2xl p-4 text-slate-800 backdrop:bg-slate-950/65 backdrop:backdrop-blur-sm sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100%-3rem)] sm:p-7 dark:text-slate-100"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 id={`${id}-title`} className="pt-1 font-heading text-2xl font-bold text-slate-900 dark:text-white">Request a custom quote</h2>
        <button type="button" aria-label="Close quote form" disabled={submitting} onClick={close} className="grid size-11 shrink-0 place-items-center rounded-xl hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50 dark:hover:bg-slate-800">
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      {receipt ? (
        <div ref={statusRef} tabIndex={-1} role="status" className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200">
          <p className="flex items-center gap-2 font-semibold"><CheckCircle2 aria-hidden="true" className="size-5 shrink-0" /> Quote request received</p>
          <p className="mt-2 break-all">Reference {receipt}</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <form noValidate onSubmit={submit} className="min-w-0 space-y-4" aria-busy={submitting}>
            <fieldset disabled={submitting} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.id} className="grid gap-1.5 text-sm font-medium">
                  <span>{field.name}{field.required && <span className="text-indigo-700 dark:text-cyan-400" aria-hidden="true"> *</span>}</span>
                  <input className={inputStyle} {...validationProps(field.id)} type={field.type} autoComplete={field.autoComplete} name={field.id} required={field.required} maxLength={CONTACT_LIMITS[field.id]} value={contact[field.id]} onChange={(event) => change(field.id, event.target.value)} />
                  {fieldError(field.id)}
                </label>
              ))}
              <label className="grid gap-1.5 text-sm font-medium">
                Budget Range ({currency})
                <input className={inputStyle} {...validationProps('budget')} name="budget" maxLength={CONTACT_LIMITS.budget} value={contact.budget} onChange={(event) => change('budget', event.target.value)} />
                {fieldError('budget')}
              </label>
              <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                Project Timeline
                <select className={inputStyle} {...validationProps('timeline')} name="timeline" value={contact.timeline} onChange={(event) => change('timeline', event.target.value)}>
                  <option value="">Choose a timeline</option>
                  {TIMELINES.map((option) => <option key={option}>{option}</option>)}
                </select>
                {fieldError('timeline')}
              </label>
              <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                Additional Requirements
                <textarea className={`${inputStyle} resize-y`} {...validationProps('requirements')} name="requirements" rows={4} maxLength={CONTACT_LIMITS.requirements} value={contact.requirements} onChange={(event) => change('requirements', event.target.value)} />
                {fieldError('requirements')}
              </label>
            </fieldset>
            {message && <div role="alert" ref={statusRef} tabIndex={-1} className="rounded-xl border border-red-300 p-3 text-sm text-red-700 dark:border-red-800 dark:text-red-300">{message}</div>}
            <button type="submit" className={`${primaryButton} w-full`} disabled={submitting}>
              {submitting && <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />}
              {submitting ? 'Sending request…' : 'Send Quote Request'}
            </button>
          </form>
          <EstimateSummary selection={selection} currency={currency} />
        </div>
      )}
    </dialog>
  );
}
