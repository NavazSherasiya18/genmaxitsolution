import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAureliaStore } from '../../context/AureliaStoreContext';
import { EDITORIAL_COLLECTIONS, formatInr } from '../../data/aureliaCatalog';
import { AureliaBrandLogo } from './AureliaBrandLogo';

interface AureliaLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const AureliaLayout: React.FC<AureliaLayoutProps> = ({ children, pageTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    hydratedBag,
    bagCount,
    bagSubtotalInr,
    wishlist,
    isBagOpen,
    openBag,
    closeBag,
    updateBagQuantity,
    removeFromBag,
    toastMessage,
    dismissToast,
  } = useAureliaStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = pageTitle
      ? `${pageTitle} — Aurélia & Co. Interactive Concept Store`
      : 'Aurélia & Co. — Paris & Milan High Jewelry · Interactive Concept Store';
    return () => {
      document.title = 'Genmax IT Solution — Web Engineering, SEO & Digital Growth Agency';
    };
  }, [pageTitle]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isBagOpen) closeBag();
        if (searchOpen) setSearchOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isBagOpen, searchOpen, mobileMenuOpen, closeBag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    navigate(q ? `/showcase/aurelia/search?q=${encodeURIComponent(q)}` : '/showcase/aurelia/search');
  };

  const currentCategoryParam = new URLSearchParams(location.search).get('category');

  const navItems = [
    {
      label: 'All Jewelry',
      to: '/showcase/aurelia/shop',
      isActive: location.pathname === '/showcase/aurelia/shop' && !currentCategoryParam,
    },
    {
      label: 'Rings',
      to: '/showcase/aurelia/shop?category=Rings',
      isActive: currentCategoryParam === 'Rings',
    },
    {
      label: 'Earrings',
      to: '/showcase/aurelia/shop?category=Earrings',
      isActive: currentCategoryParam === 'Earrings',
    },
    {
      label: 'Necklaces',
      to: '/showcase/aurelia/shop?category=Necklaces',
      isActive: currentCategoryParam === 'Necklaces',
    },
    {
      label: 'Bracelets',
      to: '/showcase/aurelia/shop?category=Bracelets',
      isActive: currentCategoryParam === 'Bracelets',
    },
    {
      label: 'Bridal',
      to: '/showcase/aurelia/shop?category=Bridal',
      isActive: currentCategoryParam === 'Bridal',
    },
    {
      label: 'Collections',
      to: '/showcase/aurelia/collections/l-etoile',
      isActive: location.pathname.startsWith('/showcase/aurelia/collections/'),
    },
    {
      label: 'House of Aurélia',
      to: '/showcase/aurelia/house',
      isActive: location.pathname === '/showcase/aurelia/house',
    },
  ];

  return (
    <div className="aurelia-storefront min-h-screen flex flex-col bg-[#FAF7F2] text-[#141312] selection:bg-[#EDE3D2] selection:text-[#141312]">
      {/* Discreet Genmax Concept Store Attribution Bar */}
      <div className="bg-[#141312] text-[#FAF7F2] border-b border-[#2B2825] text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span className="uppercase tracking-[0.18em] text-[#D2B47D] font-semibold shrink-0">
              Interactive Concept Store
            </span>
            <span className="text-[#665E55] hidden sm:inline" aria-hidden="true">
              |
            </span>
            <span className="text-[#CFC5B6] hidden md:inline truncate">
              Complimentary Insured Vault Dispatch Across India · Fictional Concept Catalog
            </span>
          </div>

          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-[#FAF7F2] hover:text-[#D2B47D] transition-colors font-medium shrink-0 whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Genmax Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Symmetrical Two-Tier Haute Joaillerie E-Commerce Masthead */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E2D7C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tier 1: Balanced 3-Column Utility + Centered Crest Logo + Commerce Actions */}
          <div className="h-[68px] sm:h-[76px] grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* Left Column: Mobile Menu / Desktop Boutiques & Client Care */}
            <div className="flex items-center gap-5 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[#141312] hover:text-[#8F6D39] transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden lg:flex items-center gap-5 text-[11px] uppercase tracking-[0.16em] text-[#665E55] font-medium">
                <Link
                  to="/showcase/aurelia/house#size-guide"
                  className="hover:text-[#141312] transition-colors whitespace-nowrap"
                >
                  Ring Size Guide
                </Link>
                <span className="text-[#D8CBB8]" aria-hidden="true">
                  ·
                </span>
                <Link
                  to="/showcase/aurelia/house#shipping"
                  className="hover:text-[#141312] transition-colors whitespace-nowrap"
                >
                  Insured Delivery
                </Link>
              </div>
            </div>

            {/* Center Column: Dead-Center Octagon Monogram Logo */}
            <div className="flex justify-center">
              <Link
                to="/showcase/aurelia"
                className="py-1 focus-visible:outline-none"
                aria-label="Aurélia & Co. Storefront Home"
              >
                <AureliaBrandLogo variant="masthead" tone="dark-ink" />
              </Link>
            </div>

            {/* Right Column: Search, Wishlist, Shopping Bag */}
            <div className="flex items-center justify-end gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setSearchOpen((prev) => !prev)}
                className="px-2.5 py-2 text-[#141312] hover:text-[#8F6D39] transition-colors inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-medium cursor-pointer"
                aria-label="Search jewelry catalog"
                aria-expanded={searchOpen}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>

              <Link
                to="/showcase/aurelia/wishlist"
                className="px-2.5 py-2 text-[#141312] hover:text-[#8F6D39] transition-colors inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-medium relative"
                aria-label={`Wishlist, ${wishlist.length} saved items`}
              >
                <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-[#8F6D39] fill-current' : ''}`} />
                <span className="hidden md:inline">Wishlist</span>
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-semibold tabular-nums bg-[#EDE3D2] text-[#141312] border border-[#D8CBB8]">
                  {wishlist.length}
                </span>
              </Link>

              <button
                type="button"
                onClick={openBag}
                className="pl-3 pr-3.5 py-2 bg-[#141312] text-[#FAF7F2] hover:bg-[#2B2825] transition-colors inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-medium cursor-pointer shrink-0"
                aria-label={`Shopping bag, ${bagCount} items`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#D2B47D]" />
                <span className="hidden sm:inline">Bag</span>
                <span className="tabular-nums font-semibold text-[#D2B47D]">
                  ({bagCount})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Desktop Category Navigation Strip */}
        <nav
          className="hidden lg:block border-t border-[#E2D7C6]/80 bg-[#FAF7F2]"
          aria-label="Storefront primary categories"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-center gap-7 xl:gap-9 text-[11px] uppercase tracking-[0.18em] font-medium">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`h-full inline-flex items-center border-b-2 transition-colors whitespace-nowrap ${
                  item.isActive
                    ? 'border-[#8F6D39] text-[#141312] font-semibold'
                    : 'border-transparent text-[#2B2825] hover:text-[#8F6D39] hover:border-[#D8CBB8]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Expandable Full-Width Search Panel */}
        {searchOpen && (
          <div className="border-t border-[#E2D7C6] bg-[#F3ECE1]/90 py-4 px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#665E55] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Étoile, emerald, platinum 950, bridal, pearl drops..."
                  aria-label="Search pieces by name, metal, gemstone, or collection"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D8CBB8] text-sm text-[#141312] placeholder-[#7A7167] focus:border-[#8F6D39] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#2B2825] transition-colors cursor-pointer shrink-0"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[#665E55] hover:text-[#141312] cursor-pointer"
                aria-label="Close search bar"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Editorial Storefront Footer */}
      <footer className="bg-[#141312] text-[#FAF7F2] border-t border-[#2B2825] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2B2825]">
            <div className="lg:col-span-4 space-y-4">
              <AureliaBrandLogo variant="footer" tone="light-ivory" />
              <p className="text-xs sm:text-sm text-[#CFC5B6] leading-relaxed max-w-sm">
                A fictional Paris–Milan fine-jewelry maison showcase engineered by Genmax IT Solution—demonstrating editorial merchandising, interactive filtering, variant pricing, and browser-local INR checkout.
              </p>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#D2B47D] hover:text-[#FAF7F2] transition-colors pt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Genmax Portfolio</span>
              </Link>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#D2B47D] font-semibold">
                Collections
              </div>
              <ul className="space-y-2.5 text-xs text-[#CFC5B6]">
                {EDITORIAL_COLLECTIONS.map((col) => (
                  <li key={col.slug}>
                    <Link
                      to={`/showcase/aurelia/collections/${col.slug}`}
                      className="hover:text-[#FAF7F2] transition-colors"
                    >
                      {col.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#D2B47D] font-semibold">
                Jewelry
              </div>
              <ul className="space-y-2.5 text-xs text-[#CFC5B6]">
                <li>
                  <Link to="/showcase/aurelia/shop" className="hover:text-[#FAF7F2] transition-colors">
                    All Pieces
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/shop?category=Rings" className="hover:text-[#FAF7F2] transition-colors">
                    Rings
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/shop?category=Earrings" className="hover:text-[#FAF7F2] transition-colors">
                    Earrings
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/shop?category=Necklaces" className="hover:text-[#FAF7F2] transition-colors">
                    Necklaces
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/shop?category=Bracelets" className="hover:text-[#FAF7F2] transition-colors">
                    Bracelets
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/shop?category=Bridal" className="hover:text-[#FAF7F2] transition-colors">
                    Bridal Atelier
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#D2B47D] font-semibold">
                Maison &amp; Client Care
              </div>
              <ul className="space-y-2.5 text-xs text-[#CFC5B6]">
                <li>
                  <Link to="/showcase/aurelia/house" className="hover:text-[#FAF7F2] transition-colors">
                    House of Aurélia Story
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/house#size-guide" className="hover:text-[#FAF7F2] transition-colors">
                    Ring Size Guide
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/house#shipping" className="hover:text-[#FAF7F2] transition-colors">
                    Insured Delivery &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/house#gifting" className="hover:text-[#FAF7F2] transition-colors">
                    Bespoke Gifting Presentation
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/wishlist" className="hover:text-[#FAF7F2] transition-colors">
                    Saved Favorites ({wishlist.length})
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/aurelia/bag" className="hover:text-[#FAF7F2] transition-colors">
                    Shopping Bag ({bagCount})
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9E9589]">
            <div>
              Aurélia &amp; Co. Interactive Concept Store · Fictional showcase for prospective clients
            </div>
            <div>All pricing shown in INR (₹) · Browser-local demo cart &amp; checkout</div>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-[#141312]/60 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Storefront navigation"
        >
          <div
            className="w-80 max-w-[85vw] bg-[#FAF7F2] text-[#141312] h-full p-6 flex flex-col justify-between border-r border-[#E2D7C6] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#E2D7C6]">
                <AureliaBrandLogo variant="compact" tone="dark-ink" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#665E55] hover:text-[#141312] cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4 text-sm uppercase tracking-[0.15em] font-medium">
                <Link to="/showcase/aurelia" className="block py-1.5 hover:text-[#8F6D39]">
                  Storefront Home
                </Link>
                <Link to="/showcase/aurelia/shop" className="block py-1.5 hover:text-[#8F6D39]">
                  Shop All Jewelry
                </Link>
                <Link to="/showcase/aurelia/search" className="block py-1.5 hover:text-[#8F6D39]">
                  Search Catalog
                </Link>
                <div className="pt-3 border-t border-[#E2D7C6]">
                  <div className="text-[10px] text-[#8F6D39] tracking-[0.2em] mb-2.5">
                    Collections
                  </div>
                  <div className="space-y-2.5 pl-2 text-xs">
                    {EDITORIAL_COLLECTIONS.map((col) => (
                      <Link
                        key={col.slug}
                        to={`/showcase/aurelia/collections/${col.slug}`}
                        className="block py-1 hover:text-[#8F6D39]"
                      >
                        {col.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-[#E2D7C6] space-y-2.5">
                  <Link to="/showcase/aurelia/house" className="block py-1.5 hover:text-[#8F6D39]">
                    House of Aurélia
                  </Link>
                  <Link to="/showcase/aurelia/wishlist" className="block py-1.5 hover:text-[#8F6D39]">
                    Saved Favorites ({wishlist.length})
                  </Link>
                  <Link to="/showcase/aurelia/bag" className="block py-1.5 hover:text-[#8F6D39]">
                    Shopping Bag ({bagCount})
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/portfolio"
              className="mt-6 py-3 px-4 border border-[#D8CBB8] text-xs uppercase tracking-[0.15em] font-medium flex items-center justify-center gap-2 hover:bg-[#EDE3D2] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Genmax Portfolio</span>
            </Link>
          </div>
        </div>
      )}

      {/* Slide-Over Shopping Bag Drawer */}
      {isBagOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#141312]/55 backdrop-blur-xs"
          onClick={closeBag}
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
        >
          <div
            className="w-full max-w-md bg-[#FAF7F2] text-[#141312] h-full flex flex-col border-l border-[#E2D7C6] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-[#E2D7C6] flex items-center justify-between">
              <div>
                <h2 className="aur-serif text-2xl font-semibold tracking-wide">
                  Shopping Bag ({bagCount})
                </h2>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#665E55]">
                  Complimentary insured dispatch in India
                </p>
              </div>
              <button
                type="button"
                onClick={closeBag}
                className="p-2 text-[#665E55] hover:text-[#141312] cursor-pointer"
                aria-label="Close shopping bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {hydratedBag.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <ShoppingBag className="w-10 h-10 text-[#9E9589] mx-auto stroke-[1.25]" />
                  <div className="aur-serif text-2xl text-[#141312]">
                    Your shopping bag is empty
                  </div>
                  <p className="text-xs text-[#665E55] max-w-xs mx-auto leading-relaxed">
                    Discover solitaires, natural gemstones, and hand-crafted fine gold pieces in our catalog.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeBag();
                      navigate('/showcase/aurelia/shop');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#2B2825] transition-colors cursor-pointer"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#E2D7C6]">
                  {hydratedBag.map((line) => (
                    <div
                      key={`${line.product.id}-${line.variant.id}`}
                      className="py-5 first:pt-0 flex gap-4"
                    >
                      <Link
                        to={`/showcase/aurelia/product/${line.product.slug}`}
                        onClick={closeBag}
                        className="w-20 h-20 bg-[#F3ECE1] border border-[#E2D7C6] shrink-0 overflow-hidden"
                      >
                        <img
                          src={line.product.images[0].url}
                          alt={line.product.images[0].alt}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/showcase/aurelia/product/${line.product.slug}`}
                            onClick={closeBag}
                            className="aur-serif text-lg font-semibold text-[#141312] hover:text-[#8F6D39] leading-tight"
                          >
                            {line.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromBag(line.product.id, line.variant.id)}
                            className="p-1 text-[#665E55] hover:text-[#141312] cursor-pointer"
                            aria-label={`Remove ${line.product.name} (${line.variant.label})`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-[#665E55] mt-0.5">
                          {line.variant.optionType}: {line.variant.label}
                        </div>
                        <div className="text-xs text-[#665E55] mt-0.5 tabular-nums">
                          {formatInr(line.unitPriceInr)} each
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-[#D8CBB8] bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateBagQuantity(
                                  line.product.id,
                                  line.variant.id,
                                  line.quantity - 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#141312] hover:bg-[#F3ECE1] cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateBagQuantity(
                                  line.product.id,
                                  line.variant.id,
                                  line.quantity + 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#141312] hover:bg-[#F3ECE1] cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-sm font-semibold tabular-nums">
                            {formatInr(line.lineTotalInr)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hydratedBag.length > 0 && (
              <div className="p-6 border-t border-[#E2D7C6] bg-[#F3ECE1] space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#665E55] uppercase tracking-[0.14em] text-xs">
                    Subtotal
                  </span>
                  <span className="text-lg font-semibold tabular-nums">
                    {formatInr(bagSubtotalInr)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#665E55]">
                  <ShieldCheck className="w-4 h-4 text-[#8F6D39] shrink-0" />
                  <span>Insured vault delivery &amp; 30-day complimentary returns included.</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    to="/showcase/aurelia/bag"
                    onClick={closeBag}
                    className="py-3 px-4 border border-[#141312] text-[#141312] text-xs uppercase tracking-[0.14em] font-medium text-center hover:bg-[#EDE3D2] transition-colors"
                  >
                    View Bag
                  </Link>
                  <Link
                    to="/showcase/aurelia/checkout"
                    onClick={closeBag}
                    className="py-3 px-4 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.14em] font-medium text-center hover:bg-[#2B2825] transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtle Toast Confirmation */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#141312] text-[#FAF7F2] px-5 py-3 text-xs border border-[#8F6D39] shadow-xl flex items-center gap-3 max-w-sm"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={dismissToast}
            className="text-[#D2B47D] hover:text-white cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
