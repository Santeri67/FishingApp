import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FishingTipsScreen from './screens/FishingTips';
import HourlyForecastScreen from './screens/HourlyForecast';
import LogbookScreen from './screens/Logbook';
import WeatherScreen from './screens/Weather';

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Stack Navigator for Weather
const Stack = createStackNavigator();

// Weather Stack Navigator
function WeatherStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
      <Stack.Screen name="HourlyForecastScreen" component={HourlyForecastScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  // Load custom font
  const [fontsLoaded] = useFonts({
    Lobster: require('./assets/fonts/Lobster-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Wait until the font is loaded
  }

  return (
    <NavigationContainer>
      <View style={styles.wrapperContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>FishingBuddy</Text>
        </View>

        {/* Bottom Tab Navigator */}
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBarStyle,
          }}
        >
          <Tab.Screen
            name="Fishing Tips"
            component={FishingTipsScreen}
            options={{
              tabBarIcon: () => <Text style={styles.tabIcon}>🐟</Text>,
            }}
          />
          <Tab.Screen
            name="Weather"
            component={WeatherStack}
            options={{
              tabBarIcon: () => <Text style={styles.tabIcon}>🌤️</Text>,
            }}
          />
          <Tab.Screen
            name="Logbook"
            component={LogbookScreen}
            options={{
              tabBarIcon: () => <Text style={styles.tabIcon}>📖</Text>,
            }}
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    height: 130,
    backgroundColor: 'indigo',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Lobster',
  },
  tabBarStyle: {
    height: 90,
    paddingBottom: 22,
    backgroundColor: 'indigo',
  },
  tabIcon: {
    fontSize: 30,
  },
});
