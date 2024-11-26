import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FishingTipsScreen from './screens/FishingTips';
import LogbookScreen from './screens/Logbook';
import WeatherScreen from './screens/Weather';

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Lobster: require('./assets/fonts/Lobster-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Render nothing until the font is loaded
  }

  return (
    <NavigationContainer>
      <View style={styles.wrapperContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>FishingBuddy</Text>
        </View>
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { height: 90, paddingBottom: 22, backgroundColor: 'indigo' } }}>
        <Tab.Screen name="Fishing Tips" component={FishingTipsScreen} options={{ tabBarIcon: () => (<Text style={{ fontSize: 30 }}>🐟</Text>) }} />
        <Tab.Screen name="Weather" component={WeatherScreen} options={{ tabBarIcon: () => (<Text style={{ fontSize: 30 }}>🌤️</Text>) }} />
        <Tab.Screen name="Logbook" component={LogbookScreen} options={{ tabBarIcon: () => (<Text style={{ fontSize: 30 }}>📖</Text>) }} />
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
    marginTop: 0,
    paddingTop: 40,
    },
  headerText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Lobster'
  },
});