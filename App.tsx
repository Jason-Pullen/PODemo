import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import MainScreen from "./screens/MainScreen";
import { RootStackParamList } from "./types";
import { CurrencyRatesProvider } from "./context/currencyRatesContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CurrencyRatesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CurrencyConverter" component={MainScreen} options={
            {
              title: "Currency Converter",
              headerStyle: {
                backgroundColor: "#FF6D77",
              
              },
              headerBackVisible: false,
              gestureEnabled: false,
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }
          
          } />
        </Stack.Navigator>
      </NavigationContainer>
    </CurrencyRatesProvider>
  );
}
