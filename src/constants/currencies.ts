export interface Currency {
  code: string;
  symbol: string;
  name: string;
  country: string;
}

export const CURRENCIES: Currency[] = [
  {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    country: "South Africa",
  },
  { code: "USD", symbol: "$", name: "US Dollar", country: "United States" },
  { code: "EUR", symbol: "€", name: "Euro", country: "European Union" },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    country: "United Kingdom",
  },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada" },
  {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    country: "Australia",
  },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", country: "Switzerland" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", country: "China" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", country: "Mexico" },
  {
    code: "KRW",
    symbol: "₩",
    name: "South Korean Won",
    country: "South Korea",
  },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore" },
  {
    code: "NZD",
    symbol: "NZ$",
    name: "New Zealand Dollar",
    country: "New Zealand",
  },
  {
    code: "THB",
    symbol: "฿",
    name: "Thai Baht",
    country: "Thailand",
  },
];

export const DEFAULT_CURRENCY = CURRENCIES[0]; // South African Rand
