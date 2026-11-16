import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight, AlertCircle, Lock } from 'lucide-react';
import { AureliaLayout } from '../../components/aurelia/AureliaLayout';
import {
  useAureliaStore,
  DELIVERY_OPTIONS,
  DeliveryMethodId,
} from '../../context/AureliaStoreContext';
import { formatInr } from '../../data/aureliaCatalog';

interface CheckoutFormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  giftNote: string;
}

const SAMPLE_CUSTOMER: CheckoutFormState = {
  fullName: 'Ananya Mehta',
  email: 'ananya.mehta@example.com',
  phone: '+91 98201 44510',
  address: '42 Altamount Road, Cumballa Hill',
  city: 'Mumbai, Maharashtra',
  postalCode: '400026',
  giftNote: 'Please enclose cream wax seal envelope.',
};

export const AureliaCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { hydratedBag, bagSubtotalInr, placeDemoOrder, lastOrder } = useAureliaStore();

  const [form, setForm] = useState<CheckoutFormState>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    giftNote: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodId>('insured-vault');
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormState, string>>>({});
  const [formErrorBanner, setFormErrorBanner] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const submitLockRef = useRef(false);

  const selectedDelivery =
    DELIVERY_OPTIONS.find((opt) => opt.id === deliveryMethod) || DELIVERY_OPTIONS[0];
  const grandTotalInr = bagSubtotalInr + selectedDelivery.feeInr;

  const handleFillSample = () => {
    setForm(SAMPLE_CUSTOMER);
    setErrors({});
    setFormErrorBanner(null);
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof CheckoutFormState, string>> = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter recipient full name.';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 8) {
      nextErrors.phone = 'Please enter a valid contact phone number.';
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      nextErrors.address = 'Please enter complete street address.';
    }
    if (!form.city.trim()) {
      nextErrors.city = 'Please enter city.';
    }
    if (!form.postalCode.trim() || !/^\d{5,6}$/.test(form.postalCode.trim())) {
      nextErrors.postalCode = 'Enter a valid 6-digit PIN code.';
    }

    setErrors(nextErrors);
    const hasErrors = Object.keys(nextErrors).length > 0;
    if (hasErrors) {
      setFormErrorBanner('Please review the highlighted shipping fields below.');
    } else {
      setFormErrorBanner(null);
    }
    return !hasErrors;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current || isPlacing) return;
    if (!validate()) return;

    submitLockRef.current = true;
    setIsPlacing(true);

    const created = placeDemoOrder(
      {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        giftNote: form.giftNote.trim() || undefined,
      },
      deliveryMethod
    );

    if (created) {
      navigate('/showcase/aurelia/order-confirmation', { replace: true });
    } else {
      submitLockRef.current = false;
      setIsPlacing(false);
    }
  };

  if (hydratedBag.length === 0) {
    return (
      <AureliaLayout pageTitle="Demo Checkout">
        <section className="py-20 max-w-xl mx-auto px-4 text-center space-y-5">
          <h1 className="aur-serif text-4xl font-semibold text-[#141312]">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-sm text-[#665E55]">
            Add a piece from the Aurélia collection to test the browser-local INR guest checkout flow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/showcase/aurelia/shop"
              className="px-7 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-medium"
            >
              Browse Creations
            </Link>
            {lastOrder && (
              <Link
                to="/showcase/aurelia/order-confirmation"
                className="px-6 py-3 border border-[#141312] text-xs uppercase tracking-[0.16em] font-medium"
              >
                View Last Demo Order ({lastOrder.orderNumber})
              </Link>
            )}
          </div>
        </section>
      </AureliaLayout>
    );
  }

  return (
    <AureliaLayout pageTitle="Demo Checkout">
      <section className="bg-[#F3ECE1] border-b border-[#E2D7C6] py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold mb-1.5">
              Interactive Concept Store · Local Browser Checkout
            </div>
            <h1 className="aur-serif text-4xl sm:text-5xl font-semibold text-[#141312]">
              Guest Checkout
            </h1>
          </div>

          <button
            type="button"
            onClick={handleFillSample}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#8F6D39] text-[#141312] text-xs uppercase tracking-[0.15em] font-semibold hover:bg-[#EDE3D2] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8F6D39]" />
            <span>Use sample details</span>
          </button>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Shipping & Delivery Form */}
          <form
            onSubmit={handlePlaceOrder}
            noValidate
            className="lg:col-span-7 space-y-8 bg-white border border-[#E2D7C6] p-6 sm:p-8"
          >
            <div className="p-4 bg-[#FAF7F2] border border-[#D8CBB8] flex items-start gap-3 text-xs text-[#2B2825]">
              <Lock className="w-4 h-4 text-[#8F6D39] shrink-0 mt-0.5" />
              <span>
                <strong>Browser-Local Demonstration:</strong> No payment card numbers are requested and no contact or order information leaves your browser.
              </span>
            </div>

            {formErrorBanner && (
              <div
                role="alert"
                className="p-3.5 bg-[#FFF5F5] border border-[#C86D6D] text-[#7D2424] text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formErrorBanner}</span>
              </div>
            )}

            <div className="space-y-5">
              <h2 className="aur-serif text-2xl font-semibold text-[#141312] pb-2 border-b border-[#E2D7C6]">
                1. Insured Recipient &amp; Shipping Address
              </h2>

              <div>
                <label htmlFor="aur-fullname" className="block text-xs uppercase tracking-[0.14em] font-medium mb-1.5">
                  Full Name *
                </label>
                <input
                  id="aur-fullname"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  placeholder="Recipient Full Name"
                  className={`w-full px-3.5 py-2.5 border text-sm bg-white focus:outline-none ${
                    errors.fullName ? 'border-[#B91C1C]' : 'border-[#D8CBB8] focus:border-[#8F6D39]'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-[#991B1B] mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="aur-email" className="block text-xs uppercase tracking-[0.14em] font-medium mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="aur-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="name@example.com"
                    className={`w-full px-3.5 py-2.5 border text-sm bg-white focus:outline-none ${
                      errors.email ? 'border-[#B91C1C]' : 'border-[#D8CBB8] focus:border-[#8F6D39]'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-[#991B1B] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="aur-phone" className="block text-xs uppercase tracking-[0.14em] font-medium mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    id="aur-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="+91 98201 44510"
                    className={`w-full px-3.5 py-2.5 border text-sm bg-white focus:outline-none ${
                      errors.phone ? 'border-[#B91C1C]' : 'border-[#D8CBB8] focus:border-[#8F6D39]'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-[#991B1B] mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="aur-address" className="block text-xs uppercase tracking-[0.14em] font-medium mb-1.5">
                  Street Address *
                </label>
                <input
                  id="aur-address"
                  type="text"
                  value={form.address}
                  onChange={(e) => {
                    setForm({ ...form, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: undefined });
                  }}
                  placeholder="Apartment, Street & Locality"
                  className={`w-full px-3.5 py-2.5 border text-sm bg-white focus:outline-none ${
                    errors.address ? 'border-[#B91C1C]' : 'border-[#D8CBB8] focus:border-[#8F6D39]'
                  }`}
                />
                {errors.address && <p className="text-xs text-[#991B1B] mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="aur-city" className="block text-xs uppercase tracking-[0.14em] font-medium mb-1.5">
                    City &amp; State *
                  </label>
                  <input
                    id="aur-city"
                    type="text"
                    value={form.city}
                    onChange={(e) => {
                      setForm({ ...form, city: e.target.value });
                      if (errors.city) setErrors({ ...errors, city: undefined });
                    }}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className={`w-full px-3.5 py-2.5 border text-sm bg-white focus:outline-none ${
                      errors.city ? 'border-[#B91C1C]' : 'border-[#D8CBB8] focus:border-[#8F6D39]'
                    }`}
                  />
                  {errors.city && <p className="text-xs text-[#991B1B] mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="aur-pin" className="block text-xs uppercase tracking-[0.14em] font-medium mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    id="aur-pin"
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => {
                      setForm({ ...form, postalCode: e.target.value });
                      if (errors.postalCode) setErrors({ ...errors, postalCode: undefined });
                    }}
                    placeholder="400026"
                    className={`w-full px-3.5 py-2.5 border text-sm bg-white focus:outline-none ${
                      errors.postalCode ? 'border-[#B91C1C]' : 'border-[#D8CBB8] focus:border-[#8F6D39]'
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="text-xs text-[#991B1B] mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="aur-giftnote" className="block text-xs uppercase tracking-[0.14em] font-medium mb-1.5">
                  Complimentary Enclosure Note (Optional)
                </label>
                <input
                  id="aur-giftnote"
                  type="text"
                  value={form.giftNote}
                  onChange={(e) => setForm({ ...form, giftNote: e.target.value })}
                  placeholder="Handwritten cotton gift card message"
                  className="w-full px-3.5 py-2.5 border border-[#D8CBB8] text-sm bg-white focus:border-[#8F6D39] focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Delivery Option */}
            <div className="space-y-4">
              <h2 className="aur-serif text-2xl font-semibold text-[#141312] pb-2 border-b border-[#E2D7C6]">
                2. Insured Delivery Method
              </h2>

              <div className="space-y-3">
                {DELIVERY_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`block border p-4 cursor-pointer transition-colors ${
                      deliveryMethod === option.id
                        ? 'border-[#141312] bg-[#FAF7F2]'
                        : 'border-[#E2D7C6] bg-white hover:border-[#8F6D39]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={option.id}
                        checked={deliveryMethod === option.id}
                        onChange={() => setDeliveryMethod(option.id)}
                        className="mt-1 accent-[#141312]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-[#141312]">
                            {option.label}
                          </span>
                          <span className="text-sm font-semibold tabular-nums text-[#8F6D39]">
                            {option.feeInr === 0 ? 'Complimentary (₹0)' : formatInr(option.feeInr)}
                          </span>
                        </div>
                        <div className="text-xs text-[#665E55] mt-1">
                          {option.eta} · {option.description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPlacing}
              className="w-full py-4 px-6 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2B2825] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isPlacing ? 'Confirming Demo Order...' : 'Place Demo Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Right: Live INR Order Summary */}
          <aside className="lg:col-span-5 bg-[#F3ECE1] border border-[#E2D7C6] p-6 sm:p-7 space-y-5">
            <h2 className="aur-serif text-2xl font-semibold text-[#141312] pb-3 border-b border-[#D8CBB8]">
              Order Summary
            </h2>

            <div className="divide-y divide-[#D8CBB8] max-h-[380px] overflow-y-auto pr-1">
              {hydratedBag.map((line) => (
                <div
                  key={`${line.product.id}-${line.variant.id}`}
                  className="py-3.5 first:pt-0 flex items-center gap-3.5"
                >
                  <img
                    src={line.product.images[0].url}
                    alt={line.product.images[0].alt}
                    className="w-16 h-16 object-cover border border-[#D8CBB8] bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="aur-serif text-lg font-semibold text-[#141312] leading-tight truncate">
                      {line.product.name}
                    </div>
                    <div className="text-xs text-[#665E55] mt-0.5">
                      {line.variant.label} · Qty {line.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-[#141312]">
                    {formatInr(line.lineTotalInr)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#D8CBB8] space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-[#665E55]">Subtotal</span>
                <span className="font-semibold tabular-nums">{formatInr(bagSubtotalInr)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#665E55]">{selectedDelivery.label}</span>
                <span className="font-semibold tabular-nums">
                  {selectedDelivery.feeInr === 0 ? '₹0' : formatInr(selectedDelivery.feeInr)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D8CBB8] flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-[0.16em] font-semibold">
                Total Demo Amount (INR)
              </span>
              <span className="text-2xl font-semibold tabular-nums text-[#141312]">
                {formatInr(grandTotalInr)}
              </span>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-[#665E55] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#8F6D39] shrink-0 mt-0.5" />
              <span>
                Placing this demo order generates a local confirmation dossier and clears your demo shopping bag.
              </span>
            </div>
          </aside>
        </div>
      </section>
    </AureliaLayout>
  );
};
