import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FishingTipsScreen() {
  // State to track which season box is expanded
  const [selectedSeason, setSelectedSeason] = useState(null);

  // Load Mononoki font
  const [fontsLoaded] = useFonts({
    MononokiBold: require('../assets/fonts/mononoki-Bold.ttf'), // Adjust the path if needed
  });

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  // Data for the seasons
  const seasons = [
    {
      name: 'Spring 🌸',
      content: 'Spring fishing tips: Fish tend to be active in shallow waters. Use brightly colored lures.',
    },
    {
      name: 'Summer ☀️',
      content: 'Summer fishing tips: Early morning and evening are the best times. Try topwater baits.',
    },
    {
      name: 'Fall 🍂',
      content: 'Fall fishing tips: Fish move to deeper waters; crankbaits are effective.',
    },
    {
      name: 'Winter ❄️',
      content: 'Winter fishing tips: Focus on slow-moving baits as fish are less active.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontFamily: 'MononokiBold' }]}>
          Fishing Tips for Different Seasons
        </Text>
      </View>

      {/* Seasons Section */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.grid}>
          {seasons.map((season, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => setSelectedSeason(season)} // Open popup with selected season
              style={styles.box}
            >
              <Text style={[styles.boxTitle, { fontFamily: 'MononokiBold' }]}>
                {season.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Popup Modal for Season Content */}
      {selectedSeason && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={!!selectedSeason}
          onRequestClose={() => setSelectedSeason(null)} // Close modal when back button is pressed
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={[styles.modalTitle, { fontFamily: 'MononokiBold' }]}
              >
                {selectedSeason.name}
              </Text>
              <Text style={styles.modalText}>{selectedSeason.content}</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setSelectedSeason(null)} // Close modal
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
    fontFamily: 'MononokiBold',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  box: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    width: '48%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center', // Ensure text is centered
  },
  boxTitle: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    color: '#333333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'indigo',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
