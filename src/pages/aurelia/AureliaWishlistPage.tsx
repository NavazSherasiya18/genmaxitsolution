import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { AureliaLayout } from '../../components/aurelia/AureliaLayout';
import { AURELIA_PRODUCTS, formatInr } from '../../data/aureliaCatalog';
import { useAureliaStore } from '../../context/AureliaStoreContext';

export const AureliaWishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, addToBag } = useAureliaStore();

  const savedProducts = wishlist
    .map((id) => AURELIA_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <AureliaLayout pageTitle="Saved Favorites">
      <section className="bg-[#F3ECE1] border-b border-[#E2D7C6] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8F6D39] font-semibold mb-2">
            Personal Curation
          </div>
          <h1 className="aur-serif text-4xl sm:text-5xl font-semibold text-[#141312]">
            Saved Favorites ({savedProducts.length})
          </h1>
          <p className="text-sm text-[#665E55] mt-2">
            Your saved pieces persist in this browser across refreshes until you are ready to select sizing or complete your concept checkout.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {savedProducts.length === 0 ? (
            <div className="border border-[#E2D7C6] bg-white p-12 text-center space-y-4 max-w-xl mx-auto">
              <Heart className="w-10 h-10 text-[#9E9589] mx-auto stroke-[1.25]" />
              <h2 className="aur-serif text-3xl font-semibold text-[#141312]">
                No saved pieces yet
              </h2>
              <p className="text-sm text-[#665E55] leading-relaxed">
                Select the heart icon on any creation across our catalog to preserve your shortlist here.
              </p>
              <Link
                to="/showcase/aurelia/shop"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#2B2825] transition-colors"
              >
                <span>Explore Jewelry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((product) => {
                const defaultVariant = product.variants[0];
                const needsSelection =
                  product.requiresVariantSelection || product.variants.length > 1;

                return (
                  <article
                    key={product.id}
                    className="border border-[#E2D7C6] bg-white flex flex-col justify-between"
                  >
                    <div>
                      <Link
                        to={`/showcase/aurelia/product/${product.slug}`}
                        className="block aspect-square overflow-hidden bg-[#F3ECE1] border-b border-[#E2D7C6]"
                      >
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt}
                          className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                        />
                      </Link>
                      <div className="p-5">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#665E55]">
                          {product.collectionName} · {product.metal}
                        </div>
                        <Link
                          to={`/showcase/aurelia/product/${product.slug}`}
                          className="block aur-serif text-2xl font-semibold text-[#141312] hover:text-[#8F6D39] mt-1"
                        >
                          {product.name}
                        </Link>
                        <div className="text-sm font-semibold text-[#141312] mt-2 tabular-nums">
                          {formatInr(product.priceInr)}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-[#E2D7C6] flex items-center gap-2.5">
                      {needsSelection ? (
                        <Link
                          to={`/showcase/aurelia/product/${product.slug}`}
                          className="flex-1 py-2.5 px-4 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.14em] font-medium text-center hover:bg-[#2B2825] transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <span>Select Size / Option</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => defaultVariant && addToBag(product.id, defaultVariant.id, 1)}
                          className="flex-1 py-2.5 px-4 bg-[#141312] text-[#FAF7F2] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#2B2825] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        aria-label={`Remove ${product.name} from saved favorites`}
                        className="p-2.5 border border-[#D8CBB8] text-[#665E55] hover:text-[#141312] hover:border-[#141312] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </AureliaLayout>
  );
};
