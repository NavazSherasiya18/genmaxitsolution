import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ZoomIn,
  X,
  Ruler,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { AureliaLayout } from '../../components/aurelia/AureliaLayout';
import { AureliaProductCard } from '../../components/aurelia/AureliaProductCard';
import { RingSizeGuideModal } from '../../components/aurelia/RingSizeGuideModal';
import {
  getProductBySlug,
  getRelatedProducts,
  formatInr,
} from '../../data/aureliaCatalog';
import { useAureliaStore } from '../../context/AureliaStoreContext';

export const AureliaProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug);
  const { isWishlisted, toggleWishlist, addToBag } = useAureliaStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [variantError, setVariantError] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Reset local interaction state cleanly when switching between products
  useEffect(() => {
    setActiveImageIdx(0);
    setQuantity(1);
    setVariantError(null);
    setZoomOpen(false);
    if (product && !product.requiresVariantSelection && product.variants.length === 1) {
      setSelectedVariantId(product.variants[0].id);
    } else {
      setSelectedVariantId(null);
    }
  }, [slug, product]);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [zoomOpen]);

  if (!product) {
    return (
      <AureliaLayout pageTitle="Piece Not Found">
        <section className="py-24 max-w-3xl mx-auto px-4 text-center space-y-5">
          <h1 className="aur-serif text-4xl font-semibold">Creation Not Found</h1>
          <p className="text-sm text-[#665E55]">
            This archive URL does not match an available piece in the Aurélia concept collection.
          </p>
          <Link
            to="/showcase/aurelia/shop"
            className="inline-block px-7 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em]"
          >
            Return to All Creations
          </Link>
        </section>
      </AureliaLayout>
    );
  }

  const saved = isWishlisted(product.id);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || null;
  const displayedPriceInr = selectedVariant ? selectedVariant.priceInr : product.priceInr;
  const activeImage = product.images[activeImageIdx] || product.images[0];
  const relatedProducts = getRelatedProducts(product);
  const isRing = product.category === 'Rings' || product.category === 'Bridal';

  const handleAddToBag = () => {
    if (product.requiresVariantSelection && !selectedVariant) {
      const optType = product.variants[0]?.optionType || 'option';
      setVariantError(`Please select a ${optType.toLowerCase()} before adding to your bag.`);
      return;
    }
    const targetVariant = selectedVariant || product.variants[0];
    if (!targetVariant || !targetVariant.inStock) {
      setVariantError('This specific size or finish is currently unavailable.');
      return;
    }
    setVariantError(null);
    addToBag(product.id, targetVariant.id, quantity);
  };

  return (
    <AureliaLayout pageTitle={product.name}>
      {/* Breadcrumb */}
      <div className="border-b border-[#E2D7C6] bg-[#F3ECE1]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-[#665E55] flex flex-wrap items-center gap-2">
          <Link to="/showcase/aurelia" className="hover:text-[#141312]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/showcase/aurelia/shop" className="hover:text-[#141312]">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`/showcase/aurelia/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#141312]"
          >
            {product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#141312] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Multi-Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square bg-[#F3ECE1] border border-[#E2D7C6] overflow-hidden group">
              <img
                src={activeImage.url}
                alt={activeImage.alt}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="absolute bottom-4 right-4 px-3.5 py-2 bg-[#FAF7F2]/95 border border-[#D8CBB8] text-[#141312] text-xs uppercase tracking-[0.14em] font-medium inline-flex items-center gap-1.5 hover:border-[#141312] transition-colors cursor-pointer"
                aria-label={`Zoom image of ${product.name}`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Inspect Zoom</span>
              </button>
              {activeImage.caption && (
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-[#141312]/80 text-[#FAF7F2] text-[11px] tracking-wide max-w-[65%]">
                  {activeImage.caption}
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`View gallery angle ${idx + 1} for ${product.name}`}
                    className={`aspect-square overflow-hidden border transition-all cursor-pointer bg-[#F3ECE1] ${
                      idx === activeImageIdx
                        ? 'border-[#141312] ring-1 ring-[#141312]'
                        : 'border-[#E2D7C6] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchasing Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <Link
                to={`/showcase/aurelia/collections/${product.collectionSlug}`}
                className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold hover:underline"
              >
                {product.collectionName}
              </Link>
              <h1 className="aur-serif text-3xl sm:text-4xl font-semibold text-[#141312] mt-1.5 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#665E55] mt-1.5">{product.subtitle}</p>
            </div>

            <div className="pb-5 border-b border-[#E2D7C6] flex items-baseline justify-between gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-[#141312] tabular-nums">
                  {formatInr(displayedPriceInr)}
                </div>
                <div className="text-[11px] text-[#665E55] mt-0.5">
                  Inclusive of GST &amp; Insured Vault Dispatch (Concept Demo Pricing)
                </div>
              </div>
              {selectedVariant && (
                <span className="text-[11px] font-mono text-[#665E55]">
                  SKU: {selectedVariant.sku}
                </span>
              )}
            </div>

            <p className="text-sm text-[#2B2825] leading-relaxed">{product.description}</p>

            {/* Variant Selector */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#141312]">
                  Select {product.variants[0]?.optionType || 'Option'}
                  {product.requiresVariantSelection && !selectedVariant ? ' *' : ''}
                </span>
                {isRing && (
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#8F6D39] hover:text-[#141312] underline underline-offset-4 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Ring Size Guide</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={!variant.inStock}
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setVariantError(null);
                      }}
                      className={`py-2.5 px-3 border text-left transition-colors ${
                        !variant.inStock
                          ? 'border-[#E2D7C6] bg-[#F3ECE1]/60 text-[#9E9589] cursor-not-allowed line-through'
                          : isSelected
                            ? 'border-[#141312] bg-[#141312] text-[#FAF7F2] cursor-pointer'
                            : 'border-[#D8CBB8] bg-white text-[#141312] hover:border-[#8F6D39] cursor-pointer'
                      }`}
                    >
                      <div className="text-xs font-semibold leading-tight">{variant.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 tabular-nums ${
                          !variant.inStock
                            ? 'text-[#9E9589]'
                            : isSelected
                              ? 'text-[#D2B47D]'
                              : 'text-[#665E55]'
                        }`}
                      >
                        {variant.inStock ? formatInr(variant.priceInr) : 'Waitlist Only'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {variantError && (
                <div
                  role="alert"
                  className="p-3 bg-[#FFF5F5] border border-[#C86D6D] text-[#7D2424] text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{variantError}</span>
                </div>
              )}

              {selectedVariant && (
                <div className="text-xs text-[#2B2825] inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8F6D39]" />
                  <span>
                    Selected: <strong>{selectedVariant.label}</strong> ({formatInr(selectedVariant.priceInr)})
                  </span>
                </div>
              )}
            </div>

            {/* Quantity & Action Row */}
            <div className="space-y-3 pt-2">
              <div className="flex items-stretch gap-3">
                <div className="inline-flex items-center border border-[#D8CBB8] bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-12 flex items-center justify-center hover:bg-[#F3ECE1] cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    className="w-10 h-12 flex items-center justify-center hover:bg-[#F3ECE1] cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="flex-1 h-12 px-6 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#2B2825] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="w-full h-11 px-6 border border-[#141312] bg-white text-[#141312] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#F3ECE1] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current text-[#8F6D39]' : ''}`} />
                <span>{saved ? 'Saved in Favorites' : 'Save to Favorites'}</span>
              </button>
            </div>

            {/* Structured Dossiers */}
            <div className="pt-4 border-t border-[#E2D7C6] divide-y divide-[#E2D7C6] text-xs">
              <div className="py-4">
                <div className="uppercase tracking-[0.16em] font-semibold text-[#141312] mb-2.5">
                  Specifications
                </div>
                <dl className="space-y-1.5">
                  {product.specifications.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-4">
                      <dt className="text-[#665E55]">{spec.label}</dt>
                      <dd className="text-[#141312] font-medium text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="py-4 space-y-2">
                <div className="uppercase tracking-[0.16em] font-semibold text-[#141312]">
                  Dimensions &amp; Materials
                </div>
                <p className="text-[#2B2825] leading-relaxed">{product.dimensions}</p>
                <p className="text-[#665E55] leading-relaxed">{product.materialAndStones}</p>
                <p className="text-[#665E55] italic leading-relaxed">{product.craftsmanshipNote}</p>
              </div>

              <div className="py-4 space-y-2.5">
                <div className="uppercase tracking-[0.16em] font-semibold text-[#141312]">
                  Delivery &amp; Returns
                </div>
                <div className="flex items-start gap-2.5 text-[#2B2825]">
                  <ShieldCheck className="w-4 h-4 text-[#8F6D39] shrink-0 mt-0.5" />
                  <span>{product.deliveryInfo}</span>
                </div>
                <div className="flex items-start gap-2.5 text-[#2B2825]">
                  <RotateCcw className="w-4 h-4 text-[#8F6D39] shrink-0 mt-0.5" />
                  <span>{product.returnsInfo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Creations */}
      <section className="py-16 border-t border-[#E2D7C6] bg-[#F3ECE1]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold mb-1.5">
                Curated Pairings
              </div>
              <h2 className="aur-serif text-3xl font-semibold text-[#141312]">
                Related Creations
              </h2>
            </div>
            <Link
              to="/showcase/aurelia/shop"
              className="text-xs uppercase tracking-[0.16em] font-medium text-[#141312] hover:text-[#8F6D39]"
            >
              View All Pieces
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <AureliaProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Zoom Lightbox Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#141312]/90 flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Zoomed photograph of ${product.name}`}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute top-5 right-5 p-3 bg-[#FAF7F2] text-[#141312] hover:bg-[#EDE3D2] cursor-pointer"
            aria-label="Close zoomed image"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="max-w-3xl w-full bg-[#FAF7F2] p-2 border border-[#D8CBB8]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.url}
              alt={activeImage.alt}
              className="w-full max-h-[82vh] object-contain"
            />
            {activeImage.caption && (
              <div className="py-2.5 px-3 text-xs text-[#2B2825] text-center">
                {activeImage.caption}
              </div>
            )}
          </div>
        </div>
      )}

      <RingSizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </AureliaLayout>
  );
};
