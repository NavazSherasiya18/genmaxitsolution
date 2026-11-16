import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { usePrimusStore } from '../../../context/PrimusStoreContext';
import { CommercialAsset, DataRoomDoc } from '../../../data/primusCatalog';
import {
  ScenarioPresetId,
  UnderwritingAssumptions,
  buildSensitivityMatrix,
  formatPrimusMoney,
  runUnderwritingModel,
} from '../../../utils/primusFinance';
import { PrimusStatusBadge } from '../PrimusStatusBadge';

interface UnderwritingStudioModuleProps {
  onOpenMemo: (asset: CommercialAsset) => void;
  onNavigateModule: (module: 'diligence' | 'committee') => void;
  onOpenAsset: (slug: string) => void;
}

export const UnderwritingStudioModule: React.FC<UnderwritingStudioModuleProps> = ({
  onOpenMemo,
  onNavigateModule,
  onOpenAsset,
}) => {
  const {
    dataset,
    activeAssetId,
    setActiveAssetId,
    selectedScenarioId,
    setSelectedScenarioId,
    updateScenarioAssumptions,
  } = usePrimusStore();

  const [showFormulas, setShowFormulas] = useState(true);

  const asset =
    dataset.assets.find((a) => a.id === activeAssetId) || dataset.assets[0];
  const assumptions = asset.scenarios[selectedScenarioId];

  const baseRes = useMemo(() => runUnderwritingModel(asset.scenarios.base), [asset]);
  const upsideRes = useMemo(() => runUnderwritingModel(asset.scenarios.upside), [asset]);
  const downsideRes = useMemo(() => runUnderwritingModel(asset.scenarios.downside), [asset]);

  const result = useMemo(() => runUnderwritingModel(assumptions), [assumptions]);
  const sensitivity = useMemo(() => buildSensitivityMatrix(assumptions), [assumptions]);

  const assetTasks = dataset.diligenceTasks.filter((t) => t.assetId === asset.id);
  const reqTasks = assetTasks.filter((t) => t.required);
  const doneReqTasks = reqTasks.filter((t) => t.status === 'completed');

  const patchNum = (field: keyof UnderwritingAssumptions, raw: string) => {
    const val = Number(raw);
    if (!Number.isFinite(val)) return;
    updateScenarioAssumptions(asset.id, selectedScenarioId, { [field]: val });
  };

  return (
    <div className="space-y-5">
      {/* Top Deal Selector + Scenario Comparison Ribbon */}
      <div className="bg-white border border-[#DDD7CB] p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label
                htmlFor="uw-asset-select"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1"
              >
                Active Underwriting Asset
              </label>
              <select
                id="uw-asset-select"
                value={asset.id}
                onChange={(e) => setActiveAssetId(e.target.value)}
                className="h-10 px-3 bg-[#F6F4EF] border border-[#DDD7CB] text-xs font-bold text-[#0D1829]"
              >
                {dataset.assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} · {a.name} ({a.currency})
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <PrimusStatusBadge status={asset.stage} />
              <button
                type="button"
                onClick={() => onOpenAsset(asset.slug)}
                className="text-xs font-semibold text-[#9E7C3B] hover:underline cursor-pointer"
              >
                View Full Dossier →
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenMemo(asset)}
              className="px-3.5 py-2 border border-[#DDD7CB] bg-[#F6F4EF] hover:border-[#9E7C3B] text-xs font-semibold text-[#0D1829] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#9E7C3B]" />
              <span>Preview IC Memo</span>
            </button>
            <button
              type="button"
              onClick={() =>
                onNavigateModule(
                  doneReqTasks.length < reqTasks.length ? 'diligence' : 'committee'
                )
              }
              className="px-4 py-2 bg-[#0D1829] hover:bg-[#192D4D] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>
                {doneReqTasks.length < reqTasks.length
                  ? `Complete Diligence (${doneReqTasks.length}/${reqTasks.length})`
                  : 'Go to Committee Submission'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D6B572]" />
            </button>
          </div>
        </div>

        {/* Scenario Switcher Cards (Base / Upside / Downside) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#EAE5DA]">
          {(
            [
              { id: 'base' as ScenarioPresetId, label: 'Base Case', res: baseRes },
              { id: 'upside' as ScenarioPresetId, label: 'Upside Case', res: upsideRes },
              { id: 'downside' as ScenarioPresetId, label: 'Downside Stress', res: downsideRes },
            ] as const
          ).map((item) => {
            const isSelected = selectedScenarioId === item.id;
            const sc = asset.scenarios[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedScenarioId(item.id)}
                className={`text-left p-3.5 border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0D1829] border-[#0D1829] text-white'
                    : 'bg-[#F6F4EF] border-[#DDD7CB] text-[#0D1829] hover:border-[#9E7C3B]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 border ${
                      isSelected
                        ? 'border-[#D6B572]/50 text-[#D6B572]'
                        : 'border-[#DDD7CB] text-[#475569]'
                    }`}
                  >
                    {sc.occupancyPct}% Occ · {sc.exitCapRatePct}% Exit Cap
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between pr-tabular">
                  <span className="text-lg font-bold">
                    {item.res.leveredIrrPct !== null ? `${item.res.leveredIrrPct}%` : 'N/A'}
                    <span
                      className={`text-[11px] font-normal ml-1 ${
                        isSelected ? 'text-slate-300' : 'text-[#64748B]'
                      }`}
                    >
                      IRR
                    </span>
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-[#DFC285]' : 'text-[#9E7C3B]'
                    }`}
                  >
                    {item.res.equityMultiple !== null ? `${item.res.equityMultiple}x EM` : 'N/A'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Left Inputs / Right Outputs + Sensitivity + Cash Flow Schedule */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Editable Assumptions */}
        <div className="xl:col-span-4 bg-white border border-[#DDD7CB] p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#EAE5DA] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
                Scenario Assumptions ({assumptions.scenarioLabel})
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Native Currency: {asset.currency} · Working draft only
              </p>
            </div>
            <Layers className="w-4 h-4 text-[#9E7C3B]" />
          </div>

          {/* Hold & Valuation */}
          <div className="space-y-3 text-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E7C3B]">
              Basis &amp; Horizon
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#475569] mb-1">Hold Period</label>
                <div className="grid grid-cols-2 border border-[#DDD7CB]">
                  {([5, 10] as const).map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() =>
                        updateScenarioAssumptions(asset.id, selectedScenarioId, {
                          holdYears: yr,
                        })
                      }
                      className={`h-9 font-semibold cursor-pointer ${
                        assumptions.holdYears === yr
                          ? 'bg-[#0D1829] text-white'
                          : 'bg-[#F6F4EF] text-[#475569]'
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#475569] mb-1">Purchase Price ({asset.currency})</label>
                <input
                  type="number"
                  step={1000000}
                  value={assumptions.purchasePrice}
                  onChange={(e) => patchNum('purchasePrice', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular font-semibold"
                />
              </div>

              <div>
                <label className="block text-[#475569] mb-1">Acq. Fee %</label>
                <input
                  type="number"
                  step={0.25}
                  value={assumptions.acquisitionFeePct}
                  onChange={(e) => patchNum('acquisitionFeePct', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular"
                />
              </div>

              <div>
                <label className="block text-[#475569] mb-1">Year-1 Capex ({asset.currency})</label>
                <input
                  type="number"
                  step={50000}
                  value={assumptions.year1OneTimeCapex}
                  onChange={(e) => patchNum('year1OneTimeCapex', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular"
                />
              </div>
            </div>
          </div>

          {/* Revenue & Operating Expenses */}
          <div className="space-y-3 text-xs pt-3 border-t border-[#EAE5DA]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E7C3B]">
              Operations &amp; Escalation
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#475569] mb-1">Occupancy %</label>
                <input
                  type="number"
                  step={0.5}
                  min={0}
                  max={100}
                  value={assumptions.occupancyPct}
                  onChange={(e) => patchNum('occupancyPct', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular font-semibold"
                />
              </div>
              <div>
                <label className="block text-[#475569] mb-1">Rent Growth %</label>
                <input
                  type="number"
                  step={0.25}
                  value={assumptions.annualRentGrowthPct}
                  onChange={(e) => patchNum('annualRentGrowthPct', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular"
                />
              </div>
              <div>
                <label className="block text-[#475569] mb-1">OpEx Ratio % of EGI</label>
                <input
                  type="number"
                  step={1}
                  min={0}
                  max={85}
                  value={assumptions.operatingExpensePct}
                  onChange={(e) => patchNum('operatingExpensePct', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular"
                />
              </div>
              <div>
                <label className="block text-[#475569] mb-1">Annual Capex Reserve</label>
                <input
                  type="number"
                  step={25000}
                  value={assumptions.annualCapexReserve}
                  onChange={(e) => patchNum('annualCapexReserve', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular"
                />
              </div>
            </div>
          </div>

          {/* Debt & Exit */}
          <div className="space-y-3 text-xs pt-3 border-t border-[#EAE5DA]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E7C3B]">
              Debt Financing &amp; Exit
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#475569] mb-1">LTV % (0 = Unlevered)</label>
                <input
                  type="number"
                  step={5}
                  min={0}
                  max={85}
                  value={assumptions.ltvPct}
                  onChange={(e) => patchNum('ltvPct', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular font-semibold"
                />
              </div>
              <div>
                <label className="block text-[#475569] mb-1">Interest Rate %</label>
                <input
                  type="number"
                  step={0.15}
                  min={0}
                  value={assumptions.interestRatePct}
                  onChange={(e) => patchNum('interestRatePct', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular"
                />
              </div>
              <div>
                <label className="block text-[#475569] mb-1">Amortization (0 = IO)</label>
                <select
                  value={assumptions.amortizationYears}
                  onChange={(e) => patchNum('amortizationYears', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829]"
                >
                  <option value={0}>0 Yrs (Interest-Only)</option>
                  <option value={20}>20 Years</option>
                  <option value={25}>25 Years</option>
                  <option value={30}>30 Years</option>
                </select>
              </div>
              <div>
                <label className="block text-[#475569] mb-1">Exit Cap Rate %</label>
                <input
                  type="number"
                  step={0.15}
                  value={assumptions.exitCapRatePct}
                  onChange={(e) => patchNum('exitCapRatePct', e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] pr-tabular font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: KPI Results + Sensitivity Matrix + Cash Flow Table */}
        <div className="xl:col-span-8 space-y-5">
          {!result.valid && (
            <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Invalid Model Inputs:</strong> {result.statusMessage}
              </span>
            </div>
          )}

          {/* Output KPI Ribbon */}
          <div className="bg-white border border-[#DDD7CB] p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
                Modeled Return Metrics ({assumptions.holdYears}-Year Hold)
              </h2>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 bg-[#FBF6EA] border border-[#E6D4AD] text-[#7C5D24]">
                Illustrative projections · Concept demo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pr-tabular">
              <div className="p-3 bg-[#0D1829] text-white">
                <span className="text-[11px] text-slate-300 block">Levered IRR</span>
                <strong className="text-xl text-[#DFC285]">
                  {result.leveredIrrPct !== null ? `${result.leveredIrrPct}%` : 'N/A'}
                </strong>
              </div>
              <div className="p-3 bg-[#F6F4EF] border border-[#DDD7CB]">
                <span className="text-[11px] text-[#475569] block">Unlevered IRR</span>
                <strong className="text-lg text-[#0D1829]">
                  {result.unleveredIrrPct !== null ? `${result.unleveredIrrPct}%` : 'N/A'}
                </strong>
              </div>
              <div className="p-3 bg-[#F6F4EF] border border-[#DDD7CB]">
                <span className="text-[11px] text-[#475569] block">Equity Multiple</span>
                <strong className="text-lg text-[#0D1829]">
                  {result.equityMultiple !== null ? `${result.equityMultiple}x` : 'N/A'}
                </strong>
              </div>
              <div className="p-3 bg-[#F6F4EF] border border-[#DDD7CB]">
                <span className="text-[11px] text-[#475569] block">Entry Cap Rate</span>
                <strong className="text-lg text-[#0D1829]">
                  {result.entryCapRatePct !== null ? `${result.entryCapRatePct}%` : 'N/A'}
                </strong>
              </div>
              <div className="p-3 bg-[#F6F4EF] border border-[#DDD7CB]">
                <span className="text-[11px] text-[#475569] block">Min DSCR / Debt Yield</span>
                <strong className="text-lg text-[#0D1829]">
                  {result.minDscr !== null ? `${result.minDscr}x` : 'N/A'}{' '}
                  <span className="text-xs font-normal text-[#64748B]">
                    / {result.year1DebtYieldPct !== null ? `${result.year1DebtYieldPct}%` : 'N/A'}
                  </span>
                </strong>
              </div>
              <div className="p-3 bg-[#F6F4EF] border border-[#DDD7CB]">
                <span className="text-[11px] text-[#475569] block">Gross Exit Value</span>
                <strong className="text-lg text-[#9E7C3B]">
                  {result.grossExitValuation !== null
                    ? formatPrimusMoney(result.grossExitValuation, asset.currency, true)
                    : 'N/A'}
                </strong>
              </div>
            </div>
          </div>

          {/* Calculation Conventions Toggle */}
          <div className="bg-white border border-[#DDD7CB]">
            <button
              type="button"
              onClick={() => setShowFormulas((s) => !s)}
              className="w-full px-5 py-3 flex items-center justify-between text-xs font-bold text-[#0D1829] bg-[#F6F4EF] cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#9E7C3B]" />
                <span>Calculation Conventions &amp; Auditable Formula Definitions</span>
              </span>
              {showFormulas ? (
                <ChevronUp className="w-4 h-4 text-[#475569]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#475569]" />
              )}
            </button>
            {showFormulas && (
              <div className="p-4 text-[11px] text-[#475569] grid grid-cols-1 md:grid-cols-2 gap-3 leading-relaxed border-t border-[#EAE5DA]">
                <p>
                  <strong className="text-[#0D1829]">1. Operating NOI:</strong> Effective Gross
                  Income = GPR × Occupancy%. OpEx = EGI × OpEx%. Annual NOI = EGI − OpEx.
                </p>
                <p>
                  <strong className="text-[#0D1829]">2. Capital &amp; Debt:</strong> Initial Equity =
                  Price + Acq Fee − Loan. Year-1 one-time capex hits Year 1 only; recurring reserve
                  applies annually. At 0% LTV, DSCR &amp; Debt Yield show <strong>N/A</strong>.
                </p>
                <p>
                  <strong className="text-[#0D1829]">3. Terminal Valuation:</strong> Gross Exit Value
                  = Forward Year N+1 NOI ÷ Exit Cap Rate, less selling costs &amp; remaining loan
                  payoff.
                </p>
                <p>
                  <strong className="text-[#0D1829]">4. Safe IRR Solver:</strong> Bounded
                  sign-change bisection across [Year 0 .. Year N] levered equity cash flows. Returns{' '}
                  <strong>N/A</strong> when no valid root exists.
                </p>
              </div>
            )}
          </div>

          {/* Occupancy × Exit Cap Sensitivity Matrix */}
          <div className="bg-white border border-[#DDD7CB] p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[#0D1829] pr-sans">
                Sensitivity Matrix: Occupancy % vs. Exit Cap Rate % (Projected Levered IRR)
              </h3>
              <span className="text-[11px] text-[#64748B]">Illustrative projections</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border border-[#DDD7CB] pr-tabular">
                <thead className="bg-[#0D1829] text-white">
                  <tr>
                    <th className="p-2.5 text-left">Exit Cap \ Occ</th>
                    {sensitivity.occHeaders.map((occ) => (
                      <th key={occ} className="p-2.5">
                        {occ.toFixed(1)}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DA]">
                  {sensitivity.capRows.map((cap, rIdx) => (
                    <tr key={cap}>
                      <td className="p-2.5 text-left font-bold bg-[#F6F4EF] text-[#0D1829] border-r border-[#DDD7CB]">
                        {cap.toFixed(2)}%
                      </td>
                      {sensitivity.matrix[rIdx].map((cell) => {
                        const isCenter =
                          Math.abs(cell.occupancyPct - assumptions.occupancyPct) < 0.05 &&
                          Math.abs(cell.exitCapRatePct - assumptions.exitCapRatePct) < 0.02;
                        return (
                          <td
                            key={`${cap}-${cell.occupancyPct}`}
                            className={`p-2.5 ${
                              isCenter
                                ? 'bg-[#0D1829] text-[#DFC285] font-bold'
                                : cell.irrPct !== null && cell.irrPct >= 10
                                ? 'bg-[#ECFDF5] text-[#065F46]'
                                : 'bg-white text-[#0D1829]'
                            }`}
                          >
                            {cell.irrPct !== null ? `${cell.irrPct}%` : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Yearly Cash Flow Schedule Table */}
          <div className="bg-white border border-[#DDD7CB] p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[#0D1829] pr-sans">
                Yearly Equity Cash Flow Schedule ({asset.currency})
              </h3>
              <span className="text-[11px] text-[#64748B]">
                Initial Equity Outflow: {formatPrimusMoney(-result.initialEquityInvested, asset.currency)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-[#DDD7CB] pr-tabular whitespace-nowrap">
                <thead className="bg-[#F6F4EF] text-[#0D1829] border-b border-[#DDD7CB]">
                  <tr>
                    <th className="p-2.5 text-left">Period</th>
                    <th className="p-2.5">GPR</th>
                    <th className="p-2.5">EGI</th>
                    <th className="p-2.5">NOI</th>
                    <th className="p-2.5">Recurring &amp; Yr1 Capex</th>
                    <th className="p-2.5">Debt Service</th>
                    <th className="p-2.5">Net Exit Equity</th>
                    <th className="p-2.5 font-bold">Levered Equity CF</th>
                    <th className="p-2.5">DSCR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DA]">
                  <tr className="bg-[#FBF6EA]">
                    <td className="p-2.5 text-left font-bold">Year 0 (Close)</td>
                    <td className="p-2.5 text-[#64748B]">—</td>
                    <td className="p-2.5 text-[#64748B]">—</td>
                    <td className="p-2.5 text-[#64748B]">—</td>
                    <td className="p-2.5 text-[#64748B]">—</td>
                    <td className="p-2.5 text-[#64748B]">—</td>
                    <td className="p-2.5 text-[#64748B]">—</td>
                    <td className="p-2.5 font-bold text-[#991B1B]">
                      {formatPrimusMoney(-result.initialEquityInvested, asset.currency, true)}
                    </td>
                    <td className="p-2.5 text-[#64748B]">N/A</td>
                  </tr>
                  {result.rows.map((row) => (
                    <tr key={row.year} className="hover:bg-[#F6F4EF]/60">
                      <td className="p-2.5 text-left font-semibold text-[#0D1829]">
                        Year {row.year}
                      </td>
                      <td className="p-2.5">{formatPrimusMoney(row.grossPotentialRent, asset.currency, true)}</td>
                      <td className="p-2.5">{formatPrimusMoney(row.effectiveGrossIncome, asset.currency, true)}</td>
                      <td className="p-2.5 font-semibold">{formatPrimusMoney(row.noi, asset.currency, true)}</td>
                      <td className="p-2.5 text-[#475569]">
                        {formatPrimusMoney(row.recurringCapex + row.oneTimeCapex, asset.currency, true)}
                      </td>
                      <td className="p-2.5 text-[#475569]">
                        {row.debtService > 0
                          ? formatPrimusMoney(row.debtService, asset.currency, true)
                          : 'N/A'}
                      </td>
                      <td className="p-2.5 font-semibold text-[#065F46]">
                        {row.netExitEquityProceeds > 0
                          ? formatPrimusMoney(row.netExitEquityProceeds, asset.currency, true)
                          : '—'}
                      </td>
                      <td className="p-2.5 font-bold text-[#0D1829]">
                        {formatPrimusMoney(row.leveredEquityCashFlow, asset.currency, true)}
                      </td>
                      <td className="p-2.5">
                        {row.dscr !== null ? `${row.dscr}x` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
