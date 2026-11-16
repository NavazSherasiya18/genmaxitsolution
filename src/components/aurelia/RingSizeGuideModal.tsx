import React, { useEffect } from 'react';
import { X, Ruler } from 'lucide-react';
import { RING_SIZE_GUIDE } from '../../data/aureliaCatalog';

interface RingSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RingSizeGuideModal: React.FC<RingSizeGuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141312]/65 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="aurelia-size-guide-title"
    >
      <div
        className="w-full max-w-2xl bg-[#FAF7F2] text-[#141312] border border-[#D8CBB8] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E2D7C6]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#8F6D39] font-semibold">
              <Ruler className="w-3.5 h-3.5" />
              <span>Atelier Sizing Dossier</span>
            </div>
            <h2 id="aurelia-size-guide-title" className="aur-serif text-3xl font-semibold mt-1">
              Ring Size Conversion &amp; Fit Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#665E55] hover:text-[#141312] cursor-pointer"
            aria-label="Close ring size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-6">
          <p className="text-xs sm:text-sm text-[#2B2825] leading-relaxed">
            Aurélia solitaire rings use Continental EU sizing with direct Indian and US equivalents. If your measurement falls between two sizes, we recommend selecting the larger size for comfortable knuckle passage—especially for wider bands.
          </p>

          <div className="overflow-x-auto border border-[#E2D7C6] bg-white">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#F3ECE1] border-b border-[#E2D7C6] text-[11px] uppercase tracking-[0.14em] text-[#665E55]">
                  <th className="py-3 px-4 font-semibold">EU Size</th>
                  <th className="py-3 px-4 font-semibold">India Size</th>
                  <th className="py-3 px-4 font-semibold">US Equivalent</th>
                  <th className="py-3 px-4 font-semibold">Inner Diameter</th>
                  <th className="py-3 px-4 font-semibold">Circumference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D7C6] tabular-nums">
                {RING_SIZE_GUIDE.map((row) => (
                  <tr key={row.eu} className="hover:bg-[#FAF7F2]">
                    <td className="py-2.5 px-4 font-semibold text-[#141312]">EU {row.eu}</td>
                    <td className="py-2.5 px-4">{row.inSize}</td>
                    <td className="py-2.5 px-4">{row.us}</td>
                    <td className="py-2.5 px-4">{row.diameterMm}</td>
                    <td className="py-2.5 px-4">{row.circumferenceMm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#F3ECE1] border border-[#E2D7C6] p-4 sm:p-5 space-y-2 text-xs text-[#2B2825] leading-relaxed">
            <div className="font-semibold uppercase tracking-[0.14em] text-[#8F6D39]">
              How to Measure at Home
            </div>
            <p>
              Wrap a non-stretch strip of paper around the base of your finger at warm room temperature (avoid cold mornings). Mark the overlap with a fine pen, measure the length in millimeters against a ruler, and match it to the Circumference column above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
