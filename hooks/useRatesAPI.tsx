import { useState, useEffect, useCallback } from "react";
import { API_KEY, APP_DEFAULT_CURRENCY_PAIR, BASE_URL, FAKE_API_DELAY_AMOUNT, REFETCH_INTERVAL } from "../constants";
import { CurrencyRate, RatesData } from "../types";

type RequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: BodyInit | null;
  headers?: HeadersInit;
};

type useRatesAPIReturnProps = {
  data: RatesData | null;
  isLoading: boolean;
  error: Error | null;
};

export const useRatesAPI = (endpoint: string, options?: Partial<RequestOptions>): useRatesAPIReturnProps => {
  const [data, setData] = useState<RatesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // GBP is the base currency, we then fetch the rest of the rates
  const baseCurrency = APP_DEFAULT_CURRENCY_PAIR.split("-")[0];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}${baseCurrency}`, {
        method: options?.method || "GET",
        body: options?.body || null,
        headers: { "x-api-key": API_KEY },
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const initialRates: Record<string, CurrencyRate> = await response.json();
      //add the initial rate to the data object
      const ratesData: RatesData = { [baseCurrency]: initialRates };
      //fetch the rest of the rates
      for (const currency of Object.keys(initialRates)) {
        const currencyResponse = await fetch(`${BASE_URL}/rates/${currency}`, {
          method: options?.method || "GET",
          body: options?.body || null,
          headers: { "x-api-key": API_KEY },
        });
        if (!currencyResponse.ok) {
          throw new Error(`API call failed with status: ${currencyResponse.status}`);
        }
        ratesData[currency] = await currencyResponse.json();
      }
      setTimeout(() => {
        // fake delay to simulate data
        setData(ratesData);
      }, FAKE_API_DELAY_AMOUNT);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, options?.method, options?.body, options?.headers]);

  useEffect(() => {
    // repeat poll every 30 second to check for data exchange rate values changes, this will be represented in the state for the app
    fetchData();
    const intervalId = setInterval(fetchData, REFETCH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { data, isLoading, error };
};
