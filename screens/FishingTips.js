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
  // State, joka seuraa laajennettua season "boxia"
  const [selectedSeason, setSelectedSeason] = useState(null);
  // State, joka seuraa laajennettua kalastusmetodi "boxia"
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Data kausivinkkejä (Fishing Tips) varten
  const seasons = [
    {
      name: 'Spring 🌸',
      content: 'Fish tend to be active in shallow waters. Use brightly colored lures.',
    },
    {
      name: 'Summer ☀️',
      content: 'Early morning and evening are the best times. Try topwater baits. If fish not active, use light colors, if active, use brightly colored baits. Matte colors are best for sea.',
    },
    {
      name: 'Fall 🍂',
      content: 'Fish move to deeper waters; crankbaits are effective.',
    },
    {
      name: 'Winter ❄️',
      content: 'Focus on slow-moving baits as fish are less active. Ice Jigging recommended.',
    },
  ];

  // Data kalastusmenetelmille
  const methods = [
    {
      name: 'Casting 🎣',
      content: 'Focus on accurate casting near structures, underwater rocks and banks. Vary your retrieve speed based on water temperature, and if fish is active or not.',
    },
    {
      name: 'Jigging 🪝',
      content: 'Use vertical motion to mimic injured baitfish. Ideal for deep-water fishing. If water is cold, reel the jig carefully (slowly), if warm, reel faster. Light "jigging" rod recommended for better handling and feel. Jigging recommended for Perch and Zander no matter the season expect for winter Ice Jigging. ',
    },
    {
      name: 'Ice Fishing 🧊',
      content: 'Use small jigs and live bait. Drill multiple holes to find active fish. Little twitching movement. ',
    },
    {
      name: 'Trolling 🚤',
      content: 'Use crankbaits or spoons. Adjust your speed to match fish activity. Use different crankbaits for different depths',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Otsikko-osio */}
      <View style={styles.titleContainer}>
        <Text style={[styles.mainTitle ]}>
          Fishing Tips
        </Text>
      </View>
  
      {/* Kaudet-osio */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { fontFamily: 'MononokiBold' }]}>
          Seasons
        </Text>
        <View style={styles.grid}>
          {seasons.map((season, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => setSelectedSeason(season)} // Avaa (modal) kauden tiedoille
              style={styles.box}
            >
              <Text style={[styles.boxTitle, { fontFamily: 'MononokiBold' }]}>
                {season.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
  
      {/* Kalastusmenetelmät-osio */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { fontFamily: 'MononokiBold' }]}>
          Fishing Methods
        </Text>
        <View style={styles.grid}>
          {methods.map((method, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => setSelectedMethod(method)} // Avaa modaalinen metodin tiedoille
              style={styles.methodBox} // Metodiboxi, jolla on kiinteä korkeus ja leveys
            >
              <Text style={styles.methodBoxTitle}>
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modaalinen popup kauden sisällölle */}
      {selectedSeason && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={!!selectedSeason}
          onRequestClose={() => setSelectedSeason(null)} // Sulkee modaalisen ikkunan
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
                onPress={() => setSelectedSeason(null)} // Sulkee modaalin
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
  
      {/* Modaalinen popup metodin sisällölle */}
      {selectedMethod && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={!!selectedMethod}
          onRequestClose={() => setSelectedMethod(null)} // Sulkee modaalisen ikkunan
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
                onPress={() => setSelectedMethod(null)} // Sulkee modaalin
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
  contentContainer: {
    padding: 12,
  },
  titleContainer: {
    backgroundColor: 'indigo',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 15,
  },
  mainTitle: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'MononokiBold',
    flexWrap: 'nowrap',
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
    fontSize: 28,
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
    padding: 20,
    borderRadius: 15,
    width: '48%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxTitle: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    flexWrap: 'nowrap',
  },
  methodBox: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    width: '45%',
    height: 100,
    marginBottom: 10,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodBoxTitle: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'MononokiBold',
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
