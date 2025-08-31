import type { CurrenciesResponse, ExchangeRatesResponse, StatusResponse } from "@/types/types";
import { API_CONFIG } from "./config";

export class CurrencyApiService {
  private createUrl(
    endpoint: string,
    params: Record<string, string | number | string[]> = {}
  ) {
    const searchParams = new URLSearchParams({
      apikey: API_CONFIG.DEFAULT_PARAMS.apikey,
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data - ${response.statusText}`);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to parse response - ${error}`);
    }
  }

  async getStatus(): Promise<StatusResponse> {
    const url = this.createUrl(API_CONFIG.STATUS);
    return this.fetchData<StatusResponse>(url);
  }

  async getCurrencies(): Promise<CurrenciesResponse> {
    const url = this.createUrl(API_CONFIG.CURRENCIES);
    return this.fetchData<CurrenciesResponse>(url);
  }

  async getLastRates({
    base_currency = "USD",
    currencies,
  }: {
    base_currency?: string;
    currencies: string[];
  }): Promise<ExchangeRatesResponse> {
    const url = this.createUrl(API_CONFIG.LATEST, {
      base_currency,
      currencies,
    });
    return this.fetchData<ExchangeRatesResponse>(url);
  }


  async convertCurrency({
    value,
    from,
    to,
  }: {
    value: number;
    from: string;
    to: string;
  }): Promise<number> {
    if (value < 0) throw new Error("Value cannot be negative");

    let status: StatusResponse;
    try {
      status = await this.getStatus();
      if (status.data.quotas.month.remaining === 0) {
        console.warn("API quota exhausted, using fixed rates");
        return this.fallbackConversion(value, from, to);
      }
    } catch (error) {
      console.warn("API status check failed, using fixed rates:", error);
      return this.fallbackConversion(value, from, to);
    }

    const currencies = await this.getCurrencies();
    if (!currencies.data[from] || !currencies.data[to]) {
      throw new Error("Invalid source or target currency");
    }

    const response = await this.getLastRates({ base_currency: from, currencies: [to] });
    const rate = response.data[to]?.value;
    if (!rate) throw new Error("Conversion rate not available");
    return value * rate;
  }

  private fallbackConversion(value: number, from: string, to: string): number {
    const FIXED_RATES: Record<string, Record<string, number>> = {
      USD: { BRL: 5, EUR: 0.9 },
      EUR: { BRL: 6, USD: 1 / 0.9 },
      BRL: { USD: 1 / 5, EUR: 1 / 6 },
    };
    if (!FIXED_RATES[from] || !FIXED_RATES[from][to]) {
      throw new Error("Conversion not supported with fixed rates");
    }
    return value * FIXED_RATES[from][to];
  }
}

export const currencyApiService = new CurrencyApiService();
