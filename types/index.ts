export type RequestOptions = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: BodyInit | null;
    headers?: HeadersInit;
  };

  export type FlatCurrencyRate = {
    code: string;
    rate: number;
    name: string;
    symbol: string;
  };

  export type AllCurrencyRates = {
    [currencyCode: string]: CurrencyRates;
  };

  export type CurrencyRate = {
    rate: number;
    name: string;
    symbol: string;
  };
  
  export type CurrencyRates = {
    [key: string]: CurrencyRate;
  };
  
  export type RatesData = Record<string, Record<string, CurrencyRate>>;

  export type RootStackParamList = {
    Splash: undefined;
    CurrencyConverter: undefined;
  };