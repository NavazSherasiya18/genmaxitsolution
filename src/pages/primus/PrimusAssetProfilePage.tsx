import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  Check,
  Columns3,
  FileSpreadsheet,
  FileText,
  Layers,
  MapPin,
  Star,
} from 'lucide-react';
import { PrimusBrandLogo, usePrimusFavicon } from '../../components/primus/PrimusBrandLogo';
import { PrimusDocumentPreviewModal } from '../../components/primus/PrimusModals';
import { PrimusStatusBadge } from '../../components/primus/PrimusStatusBadge';
import { usePrimusStore } from '../../context/PrimusStoreContext';
import { DataRoomDoc } from '../../data/primusCatalog';
import {
  FIXED_FX_TO_USD,
  convertPrimusCurrency,
  formatPrimusMoney,
  runUnderwritingModel,
} from '../../utils/primusFinance';

export const PrimusAssetProfilePage: React.FC = () => {
  usePrimusFavicon(true);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    dataset,
    setActiveAssetId,
    watchlistIds,
    toggleWatchlist,
    compareIds,
    toggleCompare,
    consolidatedCurrency,
  } = usePrimusStore();

  const asset = dataset.assets.find((a) => a.slug === slug);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<DataRoomDoc | null>(null);
  const [compareFeedback, setCompareFeedback] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setSelectedPhotoIdx(0);
    if (asset) {
      document.title = `${asset.name} | Primus Capital Interactive Concept Demo`;
    } else {
      document.title = 'Property Not Found | Primus Capital';
    }
  }, [asset, slug]);

  if (!asset) {
    return (
      <div className="primus-showcase min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <PrimusBrandLogo variant="full" tone="dark" />
        <h1 className="text-3xl pr-serif text-[#0D1829]">Commercial Property Not Found</h1>
        <p className="text-sm text-[#475569] max-w-md">
          The requested deal dossier slug does not match any active sample property in the Primus
          Capital dataset.
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/showcase/primus-capital/app/discovery"
            className="px-4 py-2.5 bg-[#0D1829] text-white text-xs font-semibold"
          >
            Return to Asset Discovery
          </Link>
          <Link
            to="/showcase/primus-capital"
            className="px-4 py-2.5 border border-[#DDD7CB] bg-white text-xs font-semibold text-[#0D1829]"
          >
            Primus Overview
          </Link>
        </div>
      </div>
    );
  }

  const sqMeters = Math.round(asset.floorAreaSqFt * 0.092903);
  const leasedSqFt = Math.round(asset.floorAreaSqFt * (asset.occupancyPct / 100));
  const vacantSqFt = Math.max(0, asset.floorAreaSqFt - leasedSqFt);
  const entryCap = ((asset.currentAnnualNoi / asset.askingPrice) * 100).toFixed(2);
  const baseResult = runUnderwritingModel(asset.scenarios.base);
  const docs = dataset.documents.filter((d) => d.assetId === asset.id);
  const isSaved = watchlistIds.includes(asset.id);
  const isCompared = compareIds.includes(asset.id);
  const heroPhoto = asset.gallery[selectedPhotoIdx] || asset.gallery[0];

  const handleStartUnderwriting = () => {
    setActiveAssetId(asset.id);
    navigate('/showcase/primus-capital/app/underwriting');
  };

  return (
    <div className="primus-showcase min-h-screen flex flex-col">
      {/* Discreet Concept Banner + Workspace Navigation Bar */}
      <div className="bg-[#07101D] text-slate-300 border-b border-slate-800 px-4 sm:px-8 py-2 text-[11px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[#DFC285]">
            Interactive Concept Demo
          </span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="hidden sm:inline">Fictional sample property &amp; financial dossier</span>
        </div>
        <Link
          to="/"
          className="text-slate-200 hover:text-[#DFC285] font-semibold inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Genmax Portfolio</span>
        </Link>
      </div>

      <header className="bg-white border-b border-[#DDD7CB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/showcase/primus-capital" className="shrink-0">
              <PrimusBrandLogo variant="full" tone="dark" size="sm" />
            </Link>
            <span className="hidden md:inline text-[#CBD5E1]">/</span>
            <Link
              to="/showcase/primus-capital/app/discovery"
              className="hidden md:inline text-xs font-semibold text-[#475569] hover:text-[#0D1829] truncate"
            >
              Asset Discovery
            </Link>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <button
              type="button"
              onClick={() => toggleWatchlist(asset.id)}
              className={`px-3 py-2 border font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-[#FBF6EA] border-[#9E7C3B] text-[#0D1829]'
                  : 'bg-white border-[#DDD7CB] text-[#475569]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#9E7C3B] text-[#9E7C3B]' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const res = toggleCompare(asset.id);
                if (!res.ok) setCompareFeedback(res.error || null);
                else setCompareFeedback(isCompared ? 'Removed from comparison.' : 'Added to Discovery comparison drawer.');
              }}
              className={`px-3 py-2 border font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                isCompared
                  ? 'bg-[#0D1829] border-[#0D1829] text-white'
                  : 'bg-white border-[#DDD7CB] text-[#0D1829]'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5 text-[#D6B572]" />
              <span className="hidden sm:inline">{isCompared ? 'In Compare' : 'Compare'}</span>
            </button>

            <button
              type="button"
              onClick={handleStartUnderwriting}
              className="px-4 py-2 bg-[#0D1829] hover:bg-[#192D4D] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-[#D6B572]" />
              <span>Start Underwriting</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8 flex-1">
        {compareFeedback && (
          <div className="p-3 bg-[#FBF6EA] border border-[#E6D4AD] text-xs text-[#0D1829] flex items-center justify-between">
            <span>{compareFeedback}</span>
            <Link
              to="/showcase/primus-capital/app/discovery"
              className="font-bold text-[#9E7C3B] hover:underline"
            >
              Open Comparison Matrix →
            </Link>
          </div>
        )}

        {/* Property Header + Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-3">
            <div className="aspect-[16/10] bg-[#EFECE5] border border-[#DDD7CB] overflow-hidden relative">
              <img
                src={heroPhoto.url}
                alt={heroPhoto.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#07101D]/85 to-transparent p-4 text-white">
                <p className="text-xs font-medium text-slate-200">{heroPhoto.caption}</p>
              </div>
            </div>

            {asset.gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {asset.gallery.map((photo, idx) => (
                  <button
                    key={photo.caption}
                    type="button"
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className={`w-28 aspect-[16/10] border-2 overflow-hidden shrink-0 cursor-pointer ${
                      idx === selectedPhotoIdx ? 'border-[#9E7C3B]' : 'border-[#DDD7CB] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white border border-[#DDD7CB] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-[#9E7C3B]">
                {asset.code} · {asset.market.toUpperCase()} ({asset.currency})
              </span>
              <PrimusStatusBadge status={asset.stage} />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl pr-serif text-[#0D1829] leading-tight">
                {asset.name}
              </h1>
              <p className="text-xs text-[#475569] mt-1.5 inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#9E7C3B]" />
                <span>
                  {asset.district} · Built {asset.yearBuilt} · {asset.sustainabilityRating}
                </span>
              </p>
            </div>

            <p className="text-sm text-[#475569] leading-relaxed">{asset.summary}</p>

            {/* Primary Financial Basis */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#F6F4EF] border border-[#DDD7CB] text-xs pr-tabular">
              <div>
                <span className="text-[#64748B] block">Asking Price ({asset.currency})</span>
                <strong className="text-lg text-[#0D1829]">
                  {formatPrimusMoney(asset.askingPrice, asset.currency, true)}
                </strong>
                <span className="block text-[11px] text-[#64748B]">
                  ≈{' '}
                  {formatPrimusMoney(
                    convertPrimusCurrency(asset.askingPrice, asset.currency, consolidatedCurrency),
                    consolidatedCurrency,
                    true
                  )}{' '}
                  {consolidatedCurrency}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">In-Place Annual NOI</span>
                <strong className="text-lg text-[#9E7C3B]">
                  {formatPrimusMoney(asset.currentAnnualNoi, asset.currency, true)}
                </strong>
                <span className="block text-[11px] text-[#0D1829] font-semibold">
                  {entryCap}% Entry Cap Rate
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Total Floor Area</span>
                <strong className="text-sm text-[#0D1829]">
                  {asset.floorAreaSqFt.toLocaleString()} sq ft
                </strong>
                <span className="block text-[11px] text-[#64748B]">
                  ({sqMeters.toLocaleString()} sq m)
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Occupancy / WAULT</span>
                <strong className="text-sm text-[#0D1829]">
                  {asset.occupancyPct}% · {asset.waultYears} yrs
                </strong>
                <span className="block text-[11px] text-[#64748B]">
                  {vacantSqFt.toLocaleString()} sq ft vacant
                </span>
              </div>
            </div>

            {/* Base Modeled Preview Strip */}
            <div className="p-3.5 bg-[#0D1829] text-white flex items-center justify-between gap-3 text-xs pr-tabular">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#DFC285] block">
                  Base Underwriting Snapshot · Illustrative Projection
                </span>
                <strong className="text-sm">
                  {baseResult.leveredIrrPct !== null ? `${baseResult.leveredIrrPct}% Levered IRR` : 'N/A'}{' '}
                  · {baseResult.equityMultiple !== null ? `${baseResult.equityMultiple}x MOIC` : 'N/A'}
                </strong>
              </div>
              <button
                type="button"
                onClick={handleStartUnderwriting}
                className="px-3 py-1.5 bg-[#9E7C3B] hover:bg-[#B8934A] text-[#07101D] font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Open Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Vacancy Split + Rent Roll Table + Expiry Ladder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#DDD7CB] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#0D1829] pr-sans">
                Certified Rent Roll &amp; Occupancy Split ({asset.currency})
              </h2>
              <span className="text-xs text-[#475569] pr-tabular">
                Leased: {leasedSqFt.toLocaleString()} sq ft · Vacant: {vacantSqFt.toLocaleString()} sq ft
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#DDD7CB] pr-tabular">
                <thead className="bg-[#0D1829] text-white">
                  <tr>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Tenant</th>
                    <th className="p-3">Sector</th>
                    <th className="p-3">Area (sq ft)</th>
                    <th className="p-3">Annual Rent</th>
                    <th className="p-3">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DA]">
                  {asset.rentRoll.map((u) => (
                    <tr key={u.unitId} className={u.status === 'vacant' ? 'bg-[#FFF7ED]' : ''}>
                      <td className="p-3 font-mono font-bold text-[#0D1829]">{u.unitId}</td>
                      <td className="p-3 font-semibold text-[#0D1829]">{u.tenantName}</td>
                      <td className="p-3 text-[#475569]">{u.sector}</td>
                      <td className="p-3">{u.areaSqFt.toLocaleString()}</td>
                      <td className="p-3 font-semibold">
                        {u.annualRent > 0 ? formatPrimusMoney(u.annualRent, asset.currency) : '—'}
                      </td>
                      <td className="p-3">{u.leaseExpiryYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Lease Expiry Breakdown */}
            <div className="bg-white border border-[#DDD7CB] p-6 space-y-4">
              <h2 className="text-base font-bold text-[#0D1829] pr-sans">Lease Expiry Schedule</h2>
              <div className="space-y-3 text-xs pr-tabular">
                {asset.expirySchedule.map((b) => (
                  <div key={b.year} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#0D1829]">{b.year}</span>
                      <span className="text-[#475569]">
                        {b.sqFtExpiring.toLocaleString()} sq ft ({b.pctOfRent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#EFECE5]">
                      <div className="h-full bg-[#9E7C3B]" style={{ width: `${b.pctOfRent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Room Preview Packs */}
            <div className="bg-white border border-[#DDD7CB] p-6 space-y-4">
              <h2 className="text-base font-bold text-[#0D1829] pr-sans">
                Property Data Room ({docs.length})
              </h2>
              {docs.length === 0 ? (
                <p className="text-xs text-[#64748B]">
                  Sample documents are seeded in active Diligence / Operating deals such as Meridian
                  Logistics Park.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {docs.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="w-full text-left p-3 border border-[#DDD7CB] bg-[#F6F4EF] hover:border-[#9E7C3B] flex items-center justify-between gap-2 text-xs cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-2 min-w-0">
                        {doc.fileType.includes('CSV') ? (
                          <FileSpreadsheet className="w-4 h-4 text-[#065F46] shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-[#9E7C3B] shrink-0" />
                        )}
                        <span className="font-bold text-[#0D1829] truncate">{doc.title}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-[#9E7C3B] shrink-0">Open</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FX Footnote */}
        <p className="text-[11px] text-[#64748B] border-t border-[#DDD7CB] pt-4">
          Native reporting shown in {asset.currency}. Optional consolidated equivalents use fixed demo FX rates: 1 GBP = {FIXED_FX_TO_USD.GBP} USD, 1 SGD = {FIXED_FX_TO_USD.SGD} USD.
        </p>
      </main>

      <PrimusDocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  );
};
