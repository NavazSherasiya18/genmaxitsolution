import React, { useState } from 'react';
import { Calculator, TrendingUp, Sparkles, ArrowRight, DollarSign, Users } from 'lucide-react';

interface RoiCalculatorProps {
  onOpenAudit: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenAudit }) => {
  const [monthlyVisitors, setMonthlyVisitors] = useState(3500);
  const [orderValue, setOrderValue] = useState(15000); // INR

  // Genmax benchmark multipliers:
  // Average Organic Traffic Uplift: +185% (factor of 2.85)
  // Average Conversion Rate optimization: 2.5% -> 4.2%
  const currentLeads = Math.round((monthlyVisitors * 0.02));
  const projectedVisitors = Math.round(monthlyVisitors * 2.85);
  const projectedLeads = Math.round((projectedVisitors * 0.042));
  const incrementalLeads = Math.max(0, projectedLeads - currentLeads);
  const estimatedAnnualGain = Math.round(incrementalLeads * (orderValue * 0.25) * 12); // assuming 25% close rate

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      <div className="p-8 sm:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4" />
              <span>Interactive Growth Engine</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Calculate Your Business Revenue Potential
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Adjust the sliders below to project your estimated inbound inquiry and revenue gains with Genmax IT Solution.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-500 font-mono uppercase bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              Validated on 500+ Deployments
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Sliders Area */}
          <div className="lg:col-span-7 space-y-8">
            {/* Slider 1: Monthly Visitors */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-900 dark:text-white">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                  <span>Current Monthly Visitors</span>
                </span>
                <span className="text-base font-bold font-mono text-indigo-600 dark:text-cyan-400">
                  {monthlyVisitors.toLocaleString('en-IN')} / mo
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="30000"
                step="500"
                value={monthlyVisitors}
                onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>500</span>
                <span>15,000</span>
                <span>30,000+</span>
              </div>
            </div>

            {/* Slider 2: Average Order/Deal Value */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-900 dark:text-white">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                  <span>Average Client / Customer Value</span>
                </span>
                <span className="text-base font-bold font-mono text-indigo-600 dark:text-cyan-400">
                  ₹{orderValue.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="100000"
                step="2000"
                value={orderValue}
                onChange={(e) => setOrderValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₹2,000</span>
                <span>₹50,000</span>
                <span>₹100,000+</span>
              </div>
            </div>

            {/* Explanation footnote */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Based on historical data from Genmax SEO campaigns: an average of +185% organic visibility elevation and a conversion rate improvement from 2.0% to 4.2% via custom responsive UX.
            </div>
          </div>

          {/* Projection Results Card */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-slate-800/80 dark:to-slate-900 border border-indigo-200 dark:border-slate-700 shadow-md space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-cyan-400 block mb-1">
                  Projected Monthly Inbound Inquiries
                </span>
                <div className="text-4xl font-bold font-heading text-slate-900 dark:text-white">
                  {projectedLeads}{' '}
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    (+{incrementalLeads} new leads/mo)
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-indigo-100 dark:border-slate-800">
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-cyan-400 block mb-1">
                  Estimated Incremental Annual Revenue
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-indigo-700 dark:text-cyan-300">
                  ₹{estimatedAnnualGain.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  *Assumes conservative 25% qualified lead-to-close conversion
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenAudit}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white font-semibold text-xs tracking-wider uppercase hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Lock in This Growth Strategy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
