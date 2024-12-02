// Tarvittavat kirjastot ja komponentit
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

// Luo alavalikko (Bottom Tab Navigator)
const Tab = createBottomTabNavigator();

// Luo pino-navigaattori (Stack Navigator) säälle
const Stack = createStackNavigator();

// Funktio sääruuduille (laatikoille), joka sisältää pino-navigaattorin
function WeatherStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Pääruutu säästä */}
      <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
      {/* Tuntiennuste ruutu */}
      <Stack.Screen name="HourlyForecastScreen" component={HourlyForecastScreen} />
    </Stack.Navigator>
  );
}

// Sovelluksen pääkomponentti
export default function App() {
  // Lataa fontit
  const [fontsLoaded] = useFonts({
    MononokiBold: require('./assets/fonts/mononoki-Bold.ttf'),
    MononokiRegular: require('./assets/fonts/mononoki-Regular.ttf'),
    Lobster: require('./assets/fonts/Lobster-Regular.ttf'),
    FiraCodeBold: require('./assets/fonts/FiraCode-Bold.ttf'),
    FiraCodeRegular: require('./assets/fonts/FiraCode-VariableFont_wght.ttf'),
  });

  // Näytä latausindikaattori, kunnes fontit ovat valmiit
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // Sovelluksen navigointirakenne
    <NavigationContainer>
      <View style={styles.wrapperContainer}>
        {/* Sovelluksen otsikko */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>FishingBuddy</Text>
        </View>
  
        {/* Alavalikko (Bottom Tabs) */}
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBarStyle,
          }}
        >
          {/* FishingTips välilehti */}
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
          {/* Säätiedot välilehti */}
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
          {/* Lokikirjan välilehti */}
          <Tab.Screen
            name="Logook"
            component={LogbookScreen}
            options={{
              tabBarIcon: () => <Text style={styles.tabIcon}>📖</Text>,
              tabBarLabel: ({ focused }) => (
                <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                  LogBook
                </Text>
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

// Tyylit sovellukselle
const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    justifyContent: 'space-between', // Jakaa tilan tasaisesti otsikon ja välilehtien välillä
  },
  headerContainer: {
    height: 130,
    backgroundColor: 'indigo',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerText: {
    color: '#ffffff', // Tekstin väri
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
    fontSize: 30, //
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'FiraCodeRegular',
    color: '#ffffff',
  },
  tabLabelFocused: {
    color: '#b147ff', // Väri aktiiviselle välilehdelle
    fontFamily: 'FiraCodeBold', // Lihavoitu fontti aktiiviselle välilehdelle
  },
});
