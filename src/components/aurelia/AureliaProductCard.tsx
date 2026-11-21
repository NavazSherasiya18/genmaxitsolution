import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { AureliaProduct, formatInr } from '../../data/aureliaCatalog';
import { useAureliaStore } from '../../context/AureliaStoreContext';

interface AureliaProductCardProps {
  product: AureliaProduct;
}

export const AureliaProductCard: React.FC<AureliaProductCardProps> = ({ product }) => {
  const { isWishlisted, toggleWishlist, addToBag } = useAureliaStore();
  const saved = isWishlisted(product.id);
  const primaryImage = product.images[0];
  const defaultVariant = product.variants[0];

  return (
    <article className="box-zoom group flex flex-col bg-[#FAF7F2] border border-[#E2D7C6] hover:border-[#B4925A]">
      <div className="relative aspect-square overflow-hidden bg-[#F3ECE1] border-b border-[#E2D7C6]">
        <Link
          to={`/showcase/aurelia/product/${product.slug}`}
          className="block w-full h-full"
          aria-label={`View ${product.name}`}
        >
          <img
            src={primaryImage.url}
            alt={primaryImage.alt}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </Link>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={saved ? `Remove ${product.name} from saved favorites` : `Save ${product.name} to favorites`}
          aria-pressed={saved}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center border transition-colors cursor-pointer ${
            saved
              ? 'bg-[#141312] text-[#FAF7F2] border-[#141312]'
              : 'bg-[#FAF7F2]/90 text-[#141312] border-[#D8CBB8] hover:border-[#141312]'
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current text-[#D2B47D]' : ''}`} />
        </button>

        {product.isFeatured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#FAF7F2]/95 border border-[#D8CBB8] text-[10px] uppercase tracking-[0.16em] text-[#8F6D39] font-semibold">
            Signature Piece
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#665E55] mb-1">
            {product.collectionName} · {product.metal}
          </div>
          <Link
            to={`/showcase/aurelia/product/${product.slug}`}
            className="block aur-serif text-xl font-semibold text-[#141312] hover:text-[#8F6D39] transition-colors leading-snug"
          >
            {product.name}
          </Link>
          <p className="text-xs text-[#665E55] mt-1 line-clamp-1">{product.subtitle}</p>
        </div>

        <div className="pt-3 border-t border-[#E2D7C6] flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-[#141312] tabular-nums">
            {formatInr(product.priceInr)}
          </div>

          {product.requiresVariantSelection || product.variants.length > 1 ? (
            <Link
              to={`/showcase/aurelia/product/${product.slug}`}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-medium text-[#141312] hover:text-[#8F6D39] transition-colors"
            >
              <span>Select Option</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => defaultVariant && addToBag(product.id, defaultVariant.id, 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#141312] text-[11px] uppercase tracking-[0.14em] font-medium text-[#141312] hover:bg-[#141312] hover:text-[#FAF7F2] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add to Bag</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
