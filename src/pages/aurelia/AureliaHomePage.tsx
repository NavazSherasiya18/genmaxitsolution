import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Gift } from 'lucide-react';
import { AureliaLayout } from '../../components/aurelia/AureliaLayout';
import { AureliaProductCard } from '../../components/aurelia/AureliaProductCard';
import {
  AURELIA_ASSETS,
  AURELIA_CATEGORIES,
  AURELIA_PRODUCTS,
  EDITORIAL_COLLECTIONS,
  formatInr,
} from '../../data/aureliaCatalog';

export const AureliaHomePage: React.FC = () => {
  const signaturePiece =
    AURELIA_PRODUCTS.find((p) => p.slug === 'the-etoile-diamond-ring') || AURELIA_PRODUCTS[0];
  const bestsellers = AURELIA_PRODUCTS.filter((p) => p.isBestseller).slice(0, 8);

  return (
    <AureliaLayout pageTitle="High Jewelry & Bridal Atelier">
      {/* 1. Campaign Hero — Immediate editorial photograph, memorable headline & clear CTA */}
      <section className="relative bg-[#141312] text-[#FAF7F2] overflow-hidden border-b border-[#2B2825]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[540px] lg:min-h-[640px]">
          <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-12 lg:py-16 order-2 lg:order-1 bg-[#141312]">
            <div className="text-[11px] uppercase tracking-[0.26em] text-[#D2B47D] font-semibold mb-4">
              Paris · Milan Autumn Capsule
            </div>
            <h1 className="aur-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.06] text-[#FAF7F2] mb-5">
              Architecture of <br />
              <span className="italic font-normal text-[#EDE3D2]">Timeless Radiance</span>
            </h1>
            <p className="text-sm sm:text-base text-[#CFC5B6] leading-relaxed mb-8 max-w-md">
              Discover hand-set natural diamonds, untreated Colombian emeralds, and recycled 18K gold commissions designed for quiet permanence.
            </p>
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to="/showcase/aurelia/shop"
                className="px-7 py-3.5 bg-[#FAF7F2] text-[#141312] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#EDE3D2] transition-colors inline-flex items-center gap-2"
              >
                <span>Shop All Creations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={`/showcase/aurelia/product/${signaturePiece.slug}`}
                className="px-6 py-3.5 border border-[#8F6D39] text-[#FAF7F2] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#2B2825] transition-colors"
              >
                The Étoile Ring
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] lg:min-h-full order-1 lg:order-2 bg-[#2B2825]">
            <img
              src={AURELIA_ASSETS.heroCampaign}
              alt="Woman in matte ivory silk wearing architectural 18K gold diamond collar and solitaire ring in Parisian daylight"
              className="w-full h-full object-cover object-[center_22%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141312]/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#141312]/40 lg:via-transparent lg:to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="py-16 sm:py-20 border-b border-[#E2D7C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold mb-2">
                Curated Silhouttes
              </div>
              <h2 className="aur-serif text-3xl sm:text-4xl font-semibold text-[#141312]">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/showcase/aurelia/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-medium text-[#141312] hover:text-[#8F6D39] transition-colors"
            >
              <span>Browse Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {AURELIA_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/showcase/aurelia/shop?category=${encodeURIComponent(cat.name)}`}
                className="group block border border-[#E2D7C6] bg-white hover:border-[#8F6D39] transition-colors"
              >
                <div className="aspect-square overflow-hidden bg-[#F3ECE1]">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="aur-serif text-xl font-semibold text-[#141312] group-hover:text-[#8F6D39] transition-colors">
                    {cat.name}
                  </div>
                  <p className="text-[11px] text-[#665E55] mt-1 line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Signature Spotlight: The Étoile Diamond Ring */}
      <section className="py-16 sm:py-24 bg-[#F3ECE1] border-b border-[#E2D7C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-[#FAF7F2] border border-[#D8CBB8] overflow-hidden">
                <img
                  src={signaturePiece.images[0].url}
                  alt={signaturePiece.images[0].alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-[#FAF7F2] border border-[#D8CBB8] overflow-hidden">
                <img
                  src={signaturePiece.images[1].url}
                  alt={signaturePiece.images[1].alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flagship Solitaire Study</span>
              </div>
              <h2 className="aur-serif text-3xl sm:text-5xl font-semibold text-[#141312] leading-tight">
                {signaturePiece.name}
              </h2>
              <div className="text-sm uppercase tracking-[0.15em] text-[#665E55]">
                {signaturePiece.subtitle} · Starting {formatInr(signaturePiece.priceInr)}
              </div>
              <p className="text-sm sm:text-base text-[#2B2825] leading-relaxed">
                {signaturePiece.description}
              </p>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#D8CBB8] text-xs">
                <div>
                  <div className="text-[#665E55] uppercase tracking-[0.12em]">Metal Standard</div>
                  <div className="font-semibold text-[#141312] mt-1">Hallmarked Platinum 950</div>
                </div>
                <div>
                  <div className="text-[#665E55] uppercase tracking-[0.12em]">Grading Dossier</div>
                  <div className="font-semibold text-[#141312] mt-1">GIA Certified 1.85 ct D·VVS1</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  to={`/showcase/aurelia/product/${signaturePiece.slug}`}
                  className="px-7 py-3.5 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#2B2825] transition-colors inline-flex items-center gap-2"
                >
                  <span>Inspect Piece &amp; Select Size</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/showcase/aurelia/house#size-guide"
                  className="text-xs uppercase tracking-[0.16em] text-[#141312] underline underline-offset-4 hover:text-[#8F6D39]"
                >
                  View Ring Size Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Editorial Collections */}
      <section className="py-16 sm:py-20 border-b border-[#E2D7C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold mb-2">
              Editorial Lines
            </div>
            <h2 className="aur-serif text-3xl sm:text-4xl font-semibold text-[#141312] mb-3">
              Signature Maison Collections
            </h2>
            <p className="text-sm text-[#665E55] leading-relaxed">
              Four sculptural design languages uniting French high-jewelry proportions with Milanese metalwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EDITORIAL_COLLECTIONS.map((col) => (
              <Link
                key={col.slug}
                to={`/showcase/aurelia/collections/${col.slug}`}
                className="group border border-[#E2D7C6] bg-white hover:border-[#8F6D39] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-[#F3ECE1] border-b border-[#E2D7C6]">
                    <img
                      src={col.heroImage}
                      alt={col.heroAlt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#8F6D39] font-semibold">
                      {col.origin}
                    </div>
                    <h3 className="aur-serif text-2xl font-semibold text-[#141312] mt-1 group-hover:text-[#8F6D39] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#665E55] mt-2 leading-relaxed">
                      {col.description}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-medium text-[#141312]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Shoppable Bestsellers */}
      <section className="py-16 sm:py-20 border-b border-[#E2D7C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold mb-2">
                Most Requested
              </div>
              <h2 className="aur-serif text-3xl sm:text-4xl font-semibold text-[#141312]">
                Shoppable Bestsellers
              </h2>
            </div>
            <Link
              to="/showcase/aurelia/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-medium text-[#141312] hover:text-[#8F6D39] transition-colors"
            >
              <span>Filter &amp; Shop All {AURELIA_PRODUCTS.length} Pieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <AureliaProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Craftsmanship Story & Gifting Feature */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Craftsmanship Story Card */}
          <div className="border border-[#E2D7C6] bg-[#F3ECE1] flex flex-col">
            <div className="aspect-[16/10] overflow-hidden border-b border-[#E2D7C6]">
              <img
                src={AURELIA_ASSETS.atelierCraft}
                alt="Master goldsmith workbench with calipers, gouache ring rendering, and emerald parcel in Milan workshop"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8F6D39] font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Milan &amp; Paris Ateliers</span>
                </div>
                <h3 className="aur-serif text-3xl font-semibold text-[#141312]">
                  The House of Aurélia Craftsmanship
                </h3>
                <p className="text-sm text-[#2B2825] mt-3 leading-relaxed">
                  Every mount begins as a water-colored gouache study before our setters hand-carve wax, cast in recycled Platinum 950 or 18K gold, and grade each natural stone under binocular optics.
                </p>
              </div>
              <div>
                <Link
                  to="/showcase/aurelia/house"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#141312] hover:text-[#8F6D39]"
                >
                  <span>Read Maison Story &amp; Sizing Care</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Gifting Presentation Card */}
          <div className="border border-[#E2D7C6] bg-white flex flex-col">
            <div className="aspect-[16/10] overflow-hidden border-b border-[#E2D7C6]">
              <img
                src={AURELIA_ASSETS.bridalPair}
                alt="Ivory suede presentation tray trimmed in antique brass beside champagne silk ribbon"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8F6D39] font-semibold mb-2">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Signature Presentation</span>
                </div>
                <h3 className="aur-serif text-3xl font-semibold text-[#141312]">
                  Bespoke Gifting &amp; Armored Dispatch
                </h3>
                <p className="text-sm text-[#2B2825] mt-3 leading-relaxed">
                  Each piece arrives sealed inside a champagne-ribboned ivory suede chest accompanied by its numbered GIA or SSEF dossier, polishing cloth, and handwritten cotton card.
                </p>
              </div>
              <div>
                <Link
                  to="/showcase/aurelia/house#gifting"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#141312] hover:text-[#8F6D39]"
                >
                  <span>Explore Gifting &amp; Delivery Policy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AureliaLayout>
  );
};
