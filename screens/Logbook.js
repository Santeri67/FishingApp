import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function LogbookScreen() {
  // Tilamuuttujat
  const [logs, setLogs] = useState([]); // Kalastuspäiväkirjan merkintöjen lista
  const [logData, setLogData] = useState(initialLogData()); // Yksittäisen merkinnän tiedot
  const [isModalVisible, setIsModalVisible] = useState(false); // Näkyykö merkinnän lisäysmodaali
  const [isCatchDetailsVisible, setIsCatchDetailsVisible] = useState(false); // Näkyykö lisäkentät saalistiedoille
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Näkyykö poistovahvistusmodaali
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false); // Näkyykö päivämääränvalitsin
  const [selectedLogIndex, setSelectedLogIndex] = useState(null);// Poistettavan merkinnän indeksi
  const [date, setDate] = useState(new Date()); // Valittu päivämäärä
  const [showSuggestion, setShowSuggestion] = useState(true); // Näytetäänkö ohjeet käyttäjälle

  // Funktio: Palauttaa oletustiedot uudelle merkinnälle
  function initialLogData() {
    return {
      bait: '',
      fishSpot: '',
      weather: '',
      date: '',
      fishSpecies: '',
      weight: '',
      length: '',
      gear: '',
    };
  }
   // Effect: Piilottaa ohjebannerin 5 sekunnin kuluttua
  useEffect(() => {
    const timer = setTimeout(() => setShowSuggestion(false), 5000);
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Effect: Lataa merkinnät AsyncStoragesta
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem('fishingLogs');
        if (storedLogs) setLogs(JSON.parse(storedLogs)); // Parsii tallennetut merkinnät JSON:ksi
      } catch (error) {
        console.error('Failed to load logs from storage', error);
      }
    };
    loadLogs();
  }, []);

// Effect: Tallentaa merkinnät AsyncStorageen aina, kun merkintöjä päivitetään
  useEffect(() => {
    const saveLogs = async () => {
      try {
        await AsyncStorage.setItem('fishingLogs', JSON.stringify(logs));
      } catch (error) {
        console.error('Failed to save logs to storage', error);
      }
    };
    saveLogs();
  }, [logs]);

  // Funktio: Päivittää tietyn kentän arvon merkinnässä
  const handleInputChange = (field, value) => setLogData((prev) => ({ ...prev, [field]: value }));
  
  // Funktio: Lisää uuden merkinnän ja nollaa lomakkeen
  const addLog = () => {
    setLogs((prevLogs) => [...prevLogs, logData]);
    resetLogForm(); // Tyhjentää lomakkeen tiedot
  };
  // Funktio: Nollaa lomakkeen ja sulkee modalit
  const resetLogForm = () => {
    setLogData(initialLogData()); // Palauttaa lomakkeen alkuperäiset arvot
    setIsModalVisible(false); // Sulkee lisäysmodalin
    setIsCatchDetailsVisible(false); // Piilottaa CatchDetail
  };
    // Funktio: Käsittelee päivämäärän valitsimen muutoksia
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'ios') {
      setDate(selectedDate || date); // Päivittää päivämäärän
    } else {
      setIsDatePickerVisible(false); // Piilottaa valitsimen Androidilla
      if (selectedDate) updateDate(selectedDate);
    }
  };
  // Funktio: Päivittää valitun päivämäärän
  const updateDate = (selectedDate) => {
    setDate(selectedDate); // Asettaa päivämäärän
    handleInputChange('date', selectedDate.toISOString().split('T')[0]); // Muotoilee päivämäärän: YYYY-MM-DD
  };
    // Funktio: iOS-päivämäärä valitsimen vahvistaminen
  const confirmIOSDate = () => {
    updateDate(date); // Päivittää päivämäärän valinnan
    setIsDatePickerVisible(false); // Sulkee valitsimen
  };
    // Funktio: Poistaa valitun merkinnän
  const deleteLog = () => {
    if (selectedLogIndex !== null) {
      setLogs((prevLogs) => prevLogs.filter((_, index) => index !== selectedLogIndex));
      setSelectedLogIndex(null); // Nollaa poistettavan indeksin
      setIsDeleteModalVisible(false); // Sulkee poistovahvistusmodaalin
    }
  };

  // Funktio: Renderöi merkinnät listaan
  const renderLogs = () =>
    logs.length === 0 ? (
      <Text style={styles.emptyMessage}>No logs yet. Start adding some!</Text>
    ) : (
      logs.map((log, index) => (
        <TouchableOpacity
          key={index}
          style={styles.logItem}
          onLongPress={() => {
            setSelectedLogIndex(index); // Asettaa poistettavan merkinnän
            setIsDeleteModalVisible(true); // Näyttää poistovahvistusmodaalin
            console.log(`Log at index ${index} is ready to delete`);
          }}
        >
          {/* Korostaa Log otsikon (Log1)*/}
          <Text style={styles.logTitle}>{`Log ${index + 1}`}</Text>
          {Object.entries(log).map(([key, value]) => {
            if (value) {
              let displayValue = value;
              if (key === 'weight') displayValue = `${value} kg`;
              if (key === 'length') displayValue = `${value} cm`;
  
              return (
                <Text style={styles.logText} key={key}>
                  <Text style={styles.logField}>
                    {key === 'fishSpecies'
                      ? 'Fish Species'
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                    :
                  </Text>{' '}
                  {displayValue}
                </Text>
              );
            }
          })}
        </TouchableOpacity>
      ))
    );
  
    // Funktio: Renderöi iOS-päivämäärän valitsimen
    const renderDatePickerModal = () =>
      isDatePickerVisible && Platform.OS === 'ios' && (
        <Modal
  transparent={true}
  animationType="fade"
  visible={isDatePickerVisible}
  onRequestClose={() => setIsDatePickerVisible(false)}
>
  <View style={styles.datePickerOverlay}>
    <View style={styles.datePickerWrapper}>
      <View style={styles.datePickerBackground}>
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      </View>
      <Pressable style={styles.doneButton} onPress={confirmIOSDate}>
        <Text style={styles.doneButtonText}>Done</Text>
      </Pressable>
    </View>
  </View>
</Modal>
);
  
    return (
      <View style={styles.container}>
        {/* Ohjebanneri käyttäjälle (miten poistaa Log) */}
        {showSuggestion && (
          <View style={styles.suggestionBanner}>
            <Text style={styles.suggestionText}>Long press a log to delete it!</Text>
          </View>
        )}
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Fishing Logbook</Text>
        </View>
  
      {/* Log Lista */}
      <ScrollView style={styles.logList}>{renderLogs()}</ScrollView>
  
      {/* Lisää Log-nappi */}
      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Log</Text>
      </TouchableOpacity>
  
      {/* Lisää Log Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Catch Details</Text>
              <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={-160}  // pitää tekstikentän näkyvissä, jos kenttä jää näppäimistön alle.
                enableOnAndroid={true}
                enableAutomaticScroll={true}
              >
                {/* Lomakkeen kentät */}
                <Text style={styles.inputLabel}>Bait & Lure:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Worm, Minnow"
                  placeholderTextColor="rgba(0, 0, 0, 0.1)" // Sopiva vaalea väri tekstille
                  value={logData.bait}
                  onChangeText={(value) => handleInputChange('bait', value)}
                />
  
                <Text style={styles.inputLabel}>Fish Spot:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Riverbank, Lake"
                  placeholderTextColor='rgba(0, 0, 0, 0.1)' // Sopiva vaalea väri tekstille
                  value={logData.fishSpot}
                  onChangeText={(value) => handleInputChange('fishSpot', value)}
                />
  
                <View style={styles.row}>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabelSmall}>Weather:</Text>
                    <TextInput
                      style={styles.halfInput}
                      placeholder="Sunny, Rainy etc"
                      placeholderTextColor= 'rgba(0, 0, 0, 0.1)' // Sopiva vaalea väri tekstille
                      value={logData.weather}
                      onChangeText={(value) => handleInputChange('weather', value)}
                    />
                  </View>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabelSmall}>Date:</Text>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => setIsDatePickerVisible(true)}
                    >
                      <Text style={styles.dateText}>{logData.date || 'Select Date'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
  
                <Text style={styles.inputLabel}>Fish Species:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Northern Pike, Zander, Salmon etc"
                  placeholderTextColor='rgba(0, 0, 0, 0.1)' // Sopiva vaalea väri tekstille
                  value={logData.catchDetails}
                  onChangeText={(value) => handleInputChange('catchDetails', value)}
                />
                
                <MoreCatchDetails
                isVisible={isCatchDetailsVisible}
                onToggle={() => setIsCatchDetailsVisible(!isCatchDetailsVisible)}
                logData={logData}
                onChange={handleInputChange}
              />
              <Text style={styles.inputLabel}>Gear Used:</Text>
              <TextInput
              style={styles.input}
              placeholder="e.g., Spinning- JigRod, Boat, etc"
              placeholderTextColor='rgba(0, 0, 0, 0.11)' // Sopiva vaalea väri tekstille
              value={logData.gear}
              onChangeText={(value) => handleInputChange('gear', value)}
            />

              </KeyboardAwareScrollView>
              <View style={styles.modalButtons}>
                <Pressable style={styles.saveButton} onPress={addLog}>
                  <Text style={styles.saveButtonText}>Save Log</Text>
                </Pressable>
                <Pressable style={styles.cancelButton} onPress={resetLogForm}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
  
      {/* Delete Log Modal */}
      <Modal
  transparent={true} // Modalin tausta läpinäkyvä.
  animationType="fade"
  visible={isDeleteModalVisible}
  onRequestClose={() => setIsDeleteModalVisible(false)}
  // Toiminto, joka suoritetaan, kun käyttäjä yrittää sulkea modaalin (esim. painamalla takaisin-nappia).
>
  <View style={styles.modalOverlay}>
    <View style={styles.deleteModalContent}>
      <Text style={styles.modalTitle}>Do you want to delete this log?</Text>
      
      <Text style={styles.modalSubtitle}>Are you sure?</Text>

      <View style={styles.modalButtons}>
        <Pressable style={styles.saveButton} onPress={deleteLog}>
          {/* Painike, joka kutsuu `deleteLog`-funktiota poistaakseen lokin, kun sitä painetaan. */}
          <Text style={styles.saveButtonText}>Yes, Delete</Text>
        </Pressable>
        <Pressable
          style={styles.cancelButton}
          onPress={() => setIsDeleteModalVisible(false)}
          // Painike, joka sulkee modaalin ilman muutoksia, kun sitä painetaan.
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>

{renderDatePickerModal()}
{/* Kutsuu renderDatePickerModal-funktion, joka näyttää päivämäärävalitsimen, jos se on näkyvissä. */}
</View>
);
}

// Custom Components
// TextInputField-komponentti: Yksittäinen syötekenttä, joka sisältää tekstin (label) ja itse tekstisyötekentän.
const TextInputField = ({ label, placeholder, value, onChangeText }) => (
  <>
    <Text style={styles.inputLabel}>{label}</Text>
    {/* Näyttää kentän otsikon, esimerkiksi "Weight" tai "Length". */}
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      // Syötekenttä
      // Muutokset tallennetaan onChangeText-funktion kautta.
    />
  </>
);

// MoreCatchDetails-komponentti (paino ja pituus.)
const MoreCatchDetails = ({ isVisible, onToggle, logData, onChange }) => (
  <>
    <TouchableOpacity style={styles.moreDetailsButton} onPress={onToggle}>
      {/* Painike, joka näyttää tai piilottaa lisätietokentät (Weight ja Length). */}
      <Text style={styles.moreDetailsButtonText}>
        {isVisible ? 'Hide Details' : 'More Catch Details'}
        {/* Teksti muuttuu sen mukaan, ovatko lisätiedot näkyvissä. */}
      </Text>
    </TouchableOpacity>
    {isVisible && (
      // Näytetään lisätiedot vain, jos isVisible on true.
      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          {/* Painokentän kontti. */}
          <Text style={styles.inputLabelSmall}>Weight:</Text>
          {/* Painon otsikkoteksti. */}
          <View style={styles.row}>
            <TextInput
              style={styles.smallInput}
              placeholder="e.g., 2.5"
              placeholderTextColor="rgba(0, 0, 0, 0.1)"
              // Placeholder-teksti antaa esimerkin oikeasta syötemuodosta.
              value={logData.weight}
              onChangeText={(value) => onChange('weight', value)}
              // Syötteen muutos tallennetaan onChange-funktion kautta logData-objektiin.
              keyboardType="numeric"
              // Avataan vain numeronäppäimistö.
            />
            <Text style={styles.unit}>kg</Text>
          </View>
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.inputLabelSmall}>Length:</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.smallInput}
              placeholder="e.g., 50"
              placeholderTextColor="rgba(0, 0, 0, 0.1)"
              // Placeholder-teksti, joka näyttää esimerkkimuodon pituudelle.
              value={logData.length}
              onChangeText={(value) => onChange('length', value)}
              // Syötteen muutos tallennetaan onChange-funktion kautta logData-objektiin.
              keyboardType="numeric"
              // Avataan vain numeronäppäimistö.
            />
            <Text style={styles.unit}>cm</Text>
            {/* Yksikkö, joka ilmoittaa, että pituus annetaan senttimetreinä. */}
          </View>
        </View>
      </View>
    )}
  </>
);




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
  title: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'MononokiBold',
  },
  logList: {
    padding: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  logItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logText: {
    fontFamily: 'MononokiRegular',
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  logField: {
    color: 'indigo',
    fontSize: 14,
    fontFamily: 'FiraCodeBold',
  },
  addButton: {
    backgroundColor: 'indigo',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 22,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 23,
    fontFamily: 'FiraCodeBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 30,
    color: 'indigo',
    fontFamily: 'MononokiBold',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: 'MononokiRegular',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  moreDetailsButton: {
    backgroundColor: 'indigo',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: 180,
    alignSelf: 'center',
  },
  moreDetailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensure equal space between elements
    alignItems: 'center',
    marginBottom: 10,
  },
  halfInputContainer: {
    flex: 1, // Adjust size to fit two inputs side by side
    marginRight: 7, // Add small spacing between the inputs
  },
  inputLabelSmall: {
    fontFamily: 'MononokiRegular',
    marginLeft: '10%',
    marginBottom: '5',
    fontSize: '16',
  },
  halfInput: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  dateInput: {
    flex: 0.75,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
  },
  smallInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallInput: {
    flex: 0.7,
    backgroundColor: '#f9f9f9',
    padding: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    marginRight: -30,
    
  },
  unit: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5, // Space between input and unit
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: 'indigo',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
    marginRight: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  datePickerModal: {
    justifyContent: 'flex-end', // Center the picker vertically
    alignItems: 'center',
    padding: 10,
  },
  datePickerOverlay: {
    marginBottom: '-110%',
    flex: 1.2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  datePickerWrapper: {
    backgroundColor: '#22052e', // Background for the picker container
    borderRadius: 20,
    padding: 10,
    width: '90%',
    alignItems: 'center',
  },
  datePickerBackground: {
    backgroundColor: '#22052e', // Dark background for the wheel
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
  },
  
  doneButton: {
    marginTop: 15,
    backgroundColor: 'mediumpurple',
    borderRadius: 10,
    padding: 10,
    width: '30%',
    alignItems: 'center',
  },
  
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteModalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  suggestionBanner: {
    backgroundColor: '#6d37ec',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'MononokiRegular',
  },
  logTitle: {
    fontFamily: 'MononokiBold', // Use a bold font for emphasis
    fontSize: 20, // Larger font size
    color: 'indigo', // Keep the text color as black
    marginBottom: 10, // Add some spacing below the title
  },
});
