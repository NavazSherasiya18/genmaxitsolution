import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ArrowRight } from 'lucide-react';
import { ShowcaseProject } from '../../data/showcaseProjects';
import { ProjectBrandLogo } from '../brand/ProjectLogos';

export const PrimusLandingPage: React.FC<{ project: ShowcaseProject }> = ({ project }) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const [selectedFund, setSelectedFund] = useState<'logistics' | 'towers' | 'lifescience'>('towers');
  const [capitalAmount, setCapitalAmount] = useState(2500000);
  const [holdingYears, setHoldingYears] = useState(5);
  const [activeSector, setActiveSector] = useState<'cbd' | 'industrial' | 'science' | 'resi'>('cbd');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lpEmail, setLpEmail] = useState('');
  const [lpRequested, setLpRequested] = useState(false);

  const fundRates = {
    towers: { label: 'Core CBD Commercial Towers', irr: 0.149, yieldPct: '14.9%' },
    logistics: { label: 'Global Intermodal Logistics IV', irr: 0.164, yieldPct: '16.4%' },
    lifescience: { label: 'Boston & Zurich Life Science Labs', irr: 0.138, yieldPct: '13.8%' },
  }[selectedFund];

  const annualDistribution = Math.round(capitalAmount * fundRates.irr);
  const projectedExitValue = Math.round(capitalAmount * Math.pow(1 + fundRates.irr, holdingYears));

  const sectors = {
    cbd: { name: 'Prime CBD Towers (38% Weight)', yield: '14.9% Net IRR', thesis: 'LEED Platinum commercial headquarters anchored by 12-year Fortune 500 leases in Singapore, London, and Frankfurt.' },
    industrial: { name: 'Automated Cold-Chain Logistics (32% Weight)', yield: '16.4% Net IRR', thesis: 'Last-mile port-adjacent automated distribution parks benefiting from global pharmaceutical cold-storage undersupply.' },
    science: { name: 'Wet-Lab Life Sciences (20% Weight)', yield: '13.8% Net IRR', thesis: 'Purpose-built genomic research campuses near Zurich and Cambridge with zero vacancy risk over 8-year horizons.' },
    resi: { name: 'Institutional Build-to-Rent (10% Weight)', yield: '12.6% Net IRR', thesis: 'High-occupancy urban residential towers indexing rents dynamically against sovereign wage growth.' },
  }[activeSector];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F1F5F9]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#F59E0B] text-[#0B0F17] text-xs font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <a href="#top" className="shrink-0">
            <ProjectBrandLogo projectId={project.id} size="md" tone="light" />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest text-slate-300 font-medium">
            <a href="#simulator" className="hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0">Yield Model</a>
            <a href="#performance" className="hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0">Track Record</a>
            <a href="#holdings" className="hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0">Holdings</a>
            <a href="#governance" className="hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0">Governance</a>
          </nav>

          <a
            href="#lp-access"
            className="px-5 py-2.5 rounded-lg bg-[#F59E0B] text-[#0B0F17] font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Investor Prospectus
          </a>
        </div>
      </header>

      {/* 2. Architectural Hero */}
      <section id="top" className="py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
              London EC2 · Singapore Marina Bay · New York
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]" style={{ textWrap: 'balance' }}>
              Institutional Real Estate &amp; High-Yield Private Credit
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Disciplined capital allocation across trophy central business district towers, automated cold-storage logistics hubs, and Tier-1 biomedical campuses delivering consistent quarterly LP distributions.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#simulator" className="px-6 py-3.5 rounded-lg bg-[#F59E0B] text-[#0B0F17] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-amber-400">
                <span>Model Fund Returns</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#holdings" className="px-6 py-3.5 rounded-lg border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider hover:border-[#F59E0B]/60">
                View Active Mandates
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">$16.4B</div>
                <div className="text-xs text-slate-400">Gross Asset Value</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#F59E0B] font-mono tabular-nums">14.9%</div>
                <div className="text-xs text-slate-400">10-Yr Net IRR</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">96.7%</div>
                <div className="text-xs text-slate-400">Portfolio Occupancy</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[420px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
              <img src={project.secondaryImage} alt="Primus Capital Global Commercial Towers" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive LP Capital Yield Simulator */}
      <section id="simulator" className="py-20 bg-[#111724] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 p-8 rounded-2xl bg-[#161E2E] border border-amber-500/25 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-1">Interactive LP Modeling</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Institutional Capital Yield Simulator</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'towers', label: 'Core CBD Towers (14.9%)' },
                { id: 'logistics', label: 'Logistics IV (16.4%)' },
                { id: 'lifescience', label: 'Life Sciences (13.8%)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFund(f.id as any)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                    selectedFund === f.id
                      ? 'bg-[#F59E0B] text-[#0B0F17] border-[#F59E0B]'
                      : 'bg-[#0E131F] text-slate-300 border-slate-700 hover:border-amber-500/40'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Committed Capital Allocation</span>
                <strong className="text-[#F59E0B] font-mono tabular-nums text-base">${(capitalAmount / 1000000).toFixed(2)}M USD</strong>
              </div>
              <input
                type="range"
                min={500000}
                max={25000000}
                step={500000}
                value={capitalAmount}
                onChange={(e) => setCapitalAmount(Number(e.target.value))}
                className="w-full accent-[#F59E0B] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">Holding Horizon:</span>
              <div className="flex gap-2">
                {[3, 5, 10].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setHoldingYears(yr)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                      holdingYears === yr ? 'bg-amber-500/20 text-[#F59E0B] border border-[#F59E0B]' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {yr} Years
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Target Net IRR</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{fundRates.yieldPct}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Annual Cash Dividend</div>
                <div className="text-2xl font-bold text-[#F59E0B] font-mono tabular-nums">${annualDistribution.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">{holdingYears}-Yr Compound Equity</div>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">${projectedExitValue.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl overflow-hidden border border-slate-800 h-72">
              <img src={project.thumbnail} alt="Primus Financial Valuation Analytics" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Backed by sovereign pension mandates and multi-family offices across Europe and APAC. All properties carry investment-grade Fortune 500 anchor tenancy.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Multi-Year Historical Performance Benchmark */}
      <section id="performance" className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#F59E0B]">Audited Track Record</div>
            <h2 className="text-3xl font-bold text-white">5-Year Fund Alpha Over Public REIT Index</h2>
            <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Independent Big-4 audited fund performance demonstrating consistent outperformance (+380 bps average spread) across tightening and expansion credit cycles.
            </p>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111724] border border-slate-800 space-y-4 font-mono">
            {[
              { year: '2022', fund: 14.2, benchmark: 8.1 },
              { year: '2023', fund: 13.8, benchmark: 9.4 },
              { year: '2024', fund: 15.6, benchmark: 10.8 },
              { year: '2025', fund: 16.1, benchmark: 11.2 },
              { year: '2026 YTD', fund: 14.9, benchmark: 10.4 },
            ].map((row) => (
              <div key={row.year} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{row.year}</span>
                  <span>
                    <strong className="text-[#F59E0B]">Primus +{row.fund}%</strong>
                    <span className="text-slate-500"> vs Index +{row.benchmark}%</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#F59E0B]" style={{ width: `${row.fund * 5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Sector Allocation Breakdown */}
      <section className="py-20 bg-[#111724] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-1">Diversified Sector Weighting</div>
              <h2 className="text-3xl font-bold text-white">$16.4B Capital Deployment by Asset Class</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'cbd', label: 'CBD Towers (38%)' },
                { id: 'industrial', label: 'Logistics (32%)' },
                { id: 'science', label: 'Life Sciences (20%)' },
                { id: 'resi', label: 'Residential (10%)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSector(s.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    activeSector === s.id ? 'bg-[#F59E0B] text-[#0B0F17]' : 'bg-[#161E2E] text-slate-300 border border-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#161E2E] border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono text-emerald-400">{sectors.yield}</div>
              <h3 className="text-2xl font-bold text-white">{sectors.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {sectors.thesis}
              </p>
            </div>
            <a href="#lp-access" className="px-6 py-3 rounded-lg bg-[#F59E0B] text-[#0B0F17] font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0">
              Request Sector Memo
            </a>
          </div>
        </div>
      </section>

      {/* 6. Active Global Mandates Table */}
      <section id="holdings" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Active Global Real Estate Mandates</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#111724]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider">
                  <th className="py-4 px-5">Mandate / Tower</th>
                  <th className="py-4 px-5">Market</th>
                  <th className="py-4 px-5 text-right">Valuation</th>
                  <th className="py-4 px-5 text-right">Occupancy</th>
                  <th className="py-4 px-5 text-right">Target IRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {[
                  { name: 'Marina Bay Tower Three', market: 'Singapore CBD', val: '$1.85B', occ: '98.4%', irr: '14.2%' },
                  { name: 'Bishopsgate Financial Plaza', market: 'London EC2', val: '$2.10B', occ: '97.1%', irr: '15.1%' },
                  { name: 'Zurich Life-Science Campus', market: 'Zurich, CH', val: '$940M', occ: '99.2%', irr: '13.8%' },
                  { name: 'Rotterdam Cold-Port Park', market: 'Netherlands', val: '$1.32B', occ: '96.5%', irr: '16.4%' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-white">{row.name}</td>
                    <td className="py-4 px-5 text-slate-400">{row.market}</td>
                    <td className="py-4 px-5 text-right font-mono tabular-nums text-white">{row.val}</td>
                    <td className="py-4 px-5 text-right font-mono tabular-nums text-emerald-400">{row.occ}</td>
                    <td className="py-4 px-5 text-right font-mono tabular-nums text-[#F59E0B] font-bold">{row.irr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Institutional Governance 4 Pillars */}
      <section id="governance" className="py-20 bg-[#111724] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-10">Sovereign-Grade Risk &amp; Governance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '01. Conservative LTV Cap', desc: 'Maximum 45% fund-level non-recourse leverage insulated by 7-year fixed interest rate swaps.' },
              { title: '02. Big-4 Quarterly Audit', desc: 'Independent NAV mark-to-market valuations published within 21 days of quarter close.' },
              { title: '03. Co-Investment Alignment', desc: 'Managing partners commit 4.5% of personal liquid capital alongside institutional LPs.' },
              { title: '04. Direct Dividend Rail', desc: 'Automated quarterly USD, EUR, or SGD distributions straight via SWIFT and Fedwire.' },
            ].map((p, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#161E2E] border border-slate-800 space-y-2">
                <div className="text-sm font-bold text-[#F59E0B]">{p.title}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Investor FAQ & Prospectus CTA */}
      <section id="lp-access" className="py-20">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white text-center">Accredited Investor &amp; Tax Reporting FAQ</h2>
            {[
              { q: 'What is the minimum commitment for qualified institutional purchasers?', a: 'Direct LP sleeves begin at $500,000 USD for qualified family offices and $5,000,000 for custom institutional co-investment tranches.' },
              { q: 'Are quarterly tax distributions and K-1 / PFIC filings automated?', a: 'Yes, investors access digital K-1, Cayman Blocker, and Luxembourg RAIF schedules inside the encrypted LP Portal every February.' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl bg-[#111724] border border-slate-800">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-bold text-white cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#F59E0B] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && <div className="px-5 pb-4 text-xs text-slate-300">{item.a}</div>}
              </div>
            ))}
          </div>

          <div className="p-8 rounded-2xl bg-[#111724] border border-amber-500/25 text-center space-y-5">
            <h3 className="text-2xl font-bold text-white">Request Q4 Institutional Fund Memorandum</h3>
            {lpRequested ? (
              <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-sm font-medium">
                Accreditation Dossier Sent — Partner Relations team notified.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (lpEmail.includes('@')) {
                    setLpRequested(true);
                    showToast('Q4 Institutional Fund Prospectus dispatched.');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  value={lpEmail}
                  onChange={(e) => setLpEmail(e.target.value)}
                  placeholder="Institutional corporate email..."
                  className="flex-1 px-4 py-3 rounded-lg bg-[#0B0F17] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#F59E0B]"
                />
                <button type="submit" className="px-6 py-3 rounded-lg bg-[#F59E0B] text-[#0B0F17] font-bold text-xs uppercase tracking-wider hover:bg-amber-400 cursor-pointer whitespace-nowrap shrink-0">
                  Request Prospectus
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-[#070A10] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <ProjectBrandLogo projectId={project.id} size="sm" tone="light" />
            <p>Institutional real estate and private credit partnership overseeing $16.4B GAV.</p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Mandates</div>
            <div>Core Commercial Towers</div>
            <div>Cold-Chain Logistics</div>
            <div>Life-Science Campuses</div>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Offices</div>
            <div>Bishopsgate, London EC2</div>
            <div>Marina Bay, Singapore</div>
            <div>Park Avenue, New York</div>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Partner Desk</div>
            <div>relations@primuscapital.io</div>
            <div>FCA &amp; MAS Regulated</div>
            <div>© 2026 Primus Capital Partners LLP</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
