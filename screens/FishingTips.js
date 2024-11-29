import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function FishingTipsScreen() {
  // State to track which season box is expanded
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);





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

  // Data for fishing methods
  const methods = [
    {
      name: 'Casting 🎣',
      content: 'Casting tips: Focus on accurate casting near structures. Vary your retrieve speed.',
    },
    {
      name: 'Jigging 🪝',
      content: 'Jigging tips: Use vertical motion to mimic injured baitfish. Ideal for deep-water fishing.',
    },
    {
      name: 'Ice Fishing 🧊',
      content: 'Ice fishing tips: Use small jigs and live bait. Drill multiple holes to find active fish.',
    },
    {
      name: 'Trolling 🚤',
      content: 'Trolling tips: Use crankbaits or spoons. Adjust your speed to match fish activity.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Main Title Section */}
      <View style={styles.titleContainer}>
        <Text style={[styles.mainTitle, { fontFamily: 'MononokiBold' }]}>
          Fishing Tips
        </Text>
      </View>
  
      {/* Seasons Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { fontFamily: 'MononokiBold' }]}>
          Seasons
        </Text>
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
      </View>
  
      {/* Fishing Methods Section */}
      {/* Fishing Methods Section */}
<View style={styles.sectionContainer}>
  <Text style={[styles.sectionTitle, { fontFamily: 'MononokiBold' }]}>
    Fishing Methods
  </Text>
  <View style={styles.grid}>
    {methods.map((method, index) => (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        onPress={() => setSelectedMethod(method)} // Open popup with selected method
        style={styles.methodBox} // Use methodBox for consistent sizing
      >
        <Text style={styles.methodBoxTitle}>
          {method.name}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

  
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
  
      {/* Popup Modal for Method Content */}
      {selectedMethod && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={!!selectedMethod}
          onRequestClose={() => setSelectedMethod(null)} // Close modal when back button is pressed
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={[styles.modalTitle, { fontFamily: 'MononokiBold' }]}
              >
                {selectedMethod.name}
              </Text>
              <Text style={styles.modalText}>{selectedMethod.content}</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setSelectedMethod(null)} // Close modal
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )};
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    padding: 12,
  },
  titleContainer: {
    backgroundColor: 'indigo', // Match the image background color
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 15,
  },
  mainTitle: {
    fontSize: 30,
    color: '#fff', // White text for contrast
    textAlign: 'center',
    fontFamily: 'MononokiBold', // Use the MononokiBold font
    flexWrap: 'nowrap', // Prevent title from breaking
    flexShrink: 1,
  },
  
  subtitle: {
    fontSize: 100,
    color: '#cfcfcf',
    textAlign: 'center',
  },
  sectionContainer: {
    marginVertical: 5,
    marginTop: 10,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  box: {
    backgroundColor: '#ffffff',
    padding: 20, // Adjusted to prevent overly large padding
    borderRadius: 15,
    width: '48%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center', // Centers content within the box
    justifyContent: 'center', // Ensures text is vertically centered
  },
  boxTitle: {
    fontSize: 16, // Slightly smaller to fit longer words
    color: '#333333',
    textAlign: 'center',
    flexWrap: 'nowrap', // Prevent wrapping
  },
  methodBox: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    width: '45%', // Consistent width for method boxes
    height: 100, // Fixed height for all method boxes
    marginBottom: 10,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center', // Centers text horizontally
    justifyContent: 'center', // Centers text vertically
  },
  methodBoxTitle: {
    fontSize: 18, // Font size for text
    color: '#333333',
    textAlign: 'center', // Center the text inside the box
    fontFamily: 'MononokiBold', // Use the bold font
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
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
