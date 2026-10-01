export type CurrencyCode = 'USD' | 'VND' | 'EUR' | 'GBP';

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; prefix: boolean }> = {
  USD: { symbol: '$', rate: 1, prefix: true },
  VND: { symbol: '₫', rate: 25400, prefix: false },
  EUR: { symbol: '€', rate: 0.92, prefix: true },
  GBP: { symbol: '£', rate: 0.78, prefix: true },
};

export function formatPrice(amount?: number | null, currency: CurrencyCode = 'USD'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';

  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = amount * config.rate;

  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(converted);
  }

  const formattedNum = converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return config.prefix ? `${config.symbol}${formattedNum}` : `${formattedNum} ${config.symbol}`;
}

export function formatVND(amount?: number | null): string {
  // If amount is small (like $24.49), format in USD by default or in VND if huge
  if (amount !== undefined && amount !== null && amount < 1000) {
    return formatPrice(amount, 'USD');
  }
  if (amount === undefined || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function parseSpecs(specsJson?: string): Record<string, string> {
  if (!specsJson) return {};
  try {
    return JSON.parse(specsJson);
  } catch {
    return {};
  }
}
