import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import FishingTipsScreen from './screens/FishingTips';
import HourlyForecastScreen from './screens/HourlyForecast';
import LogbookScreen from './screens/Logbook';
import WeatherScreen from './screens/Weather';

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Stack Navigator for Weather
const Stack = createStackNavigator();

function WeatherStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
      <Stack.Screen name="HourlyForecastScreen" component={HourlyForecastScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  // Load fonts globally
  const [fontsLoaded] = useFonts({
    MononokiBold: require('./assets/fonts/mononoki-Bold.ttf'),
    MononokiRegular: require('./assets/fonts/mononoki-Regular.ttf'),
    Lobster: require('./assets/fonts/Lobster-Regular.ttf'),
    FiraCodeBold: require('./assets/fonts/FiraCode-Bold.ttf'),
    FiraCodeRegular: require('./assets/fonts/FiraCode-VariableFont_wght.ttf'),

  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={styles.wrapperContainer}>
        {/* App Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>FishingBuddy</Text>
        </View>
  
        {/* Bottom Tabs */}
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
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                  Fishing Tips
                </Text>
              ),
            }}
          />
          <Tab.Screen
            name="Weather"
            component={WeatherStack}
            options={{
              tabBarIcon: () => <Text style={styles.tabIcon}>🌤️</Text>,
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                  Weather
                </Text>
              ),
            }}
          />
          <Tab.Screen
            name="Logbook"
            component={LogbookScreen}
            options={{
              tabBarIcon: () => <Text style={styles.tabIcon}>📖</Text>,
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                  Logbook
                </Text>
              ),
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
    fontFamily: 'Lobster', // Use globally loaded font
  },
  tabBarStyle: {
    height: 90,
    paddingBottom: 22,
    backgroundColor: 'indigo',
  },
  tabIcon: {
    fontSize: 30,
  },
  tabLabel: {
    fontSize: 12, // Default size for label
    fontFamily: 'FiraCodeRegular', // Default font
    color: '#ffffff', // Default color
  },
  tabLabelFocused: {
    color: '#b147ff', // Highlight color for active tab
    fontFamily: 'FiraCodeBold', // Bold font for active tab
  },
});
