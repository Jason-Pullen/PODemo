import React from "react";
import { FlatList, Modal } from "react-native";
import styled from "styled-components/native";
import { CurrencyRates, FlatCurrencyRate } from "../types";
import { CloseButton, CurrencyText, ModalContainer, ModalContent, CloseButtonText } from "../styles";

type DropdownModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (currency: FlatCurrencyRate) => void;
  currencyRates: CurrencyRates;
};

const CurrencyItem = styled.TouchableOpacity`
  text-align: center;
  justify-content: center;
  item-align: center;
  self-align: center;
  margin-horizontal: 8px;
  margin-vertical: 1px;
  padding: 10px;
  border-radius: 5px;
  border-bottom-width: 1px;
  background-color: white;
`;

const renderItem = ({ item }: { item: FlatCurrencyRate }, onSelect: (currency: FlatCurrencyRate) => void) => {
  return (
    <CurrencyItem onPress={() => onSelect(item)} accessibilityLabel={`Currency ${item.name}`}>
      <CurrencyText>{`${item.symbol} - ${item.name} (${item.code})`}</CurrencyText>
      <CurrencyText>{`Rate: ${item.rate}`}</CurrencyText>
    </CurrencyItem>
  );
};

export const DropdownModal: React.FC<DropdownModalProps> = ({ visible, onClose, onSelect, currencyRates }) => {
  const currencyArray: Array<FlatCurrencyRate> = React.useMemo(() => {
    return Object.entries(currencyRates).map(([code, { name, symbol, rate }]) => ({
      code,
      name,
      symbol,
      rate,
    }));
  }, [currencyRates]);

  return (
    <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
      <ModalContainer accessibilityLabel="Select currency">
        <ModalContent>
          <CloseButton onPress={onClose}>
            <CloseButtonText>X</CloseButtonText>
          </CloseButton>
          <FlatList data={currencyArray} renderItem={(item) => renderItem(item, onSelect)} keyExtractor={(item) => item.code} />
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};
