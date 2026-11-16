import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { AureliaLayout } from '../../components/aurelia/AureliaLayout';
import { AureliaProductCard } from '../../components/aurelia/AureliaProductCard';
import {
  AURELIA_PRODUCTS,
  AURELIA_CATEGORIES,
  EDITORIAL_COLLECTIONS,
  AureliaCategory,
  AureliaMetal,
  AureliaGemstone,
  AureliaCollectionSlug,
} from '../../data/aureliaCatalog';

type PriceBracketId = 'all' | 'under-200k' | '200k-500k' | 'above-500k';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const METALS: AureliaMetal[] = ['Platinum 950', '18K Yellow Gold', '18K Rose Gold', '18K White Gold'];
const GEMSTONES: AureliaGemstone[] = [
  'Diamond',
  'Colombian Emerald',
  'Burmese Sapphire',
  'Freshwater Pearl',
];

const PRICE_BRACKETS: { id: PriceBracketId; label: string }[] = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-200k', label: 'Under ₹2,00,000' },
  { id: '200k-500k', label: '₹2,00,000 – ₹5,00,000' },
  { id: 'above-500k', label: 'Above ₹5,00,000' },
];

export const AureliaShopPage: React.FC = () => {
  const { collectionSlug } = useParams<{ collectionSlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isSearchRoute = location.pathname.endsWith('/search');

  const [selectedCategory, setSelectedCategory] = useState<AureliaCategory | 'All'>(() => {
    const c = searchParams.get('category');
    return AURELIA_CATEGORIES.some((cat) => cat.name === c) ? (c as AureliaCategory) : 'All';
  });

  const [selectedCollection, setSelectedCollection] = useState<AureliaCollectionSlug | 'All'>(() => {
    if (collectionSlug && EDITORIAL_COLLECTIONS.some((col) => col.slug === collectionSlug)) {
      return collectionSlug as AureliaCollectionSlug;
    }
    const qCol = searchParams.get('collection');
    return EDITORIAL_COLLECTIONS.some((col) => col.slug === qCol)
      ? (qCol as AureliaCollectionSlug)
      : 'All';
  });

  const [selectedMetal, setSelectedMetal] = useState<AureliaMetal | 'All'>(() => {
    const m = searchParams.get('metal');
    return METALS.includes(m as AureliaMetal) ? (m as AureliaMetal) : 'All';
  });

  const [selectedGemstone, setSelectedGemstone] = useState<AureliaGemstone | 'All'>(() => {
    const g = searchParams.get('gemstone');
    return GEMSTONES.includes(g as AureliaGemstone) ? (g as AureliaGemstone) : 'All';
  });

  const [priceBracket, setPriceBracket] = useState<PriceBracketId>(() => {
    const p = searchParams.get('price');
    return PRICE_BRACKETS.some((b) => b.id === p) ? (p as PriceBracketId) : 'all';
  });

  const [searchTerm, setSearchTerm] = useState<string>(() => searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const s = searchParams.get('sort');
    return s === 'price-asc' || s === 'price-desc' || s === 'newest' ? s : 'featured';
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL route collection slug & query updates
  useEffect(() => {
    if (collectionSlug && EDITORIAL_COLLECTIONS.some((c) => c.slug === collectionSlug)) {
      setSelectedCollection(collectionSlug as AureliaCollectionSlug);
    } else if (!collectionSlug && !searchParams.get('collection')) {
      setSelectedCollection('All');
    }
  }, [collectionSlug, searchParams]);

  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat && AURELIA_CATEGORIES.some((c) => c.name === urlCat)) {
      setSelectedCategory(urlCat as AureliaCategory);
    } else if (!urlCat) {
      setSelectedCategory('All');
    }
    const urlQuery = searchParams.get('q');
    if (urlQuery !== null) {
      setSearchTerm(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileFiltersOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileFiltersOpen]);

  const activeCollectionObj =
    selectedCollection !== 'All'
      ? EDITORIAL_COLLECTIONS.find((c) => c.slug === selectedCollection)
      : undefined;

  const filteredProducts = useMemo(() => {
    const fold = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const q = fold(searchTerm.trim());

    const list = AURELIA_PRODUCTS.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedCollection !== 'All' && p.collectionSlug !== selectedCollection) return false;
      if (selectedMetal !== 'All' && p.metal !== selectedMetal) return false;
      if (selectedGemstone !== 'All' && p.gemstone !== selectedGemstone) return false;

      if (priceBracket === 'under-200k' && p.priceInr >= 200000) return false;
      if (priceBracket === '200k-500k' && (p.priceInr < 200000 || p.priceInr > 500000)) return false;
      if (priceBracket === 'above-500k' && p.priceInr <= 500000) return false;

      if (q) {
        const haystack = fold(
          `${p.name} ${p.subtitle} ${p.category} ${p.metal} ${p.gemstone} ${p.collectionName} ${p.description}`
        );
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.priceInr - b.priceInr);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.priceInr - a.priceInr);
    }
    if (sortBy === 'newest') {
      return [...list].sort((a, b) => b.releaseOrder - a.releaseOrder);
    }
    return [...list].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.releaseOrder - a.releaseOrder;
    });
  }, [
    selectedCategory,
    selectedCollection,
    selectedMetal,
    selectedGemstone,
    priceBracket,
    searchTerm,
    sortBy,
  ]);

  const activeFilters: { key: string; label: string; onClear: () => void }[] = [];
  if (selectedCategory !== 'All') {
    activeFilters.push({
      key: 'category',
      label: `Category: ${selectedCategory}`,
      onClear: () => {
        setSelectedCategory('All');
        const next = new URLSearchParams(searchParams);
        next.delete('category');
        setSearchParams(next);
      },
    });
  }
  if (selectedCollection !== 'All') {
    activeFilters.push({
      key: 'collection',
      label: `Collection: ${activeCollectionObj?.name || selectedCollection}`,
      onClear: () => {
        setSelectedCollection('All');
        if (collectionSlug) navigate('/showcase/aurelia/shop');
      },
    });
  }
  if (selectedMetal !== 'All') {
    activeFilters.push({
      key: 'metal',
      label: `Metal: ${selectedMetal}`,
      onClear: () => setSelectedMetal('All'),
    });
  }
  if (selectedGemstone !== 'All') {
    activeFilters.push({
      key: 'gemstone',
      label: `Stone: ${selectedGemstone}`,
      onClear: () => setSelectedGemstone('All'),
    });
  }
  if (priceBracket !== 'all') {
    const label = PRICE_BRACKETS.find((b) => b.id === priceBracket)?.label || priceBracket;
    activeFilters.push({
      key: 'price',
      label: `Price: ${label}`,
      onClear: () => setPriceBracket('all'),
    });
  }
  if (searchTerm.trim()) {
    activeFilters.push({
      key: 'search',
      label: `Search: "${searchTerm.trim()}"`,
      onClear: () => {
        setSearchTerm('');
        const next = new URLSearchParams(searchParams);
        next.delete('q');
        setSearchParams(next);
      },
    });
  }

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setSelectedMetal('All');
    setSelectedGemstone('All');
    setPriceBracket('all');
    setSearchTerm('');
    setSortBy('featured');
    if (collectionSlug) {
      navigate('/showcase/aurelia/shop');
    } else {
      setSearchParams({});
    }
  };

  const renderFilterSections = () => (
    <div className="space-y-7 text-xs">
      {/* Category */}
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8F6D39] font-semibold mb-3">
          Category
        </div>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#141312] text-[#FAF7F2] font-semibold'
                : 'text-[#2B2825] hover:bg-[#F3ECE1]'
            }`}
          >
            All Categories ({AURELIA_PRODUCTS.length})
          </button>
          {AURELIA_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-[#141312] text-[#FAF7F2] font-semibold'
                  : 'text-[#2B2825] hover:bg-[#F3ECE1]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Collection */}
      <div className="pt-5 border-t border-[#E2D7C6]">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8F6D39] font-semibold mb-3">
          Editorial Collection
        </div>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedCollection('All');
              if (collectionSlug) navigate('/showcase/aurelia/shop');
            }}
            className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer ${
              selectedCollection === 'All'
                ? 'bg-[#141312] text-[#FAF7F2] font-semibold'
                : 'text-[#2B2825] hover:bg-[#F3ECE1]'
            }`}
          >
            All Collections
          </button>
          {EDITORIAL_COLLECTIONS.map((col) => (
            <button
              key={col.slug}
              type="button"
              onClick={() => setSelectedCollection(col.slug)}
              className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer ${
                selectedCollection === col.slug
                  ? 'bg-[#141312] text-[#FAF7F2] font-semibold'
                  : 'text-[#2B2825] hover:bg-[#F3ECE1]'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="pt-5 border-t border-[#E2D7C6]">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8F6D39] font-semibold mb-3">
          Price Range (INR)
        </div>
        <div className="space-y-1.5">
          {PRICE_BRACKETS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setPriceBracket(b.id)}
              className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer ${
                priceBracket === b.id
                  ? 'bg-[#141312] text-[#FAF7F2] font-semibold'
                  : 'text-[#2B2825] hover:bg-[#F3ECE1]'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metal */}
      <div className="pt-5 border-t border-[#E2D7C6]">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8F6D39] font-semibold mb-3">
          Precious Metal
        </div>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setSelectedMetal('All')}
            className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer ${
              selectedMetal === 'All'
                ? 'bg-[#141312] text-[#FAF7F2] font-semibold'
                : 'text-[#2B2825] hover:bg-[#F3ECE1]'
            }`}
          >
            All Metals
          </button>
          {METALS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMetal(m)}
              className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer ${
                selectedMetal === m
                  ? 'bg-[#141312] text-[#FAF7F2] font-semibold'
                  : 'text-[#2B2825] hover:bg-[#F3ECE1]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Gemstone */}
      <div className="pt-5 border-t border-[#E2D7C6]">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8F6D39] font-semibold mb-3">
          Primary Stone
        </div>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setSelectedGemstone('All')}
            className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer ${
              selectedGemstone === 'All'
                ? 'bg-[#141312] text-[#FAF7F2] font-semibold'
                : 'text-[#2B2825] hover:bg-[#F3ECE1]'
            }`}
          >
            All Gemstones
          </button>
          {GEMSTONES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGemstone(g)}
              className={`w-full text-left py-1.5 px-2 transition-colors cursor-pointer ${
                selectedGemstone === g
                  ? 'bg-[#141312] text-[#FAF7F2] font-semibold'
                  : 'text-[#2B2825] hover:bg-[#F3ECE1]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const pageHeading = activeCollectionObj
    ? activeCollectionObj.name
    : isSearchRoute
      ? 'Search the Maison Archive'
      : selectedCategory !== 'All'
        ? selectedCategory
        : 'All High Jewelry Creations';

  return (
    <AureliaLayout pageTitle={pageHeading}>
      {/* Page Banner */}
      <section className="bg-[#F3ECE1] border-b border-[#E2D7C6] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold mb-2">
              {activeCollectionObj ? activeCollectionObj.origin : 'Paris · Milan Atelier Catalog'}
            </div>
            <h1 className="aur-serif text-4xl sm:text-5xl font-semibold text-[#141312]">
              {pageHeading}
            </h1>
            <p className="text-sm text-[#2B2825] mt-3 leading-relaxed">
              {activeCollectionObj
                ? activeCollectionObj.description
                : 'Browse 22 heirloom silhouettes crafted in certified Platinum 950 and recycled 18K gold. Filter by metal, gemstone, collection, or INR price range.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Toolbar + Grid */}
      <section className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Mobile Filter Trigger + Sort Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2D7C6]">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 border border-[#141312] text-xs uppercase tracking-[0.15em] font-medium bg-white cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFilters.length > 0 && (
                  <span className="tabular-nums text-[#8F6D39] font-semibold">
                    ({activeFilters.length})
                  </span>
                )}
              </button>

              <div className="relative flex-1 min-w-[220px] max-w-md">
                <Search className="w-4 h-4 text-[#665E55] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Étoile, emerald, platinum, choker..."
                  aria-label="Filter catalog by search keyword"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D8CBB8] text-xs sm:text-sm text-[#141312] placeholder-[#7A7167] focus:border-[#8F6D39] focus:outline-none"
                />
              </div>

              <span className="text-xs text-[#665E55] tabular-nums">
                Showing {filteredProducts.length} of {AURELIA_PRODUCTS.length} pieces
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <label htmlFor="aurelia-sort-select" className="text-xs uppercase tracking-[0.14em] text-[#665E55]">
                Sort:
              </label>
              <select
                id="aurelia-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-white border border-[#D8CBB8] text-xs text-[#141312] focus:border-[#8F6D39] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Pieces</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="py-4 flex flex-wrap items-center gap-2 border-b border-[#E2D7C6]">
              {activeFilters.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onClear}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE3D2] border border-[#D8CBB8] text-xs text-[#141312] hover:border-[#8F6D39] cursor-pointer"
                >
                  <span>{chip.label}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-[0.14em] text-[#8F6D39] font-semibold hover:text-[#141312] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear all</span>
              </button>
            </div>
          )}

          {/* Sidebar + Product Grid */}
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="hidden lg:block lg:col-span-3 border border-[#E2D7C6] bg-white p-6">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E2D7C6]">
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#141312]">
                  Refine Catalog
                </span>
                {activeFilters.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[11px] text-[#8F6D39] hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
              {renderFilterSections()}
            </aside>

            <div className="lg:col-span-9">
              {filteredProducts.length === 0 ? (
                <div className="border border-[#E2D7C6] bg-white p-12 text-center space-y-4">
                  <div className="aur-serif text-3xl font-semibold text-[#141312]">
                    No matching creations found
                  </div>
                  <p className="text-sm text-[#665E55] max-w-md mx-auto">
                    Try clearing one or more active filters or searching by gemstone, collection, or precious metal.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#2B2825] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <AureliaProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-[#141312]/60 backdrop-blur-xs"
          onClick={() => setMobileFiltersOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Filter jewelry catalog"
        >
          <div
            className="w-80 max-w-[85vw] bg-[#FAF7F2] h-full p-6 overflow-y-auto border-r border-[#E2D7C6]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E2D7C6]">
              <span className="aur-serif text-2xl font-semibold text-[#141312]">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-[#665E55] hover:text-[#141312] cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderFilterSections()}
            <div className="mt-8 pt-4 border-t border-[#E2D7C6] grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="py-2.5 border border-[#D8CBB8] text-xs uppercase tracking-[0.14em] font-medium cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="py-2.5 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.14em] font-medium cursor-pointer"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </AureliaLayout>
  );
};
