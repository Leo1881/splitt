import { create } from "zustand";
import {
  Payee,
  ReceiptItem,
  ItemAssignment,
  ExtractedReceiptData,
} from "../types";
import { Currency, DEFAULT_CURRENCY } from "../constants/currencies";

interface AppState {
  // Payees
  payees: Payee[];
  setPayees: (payees: Payee[]) => void;

  // Items
  items: ReceiptItem[];
  setItems: (items: ReceiptItem[]) => void;

  // Assignments
  assignments: ItemAssignment[];
  setAssignments: (assignments: ItemAssignment[]) => void;

  // Financial
  tipAmount: number;
  setTipAmount: (amount: number) => void;
  subtotal: number;
  setSubtotal: (amount: number) => void;

  // Settings
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  restaurantName: string;
  setRestaurantName: (name: string) => void;

  // Receipt
  capturedPhoto: string | null;
  setCapturedPhoto: (uri: string | null) => void;
  extractedData: ExtractedReceiptData | null;
  setExtractedData: (data: ExtractedReceiptData | null) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  payees: [],
  items: [],
  assignments: [],
  tipAmount: 0,
  subtotal: 0,
  selectedCurrency: DEFAULT_CURRENCY,
  restaurantName: "",
  capturedPhoto: null,
  extractedData: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setPayees: (payees) => set({ payees }),
  setItems: (items) => set({ items }),
  setAssignments: (assignments) => set({ assignments }),
  setTipAmount: (amount) => set({ tipAmount: amount }),
  setSubtotal: (amount) => set({ subtotal: amount }),
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
  setRestaurantName: (name) => set({ restaurantName: name }),
  setCapturedPhoto: (uri) => set({ capturedPhoto: uri }),
  setExtractedData: (data) => set({ extractedData: data }),

  reset: () => set(initialState),
}));
