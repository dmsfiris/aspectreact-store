import { CURRENCY, DEFAULT_LOCALE } from "./config";

export function formatCurrency(n, { currency = CURRENCY, locale = DEFAULT_LOCALE } = {}) {
  const amount = Number(n || 0);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if env currency/locale are odd
    return `$${amount.toFixed(2)}`;
  }
}
