import heroCampaignImg from '../assets/images/aurelia_hero_campaign_1794821314191.jpg';
import etoileHeroImg from '../assets/images/etoile_ring_hero_1794821313542.jpg';
import etoileDetailImg from '../assets/images/etoile_ring_detail_1794821314517.jpg';
import earringsPearlImg from '../assets/images/aurelia_earrings_pearl_1794821313634.jpg';
import necklaceRiviereImg from '../assets/images/aurelia_necklace_riviere_1794821313635.jpg';
import braceletCuffImg from '../assets/images/aurelia_bracelet_cuff_1794821313964.jpg';
import bridalPairImg from '../assets/images/aurelia_bridal_pair_1794821314506.jpg';
import atelierCraftImg from '../assets/images/aurelia_atelier_craft_1794821314931.jpg';
import emeraldRingImg from '../assets/images/aurelia_emerald_ring_1794548652556.jpg';
import showcaseEditorialImg from '../assets/images/ecommerce_showcase_1794460734442.jpg';

export type AureliaCategory = 'Rings' | 'Earrings' | 'Necklaces' | 'Bracelets' | 'Bridal';

export type AureliaCollectionSlug =
  | 'l-etoile'
  | 'maison-serpentine'
  | 'jardin-botanique'
  | 'bridal-atelier';

export type AureliaMetal =
  | 'Platinum 950'
  | '18K Yellow Gold'
  | '18K Rose Gold'
  | '18K White Gold';

export type AureliaGemstone =
  | 'Diamond'
  | 'Colombian Emerald'
  | 'Burmese Sapphire'
  | 'Freshwater Pearl';

export interface ProductVariant {
  id: string;
  label: string;
  optionType: 'Ring Size' | 'Metal Finish' | 'Length';
  priceInr: number;
  inStock: boolean;
  sku: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface AureliaProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: AureliaCategory;
  collectionSlug: AureliaCollectionSlug;
  collectionName: string;
  priceInr: number;
  metal: AureliaMetal;
  gemstone: AureliaGemstone;
  images: ProductImage[];
  description: string;
  craftsmanshipNote: string;
  specifications: { label: string; value: string }[];
  dimensions: string;
  materialAndStones: string;
  deliveryInfo: string;
  returnsInfo: string;
  variants: ProductVariant[];
  requiresVariantSelection: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  releaseOrder: number;
  relatedSlugs: string[];
}

export interface EditorialCollection {
  slug: AureliaCollectionSlug;
  name: string;
  subtitle: string;
  origin: string;
  description: string;
  heroImage: string;
  heroAlt: string;
}

export interface RingSizeGuideRow {
  eu: string;
  inSize: string;
  us: string;
  diameterMm: string;
  circumferenceMm: string;
}

export const AURELIA_ASSETS = {
  heroCampaign: heroCampaignImg,
  etoileHero: etoileHeroImg,
  etoileDetail: etoileDetailImg,
  earringsPearl: earringsPearlImg,
  necklaceRiviere: necklaceRiviereImg,
  braceletCuff: braceletCuffImg,
  bridalPair: bridalPairImg,
  atelierCraft: atelierCraftImg,
  emeraldRing: emeraldRingImg,
  showcaseEditorial: showcaseEditorialImg,
};

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const AURELIA_CATEGORIES: {
  name: AureliaCategory;
  tagline: string;
  image: string;
  alt: string;
}[] = [
  {
    name: 'Rings',
    tagline: 'Solitaires, cathedral halos & architectural bands',
    image: etoileHeroImg,
    alt: 'The Étoile Diamond Ring crafted in platinum 950 resting on warm limestone',
  },
  {
    name: 'Earrings',
    tagline: 'Sculptural baroque pearl drops & baguette studs',
    image: earringsPearlImg,
    alt: 'Sculptural 18K yellow gold drop earrings with baroque pearls and baguette diamonds',
  },
  {
    name: 'Necklaces',
    tagline: 'Graduated diamond rivières & heirloom medallions',
    image: necklaceRiviereImg,
    alt: 'Graduated diamond rivière necklace paired with an antique gold solitaire pendant',
  },
  {
    name: 'Bracelets',
    tagline: 'Pavé hinged cuffs & articulated tennis bracelets',
    image: braceletCuffImg,
    alt: '18K rose gold pavé diamond cuff bracelet alongside a platinum tennis bracelet',
  },
  {
    name: 'Bridal',
    tagline: 'Bespoke engagement mounts & full-eternity suites',
    image: bridalPairImg,
    alt: 'Matched platinum solitaire diamond ring and full-eternity diamond band on ivory suede',
  },
];

export const EDITORIAL_COLLECTIONS: EditorialCollection[] = [
  {
    slug: 'l-etoile',
    name: "L'Étoile Solitaire",
    subtitle: 'Architectural Clarity & Hidden Pavé Galeries',
    origin: 'Place Vendôme Study · Paris',
    description:
      'Defined by knife-edge platinum mounts, suspended oval brilliants, and concealed micro-pavé collars engineered to draw light through every pavilion facet.',
    heroImage: etoileHeroImg,
    heroAlt: "L'Étoile Solitaire platinum oval diamond ring photographed on carved limestone",
  },
  {
    slug: 'maison-serpentine',
    name: 'Maison Serpentine',
    subtitle: 'Fluid Gold Geometry & Brushed Silk Satin',
    origin: 'Via Montenapoleone · Milan',
    description:
      'Hand-planished 18K yellow and rose gold contours inspired by Milanese modernist sculpture—designed to drape effortlessly along collarbone and wrist.',
    heroImage: braceletCuffImg,
    heroAlt: 'Maison Serpentine 18K rose gold pavé hinged cuff bracelet and tennis bracelet',
  },
  {
    slug: 'jardin-botanique',
    name: 'Jardin Botanique',
    subtitle: 'Untreated Emeralds, Pearls & Organic Gold',
    origin: 'Botanical Archive · Paris–Milan',
    description:
      'Lustrous baroque freshwater pearls, Muzo emeralds, and velvety cornflower sapphires set in hand-textured gold clasps.',
    heroImage: earringsPearlImg,
    heroAlt: 'Jardin Botanique 18K yellow gold baroque pearl drop earrings with diamond studs',
  },
  {
    slug: 'bridal-atelier',
    name: 'Bridal Atelier',
    subtitle: 'Ceremonial Pairings & Lifetime Heirloom Bands',
    origin: 'Private Salon Commissions',
    description:
      'Interlocking solitaire and eternity silhouettes individually balanced by weight and millimeter height for flush daily wear.',
    heroImage: bridalPairImg,
    heroAlt: 'Bridal Atelier platinum engagement ring and matched diamond eternity band',
  },
];

export const RING_SIZE_GUIDE: RingSizeGuideRow[] = [
  { eu: '48', inSize: '8', us: '4.5', diameterMm: '15.3 mm', circumferenceMm: '48.0 mm' },
  { eu: '50', inSize: '10', us: '5.25', diameterMm: '15.9 mm', circumferenceMm: '50.0 mm' },
  { eu: '52', inSize: '12', us: '6.0', diameterMm: '16.6 mm', circumferenceMm: '52.0 mm' },
  { eu: '54', inSize: '14', us: '6.75', diameterMm: '17.2 mm', circumferenceMm: '54.0 mm' },
  { eu: '56', inSize: '16', us: '7.5', diameterMm: '17.8 mm', circumferenceMm: '56.0 mm' },
  { eu: '58', inSize: '18', us: '8.25', diameterMm: '18.5 mm', circumferenceMm: '58.0 mm' },
];

const standardRingSizes = (basePrice: number, skuPrefix: string, unavailableEu?: string): ProductVariant[] => [
  { id: 'eu-48', label: 'EU 48 (IN 8)', optionType: 'Ring Size', priceInr: basePrice, inStock: unavailableEu !== '48', sku: `${skuPrefix}-48` },
  { id: 'eu-50', label: 'EU 50 (IN 10)', optionType: 'Ring Size', priceInr: basePrice, inStock: unavailableEu !== '50', sku: `${skuPrefix}-50` },
  { id: 'eu-52', label: 'EU 52 (IN 12)', optionType: 'Ring Size', priceInr: basePrice, inStock: unavailableEu !== '52', sku: `${skuPrefix}-52` },
  { id: 'eu-54', label: 'EU 54 (IN 14)', optionType: 'Ring Size', priceInr: basePrice + 10000, inStock: unavailableEu !== '54', sku: `${skuPrefix}-54` },
  { id: 'eu-56', label: 'EU 56 (IN 16)', optionType: 'Ring Size', priceInr: basePrice + 10000, inStock: unavailableEu !== '56', sku: `${skuPrefix}-56` },
  { id: 'eu-58', label: 'EU 58 (IN 18)', optionType: 'Ring Size', priceInr: basePrice + 18000, inStock: unavailableEu !== '58', sku: `${skuPrefix}-58` },
];

export const AURELIA_PRODUCTS: AureliaProduct[] = [
  {
    id: 'aur-etoile-ring',
    slug: 'the-etoile-diamond-ring',
    name: 'The Étoile Diamond Ring',
    subtitle: '1.85 ct Oval Brilliant Diamond · Hidden Pavé Gallery',
    category: 'Rings',
    collectionSlug: 'l-etoile',
    collectionName: "L'Étoile Solitaire",
    priceInr: 485000,
    metal: 'Platinum 950',
    gemstone: 'Diamond',
    images: [
      {
        url: etoileHeroImg,
        alt: 'The Étoile Diamond Ring front solitaire view on carved warm ivory limestone',
        caption: 'Front Elevation · 1.85 ct GIA Oval Brilliant',
      },
      {
        url: etoileDetailImg,
        alt: 'Three-quarter profile showing the concealed diamond micro-pavé collar on The Étoile Diamond Ring',
        caption: 'Gallery Profile · Concealed 24-Stone Micro-Pavé Collar',
      },
      {
        url: bridalPairImg,
        alt: 'The Étoile Diamond Ring paired alongside a matching eternity band in an ivory suede tray',
        caption: 'Bridal Pairing Study · Flush Eternity Fit',
      },
      {
        url: atelierCraftImg,
        alt: 'Hand-painted gouache design study and goldsmith bench inside the Aurélia Milan atelier',
        caption: 'Atelier Dossier · Hand-Set in Our Milan Workshop',
      },
    ],
    description:
      'Our signature engagement commission balances an elongated 1.85-carat GIA-certified oval brilliant diamond atop a sculpted knife-edge Platinum 950 shank. Beneath the crown sits a fine micro-pavé gallery engineered to maximize light return without disturbing the clean top silhouette.',
    craftsmanshipNote:
      'Requires 42 hours of manual piercing, claw-tip burnishing, and Zeiss binocular pavé setting by a single master setter.',
    specifications: [
      { label: 'Center Diamond', value: '1.85 ct Natural Oval Brilliant (D Color · VVS1)' },
      { label: 'Accent Stones', value: '0.24 ct F–G VVS Full-Cut Micro-Pavé Collar' },
      { label: 'Certification', value: 'GIA Natural Diamond Grading Dossier Included' },
      { label: 'Precious Metal', value: 'Hallmarked Platinum 950 (Palladium-Alloyed)' },
      { label: 'Hallmark Stamp', value: 'Pt950 · BIS & French Swan Assay' },
      { label: 'Setting Architecture', value: '4 Eagle-Claw Prongs with Open Undergallery' },
    ],
    dimensions: 'Band width 1.85 mm tapering to 1.60 mm · Basket height 6.4 mm · Center table 9.2 × 6.8 mm',
    materialAndStones: '100% recycled Platinum 950 set with conflict-free Kimberley Process certified natural diamonds.',
    deliveryInfo: 'Complimentary insured vault delivery across India in 4–6 business days with signature verification.',
    returnsInfo: '30-day complimentary return & one complimentary lifetime resize within two EU sizes.',
    variants: standardRingSizes(485000, 'AUR-ETO-R01', '58'),
    requiresVariantSelection: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    releaseOrder: 22,
    relatedSlugs: [
      'l-union-solitaire-eternity-suite',
      'celeste-graduated-diamond-riviere',
      'etoile-baguette-diamond-studs',
      'serpentine-pave-architectural-band',
    ],
  },
  {
    id: 'aur-jardin-emerald-ring',
    slug: 'jardin-colombian-emerald-ring',
    name: 'Jardin Colombian Emerald Ring',
    subtitle: '2.10 ct Octagonal Muzo Emerald · 18K Yellow Gold',
    category: 'Rings',
    collectionSlug: 'jardin-botanique',
    collectionName: 'Jardin Botanique',
    priceInr: 620000,
    metal: '18K Yellow Gold',
    gemstone: 'Colombian Emerald',
    images: [
      { url: emeraldRingImg, alt: 'Octagonal Colombian emerald solitaire ring set with tapered diamond shoulders' },
      { url: atelierCraftImg, alt: 'Atelier gouache rendering and loose emerald parcel on parchment' },
      { url: etoileDetailImg, alt: 'Macro gallery view illustrating Aurélia fine claw setting finish' },
    ],
    description:
      'An untreated step-cut Colombian emerald glowing with velvety Muzo saturation, framed by twin F-color tapered baguette diamonds in warm satin-polished 18K yellow gold.',
    craftsmanshipNote:
      'Individually color-matched stone parcel selected in Geneva before custom basket fabrication.',
    specifications: [
      { label: 'Center Gemstone', value: '2.10 ct Step-Cut Natural Colombian Emerald' },
      { label: 'Side Stones', value: '0.42 ct Tapered Baguette Diamonds (E–F · VVS)' },
      { label: 'Certification', value: 'SSEF Origin & Clarity Report' },
      { label: 'Precious Metal', value: 'Hallmarked 18K Recycled Yellow Gold (750)' },
    ],
    dimensions: 'Band width 2.1 mm · Center emerald 8.6 × 6.5 mm · Crown height 6.8 mm',
    materialAndStones: '750 Hallmarked 18K Yellow Gold, natural minor-oil Colombian emerald, natural baguette diamonds.',
    deliveryInfo: 'Armored insured courier within 5–7 business days with origin certificate.',
    returnsInfo: '30-day unwind exchange or full refund; complimentary annual prong inspection.',
    variants: standardRingSizes(620000, 'AUR-JAR-R02', '48'),
    requiresVariantSelection: true,
    isBestseller: true,
    isNewArrival: true,
    releaseOrder: 21,
    relatedSlugs: [
      'jardin-emerald-teardrop-earrings',
      'the-etoile-diamond-ring',
      'serpentine-pave-architectural-band',
      'soleil-antique-gold-medallion',
    ],
  },
  {
    id: 'aur-serpentine-band',
    slug: 'serpentine-pave-architectural-band',
    name: 'Serpentine Pavé Architectural Band',
    subtitle: 'Three-Row French-Cut Diamond Pavé · 18K Rose Gold',
    category: 'Rings',
    collectionSlug: 'maison-serpentine',
    collectionName: 'Maison Serpentine',
    priceInr: 168000,
    metal: '18K Rose Gold',
    gemstone: 'Diamond',
    images: [
      { url: etoileDetailImg, alt: 'Micro-pavé diamond metalwork profile on travertine plinth' },
      { url: braceletCuffImg, alt: 'Coordinated 18K rose gold pavé diamond collection finish' },
    ],
    description:
      'Ribbon-contoured 18K rose gold set seamlessly with 68 French-cut round brilliant diamonds, sculpted for comfortable stacking or standalone wear.',
    craftsmanshipNote:
      'Hand-drilled honeycomb under-gallery eliminates skin friction while letting light clean every stone.',
    specifications: [
      { label: 'Total Diamond Weight', value: '0.88 ct F–G VS1 Round Brilliants' },
      { label: 'Metal Alloy', value: '18K Warm Copper-Alloyed Rose Gold' },
      { label: 'Profile', value: '3.4 mm Comfort-Fit Dome' },
    ],
    dimensions: 'Width 3.4 mm · Thickness 2.1 mm',
    materialAndStones: 'Recycled 18K rose gold (Au 750) paired with calibrated natural melee diamonds.',
    deliveryInfo: 'Ships within 3–4 business days in signature suede travel case.',
    returnsInfo: '30-day complimentary return in unworn condition.',
    variants: standardRingSizes(168000, 'AUR-SRP-R03'),
    requiresVariantSelection: true,
    isBestseller: true,
    releaseOrder: 18,
    relatedSlugs: ['solstice-rose-gold-pave-cuff', 'the-etoile-diamond-ring', 'voeux-platinum-eternity-band'],
  },
  {
    id: 'aur-lumiere-cocktail',
    slug: 'lumiere-halo-cocktail-ring',
    name: 'Lumière Cushion Diamond Ring',
    subtitle: '1.30 ct Cushion Brilliant · 18K White Gold',
    category: 'Rings',
    collectionSlug: 'l-etoile',
    collectionName: "L'Étoile Solitaire",
    priceInr: 345000,
    metal: '18K White Gold',
    gemstone: 'Diamond',
    images: [
      { url: etoileHeroImg, alt: 'Lumière Cushion Diamond Ring elevated above warm ivory travertine' },
      { url: bridalPairImg, alt: 'Cushion silhouette presented in ivory suede display tray' },
    ],
    description:
      'Soft-cornered cushion brilliant center surrounded by a razor-thin milgrain halo and split cathedral shoulders.',
    craftsmanshipNote: 'Rhodium-finished 18K palladium white gold resists warmth over decades of wear.',
    specifications: [
      { label: 'Center Stone', value: '1.30 ct Cushion Cut (E · VS1 · IGI)' },
      { label: 'Halo Weight', value: '0.35 ct Calibrated Micro-Pavé' },
      { label: 'Metal', value: '18K Palladium White Gold' },
    ],
    dimensions: 'Halo Span 9.5 mm · Shank 1.9 mm',
    materialAndStones: '18K white gold with natural ethically sourced diamonds.',
    deliveryInfo: 'Insured vault shipping in 4–5 business days.',
    returnsInfo: '30-day complimentary return & sizing adjustment.',
    variants: standardRingSizes(345000, 'AUR-LUM-R04', '50'),
    requiresVariantSelection: true,
    releaseOrder: 14,
    relatedSlugs: ['the-etoile-diamond-ring', 'celeste-graduated-diamond-riviere', 'etoile-baguette-diamond-studs'],
  },
  {
    id: 'aur-valmont-sapphire-ring',
    slug: 'valmont-sapphire-signet-ring',
    name: 'Valmont Burmese Sapphire Ring',
    subtitle: '1.65 ct Oval Royal Blue Sapphire · 18K Yellow Gold',
    category: 'Rings',
    collectionSlug: 'jardin-botanique',
    collectionName: 'Jardin Botanique',
    priceInr: 295000,
    metal: '18K Yellow Gold',
    gemstone: 'Burmese Sapphire',
    images: [
      { url: emeraldRingImg, alt: 'Bezel and prong architectural gemstone ring mounted in brushed 18K gold' },
      { url: atelierCraftImg, alt: 'Gemstone sorting and bespoke gold wax modeling in atelier' },
    ],
    description:
      'East-west bezel-set royal blue Burmese sapphire accented with subtle flush diamond stars along a brushed cigar band.',
    craftsmanshipNote: 'Hand-matte Florentine engraving across the shoulders contrasts the mirror interior.',
    specifications: [
      { label: 'Center Stone', value: '1.65 ct Unheated Oval Burmese Sapphire' },
      { label: 'Accent Stones', value: '0.08 ct Flush Star-Set Diamonds' },
      { label: 'Metal', value: '18K Yellow Gold (Satin Brush)' },
    ],
    dimensions: 'Band width 5.2 mm at crest · Thickness 2.2 mm',
    materialAndStones: '18K yellow gold with natural unheated blue corundum sapphire.',
    deliveryInfo: 'Ships in 5–7 business days with gemological certificate.',
    returnsInfo: '30-day exchange or refund on standard sizes.',
    variants: standardRingSizes(295000, 'AUR-VAL-R05'),
    requiresVariantSelection: true,
    releaseOrder: 12,
    relatedSlugs: ['botanique-sapphire-lariat-necklace', 'jardin-colombian-emerald-ring', 'palais-fine-link-bracelet'],
  },

  // EARRINGS (4)
  {
    id: 'aur-adrienne-pearl-drops',
    slug: 'adrienne-baroque-pearl-drops',
    name: 'Adrienne Baroque Pearl Drops',
    subtitle: 'Matched Baroque Freshwater Pearls · Baguette Diamond Studs',
    category: 'Earrings',
    collectionSlug: 'jardin-botanique',
    collectionName: 'Jardin Botanique',
    priceInr: 142000,
    metal: '18K Yellow Gold',
    gemstone: 'Freshwater Pearl',
    images: [
      { url: earringsPearlImg, alt: 'Adrienne sculptural 18K yellow gold drop earrings with baroque freshwater pearls on champagne silk' },
      { url: showcaseEditorialImg, alt: 'Aurélia editorial fine jewelry styling in Paris apartment light' },
    ],
    description:
      'Organic draped 18K yellow gold petals suspend luminous hand-paired baroque pearls beneath crisp baguette diamond posts—catching warm candlelight with every turn.',
    craftsmanshipNote: 'Each lost-wax gold drape is hand-chased to mirror the natural undulation of its pearl.',
    specifications: [
      { label: 'Pearls', value: '13 × 10 mm Matched Orient Baroque Freshwater Pearls' },
      { label: 'Diamond Tops', value: '0.32 ct Total E–F Step-Cut Baguettes' },
      { label: 'Clasps', value: 'Locking 18K Au 750 Butterfly Post' },
    ],
    dimensions: 'Drop Length 34 mm · Weight 6.8 g per earring',
    materialAndStones: '18K solid yellow gold, natural nacre baroque pearls, natural baguette diamonds.',
    deliveryInfo: 'Delivered in 2–4 business days inside cushioned ivory presentation box.',
    returnsInfo: '30-day hygiene-sealed return policy.',
    variants: [
      { id: '18k-yg', label: '18K Yellow Gold (Standard Satin)', optionType: 'Metal Finish', priceInr: 142000, inStock: true, sku: 'AUR-ADR-E01-YG' },
      { id: '18k-rg', label: '18K Rose Gold (Bespoke Tint)', optionType: 'Metal Finish', priceInr: 148000, inStock: true, sku: 'AUR-ADR-E01-RG' },
    ],
    requiresVariantSelection: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    releaseOrder: 20,
    relatedSlugs: [
      'soleil-antique-gold-medallion',
      'jardin-emerald-teardrop-earrings',
      'serpentine-cascade-hoops',
    ],
  },
  {
    id: 'aur-etoile-studs',
    slug: 'etoile-baguette-diamond-studs',
    name: 'Étoile Floating Diamond Studs',
    subtitle: '1.20 ct Total Oval & Pavé Collar Studs · Platinum 950',
    category: 'Earrings',
    collectionSlug: 'l-etoile',
    collectionName: "L'Étoile Solitaire",
    priceInr: 275000,
    metal: 'Platinum 950',
    gemstone: 'Diamond',
    images: [
      { url: etoileHeroImg, alt: 'Oval brilliant solitaire diamond study echoed in Étoile Floating Studs' },
      { url: earringsPearlImg, alt: 'Fine ear post and gallery finishing craftsmanship' },
    ],
    description:
      'Matched 0.60-carat oval brilliants mounted in low-profile four-prong platinum baskets with hidden pavé galleries, crafted to sit flush against the earlobe.',
    craftsmanshipNote: 'Guardian friction-lock platinum backs included for effortless all-day security.',
    specifications: [
      { label: 'Total Carat Weight', value: '1.20 ct Pair (D–E Color · VVS2)' },
      { label: 'Metal', value: 'Hallmarked Platinum 950' },
      { label: 'Post Style', value: 'La Poussette Safety Locking Back' },
    ],
    dimensions: 'Height 6.9 mm · Width 5.1 mm',
    materialAndStones: 'Platinum 950, two GIA-dossier matched oval natural diamonds.',
    deliveryInfo: 'Ships within 3–4 business days via insured air courier.',
    returnsInfo: '30-day complimentary return when security tag remains intact.',
    variants: [
      { id: 'pt-std', label: 'Platinum 950 (1.20 ct)', optionType: 'Metal Finish', priceInr: 275000, inStock: true, sku: 'AUR-ETO-E02' },
    ],
    requiresVariantSelection: false,
    isBestseller: true,
    releaseOrder: 17,
    relatedSlugs: ['the-etoile-diamond-ring', 'celeste-graduated-diamond-riviere', 'etoile-platinum-tennis-bracelet'],
  },
  {
    id: 'aur-serpentine-hoops',
    slug: 'serpentine-cascade-hoops',
    name: 'Serpentine Sculpted Pavé Hoops',
    subtitle: 'Split Hinged 18K White Gold · 0.96 ct Diamonds',
    category: 'Earrings',
    collectionSlug: 'maison-serpentine',
    collectionName: 'Maison Serpentine',
    priceInr: 189000,
    metal: '18K White Gold',
    gemstone: 'Diamond',
    images: [
      { url: braceletCuffImg, alt: 'Hand-set micro-pavé diamond curvature matching Serpentine hoops' },
      { url: heroCampaignImg, alt: 'Architectural diamond couture worn in Paris editorial portrait' },
    ],
    description:
      'Interlocking oval huggies paved both along the outer curve and inner visible crescent with seamless tension clasps.',
    craftsmanshipNote: 'Concealed hinge clicks flush without protruding snaps.',
    specifications: [
      { label: 'Diamonds', value: '0.96 ct F–G VS Full-Cut Brilliants' },
      { label: 'Metal', value: '18K White Gold' },
      { label: 'Outer Diameter', value: '21 mm Oval Architectural Hoop' },
    ],
    dimensions: '21 mm × 3.2 mm width',
    materialAndStones: '18K palladium white gold, 74 natural pavé diamonds.',
    deliveryInfo: 'Ships within 3–5 business days.',
    returnsInfo: '30-day complimentary return.',
    variants: [
      { id: '18k-wg', label: '18K White Gold', optionType: 'Metal Finish', priceInr: 189000, inStock: true, sku: 'AUR-SRP-E03-WG' },
      { id: '18k-yg', label: '18K Yellow Gold', optionType: 'Metal Finish', priceInr: 189000, inStock: true, sku: 'AUR-SRP-E03-YG' },
    ],
    requiresVariantSelection: true,
    releaseOrder: 11,
    relatedSlugs: ['maison-serpentine-diamond-collar', 'solstice-rose-gold-pave-cuff'],
  },
  {
    id: 'aur-jardin-emerald-earrings',
    slug: 'jardin-emerald-teardrop-earrings',
    name: 'Jardin Emerald Teardrop Earrings',
    subtitle: 'Pear-Cut Muzo Emeralds · Diamond Pavé Drops',
    category: 'Earrings',
    collectionSlug: 'jardin-botanique',
    collectionName: 'Jardin Botanique',
    priceInr: 410000,
    metal: '18K Yellow Gold',
    gemstone: 'Colombian Emerald',
    images: [
      { url: emeraldRingImg, alt: 'Colombian emerald vivid tone paired with white diamonds' },
      { url: earringsPearlImg, alt: 'Articulated drop earring proportion study' },
    ],
    description:
      'Matched 2.40-carat pear-cut Colombian emeralds suspended gracefully from articulated knife-edge diamond chains.',
    craftsmanshipNote: 'Free-swinging gallery links maximize movement and depth.',
    specifications: [
      { label: 'Emeralds', value: '2.40 ct Matched Colombian Pear Cuts' },
      { label: 'Diamonds', value: '0.58 ct E–F VVS Round Brilliants' },
      { label: 'Metal', value: '18K Yellow Gold & Platinum Collets' },
    ],
    dimensions: 'Drop Length 29 mm · Width 8.5 mm',
    materialAndStones: '18K gold and platinum 950 heads, natural Colombian emeralds.',
    deliveryInfo: 'Insured armored delivery within 5–6 business days.',
    returnsInfo: '30-day return guarantee.',
    variants: [
      { id: '18k-yg-single', label: '18K Yellow Gold / Platinum', optionType: 'Metal Finish', priceInr: 410000, inStock: true, sku: 'AUR-JAR-E04' },
    ],
    requiresVariantSelection: false,
    releaseOrder: 15,
    relatedSlugs: ['jardin-colombian-emerald-ring', 'adrienne-baroque-pearl-drops'],
  },

  // NECKLACES (5)
  {
    id: 'aur-celeste-riviere',
    slug: 'celeste-graduated-diamond-riviere',
    name: 'Céleste Graduated Diamond Rivière',
    subtitle: '7.50 ct Natural Diamonds · Articulated 4-Prong Links',
    category: 'Necklaces',
    collectionSlug: 'l-etoile',
    collectionName: "L'Étoile Solitaire",
    priceInr: 1180000,
    metal: 'Platinum 950',
    gemstone: 'Diamond',
    images: [
      { url: necklaceRiviereImg, alt: 'Céleste Graduated Diamond Rivière necklace draped across warm linen beside limestone' },
      { url: heroCampaignImg, alt: 'Aurélia diamond collar neckline fit in Paris afternoon light' },
    ],
    description:
      'Ninety-two individually calibrated round brilliant diamonds taper from 0.25 carats at the collarbone to 0.04 carats at the concealed double-safety box clasp.',
    craftsmanshipNote: 'Every articulated Platinum 950 collet is hand-weighted so the strand never flips.',
    specifications: [
      { label: 'Total Diamonds', value: '7.50 ct F–G Color · VS1–VVS2' },
      { label: 'Number of Stones', value: '92 Natural Round Brilliants' },
      { label: 'Clasp', value: 'Concealed Safety Tongue & Figure-Eight Latch' },
    ],
    dimensions: 'Select 40 cm Choker or 43 cm Princess Collar',
    materialAndStones: 'Platinum 950 articulated links with certified natural diamonds.',
    deliveryInfo: 'Armored white-glove delivery across metro India in 3–5 business days.',
    returnsInfo: '30-day return guarantee with intact security seal.',
    variants: [
      { id: 'len-40', label: '40 cm (Choker Fit)', optionType: 'Length', priceInr: 1180000, inStock: true, sku: 'AUR-CEL-N01-40' },
      { id: 'len-43', label: '43 cm (Collarbone Fit)', optionType: 'Length', priceInr: 1245000, inStock: true, sku: 'AUR-CEL-N01-43' },
    ],
    requiresVariantSelection: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    releaseOrder: 19,
    relatedSlugs: ['etoile-platinum-tennis-bracelet', 'the-etoile-diamond-ring', 'etoile-baguette-diamond-studs'],
  },
  {
    id: 'aur-soleil-medallion',
    slug: 'soleil-antique-gold-medallion',
    name: 'Soleil Antique Solitaire Pendant',
    subtitle: '1.15 ct Old Mine Cushion Diamond · 18K Yellow Gold',
    category: 'Necklaces',
    collectionSlug: 'jardin-botanique',
    collectionName: 'Jardin Botanique',
    priceInr: 238000,
    metal: '18K Yellow Gold',
    gemstone: 'Diamond',
    images: [
      { url: necklaceRiviereImg, alt: 'Warm 18K antique gold bezel cushion diamond pendant resting on porous limestone' },
      { url: atelierCraftImg, alt: 'Goldsmith bench finishing heavy 18K bail engraving' },
    ],
    description:
      'Reminiscent of Grand Tour heirlooms, a luminous cushion diamond is cupped inside an engraved Georgian-style 18K yellow gold collet hung from a diamond-cut rolo chain.',
    craftsmanshipNote: 'Hand-chamfered bail accommodates both daytime wear and layering with rivières.',
    specifications: [
      { label: 'Center Stone', value: '1.15 ct Cushion Diamond (G · VS1 · GIA)' },
      { label: 'Chain Style', value: '1.4 mm Hand-Soldered Rolo Chain' },
      { label: 'Adjustability', value: 'Jump Rings at 42 cm & 45 cm' },
    ],
    dimensions: 'Drop 15.5 mm · Chain adjustable 42 / 45 cm',
    materialAndStones: '18K antique yellow gold with natural diamond.',
    deliveryInfo: 'Ships within 3–4 business days.',
    returnsInfo: '30-day complimentary return.',
    variants: [
      { id: '18k-yg-42', label: '42 / 45 cm · 18K Yellow Gold', optionType: 'Length', priceInr: 238000, inStock: true, sku: 'AUR-SOL-N02' },
    ],
    requiresVariantSelection: false,
    isBestseller: true,
    releaseOrder: 16,
    relatedSlugs: ['adrienne-baroque-pearl-drops', 'celeste-graduated-diamond-riviere'],
  },
  {
    id: 'aur-serpentine-collar',
    slug: 'maison-serpentine-diamond-collar',
    name: 'Maison Serpentine Triple Collar',
    subtitle: 'Architectural Baguette & Pavé Necklace · 18K Gold',
    category: 'Necklaces',
    collectionSlug: 'maison-serpentine',
    collectionName: 'Maison Serpentine',
    priceInr: 1450000,
    metal: '18K Yellow Gold',
    gemstone: 'Diamond',
    images: [
      { url: heroCampaignImg, alt: 'Three-tier baguette and round diamond architectural collar worn over warm ivory silk' },
      { url: atelierCraftImg, alt: 'High jewelry gouache blueprint and loose stones in Milan atelier' },
    ],
    description:
      'Our atelier flagship statement piece: three articulated rows pairing emerald-cut baguettes with bezel-framed round brilliants sculpted precisely to the collarbone.',
    craftsmanshipNote: 'Individually hinged vertical bridges let the collar breathe fluidly with posture.',
    specifications: [
      { label: 'Diamond Weight', value: '11.40 ct E–F VVS Baguettes & Brilliants' },
      { label: 'Articulated Joints', value: '148 Internal Silk-Smooth Links' },
      { label: 'Metal', value: '18K Warm Antique Yellow Gold' },
    ],
    dimensions: 'Internal Circumference 38.5 cm · Drop Height 19 mm',
    materialAndStones: 'High-jewelry commission in 18K yellow gold and natural diamonds.',
    deliveryInfo: 'Hand-delivered by concierge courier across major Indian cities within 7 days.',
    returnsInfo: 'Eligible for salon inspection & exchange within 14 days.',
    variants: [
      { id: 'collar-38', label: '38.5 cm Signature Fit', optionType: 'Length', priceInr: 1450000, inStock: true, sku: 'AUR-SRP-N03-38' },
      { id: 'collar-41', label: '41 cm Extended Fit', optionType: 'Length', priceInr: 1495000, inStock: true, sku: 'AUR-SRP-N03-41' },
    ],
    requiresVariantSelection: true,
    isFeatured: true,
    releaseOrder: 20,
    relatedSlugs: ['solstice-rose-gold-pave-cuff', 'serpentine-cascade-hoops'],
  },
  {
    id: 'aur-botanique-lariat',
    slug: 'botanique-sapphire-lariat-necklace',
    name: 'Botanique Sapphire Y-Lariat',
    subtitle: 'Pear-Cut Burmese Sapphire Drop · 18K White Gold',
    category: 'Necklaces',
    collectionSlug: 'jardin-botanique',
    collectionName: 'Jardin Botanique',
    priceInr: 315000,
    metal: '18K White Gold',
    gemstone: 'Burmese Sapphire',
    images: [
      { url: necklaceRiviereImg, alt: 'Delicate platinum and diamond chain necklace draped on travertine' },
      { url: showcaseEditorialImg, alt: 'Evening styling of Botanique fine jewelry necklace' },
    ],
    description:
      'Fine diamond station chain falling into an elongated sapphire droplet that illuminates evening necklines.',
    craftsmanshipNote: 'Stationed collets stay facing outward using flat back-beveled bezels.',
    specifications: [
      { label: 'Sapphire Weight', value: '1.40 ct Pear Burmese Sapphire' },
      { label: 'Station Diamonds', value: '0.62 ct Full-Cut Round Brilliants' },
      { label: 'Chain', value: '18K White Gold Fine Cable (44 cm + 5 cm Drop)' },
    ],
    dimensions: '44 cm collar with 50 mm vertical lariat drop',
    materialAndStones: '18K white gold, natural Burmese sapphire, natural diamonds.',
    deliveryInfo: 'Ships insured within 4 business days.',
    returnsInfo: '30-day complimentary return.',
    variants: [
      { id: 'wg-44', label: '44 cm Collar · 18K White Gold', optionType: 'Length', priceInr: 315000, inStock: true, sku: 'AUR-BOT-N04' },
    ],
    requiresVariantSelection: false,
    releaseOrder: 9,
    relatedSlugs: ['valmont-sapphire-signet-ring', 'adrienne-baroque-pearl-drops'],
  },
  {
    id: 'aur-etoile-crescent',
    slug: 'etoile-east-west-solitaire-necklace',
    name: 'Étoile East-West Solitaire Necklace',
    subtitle: '0.85 ct Horizontal Oval Diamond · Platinum 950',
    category: 'Necklaces',
    collectionSlug: 'l-etoile',
    collectionName: "L'Étoile Solitaire",
    priceInr: 196000,
    metal: 'Platinum 950',
    gemstone: 'Diamond',
    images: [
      { url: etoileHeroImg, alt: 'Oval brilliant solitaire diamond orientation matching East-West pendant' },
      { url: necklaceRiviereImg, alt: 'Minimalist diamond solitaire chain draped across cream linen' },
    ],
    description:
      'Minimalist floating solitaire suspended horizontally on an ultra-fine Platinum 950 mirror cable chain.',
    craftsmanshipNote: 'Twin hidden chain eyelets allow uninterrupted sparkle along the collarbone.',
    specifications: [
      { label: 'Diamond', value: '0.85 ct Oval Brilliant (E · VVS2 · GIA)' },
      { label: 'Metal', value: 'Platinum 950' },
      { label: 'Length', value: '40 cm / 42 cm / 44 cm Multi-Loop' },
    ],
    dimensions: 'Stone 7.4 × 5.2 mm · Adjustable 40–44 cm chain',
    materialAndStones: 'Platinum 950 and natural GIA-graded diamond.',
    deliveryInfo: 'Ships within 2–3 business days.',
    returnsInfo: '30-day complimentary return.',
    variants: [
      { id: 'pt-42', label: '40–44 cm Adjustable · Platinum 950', optionType: 'Length', priceInr: 196000, inStock: true, sku: 'AUR-ETO-N05' },
    ],
    requiresVariantSelection: false,
    releaseOrder: 13,
    relatedSlugs: ['the-etoile-diamond-ring', 'etoile-baguette-diamond-studs'],
  },

  // BRACELETS (4)
  {
    id: 'aur-solstice-cuff',
    slug: 'solstice-rose-gold-pave-cuff',
    name: 'Solstice Hinged Pavé Cuff',
    subtitle: 'Five-Row Micro-Pavé Diamonds · 18K Rose Gold',
    category: 'Bracelets',
    collectionSlug: 'maison-serpentine',
    collectionName: 'Maison Serpentine',
    priceInr: 540000,
    metal: '18K Rose Gold',
    gemstone: 'Diamond',
    images: [
      { url: braceletCuffImg, alt: 'Solstice 18K rose gold hinged cuff bracelet encrusted with five rows of pavé diamonds' },
      { url: atelierCraftImg, alt: 'Milan atelier bench showing hand-finished 18K gold castings' },
    ],
    description:
      'Dome-sculpted oval bangle paved with over 340 calibrated brilliant diamonds flush-set into warm 18K rose gold. Engineered with an invisible side hinge and double safety catch.',
    craftsmanshipNote: 'Oval wrist architecture follows anatomical curvature so the top arc stays centered.',
    specifications: [
      { label: 'Total Diamond Weight', value: '4.10 ct F–G VS Micro-Pavé Brilliants' },
      { label: 'Metal', value: 'Solid 18K Rose Gold (42.5 g)' },
      { label: 'Closure', value: 'Recessed Spring Hinge + Flush Security Trigger' },
    ],
    dimensions: 'Width 8.2 mm · S (15.5 cm) or M (17.0 cm) Inner Wrist',
    materialAndStones: '18K rose gold (Au 750) with natural diamonds.',
    deliveryInfo: 'Complimentary insured courier in 4–5 business days.',
    returnsInfo: '30-day exchange for size adjustment.',
    variants: [
      { id: 'wrist-s', label: 'Small (15.5 cm Wrist)', optionType: 'Length', priceInr: 540000, inStock: true, sku: 'AUR-SOL-B01-S' },
      { id: 'wrist-m', label: 'Medium (17.0 cm Wrist)', optionType: 'Length', priceInr: 558000, inStock: true, sku: 'AUR-SOL-B01-M' },
    ],
    requiresVariantSelection: true,
    isFeatured: true,
    isBestseller: true,
    releaseOrder: 18,
    relatedSlugs: ['etoile-platinum-tennis-bracelet', 'serpentine-pave-architectural-band'],
  },
  {
    id: 'aur-etoile-tennis',
    slug: 'etoile-platinum-tennis-bracelet',
    name: 'Étoile Line Diamond Bracelet',
    subtitle: '3.80 ct Matched Round Brilliants · Platinum 950',
    category: 'Bracelets',
    collectionSlug: 'l-etoile',
    collectionName: "L'Étoile Solitaire",
    priceInr: 465000,
    metal: 'Platinum 950',
    gemstone: 'Diamond',
    images: [
      { url: braceletCuffImg, alt: 'Slender Platinum 950 diamond tennis bracelet alongside rose gold cuff on travertine tray' },
      { url: necklaceRiviereImg, alt: 'Articulated platinum diamond line link craftsmanship' },
    ],
    description:
      'Fifty-four F-color VVS round brilliant diamonds articulated in feather-light four-prong Platinum 950 collets designed to stack cleanly beside timepieces or cuffs.',
    craftsmanshipNote: 'Ultra-supple joint tolerance drapes smoothly like liquid platinum.',
    specifications: [
      { label: 'Total Carat Weight', value: '3.80 ct Natural Round Brilliants (F · VVS)' },
      { label: 'Metal', value: 'Hallmarked Platinum 950' },
      { label: 'Security', value: 'Triple-Lock Integrated Diamond Clasp' },
    ],
    dimensions: 'Stone diameter 2.6 mm · Select 16.5 cm or 18.0 cm',
    materialAndStones: 'Platinum 950 and calibrated natural round brilliant diamonds.',
    deliveryInfo: 'Ships within 3–4 business days.',
    returnsInfo: '30-day return & complimentary link sizing.',
    variants: [
      { id: 'len-165', label: '16.5 cm Standard', optionType: 'Length', priceInr: 465000, inStock: true, sku: 'AUR-ETO-B02-165' },
      { id: 'len-180', label: '18.0 cm Relaxed', optionType: 'Length', priceInr: 492000, inStock: true, sku: 'AUR-ETO-B02-180' },
    ],
    requiresVariantSelection: true,
    isBestseller: true,
    releaseOrder: 17,
    relatedSlugs: ['solstice-rose-gold-pave-cuff', 'celeste-graduated-diamond-riviere'],
  },
  {
    id: 'aur-palais-chain',
    slug: 'palais-fine-link-bracelet',
    name: 'Palais Hammered Gold Link Bracelet',
    subtitle: 'Hand-Beveled Paperclip Links · 18K Yellow Gold',
    category: 'Bracelets',
    collectionSlug: 'maison-serpentine',
    collectionName: 'Maison Serpentine',
    priceInr: 88000,
    metal: '18K Yellow Gold',
    gemstone: 'Diamond',
    images: [
      { url: braceletCuffImg, alt: 'Architectural yellow and rose gold bracelet textures on ivory limestone' },
      { url: atelierCraftImg, alt: 'Hand-cast 18K gold links inside Milan workshop' },
    ],
    description:
      'Elongated solid gold links lightly faceted by hand, fastened with a flush pavé diamond bar clasp.',
    craftsmanshipNote: 'Solid wire links ensure lifelong resistance against denting.',
    specifications: [
      { label: 'Gold Weight', value: '14.8 g Solid 18K Yellow Gold' },
      { label: 'Clasp Accent', value: '0.12 ct Flush-Set Pavé Diamonds' },
    ],
    dimensions: 'Link gauge 4.2 mm · Length 17.5 cm (adjustable)',
    materialAndStones: '18K solid yellow gold with natural accent diamonds.',
    deliveryInfo: 'Ships in 2–3 business days.',
    returnsInfo: '30-day complimentary return.',
    variants: [
      { id: 'yg-175', label: '17.5 cm · 18K Yellow Gold', optionType: 'Metal Finish', priceInr: 88000, inStock: true, sku: 'AUR-PAL-B03' },
    ],
    requiresVariantSelection: false,
    releaseOrder: 8,
    relatedSlugs: ['soleil-antique-gold-medallion', 'solstice-rose-gold-pave-cuff'],
  },
  {
    id: 'aur-jardin-pearl-bangle',
    slug: 'jardin-pearl-emerald-open-cuff',
    name: 'Jardin Pearl & Emerald Open Cuff',
    subtitle: 'Terminated with Muzo Emerald & Pearl Cabochon · 18K Gold',
    category: 'Bracelets',
    collectionSlug: 'jardin-botanique',
    collectionName: 'Jardin Botanique',
    priceInr: 224000,
    metal: '18K Yellow Gold',
    gemstone: 'Colombian Emerald',
    images: [
      { url: earringsPearlImg, alt: 'Lustrous baroque pearl paired with organic 18K yellow gold work' },
      { url: emeraldRingImg, alt: 'Matched vibrant Colombian emerald cabochon color finish' },
    ],
    description:
      'Memory-tempered 18K yellow gold torque cuff capped asymmetrically with a luminous freshwater pearl and octagonal Colombian emerald.',
    craftsmanshipNote: 'Internal titanium spring wire preserves exact wrist tension.',
    specifications: [
      { label: 'Gemstones', value: '0.95 ct Muzo Emerald · 9.5 mm Pearl' },
      { label: 'Metal', value: '18K Yellow Gold (Satin Satiné)' },
    ],
    dimensions: 'Inner width 58 mm · Band gauge 2.8 mm',
    materialAndStones: '18K yellow gold, freshwater pearl, natural Colombian emerald.',
    deliveryInfo: 'Ships in 4–5 business days.',
    returnsInfo: '30-day return guarantee.',
    variants: [
      { id: '18k-yg-m', label: 'Standard 58 mm · 18K Gold', optionType: 'Metal Finish', priceInr: 224000, inStock: true, sku: 'AUR-JAR-B04' },
    ],
    requiresVariantSelection: false,
    releaseOrder: 10,
    relatedSlugs: ['adrienne-baroque-pearl-drops', 'jardin-colombian-emerald-ring'],
  },

  // BRIDAL (4)
  {
    id: 'aur-union-bridal-suite',
    slug: 'l-union-solitaire-eternity-suite',
    name: "L'Union Solitaire & Eternity Suite",
    subtitle: 'Matched Bridal Pairing · 2.45 ct Combined Diamonds',
    category: 'Bridal',
    collectionSlug: 'bridal-atelier',
    collectionName: 'Bridal Atelier',
    priceInr: 695000,
    metal: 'Platinum 950',
    gemstone: 'Diamond',
    images: [
      { url: bridalPairImg, alt: "L'Union Solitaire & Eternity Suite nestled inside warm ivory suede presentation box" },
      { url: etoileHeroImg, alt: 'Matched oval solitaire focal detail' },
      { url: etoileDetailImg, alt: 'Profile height study confirming flush eternity band stack' },
    ],
    description:
      'Conceived as an inseparable bridal diptych: a 1.60-carat GIA oval solitaire elevated precisely to nest flush alongside our shared-prong full-eternity diamond band.',
    craftsmanshipNote: 'Both bands share identical alloy pour batches and mirror platinum polish.',
    specifications: [
      { label: 'Engagement Center', value: '1.60 ct Oval Brilliant (D–E · VVS1 · GIA)' },
      { label: 'Companion Eternity', value: '0.85 ct Full-Circle French-Cut Diamonds' },
      { label: 'Precious Metal', value: 'Hallmarked Platinum 950 Pair' },
    ],
    dimensions: 'Combined stack width 4.0 mm · Flush under-basket clearance',
    materialAndStones: 'Platinum 950 set with matched natural colorless diamonds.',
    deliveryInfo: 'Insured white-glove bridal presentation delivery in 5–7 business days.',
    returnsInfo: '30-day complimentary exchange & complimentary annual polish.',
    variants: standardRingSizes(695000, 'AUR-BRD-S01', '48'),
    requiresVariantSelection: true,
    isFeatured: true,
    isNewArrival: true,
    releaseOrder: 21,
    relatedSlugs: ['the-etoile-diamond-ring', 'voeux-platinum-eternity-band', 'etoile-baguette-diamond-studs'],
  },
  {
    id: 'aur-voeux-eternity',
    slug: 'voeux-platinum-eternity-band',
    name: 'Voeux Shared-Prong Eternity Band',
    subtitle: '1.40 ct Full-Circle Brilliants · Platinum 950',
    category: 'Bridal',
    collectionSlug: 'bridal-atelier',
    collectionName: 'Bridal Atelier',
    priceInr: 218000,
    metal: 'Platinum 950',
    gemstone: 'Diamond',
    images: [
      { url: bridalPairImg, alt: 'Voeux Platinum Eternity Band photographed beside matching solitaire in suede tray' },
      { url: etoileDetailImg, alt: 'Close-up shared-prong platinum craftsmanship' },
    ],
    description:
      'Continuous circle of E-color round brilliants held in airy U-cut shared prongs so minimal metal interrupts each diamond’s sparkle.',
    craftsmanshipNote: 'Sized accurately to order so stone spacing remains uniform all 360°.',
    specifications: [
      { label: 'Total Carat Weight', value: '1.40 ct E–F VVS Round Brilliants' },
      { label: 'Metal', value: 'Platinum 950' },
      { label: 'Profile Width', value: '2.3 mm U-Cut Shared Prong' },
    ],
    dimensions: 'Band width 2.3 mm · Height 2.0 mm',
    materialAndStones: 'Platinum 950 with natural diamond eternity set.',
    deliveryInfo: 'Insured delivery in 5–6 business days.',
    returnsInfo: '30-day complimentary exchange for unworn sizing swap.',
    variants: standardRingSizes(218000, 'AUR-VOE-S02'),
    requiresVariantSelection: true,
    releaseOrder: 15,
    relatedSlugs: ['the-etoile-diamond-ring', 'l-union-solitaire-eternity-suite'],
  },
  {
    id: 'aur-couronne-engagement',
    slug: 'couronne-cathedral-pave-ring',
    name: 'Couronne Cathedral Bridal Ring',
    subtitle: '1.50 ct Emerald-Cut Diamond · 18K White Gold',
    category: 'Bridal',
    collectionSlug: 'bridal-atelier',
    collectionName: 'Bridal Atelier',
    priceInr: 448000,
    metal: '18K White Gold',
    gemstone: 'Diamond',
    images: [
      { url: etoileDetailImg, alt: 'Cathedral shoulder and undergallery diamond work on travertine stone' },
      { url: etoileHeroImg, alt: 'Top silhouette of architectural solitaire bridal mount' },
    ],
    description:
      'Hall of Mirrors emerald-cut diamond suspended between gracefully arched cathedral shoulders beaded with micro-pavé diamonds.',
    craftsmanshipNote: 'Four corner talon prongs accentuate crisp emerald-cut geometry.',
    specifications: [
      { label: 'Center Stone', value: '1.50 ct Emerald-Cut (E · VVS1 · GIA)' },
      { label: 'Shoulder Pavé', value: '0.32 ct Tapered Micro-Pavé' },
      { label: 'Metal', value: '18K Palladium White Gold' },
    ],
    dimensions: 'Shank 2.0 mm · Crown elevation 6.2 mm',
    materialAndStones: '18K white gold and GIA-certified natural diamonds.',
    deliveryInfo: 'Insured delivery within 5 business days.',
    returnsInfo: '30-day complimentary return & first resize.',
    variants: standardRingSizes(448000, 'AUR-COU-S03', '56'),
    requiresVariantSelection: true,
    releaseOrder: 13,
    relatedSlugs: ['the-etoile-diamond-ring', 'voeux-platinum-eternity-band'],
  },
  {
    id: 'aur-alliance-millgrain',
    slug: 'alliance-millgrain-wedding-band',
    name: 'Alliance Knife-Edge Wedding Band',
    subtitle: 'Signature Hand-Beaded Rim · 18K Rose Gold',
    category: 'Bridal',
    collectionSlug: 'bridal-atelier',
    collectionName: 'Bridal Atelier',
    priceInr: 72000,
    metal: '18K Rose Gold',
    gemstone: 'Diamond',
    images: [
      { url: atelierCraftImg, alt: 'Traditional goldsmith calipers and precision ring craftsmanship' },
      { url: bridalPairImg, alt: 'Warm rose gold and bridal keepsake silk ribbon presentation' },
    ],
    description:
      'Timeless court-interior wedding band edged with whisper-fine hand millgrain and a concealed inner diamond promise stone.',
    craftsmanshipNote: 'Inner secret stone option engraved with complimentary initials.',
    specifications: [
      { label: 'Inside Detail', value: '0.03 ct Flush Comfort Diamond' },
      { label: 'Metal', value: '18K Solid Rose Gold (Au 750)' },
      { label: 'Width', value: '2.6 mm Millgrain Border' },
    ],
    dimensions: 'Width 2.6 mm · Court comfort interior',
    materialAndStones: '18K rose gold with single internal diamond accent.',
    deliveryInfo: 'Ships within 3 business days.',
    returnsInfo: '30-day complimentary return or size swap.',
    variants: standardRingSizes(72000, 'AUR-ALL-S04'),
    requiresVariantSelection: true,
    releaseOrder: 7,
    relatedSlugs: ['l-union-solitaire-eternity-suite', 'serpentine-pave-architectural-band'],
  },
];

export function getProductBySlug(slug?: string): AureliaProduct | undefined {
  if (!slug) return undefined;
  return AURELIA_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export function getRelatedProducts(product: AureliaProduct): AureliaProduct[] {
  const mapped = product.relatedSlugs
    .map((slug) => AURELIA_PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is AureliaProduct => Boolean(p));
  if (mapped.length >= 3) return mapped.slice(0, 4);
  const others = AURELIA_PRODUCTS.filter(
    (p) => p.id !== product.id && !mapped.some((m) => m.id === p.id)
  );
  return [...mapped, ...others].slice(0, 4);
}
