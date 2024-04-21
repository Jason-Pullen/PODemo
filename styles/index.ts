import styled from "styled-components/native";

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0);
`;

export const ModalContent = styled.View`
  background-color: #ff6d77;
  width: 80%;
  max-height: 60%;
  border-radius: 20px;
  overflow: hidden;
  padding: 8px;
`;

export const CurrencyText = styled.Text`
  font-size: 18px;
`;

export const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  padding: 1px;
`;

export const BodyText = styled.Text`
  font-size: 18px;
  color: #444;
  margin: 8px;
`;

export const AppModal = styled.Modal`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

export const CloseButtonText = styled(BodyText)`
  font-size: 24px;
`;