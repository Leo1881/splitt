// Type definitions for the app
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Shared interfaces used across the app
export interface Payee {
  id: string;
  name: string;
}

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ItemAssignment {
  itemId: string;
  payees: Payee[];
  isSplit: boolean;
  quantities?: { [payeeId: string]: number };
}

export interface ExtractedReceiptData {
  restaurantName: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  rawText: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};
