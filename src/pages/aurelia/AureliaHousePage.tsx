import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ruler, ShieldCheck, Gift, ArrowRight, Sparkles } from 'lucide-react';
import { AureliaLayout } from '../../components/aurelia/AureliaLayout';
import { AURELIA_ASSETS, RING_SIZE_GUIDE } from '../../data/aureliaCatalog';

export const AureliaHousePage: React.FC = () => {
  const location = useLocation();
  const [circumferenceInput, setCircumferenceInput] = useState('52');

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash]);

  const numericMm = parseFloat(circumferenceInput);
  const recommendedSize =
    !Number.isNaN(numericMm) && numericMm >= 46 && numericMm <= 62
      ? RING_SIZE_GUIDE.reduce((prev, curr) => {
          const prevDiff = Math.abs(parseFloat(prev.circumferenceMm) - numericMm);
          const currDiff = Math.abs(parseFloat(curr.circumferenceMm) - numericMm);
          return currDiff < prevDiff ? curr : prev;
        })
      : null;

  return (
    <AureliaLayout pageTitle="House of Aurélia & Client Care">
      {/* Editorial Story Banner */}
      <section className="bg-[#F3ECE1] border-b border-[#E2D7C6] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-[#8F6D39] font-semibold">
              Maison Heritage · Paris &amp; Milan
            </div>
            <h1 className="aur-serif text-4xl sm:text-5xl font-semibold text-[#141312] leading-tight">
              Quiet Goldwork, Measured to the Millimeter
            </h1>
            <p className="text-sm sm:text-base text-[#2B2825] leading-relaxed">
              Aurélia &amp; Co. pairs Parisian proportion with Milanese goldsmithing discipline. Every mounting starts as a gouache drawing before being carved in wax, cast in recycled Platinum 950 or 18K gold, and burnished by hand so prongs feel silk-smooth against the skin.
            </p>
            <div className="pt-2">
              <Link
                to="/showcase/aurelia/shop"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#2B2825] transition-colors"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 border border-[#D8CBB8] bg-white overflow-hidden aspect-[4/3]">
            <img
              src={AURELIA_ASSETS.atelierCraft}
              alt="Master jeweler workbench with gouache ring study, brass calipers, and unset emerald and diamond stones"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Ring Size Guide Section */}
      <section id="size-guide" className="py-16 border-b border-[#E2D7C6] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8F6D39] font-semibold mb-2">
              <Ruler className="w-3.5 h-3.5" />
              <span>Atelier Sizing Assistant</span>
            </div>
            <h2 className="aur-serif text-3xl sm:text-4xl font-semibold text-[#141312]">
              Ring Size Guidance &amp; Millimeter Finder
            </h2>
            <p className="text-sm text-[#665E55] mt-2 leading-relaxed">
              Convert between Continental EU sizes used across our solitaire catalog and standard Indian or US ring scales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 border border-[#E2D7C6] bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#F3ECE1] border-b border-[#E2D7C6] text-[11px] uppercase tracking-[0.14em] text-[#665E55]">
                    <th className="py-3.5 px-5 font-semibold">EU Size</th>
                    <th className="py-3.5 px-5 font-semibold">India Size</th>
                    <th className="py-3.5 px-5 font-semibold">US Scale</th>
                    <th className="py-3.5 px-5 font-semibold">Inner Diameter</th>
                    <th className="py-3.5 px-5 font-semibold">Circumference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D7C6] tabular-nums">
                  {RING_SIZE_GUIDE.map((row) => (
                    <tr key={row.eu} className="hover:bg-[#FAF7F2]">
                      <td className="py-3 px-5 font-semibold text-[#141312]">EU {row.eu}</td>
                      <td className="py-3 px-5">{row.inSize}</td>
                      <td className="py-3 px-5">{row.us}</td>
                      <td className="py-3 px-5">{row.diameterMm}</td>
                      <td className="py-3 px-5">{row.circumferenceMm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-4 border border-[#E2D7C6] bg-[#F3ECE1] p-6 space-y-4">
              <div className="text-xs uppercase tracking-[0.16em] font-semibold text-[#8F6D39]">
                Quick Millimeter Estimator
              </div>
              <div>
                <label htmlFor="aur-mm-calc" className="block text-xs text-[#2B2825] mb-1.5">
                  Measured Finger Circumference (46–60 mm)
                </label>
                <input
                  id="aur-mm-calc"
                  type="number"
                  min={46}
                  max={62}
                  step="0.5"
                  value={circumferenceInput}
                  onChange={(e) => setCircumferenceInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8CBB8] text-sm tabular-nums focus:border-[#8F6D39] focus:outline-none"
                />
              </div>
              {recommendedSize ? (
                <div className="p-4 bg-white border border-[#D8CBB8] text-xs space-y-1">
                  <div className="text-[#665E55]">Closest Aurélia Size:</div>
                  <div className="aur-serif text-2xl font-semibold text-[#141312]">
                    EU {recommendedSize.eu} (India {recommendedSize.inSize})
                  </div>
                  <div className="text-[#665E55]">
                    Inner Diameter {recommendedSize.diameterMm} · US {recommendedSize.us}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#665E55]">
                  Enter a measurement between 46 mm and 62 mm to locate your closest EU/India ring size.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Shipping & Returns Section */}
      <section id="shipping" className="py-16 border-b border-[#E2D7C6] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-[#E2D7C6] bg-white p-7 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8F6D39] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Armored &amp; Insured Transit</span>
            </div>
            <h2 className="aur-serif text-3xl font-semibold text-[#141312]">
              Complimentary Vault Delivery
            </h2>
            <p className="text-sm text-[#2B2825] leading-relaxed">
              Every Aurélia commission dispatches complimentary via insured vault courier across India within 4–6 business days. Priority same-day armored courier (₹2,500) is available across Mumbai, Delhi NCR, and Bengaluru. All shipments remain 100% insured by the Maison until signed reception.
            </p>
          </div>

          <div className="border border-[#E2D7C6] bg-white p-7 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8F6D39] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>30-Day Return &amp; Lifetime Care</span>
            </div>
            <h2 className="aur-serif text-3xl font-semibold text-[#141312]">
              Returns &amp; Complimentary Resizing
            </h2>
            <p className="text-sm text-[#2B2825] leading-relaxed">
              Unworn creations bearing intact Aurélia security tags may be returned or exchanged within 30 days at zero collection cost. Solitaire and wedding bands include one complimentary resize within two EU sizes during the first year, plus lifetime ultrasonic cleaning and prong inspections.
            </p>
          </div>
        </div>
      </section>

      {/* Bespoke Gifting Feature */}
      <section id="gifting" className="py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#F3ECE1] border border-[#E2D7C6] p-6 sm:p-10">
          <div className="lg:col-span-6 aspect-[4/3] overflow-hidden border border-[#D8CBB8] bg-white">
            <img
              src={AURELIA_ASSETS.bridalPair}
              alt="Ivory suede jewelry box edged with brushed brass and wrapped with champagne satin ribbon"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8F6D39] font-semibold">
              <Gift className="w-4 h-4" />
              <span>Ceremonial Presentation</span>
            </div>
            <h2 className="aur-serif text-3xl sm:text-4xl font-semibold text-[#141312]">
              The Art of Aurélia Gifting
            </h2>
            <p className="text-sm text-[#2B2825] leading-relaxed">
              Every piece arrives nested inside an ivory suede vault trimmed in brushed antique brass, tied with champagne silk ribbon, and accompanied by a wax-sealed GIA/SSEF certificate envelope and customizable message card.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/showcase/aurelia/collections/bridal-atelier"
                className="px-6 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#2B2825] transition-colors inline-flex items-center gap-2"
              >
                <span>Shop Bridal &amp; Gifting Suites</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/showcase/aurelia/shop?category=Necklaces"
                className="px-6 py-3 border border-[#141312] text-[#141312] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#EDE3D2] transition-colors"
              >
                Explore Pendants
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AureliaLayout>
  );
};
