import { Currency } from "../constants/currencies";

/**
 * Formats a number as currency with the provided currency symbol
 * @param amount - The amount to format
 * @param currency - The currency object with symbol and code
 * @returns Formatted currency string (e.g., "$10.50" or "R100.00")
 */
export const formatCurrency = (amount: number, currency: Currency): string => {
  return `${currency.symbol}${amount.toFixed(2)}`;
};

/**
 * Formats a number as currency with the provided currency symbol and code
 * @param amount - The amount to format
 * @param currency - The currency object with symbol and code
 * @returns Formatted currency string with code (e.g., "$10.50 USD" or "R100.00 ZAR")
 */
export const formatCurrencyWithCode = (
  amount: number,
  currency: Currency
): string => {
  return `${currency.symbol}${amount.toFixed(2)} ${currency.code}`;
};
