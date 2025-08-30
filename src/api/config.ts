export const API_CONFIG = {
  BASE_URL: "https://api.currencyapi.com/v3",
  STATUS: "https://api.currencyapi.com/v3/status",
  CURRENCIES: "https://api.currencyapi.com/v3/currencies",
  LATEST: "https://api.currencyapi.com/v3/latest",
  DEFAULT_PARAMS: {
    apikey: import.meta.env.VITE_CURRENCY_API_KEY,
  },
};