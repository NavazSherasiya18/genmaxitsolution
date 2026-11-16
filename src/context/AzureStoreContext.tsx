import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CurrencyCode,
  DestinationSlug,
  VillaQuote,
  getTodayIso,
  addDaysIso,
} from '../data/azureCatalog';

export interface AzureSearchDraft {
  destination: DestinationSlug | 'all';
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface AzureReservationDraft {
  villaSlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  selectedExtraIds: string[];
}

export interface AzureConfirmationSummary {
  reference: string;
  createdAtIso: string;
  villaId: string;
  villaSlug: string;
  villaName: string;
  destinationLabel: string;
  locationArea: string;
  villaImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  currency: CurrencyCode;
  quote: VillaQuote;
  leadGuestFirstName: string; // Display-only first name greeting; NO email/phone/PII stored
  specialRequestsNote?: string;
}

interface AzureStoreContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  savedVillaIds: string[];
  toggleSaveVilla: (villaId: string) => void;
  isVillaSaved: (villaId: string) => boolean;
  searchDraft: AzureSearchDraft;
  updateSearchDraft: (patch: Partial<AzureSearchDraft>) => void;
  reservationDraft: AzureReservationDraft;
  updateReservationDraft: (patch: Partial<AzureReservationDraft>) => void;
  toggleDraftExtra: (extraId: string) => void;
  lastConfirmation: AzureConfirmationSummary | null;
  saveConfirmation: (summary: AzureConfirmationSummary) => void;
  clearConfirmation: () => void;
}

const SAVED_STORAGE_KEY = 'azure_saved_villas_v1';
const CURRENCY_STORAGE_KEY = 'azure_currency_v1';
const CONFIRMATION_STORAGE_KEY = 'azure_last_reservation_v1';

const DEFAULT_TODAY = getTodayIso();

const DEFAULT_SEARCH_DRAFT: AzureSearchDraft = {
  destination: 'all',
  checkIn: addDaysIso(DEFAULT_TODAY, 8),
  checkOut: addDaysIso(DEFAULT_TODAY, 12),
  guests: 2,
};

const DEFAULT_RESERVATION_DRAFT: AzureReservationDraft = {
  villaSlug: 'caldera-house',
  checkIn: addDaysIso(DEFAULT_TODAY, 8),
  checkOut: addDaysIso(DEFAULT_TODAY, 12),
  guests: 2,
  selectedExtraIds: [],
};

const AzureStoreContext = createContext<AzureStoreContextValue | undefined>(undefined);

export const AzureStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved === 'EUR' || saved === 'USD' || saved === 'INR') return saved;
    } catch {
      // Ignore storage access failures
    }
    return 'EUR';
  });

  const [savedVillaIds, setSavedVillaIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((id): id is string => typeof id === 'string');
      }
    } catch {
      // Ignore storage parse failures
    }
    return ['villa-caldera-house'];
  });

  const [searchDraft, setSearchDraft] = useState<AzureSearchDraft>(DEFAULT_SEARCH_DRAFT);
  const [reservationDraft, setReservationDraft] = useState<AzureReservationDraft>(
    DEFAULT_RESERVATION_DRAFT
  );

  const [lastConfirmation, setLastConfirmation] = useState<AzureConfirmationSummary | null>(() => {
    try {
      const raw = localStorage.getItem(CONFIRMATION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.reference === 'string' && parsed.quote?.valid) {
          return parsed as AzureConfirmationSummary;
        }
      }
    } catch {
      // Ignore parse failures
    }
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedVillaIds));
    } catch {
      // Ignore write failures
    }
  }, [savedVillaIds]);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, next);
    } catch {
      // Ignore write failures
    }
  }, []);

  const toggleSaveVilla = useCallback((villaId: string) => {
    setSavedVillaIds((prev) =>
      prev.includes(villaId) ? prev.filter((id) => id !== villaId) : [...prev, villaId]
    );
  }, []);

  const isVillaSaved = useCallback(
    (villaId: string) => savedVillaIds.includes(villaId),
    [savedVillaIds]
  );

  const updateSearchDraft = useCallback((patch: Partial<AzureSearchDraft>) => {
    setSearchDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateReservationDraft = useCallback((patch: Partial<AzureReservationDraft>) => {
    setReservationDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleDraftExtra = useCallback((extraId: string) => {
    setReservationDraft((prev) => ({
      ...prev,
      selectedExtraIds: prev.selectedExtraIds.includes(extraId)
        ? prev.selectedExtraIds.filter((id) => id !== extraId)
        : [...prev.selectedExtraIds, extraId],
    }));
  }, []);

  const saveConfirmation = useCallback((summary: AzureConfirmationSummary) => {
    // Strip any potential contact fields strictly so zero PII enters persistent storage
    const sanitized: AzureConfirmationSummary = {
      reference: summary.reference,
      createdAtIso: summary.createdAtIso,
      villaId: summary.villaId,
      villaSlug: summary.villaSlug,
      villaName: summary.villaName,
      destinationLabel: summary.destinationLabel,
      locationArea: summary.locationArea,
      villaImage: summary.villaImage,
      checkIn: summary.checkIn,
      checkOut: summary.checkOut,
      guests: summary.guests,
      currency: summary.currency,
      quote: summary.quote,
      leadGuestFirstName: summary.leadGuestFirstName,
      specialRequestsNote: summary.specialRequestsNote,
    };
    setLastConfirmation(sanitized);
    try {
      localStorage.setItem(CONFIRMATION_STORAGE_KEY, JSON.stringify(sanitized));
    } catch {
      // Ignore storage failures
    }
  }, []);

  const clearConfirmation = useCallback(() => {
    setLastConfirmation(null);
    try {
      localStorage.removeItem(CONFIRMATION_STORAGE_KEY);
    } catch {
      // Ignore removal failures
    }
  }, []);

  const value = useMemo<AzureStoreContextValue>(
    () => ({
      currency,
      setCurrency,
      savedVillaIds,
      toggleSaveVilla,
      isVillaSaved,
      searchDraft,
      updateSearchDraft,
      reservationDraft,
      updateReservationDraft,
      toggleDraftExtra,
      lastConfirmation,
      saveConfirmation,
      clearConfirmation,
    }),
    [
      currency,
      setCurrency,
      savedVillaIds,
      toggleSaveVilla,
      isVillaSaved,
      searchDraft,
      updateSearchDraft,
      reservationDraft,
      updateReservationDraft,
      toggleDraftExtra,
      lastConfirmation,
      saveConfirmation,
      clearConfirmation,
    ]
  );

  return <AzureStoreContext.Provider value={value}>{children}</AzureStoreContext.Provider>;
};

export function useAzureStore() {
  const ctx = useContext(AzureStoreContext);
  if (!ctx) {
    throw new Error('useAzureStore must be used inside AzureStoreProvider');
  }
  return ctx;
}
