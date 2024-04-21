import React, { useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AllCurrencyRates } from "../types";
import { APP_DEFAULT_CURRENCY_PAIR } from "../constants";

type Context = {
  currencyRates: AllCurrencyRates;
  setCurrencyRates: (allRates: AllCurrencyRates) => void;
  currencyPairString: string;
  setStoreCurrencyPairString: (currencyPair: string) => void;
};
interface CurrencyRatesProviderProps {
  children: ReactNode;
}

const CurrencyRatesContext = React.createContext<Context>({
  currencyRates: {},
  setCurrencyRates: () => {},
  currencyPairString: APP_DEFAULT_CURRENCY_PAIR,
  setStoreCurrencyPairString: () => {},
});

const CurrencyRatesProvider: React.FC<CurrencyRatesProviderProps> = ({ children }) => {
  const [currencyRates, setCurrencyRates] = useState<AllCurrencyRates>({});
  const [currencyPairString, setCurrencyPairString] = useState<string>("");

  const setStoreCurrencyPairString = async (currencyPair: string) => {
    try {
      await AsyncStorage.setItem("currencyPair", currencyPair);
      setCurrencyPairString(currencyPair);
    } catch (error) {
      console.error("Error storing currency pair:", error);
    }
  };

  useEffect(() => {
    const fetchStoredCurrencyData = async () => {
      const storedCurrencyPair = await AsyncStorage.getItem("currencyPair");
      setCurrencyPairString(storedCurrencyPair || APP_DEFAULT_CURRENCY_PAIR);
    };
    fetchStoredCurrencyData();
  }, []);

  return (
    <CurrencyRatesContext.Provider value={{ currencyRates, setCurrencyRates, currencyPairString, setStoreCurrencyPairString }}>
      {children}
    </CurrencyRatesContext.Provider>
  );
};

// Hook to use the currency rates context
const useCurrencyState = () => {
  return useContext(CurrencyRatesContext);
};

export { CurrencyRatesProvider, useCurrencyState };
