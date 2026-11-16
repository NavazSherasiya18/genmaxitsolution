import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { AureliaLayout } from '../../components/aurelia/AureliaLayout';
import { useAureliaStore, DELIVERY_OPTIONS } from '../../context/AureliaStoreContext';
import { formatInr } from '../../data/aureliaCatalog';

export const AureliaBagPage: React.FC = () => {
  const { hydratedBag, bagCount, bagSubtotalInr, updateBagQuantity, removeFromBag } =
    useAureliaStore();

  const standardDelivery = DELIVERY_OPTIONS[0];

  return (
    <AureliaLayout pageTitle="Shopping Bag">
      <section className="bg-[#F3ECE1] border-b border-[#E2D7C6] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold mb-2">
            Concept Bag Summary
          </div>
          <h1 className="aur-serif text-4xl sm:text-5xl font-semibold text-[#141312]">
            Shopping Bag ({bagCount})
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hydratedBag.length === 0 ? (
            <div className="border border-[#E2D7C6] bg-white p-12 text-center space-y-4 max-w-xl mx-auto">
              <ShoppingBag className="w-10 h-10 text-[#9E9589] mx-auto stroke-[1.25]" />
              <h2 className="aur-serif text-3xl font-semibold text-[#141312]">
                Your shopping bag is currently empty
              </h2>
              <p className="text-sm text-[#665E55]">
                Explore our Paris–Milan collections to select a piece and review variant pricing and insured shipping.
              </p>
              <Link
                to="/showcase/aurelia/shop"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#2B2825] transition-colors"
              >
                <span>Shop All Creations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Line Items */}
              <div className="lg:col-span-8 border border-[#E2D7C6] bg-white divide-y divide-[#E2D7C6]">
                {hydratedBag.map((line) => (
                  <div
                    key={`${line.product.id}-${line.variant.id}`}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                  >
                    <Link
                      to={`/showcase/aurelia/product/${line.product.slug}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F3ECE1] border border-[#E2D7C6] shrink-0 overflow-hidden"
                    >
                      <img
                        src={line.product.images[0].url}
                        alt={line.product.images[0].alt}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-[#8F6D39] font-semibold">
                        {line.product.collectionName}
                      </div>
                      <Link
                        to={`/showcase/aurelia/product/${line.product.slug}`}
                        className="block aur-serif text-2xl font-semibold text-[#141312] hover:text-[#8F6D39]"
                      >
                        {line.product.name}
                      </Link>
                      <div className="text-xs text-[#2B2825]">
                        Selected {line.variant.optionType}:{' '}
                        <span className="font-semibold">{line.variant.label}</span>
                      </div>
                      <div className="text-[11px] font-mono text-[#665E55]">
                        SKU: {line.variant.sku} · Unit {formatInr(line.unitPriceInr)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-4">
                      <div className="text-base sm:text-lg font-semibold text-[#141312] tabular-nums">
                        {formatInr(line.lineTotalInr)}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center border border-[#D8CBB8] bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() =>
                              updateBagQuantity(line.product.id, line.variant.id, line.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#EDE3D2] cursor-pointer"
                            aria-label={`Decrease quantity for ${line.product.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-xs font-semibold tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateBagQuantity(line.product.id, line.variant.id, line.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#EDE3D2] cursor-pointer"
                            aria-label={`Increase quantity for ${line.product.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromBag(line.product.id, line.variant.id)}
                          aria-label={`Remove ${line.product.name} (${line.variant.label})`}
                          className="p-2 text-[#665E55] hover:text-[#141312] border border-[#E2D7C6] hover:border-[#141312] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Box */}
              <aside className="lg:col-span-4 border border-[#E2D7C6] bg-[#F3ECE1] p-6 sm:p-7 space-y-5">
                <h2 className="aur-serif text-2xl font-semibold text-[#141312] pb-3 border-b border-[#D8CBB8]">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#665E55]">Pieces Subtotal ({bagCount})</span>
                    <span className="font-semibold tabular-nums">{formatInr(bagSubtotalInr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#665E55]">{standardDelivery.label}</span>
                    <span className="font-semibold text-[#8F6D39]">Complimentary (₹0)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D8CBB8] flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-[0.15em] font-semibold">
                    Estimated Total (INR)
                  </span>
                  <span className="text-xl font-semibold tabular-nums">
                    {formatInr(bagSubtotalInr + standardDelivery.feeInr)}
                  </span>
                </div>

                <Link
                  to="/showcase/aurelia/checkout"
                  className="w-full py-3.5 px-6 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#2B2825] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Demo Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-start gap-2 text-[11px] text-[#665E55] leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-[#8F6D39] shrink-0 mt-0.5" />
                  <span>
                    Interactive Concept Store checkout runs locally in your browser—no card entry or payment data required.
                  </span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </AureliaLayout>
  );
};
