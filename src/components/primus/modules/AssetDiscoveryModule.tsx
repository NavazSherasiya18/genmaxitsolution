import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Columns3,
  List,
  Map as MapIcon,
  Search,
  Star,
  X,
} from 'lucide-react';
import { usePrimusStore } from '../../../context/PrimusStoreContext';
import {
  FIXED_FX_TO_USD,
  convertPrimusCurrency,
  formatPrimusMoney,
} from '../../../utils/primusFinance';
import { PrimusStatusBadge } from '../PrimusStatusBadge';
import { PrimusMapSchematic } from '../PrimusMapSchematic';

interface AssetDiscoveryModuleProps {
  onOpenAsset: (slug: string) => void;
  onStartUnderwriting: (assetId: string) => void;
}

export const AssetDiscoveryModule: React.FC<AssetDiscoveryModuleProps> = ({
  onOpenAsset,
  onStartUnderwriting,
}) => {
  const {
    dataset,
    watchlistIds,
    toggleWatchlist,
    compareIds,
    toggleCompare,
    consolidatedCurrency,
  } = usePrimusStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const [compareErr, setCompareErr] = useState<string | null>(null);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);

  const query = searchParams.get('q') || '';
  const marketFilter = searchParams.get('market') || 'all';
  const classFilter = searchParams.get('class') || 'all';
  const stageFilter = searchParams.get('stage') || 'all';
  const minOccupancy = Number(searchParams.get('occ') || '0');
  const viewMode = searchParams.get('view') === 'map' ? 'map' : 'list';
  const sortBy = searchParams.get('sort') || 'featured';
  const watchlistOnly = searchParams.get('saved') === '1';

  const setFilterParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === 'all' || val === '0') {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next, { replace: true });
  };

  const filteredAssets = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = dataset.assets.filter((a) => {
      if (watchlistOnly && !watchlistIds.includes(a.id)) return false;
      if (marketFilter !== 'all' && a.market !== marketFilter) return false;
      if (classFilter !== 'all' && a.assetClass !== classFilter) return false;
      if (stageFilter !== 'all' && a.stage !== stageFilter) return false;
      if (a.occupancyPct < minOccupancy) return false;
      if (q) {
        const hay = `${a.name} ${a.code} ${a.district} ${a.market} ${a.assetClass}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'price_desc') {
      return [...list].sort(
        (a, b) =>
          convertPrimusCurrency(b.askingPrice, b.currency, 'USD') -
          convertPrimusCurrency(a.askingPrice, a.currency, 'USD')
      );
    }
    if (sortBy === 'cap_desc') {
      return [...list].sort(
        (a, b) =>
          b.currentAnnualNoi / b.askingPrice - a.currentAnnualNoi / a.askingPrice
      );
    }
    if (sortBy === 'occ_desc') {
      return [...list].sort((a, b) => b.occupancyPct - a.occupancyPct);
    }
    return list;
  }, [
    dataset.assets,
    query,
    marketFilter,
    classFilter,
    stageFilter,
    minOccupancy,
    sortBy,
    watchlistOnly,
    watchlistIds,
  ]);

  const comparedAssets = dataset.assets.filter((a) => compareIds.includes(a.id));

  return (
    <div className="space-y-5">
      {/* Filter & Search Bar (URL-synchronized for shareable discovery searches) */}
      <div className="bg-white border border-[#DDD7CB] p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setFilterParam('q', e.target.value)}
              placeholder="Search Meridian Logistics Park, London, SGD..."
              aria-label="Search commercial real estate assets"
              className="w-full h-10 pl-9 pr-3 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829]"
            />
          </div>

          <select
            aria-label="Market filter"
            value={marketFilter}
            onChange={(e) => setFilterParam('market', e.target.value)}
            className="md:col-span-2 h-10 px-2.5 bg-white border border-[#DDD7CB] text-[#0D1829]"
          >
            <option value="all">All Markets (12)</option>
            <option value="Singapore">Singapore (SGD)</option>
            <option value="London">London (GBP)</option>
          </select>

          <select
            aria-label="Asset class filter"
            value={classFilter}
            onChange={(e) => setFilterParam('class', e.target.value)}
            className="md:col-span-2 h-10 px-2.5 bg-white border border-[#DDD7CB] text-[#0D1829]"
          >
            <option value="all">All Asset Classes</option>
            <option value="logistics">Logistics</option>
            <option value="office">Office</option>
            <option value="mixed_use">Mixed-Use</option>
          </select>

          <select
            aria-label="Deal stage filter"
            value={stageFilter}
            onChange={(e) => setFilterParam('stage', e.target.value)}
            className="md:col-span-2 h-10 px-2.5 bg-white border border-[#DDD7CB] text-[#0D1829]"
          >
            <option value="all">All Stages</option>
            <option value="screening">Screening</option>
            <option value="underwriting">Underwriting</option>
            <option value="due_diligence">Due Diligence</option>
            <option value="committee">Committee</option>
            <option value="approved">Approved</option>
            <option value="operating_holding">Operating Holding</option>
          </select>

          <select
            aria-label="Minimum occupancy filter"
            value={String(minOccupancy)}
            onChange={(e) => setFilterParam('occ', e.target.value)}
            className="md:col-span-2 h-10 px-2.5 bg-white border border-[#DDD7CB] text-[#0D1829]"
          >
            <option value="0">Any Occupancy</option>
            <option value="90">Occupancy ≥ 90%</option>
            <option value="94">Occupancy ≥ 94%</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EAE5DA] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#475569]">
              Showing {filteredAssets.length} of {dataset.assets.length} commercial assets
            </span>
            <button
              type="button"
              onClick={() => setFilterParam('saved', watchlistOnly ? '' : '1')}
              className={`px-3 py-1.5 border font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                watchlistOnly
                  ? 'bg-[#FBF6EA] border-[#9E7C3B] text-[#0D1829]'
                  : 'bg-[#F6F4EF] border-[#DDD7CB] text-[#475569]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${watchlistOnly ? 'fill-[#9E7C3B] text-[#9E7C3B]' : ''}`} />
              <span>Watchlist ({watchlistIds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCompareDrawer((s) => !s)}
              className="px-3 py-1.5 bg-[#0D1829] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Columns3 className="w-3.5 h-3.5 text-[#D6B572]" />
              <span>Compare Selected ({comparedAssets.length}/3)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="Sort assets"
              value={sortBy}
              onChange={(e) => setFilterParam('sort', e.target.value)}
              className="h-8 px-2 bg-white border border-[#DDD7CB] text-[#0D1829]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_desc">Asking Value (High → Low)</option>
              <option value="cap_desc">Entry Cap Rate (High → Low)</option>
              <option value="occ_desc">Occupancy % (High → Low)</option>
            </select>

            <div className="flex border border-[#DDD7CB] bg-[#F6F4EF]">
              <button
                type="button"
                onClick={() => setFilterParam('view', 'list')}
                className={`px-2.5 py-1.5 inline-flex items-center gap-1 font-semibold cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-[#0D1829]' : 'text-[#475569]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterParam('view', 'map')}
                className={`px-2.5 py-1.5 inline-flex items-center gap-1 font-semibold cursor-pointer ${
                  viewMode === 'map' ? 'bg-white text-[#0D1829]' : 'text-[#475569]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {compareErr && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs flex items-center justify-between">
          <span>{compareErr}</span>
          <button type="button" onClick={() => setCompareErr(null)} className="font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix (Up to 3 Assets in Fixed Demo Consolidated Currency + Native Currency) */}
      {showCompareDrawer && comparedAssets.length > 0 && (
        <div className="bg-white border border-[#9E7C3B] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0D1829] pr-sans">
                Side-by-Side Asset Comparison ({comparedAssets.length}/3)
              </h2>
              <p className="text-[11px] text-[#475569] pr-tabular">
                Common comparison shown in <strong>{consolidatedCurrency}</strong> alongside each
                property’s native currency · Fixed Demo FX: 1 GBP = {FIXED_FX_TO_USD.GBP} USD, 1 SGD ={' '}
                {FIXED_FX_TO_USD.SGD} USD.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCompareDrawer(false)}
              className="p-1.5 border border-[#DDD7CB] text-[#0D1829] cursor-pointer"
              aria-label="Close comparison drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#DDD7CB] pr-tabular">
              <thead className="bg-[#0D1829] text-white">
                <tr>
                  <th className="p-3">Metric</th>
                  {comparedAssets.map((a) => (
                    <th key={a.id} className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span>{a.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleCompare(a.id)}
                          className="text-slate-300 hover:text-white cursor-pointer"
                          aria-label={`Remove ${a.name} from compare`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DA]">
                <tr>
                  <td className="p-3 font-semibold text-[#475569]">Market &amp; Class</td>
                  {comparedAssets.map((a) => (
                    <td key={a.id} className="p-3">
                      {a.market} · {a.assetClass.replace('_', '-')} ({a.currency})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#475569]">Asking Price (Native)</td>
                  {comparedAssets.map((a) => (
                    <td key={a.id} className="p-3 font-bold">
                      {formatPrimusMoney(a.askingPrice, a.currency, true)} ({a.currency})
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#F6F4EF]">
                  <td className="p-3 font-semibold text-[#0D1829]">
                    Asking Price ({consolidatedCurrency} Demo FX)
                  </td>
                  {comparedAssets.map((a) => (
                    <td key={a.id} className="p-3 font-bold text-[#9E7C3B]">
                      {formatPrimusMoney(
                        convertPrimusCurrency(a.askingPrice, a.currency, consolidatedCurrency),
                        consolidatedCurrency,
                        true
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#475569]">Current Annual NOI (Native)</td>
                  {comparedAssets.map((a) => (
                    <td key={a.id} className="p-3">
                      {formatPrimusMoney(a.currentAnnualNoi, a.currency, true)} ({a.currency})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#475569]">Implied Entry Cap Rate</td>
                  {comparedAssets.map((a) => (
                    <td key={a.id} className="p-3 font-bold">
                      {((a.currentAnnualNoi / a.askingPrice) * 100).toFixed(2)}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#475569]">Occupancy / WAULT</td>
                  {comparedAssets.map((a) => (
                    <td key={a.id} className="p-3">
                      {a.occupancyPct}% · {a.waultYears} yrs WAULT
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#475569]">Top Tenant Concentration</td>
                  {comparedAssets.map((a) => {
                    const topLease = a.rentRoll[0];
                    const totalRent = a.rentRoll.reduce((s, r) => s + r.annualRent, 0);
                    const conc = totalRent > 0 ? ((topLease.annualRent / totalRent) * 100).toFixed(0) : '0';
                    return (
                      <td key={a.id} className="p-3">
                        {topLease.tenantName} ({conc}%)
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#475569]">Next Near-Term Expiry</td>
                  {comparedAssets.map((a) => {
                    const nextExp = a.expirySchedule[0];
                    return (
                      <td key={a.id} className="p-3">
                        {nextExp
                          ? `${nextExp.year}: ${nextExp.sqFtExpiring.toLocaleString()} sq ft (${nextExp.pctOfRent}%)`
                          : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main View: Map Schematic or Asset Grid */}
      {viewMode === 'map' ? (
        <PrimusMapSchematic assets={filteredAssets} onOpenAsset={onOpenAsset} />
      ) : filteredAssets.length === 0 ? (
        <div className="bg-white border border-[#DDD7CB] p-10 text-center text-xs text-[#64748B]">
          No commercial properties match the current filters. Adjust filters or clear search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAssets.map((asset) => {
            const isSaved = watchlistIds.includes(asset.id);
            const isCompared = compareIds.includes(asset.id);
            const capRate = ((asset.currentAnnualNoi / asset.askingPrice) * 100).toFixed(2);
            return (
              <div
                key={asset.id}
                className="bg-white border border-[#DDD7CB] flex flex-col justify-between hover:border-[#9E7C3B] transition-colors"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-[#EFECE5] overflow-hidden border-b border-[#DDD7CB]">
                    <img
                      src={asset.gallery[0].url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#0D1829]/90 text-white px-2.5 py-1 text-[11px] font-mono font-bold">
                      {asset.code} · {asset.currency}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWatchlist(asset.id)}
                      className="absolute top-3 right-3 p-1.5 bg-white/95 border border-[#DDD7CB] text-[#0D1829] cursor-pointer"
                      aria-label={isSaved ? 'Remove from watchlist' : 'Save to watchlist'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isSaved ? 'fill-[#9E7C3B] text-[#9E7C3B]' : 'text-[#475569]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E7C3B]">
                        {asset.market} · {asset.assetClass.replace('_', '-')}
                      </span>
                      <PrimusStatusBadge status={asset.stage} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0D1829] pr-sans">{asset.name}</h3>
                      <p className="text-xs text-[#475569]">{asset.district}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-[#EAE5DA] text-xs pr-tabular">
                      <div>
                        <span className="text-[#64748B] block">Asking</span>
                        <strong className="text-[#0D1829]">
                          {formatPrimusMoney(asset.askingPrice, asset.currency, true)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Entry Cap</span>
                        <strong className="text-[#9E7C3B]">{capRate}%</strong>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Occupancy</span>
                        <strong className="text-[#0D1829]">{asset.occupancyPct}%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <label className="inline-flex items-center gap-1.5 text-[#475569] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => {
                        const res = toggleCompare(asset.id);
                        if (!res.ok) setCompareErr(res.error || null);
                      }}
                      className="accent-[#9E7C3B]"
                    />
                    <span>Compare</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onStartUnderwriting(asset.id)}
                      className="px-2.5 py-1.5 border border-[#DDD7CB] bg-[#F6F4EF] hover:border-[#9E7C3B] font-semibold text-[#0D1829] cursor-pointer"
                    >
                      Underwrite
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenAsset(asset.slug)}
                      className="px-3 py-1.5 bg-[#0D1829] hover:bg-[#192D4D] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Profile</span>
                      <ArrowRight className="w-3 h-3 text-[#D6B572]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
