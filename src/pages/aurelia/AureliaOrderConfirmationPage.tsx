import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { AureliaLayout } from '../../components/aurelia/AureliaLayout';
import { useAureliaStore } from '../../context/AureliaStoreContext';
import { formatInr } from '../../data/aureliaCatalog';

export const AureliaOrderConfirmationPage: React.FC = () => {
  const { lastOrder } = useAureliaStore();

  if (!lastOrder) {
    return (
      <AureliaLayout pageTitle="Order Confirmation">
        <section className="py-20 max-w-xl mx-auto px-4 text-center space-y-5">
          <h1 className="aur-serif text-4xl font-semibold text-[#141312]">
            No Demo Order Placed Yet
          </h1>
          <p className="text-sm text-[#665E55]">
            Select any creation, add it to your bag, and complete the browser-local guest checkout to preview an Aurélia order dossier.
          </p>
          <Link
            to="/showcase/aurelia/shop"
            className="inline-block px-7 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-medium"
          >
            Explore Jewelry Catalog
          </Link>
        </section>
      </AureliaLayout>
    );
  }

  return (
    <AureliaLayout pageTitle={`Demo Order ${lastOrder.orderNumber}`}>
      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-[#D8CBB8] bg-white p-7 sm:p-10 space-y-8">
            <div className="text-center space-y-3 pb-7 border-b border-[#E2D7C6]">
              <div className="w-12 h-12 mx-auto bg-[#F3ECE1] border border-[#D8CBB8] flex items-center justify-center text-[#8F6D39]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold">
                Interactive Concept Store · Simulated Demo Order
              </div>
              <h1 className="aur-serif text-4xl sm:text-5xl font-semibold text-[#141312]">
                Thank You, {lastOrder.customer.fullName}
              </h1>
              <div className="inline-block px-4 py-1.5 bg-[#F3ECE1] border border-[#D8CBB8] text-xs font-mono font-semibold text-[#141312]">
                Demo Order Reference: {lastOrder.orderNumber}
              </div>
              <p className="text-xs text-[#665E55] max-w-md mx-auto leading-relaxed">
                This confirmation is stored locally in your browser so you may refresh or revisit it freely. No real charge or dispatch occurs.
              </p>
            </div>

            {/* Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm pb-6 border-b border-[#E2D7C6]">
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#8F6D39] font-semibold">
                  Recipient &amp; Address
                </div>
                <div className="font-semibold text-[#141312]">{lastOrder.customer.fullName}</div>
                <div className="text-[#2B2825]">{lastOrder.customer.address}</div>
                <div className="text-[#2B2825]">
                  {lastOrder.customer.city} — {lastOrder.customer.postalCode}
                </div>
                <div className="text-[#665E55] pt-1">
                  {lastOrder.customer.email} · {lastOrder.customer.phone}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#8F6D39] font-semibold">
                  Delivery Selection
                </div>
                <div className="font-semibold text-[#141312]">{lastOrder.deliveryOption.label}</div>
                <div className="text-[#2B2825]">Estimated Window: {lastOrder.deliveryOption.eta}</div>
                {lastOrder.customer.giftNote && (
                  <div className="text-[#665E55] italic pt-1">
                    Note: &ldquo;{lastOrder.customer.giftNote}&rdquo;
                  </div>
                )}
              </div>
            </div>

            {/* Purchased Items */}
            <div className="space-y-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#8F6D39] font-semibold">
                Reserved Pieces
              </div>
              <div className="divide-y divide-[#E2D7C6] border-y border-[#E2D7C6]">
                {lastOrder.items.map((item, idx) => (
                  <div key={`${item.sku}-${idx}`} className="py-4 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover border border-[#E2D7C6] bg-[#F3ECE1] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/showcase/aurelia/product/${item.slug}`}
                        className="aur-serif text-xl font-semibold text-[#141312] hover:text-[#8F6D39]"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-[#665E55]">
                        {item.variantLabel} · Qty {item.quantity} · SKU {item.sku}
                      </div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums text-[#141312]">
                      {formatInr(item.lineTotalInr)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final INR Totals */}
            <div className="bg-[#F3ECE1] border border-[#D8CBB8] p-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-[#665E55]">Pieces Subtotal</span>
                <span className="font-semibold tabular-nums">{formatInr(lastOrder.subtotalInr)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#665E55]">{lastOrder.deliveryOption.label}</span>
                <span className="font-semibold tabular-nums">
                  {lastOrder.shippingInr === 0 ? '₹0' : formatInr(lastOrder.shippingInr)}
                </span>
              </div>
              <div className="pt-3 border-t border-[#D8CBB8] flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-[0.16em] font-semibold">
                  Final Demo Total (INR)
                </span>
                <span className="text-2xl font-semibold tabular-nums text-[#141312]">
                  {formatInr(lastOrder.totalInr)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link
                to="/showcase/aurelia/shop"
                className="w-full sm:w-auto px-6 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#2B2825] transition-colors"
              >
                <span>Continue Exploring Storefront</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#665E55] hover:text-[#141312]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Genmax Portfolio</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#665E55] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#8F6D39]" />
              <span>Your shopping bag has been cleared after confirmation.</span>
            </div>
          </div>
        </div>
      </section>
    </AureliaLayout>
  );
};
