export interface Currency {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
  type: string;
  countries: string[];
}

export interface CurrenciesResponse {
  data: {
    [currencyCode: string]: Currency;
  };
}

export interface ExchangeRate {
  code: string;
  value: number;
}

export interface ExchangeRatesResponse {
  meta: {
    last_updated_at: string;
  };
  data: {
    [currencyCode: string]: ExchangeRate;
  };
}

export interface Quota {
  total: number;
  used: number;
  remaining: number;
}

export interface StatusResponse {
  data: {
    account_id: string;
    account_status: string;
    quotas: {
      month: Quota;
    };
  };
}