import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AURELIA_PRODUCTS, AureliaProduct, ProductVariant } from '../data/aureliaCatalog';

export interface AureliaBagItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface HydratedBagLine {
  product: AureliaProduct;
  variant: ProductVariant;
  quantity: number;
  unitPriceInr: number;
  lineTotalInr: number;
}

export type DeliveryMethodId = 'insured-vault' | 'armored-concierge';

export interface DeliveryMethodOption {
  id: DeliveryMethodId;
  label: string;
  eta: string;
  feeInr: number;
  description: string;
}

export const DELIVERY_OPTIONS: DeliveryMethodOption[] = [
  {
    id: 'insured-vault',
    label: 'Complimentary Insured Vault Delivery',
    eta: '4–6 Business Days',
    feeInr: 0,
    description: 'Signature-required armored courier with 100% transit coverage across India.',
  },
  {
    id: 'armored-concierge',
    label: 'Same-Day / Priority Armored Concierge',
    eta: '24–48 Hours (Select Metros)',
    feeInr: 2500,
    description: 'Dedicated white-glove salon handoff with sealed presentation packaging.',
  },
];

export interface AureliaOrderItemSnapshot {
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantLabel: string;
  sku: string;
  unitPriceInr: number;
  quantity: number;
  lineTotalInr: number;
}

export interface AureliaDemoOrder {
  orderNumber: string;
  createdAtIso: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    giftNote?: string;
  };
  deliveryOption: DeliveryMethodOption;
  items: AureliaOrderItemSnapshot[];
  subtotalInr: number;
  shippingInr: number;
  totalInr: number;
}

interface AureliaStoreContextValue {
  bag: AureliaBagItem[];
  hydratedBag: HydratedBagLine[];
  bagCount: number;
  bagSubtotalInr: number;
  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  addToBag: (productId: string, variantId: string, quantity?: number) => void;
  updateBagQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeFromBag: (productId: string, variantId: string) => void;
  clearBag: () => void;
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  lastOrder: AureliaDemoOrder | null;
  placeDemoOrder: (
    customer: AureliaDemoOrder['customer'],
    deliveryOptionId: DeliveryMethodId
  ) => AureliaDemoOrder | null;
  toastMessage: string | null;
  dismissToast: () => void;
}

const BAG_STORAGE_KEY = 'aurelia_bag_v1';
const WISHLIST_STORAGE_KEY = 'aurelia_wishlist_v1';
const ORDER_STORAGE_KEY = 'aurelia_last_order_v1';

const AureliaStoreContext = createContext<AureliaStoreContextValue | undefined>(undefined);

function safeReadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const AureliaStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bag, setBag] = useState<AureliaBagItem[]>(() =>
    safeReadStorage<AureliaBagItem[]>(BAG_STORAGE_KEY, [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    safeReadStorage<string[]>(WISHLIST_STORAGE_KEY, [])
  );
  const [lastOrder, setLastOrder] = useState<AureliaDemoOrder | null>(() =>
    safeReadStorage<AureliaDemoOrder | null>(ORDER_STORAGE_KEY, null)
  );
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bag));
    } catch {
      // ignore quota failures
    }
  }, [bag]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore quota failures
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (lastOrder) {
        window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
      } else {
        window.localStorage.removeItem(ORDER_STORAGE_KEY);
      }
    } catch {
      // ignore quota failures
    }
  }, [lastOrder]);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const hydratedBag = useMemo<HydratedBagLine[]>(() => {
    return bag
      .map((line) => {
        const product = AURELIA_PRODUCTS.find((p) => p.id === line.productId);
        if (!product) return null;
        const variant = product.variants.find((v) => v.id === line.variantId) || product.variants[0];
        if (!variant) return null;
        const unitPriceInr = variant.priceInr;
        const qty = Math.max(1, Math.min(10, line.quantity));
        return {
          product,
          variant,
          quantity: qty,
          unitPriceInr,
          lineTotalInr: unitPriceInr * qty,
        };
      })
      .filter((item): item is HydratedBagLine => Boolean(item));
  }, [bag]);

  const bagCount = useMemo(
    () => hydratedBag.reduce((sum, item) => sum + item.quantity, 0),
    [hydratedBag]
  );

  const bagSubtotalInr = useMemo(
    () => hydratedBag.reduce((sum, item) => sum + item.lineTotalInr, 0),
    [hydratedBag]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [productId, ...prev];
      const product = AURELIA_PRODUCTS.find((p) => p.id === productId);
      if (product) {
        setToastMessage(
          exists ? `Removed ${product.name} from favorites` : `Saved ${product.name} to favorites`
        );
      }
      return next;
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  }, []);

  const addToBag = useCallback((productId: string, variantId: string, quantity = 1) => {
    const product = AURELIA_PRODUCTS.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    if (!product || !variant || !variant.inStock) return;

    setBag((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: Math.min(10, updated[idx].quantity + quantity),
        };
        return updated;
      }
      return [...prev, { productId, variantId, quantity: Math.max(1, quantity) }];
    });

    setToastMessage(`Added ${product.name} (${variant.label}) to your bag`);
    setIsBagOpen(true);
  }, []);

  const updateBagQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      if (quantity <= 0) {
        setBag((prev) =>
          prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
        );
        return;
      }
      setBag((prev) =>
        prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: Math.min(10, quantity) }
            : item
        )
      );
    },
    []
  );

  const removeFromBag = useCallback((productId: string, variantId: string) => {
    setBag((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  }, []);

  const clearBag = useCallback(() => {
    setBag([]);
  }, []);

  const placeDemoOrder = useCallback(
    (
      customer: AureliaDemoOrder['customer'],
      deliveryOptionId: DeliveryMethodId
    ): AureliaDemoOrder | null => {
      if (hydratedBag.length === 0) return null;
      const deliveryOption =
        DELIVERY_OPTIONS.find((opt) => opt.id === deliveryOptionId) || DELIVERY_OPTIONS[0];
      const subtotalInr = hydratedBag.reduce((sum, item) => sum + item.lineTotalInr, 0);
      const shippingInr = deliveryOption.feeInr;
      const totalInr = subtotalInr + shippingInr;

      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const order: AureliaDemoOrder = {
        orderNumber: `DEMO-AUR-${randomCode}`,
        createdAtIso: new Date().toISOString(),
        customer,
        deliveryOption,
        items: hydratedBag.map((line) => ({
          productId: line.product.id,
          slug: line.product.slug,
          name: line.product.name,
          image: line.product.images[0].url,
          variantLabel: line.variant.label,
          sku: line.variant.sku,
          unitPriceInr: line.unitPriceInr,
          quantity: line.quantity,
          lineTotalInr: line.lineTotalInr,
        })),
        subtotalInr,
        shippingInr,
        totalInr,
      };

      setLastOrder(order);
      setBag([]);
      setIsBagOpen(false);
      return order;
    },
    [hydratedBag]
  );

  const value: AureliaStoreContextValue = {
    bag,
    hydratedBag,
    bagCount,
    bagSubtotalInr,
    wishlist,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    addToBag,
    updateBagQuantity,
    removeFromBag,
    clearBag,
    isBagOpen,
    openBag: () => setIsBagOpen(true),
    closeBag: () => setIsBagOpen(false),
    lastOrder,
    placeDemoOrder,
    toastMessage,
    dismissToast: () => setToastMessage(null),
  };

  return <AureliaStoreContext.Provider value={value}>{children}</AureliaStoreContext.Provider>;
};

export function useAureliaStore(): AureliaStoreContextValue {
  const ctx = useContext(AureliaStoreContext);
  if (!ctx) {
    throw new Error('useAureliaStore must be used inside AureliaStoreProvider');
  }
  return ctx;
}
