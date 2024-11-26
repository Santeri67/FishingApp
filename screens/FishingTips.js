import { useFonts } from 'expo-font';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FishingTipsScreen() {
  // Load Mononoki font
  const [fontsLoaded] = useFonts({
    MononokiBold: require('../assets/fonts/mononoki-Bold.ttf'), // Adjust the path if needed
  });

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontFamily: 'MononokiBold' }]}>
          Fishing Tips for Different Seasons
        </Text>
      </View>
      {/* Content Section */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.contentText}>
          1. Spring: Fish tend to be active in shallow waters. Use brightly colored lures.{"\n"}
          2. Summer: Early morning and evening are the best times. Try topwater baits.{"\n"}
          3. Fall: Fish move to deeper waters; crankbaits are effective.{"\n"}
          4. Winter: Focus on slow-moving baits as fish are less active.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  titleContainer: {
    backgroundColor: 'indigo',
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 21,
    color: '#fff',
    fontFamily: 'MononokiBold', // Explicitly assign the Mononoki font
    textAlign: 'center',
    },
  contentContainer: {
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    color: '#333333',
    lineHeight: 24,
  },
});
