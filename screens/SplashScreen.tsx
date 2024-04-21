import React, { useEffect, useRef } from "react";
import styled from "styled-components/native";
import { Animated, Easing } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRatesAPI } from "../hooks/useRatesAPI";
import { RequestOptions, RootStackParamList } from "../types";
import { useCurrencyState } from "../context/currencyRatesContext";

type NavigationProps = StackNavigationProp<RootStackParamList>;

const splashImage = require("../assets/SwapFrom.png");
const options: RequestOptions = { method: "GET" };

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const RotatingImage = styled(Animated.createAnimatedComponent(Image))`
  width: 250px;
  height: 250px;
`;
const LoadingText = styled.Text`
  font-size: 18px;
  color: #444;
`;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { setCurrencyRates } = useCurrencyState();
  const { data, isLoading, error } = useRatesAPI(`/rates/`, options);
  const rotation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (data && !isLoading && !error) {
      setCurrencyRates(data);
      navigation.navigate("CurrencyConverter");
    }
    if (error) {
      console.error(error);
    }
  }, [data, isLoading, error, setCurrencyRates, navigation]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-20deg", "20deg"],
  });

  return (
    <Container>
      <RotatingImage
        source={splashImage}
        style={{
          transform: [{ rotate: rotateInterpolation }],
        }}
      />
      <LoadingText>Loading all exchange rates...</LoadingText>
    </Container>
  );
};

export default SplashScreen;
