import React from "react";
import styled from "styled-components/native";
import { Image } from "expo-image";
import { FLAGS } from "../constants";
import { BodyText } from "../styles";

type CurrencySelectorProps = {
  currencyCode: string;
  onPress: () => void;
};

const chevron = require("../assets/chevron.svg");

const Container = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  width: 200px;
`;

const CurrencyText = styled(BodyText)`
  margin-left: 8px;
  font-size: 16px;
`;

const FlagAndCurrency = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currencyCode, onPress }) => {
  const imageSource = FLAGS[currencyCode];
  return (
    <Container onPress={onPress}>
      <FlagAndCurrency>
        <Image source={imageSource} style={{ width: 30, height: 24 }} />
        <CurrencyText>{currencyCode}</CurrencyText>
      </FlagAndCurrency>
      <Image source={chevron} style={{ width: 15, height: 10 }} />
    </Container>
  );
};
