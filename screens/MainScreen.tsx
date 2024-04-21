import React, { useState, useEffect, useCallback } from "react";
import { Image } from "expo-image";
import styled from "styled-components/native";
import { DropdownModal } from "../components/DropdownModal";
import { FlatCurrencyRate } from "../types";
import { useCurrencyState } from "../context/currencyRatesContext";
import { CurrencySelector } from "../components/CurrencySelector";
import { AppModal, BodyText, CloseButton, CloseButtonText, ModalContainer, ModalContent } from "../styles";
import { APP_DEFAULT_CURRENCY_PAIR } from "../constants";

const PageContainer = styled.KeyboardAvoidingView`
  flex: 1;
  padding-top: 50px;
  align-items: center;
  background-color: #fff;
`;
const Article = styled.View`
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
`;
const TitleText = styled(BodyText)`
  font-size: 20px;
  margin-bottom: 20px;
`;
const CurrencySelectArea = styled.View`
  justify-content: center;
  align-items: center;
  padding-bottom: 20p;
`;
const CurrencyInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const CurrencySymbol = styled(BodyText)`
  position: absolute;
  left: 10px;
  font-size: 20px;
  margin: 10px;
`;
const CurrencyInput = styled.TextInput.attrs({
  keyboardType: "numeric",
})`
  width: 100px;
  border: 1px solid #ddd;
  padding-horizontal: 20px;
  padding-vertical: 10px;
  margin: 15px 15px;
`;

const splashImage = require("../assets/SwapFrom.svg");

const MainScreen: React.FC = () => {
  const { currencyRates, currencyPairString, setStoreCurrencyPairString } = useCurrencyState();
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromCurrency, setFromCurrency] = useState(currencyPairString.split("-")[0]);
  const [toCurrency, setToCurrency] = useState(currencyPairString.split("-")[1]);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [rate, setRate] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      const newRate = currencyRates[fromCurrency]?.[toCurrency]?.rate || 0;
      setRate(newRate);
      recalculateValues(fromValue, newRate, "from");
    }
  }, [fromCurrency, toCurrency, currencyRates]);

  useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      const newCurrencyPairString = `${fromCurrency}-${toCurrency}`;
      setStoreCurrencyPairString(newCurrencyPairString);
    }
  }, [fromCurrency, toCurrency, setStoreCurrencyPairString]);

  useEffect(() => {
    setFromCurrency(currencyPairString.split("-")[0]);
    setToCurrency(currencyPairString.split("-")[1]);
  }, [currencyPairString]);

  const getCurrencySymbol = (currencyCode: string) => {
    if (currencyRates[currencyPairString.split("-")[0]]) {
      return currencyRates[currencyPairString.split("-")[0]][currencyCode]?.symbol;
    } else {
      return "£";
    }
  };
  const formatValue = (type: "from" | "to", value: number, fromCurrency: string = "GBP", toCurrency: string = "USD") => {
    // taking into account the JPY currency which does not have decimal places
    if ((type === "from" && toCurrency === "JPY") || (type === "to" && fromCurrency === "JPY")) {
      return value.toFixed(0);
    } else {
      return value.toFixed(2);
    }
  };
  const recalculateValues = (value: string, currentRate: number, type: "from" | "to") => {
    if (!isNaN(parseFloat(value))) {
      const convertedValue = parseFloat(value) * (type === "from" ? currentRate : 1 / currentRate);
      const formattedValue = formatValue(type, convertedValue, fromCurrency, toCurrency);
      if (type === "from") {
        setToValue(formattedValue);
      } else {
        setFromValue(formattedValue);
      }
    }
  };

  const handleValueChange = (value: string, type: "from" | "to") => {
    if (type === "from") {
      setFromValue(value);
      recalculateValues(value, rate, "from");
    } else {
      setToValue(value);
      recalculateValues(value, rate, "to");
    }
  };

  const handleSelectCurrency = useCallback((currency: FlatCurrencyRate, type: "from" | "to") => {
    const updateCurrency = type === "from" ? setFromCurrency : setToCurrency;
    updateCurrency(currency.code);
    setShowFromDropdown(type === "from" ? false : showFromDropdown);
    setShowToDropdown(type === "to" ? false : showToDropdown);

    if (currency.code === (type === "from" ? toCurrency : fromCurrency)) {
      setShowErrorModal(true);
    }
  }, [setFromCurrency, setToCurrency, showFromDropdown, showToDropdown, toCurrency, fromCurrency]);

  const handleErrorClose = () => {
    setShowErrorModal(false);
    setStoreCurrencyPairString(APP_DEFAULT_CURRENCY_PAIR);
  }

  return (
    <PageContainer style={{ flex: 1 }} behavior="padding">
      <Image source={splashImage} style={{ width: 80, height: 80 }} />
      <CurrencySelectArea>
        <BodyText>Swap From</BodyText>
        <CurrencySelector currencyCode={fromCurrency} onPress={() => setShowFromDropdown(true)} />
        <DropdownModal
          visible={showFromDropdown}
          onClose={() => {
            setShowFromDropdown(false);
          }}
          onSelect={(currency: FlatCurrencyRate) => handleSelectCurrency(currency, "from")}
          currencyRates={currencyRates[fromCurrency]}
        />
        <CurrencyInputContainer>
          <CurrencySymbol>{getCurrencySymbol(fromCurrency)}</CurrencySymbol>
          <CurrencyInput placeholder="Amount" value={fromValue} onChangeText={(value) => handleValueChange(value, "from")} />
        </CurrencyInputContainer>
      </CurrencySelectArea>
      <CurrencySelectArea>
        <BodyText>To</BodyText>
        <BodyText>
          {fromCurrency} {getCurrencySymbol(fromCurrency)}1 = {toCurrency} {getCurrencySymbol(toCurrency)}
          {rate.toFixed(4)}
        </BodyText>
        <CurrencySelector currencyCode={toCurrency} onPress={() => setShowToDropdown(true)} />
        <DropdownModal
          visible={showToDropdown}
          onClose={() => {
            setShowToDropdown(false);
          }}
          onSelect={(currency: FlatCurrencyRate) => handleSelectCurrency(currency, "to")}
          currencyRates={currencyRates[toCurrency]}
        />
        <CurrencyInputContainer>
          <CurrencySymbol>{getCurrencySymbol(toCurrency)}</CurrencySymbol>
          <CurrencyInput placeholder="Amount" value={toValue} onChangeText={(value) => handleValueChange(value, "to")} />
        </CurrencyInputContainer>
      </CurrencySelectArea>

      {/* I would not allow the selection of the same currency via the UX. design anti-pattern. but following the design brief */}
      <AppModal visible={showErrorModal} animationType="slide" transparent={true}>
        <ModalContainer>
          <ModalContent>
            <CloseButton onPress={() => handleErrorClose()}>
              <CloseButtonText>X</CloseButtonText>
            </CloseButton>
            <Article>
              <TitleText>Invalid currency pair.</TitleText>
              <BodyText>You cannot select the same currency for from and to. please select an alternative currency</BodyText>
            </Article>
          </ModalContent>
        </ModalContainer>
      </AppModal>
    </PageContainer>
  );
};

export default MainScreen;
