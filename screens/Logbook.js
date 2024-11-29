import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LogbookScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCatchDetailsVisible, setIsCatchDetailsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logData, setLogData] = useState({
    bait: '',
    fishSpot: '',
    weather: '',
    date: '',
    catchDetails: '',
    weight: '',
    length: '',
    gear: '',
  });

  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // Load and save logs
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem('fishingLogs');
        if (storedLogs) setLogs(JSON.parse(storedLogs));
      } catch (error) {
        console.error('Failed to load logs from storage', error);
      }
    };
    loadLogs();
  }, []);

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

  const handleInputChange = (field, value) => {
    setLogData((prev) => ({ ...prev, [field]: value }));
  };

  const addLog = () => {
    setLogs((prevLogs) => [...prevLogs, logData]);
    setLogData({
      bait: '',
      fishSpot: '',
      weather: '',
      date: '',
      catchDetails: '',
      weight: '',
      length: '',
      gear: '',
    });
    setIsModalVisible(false);
    setIsCatchDetailsVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'ios') {
      // iOS requires manual dismiss
      setDate(selectedDate || date);
    } else {
      setIsDatePickerVisible(false);
      if (selectedDate) {
        setDate(selectedDate);
        setLogData((prev) => ({
          ...prev,
          date: selectedDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        }));
      }
    }
  };

  const confirmIOSDate = () => {
    setLogData((prev) => ({
      ...prev,
      date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
    }));
    setIsDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Fishing Logbook</Text>
      </View>

      <ScrollView style={styles.logList}>
        {logs.length === 0 ? (
          <Text style={styles.emptyMessage}>No logs yet. Start adding some!</Text>
        ) : (
          logs.map((log, index) => (
            <View key={index} style={styles.logItem}>
              {log.bait && (
                <Text style={styles.logText}>
                  <Text style={styles.logField}>Bait:</Text> {log.bait}
                </Text>
              )}
              {log.fishSpot && (
                <Text style={styles.logText}>
                  <Text style={styles.logField}>Fish Spot:</Text> {log.fishSpot}
                </Text>
              )}
              {log.weather && (
                <Text style={styles.logText}>
                  <Text style={styles.logField}>Weather:</Text> {log.weather}
                </Text>
              )}
              {log.date && (
                <Text style={styles.logText}>
                  <Text style={styles.logField}>Date:</Text> {log.date}
                </Text>
              )}
              {log.catchDetails && (
                <Text style={styles.logText}>
                  <Text style={styles.logField}>Fish Species:</Text>{' '}
                  {log.catchDetails}
                </Text>
              )}
              {log.weight && (
                <Text style={styles.logText}>
                  <Text style={styles.logField}>Weight:</Text> {log.weight} kg
                </Text>
              )}
              {log.length && (
                <Text style={styles.logText}>
                  <Text style={styles.logField}>Length:</Text> {log.length} cm
                </Text>
              )}
              {log.gear && (
                <Text style={styles.logText}>
                  <Text style={styles.logField}>Gear:</Text> {log.gear}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Log</Text>
      </TouchableOpacity>

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
                extraScrollHeight={-180}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
              >
                {/* Input Fields */}
                <Text style={styles.inputLabel}>Bait & Lure:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Worm, Minnow"
                  value={logData.bait}
                  onChangeText={(value) => handleInputChange('bait', value)}
                />

                <Text style={styles.inputLabel}>Fish Spot:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Riverbank, Lake"
                  value={logData.fishSpot}
                  onChangeText={(value) => handleInputChange('fishSpot', value)}
                />

                {/* Weather and Date */}
                <View style={styles.row}>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabelSmall}>Weather:</Text>
                    <TextInput
                      style={styles.halfInput}
                      placeholder="Sunny, Rainy"
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
                      <Text style={styles.dateText}>
                        {logData.date || 'Select Date'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.inputLabel}>Fish Species:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Bass, Salmon"
                  value={logData.catchDetails}
                  onChangeText={(value) => handleInputChange('catchDetails', value)}
                />

                {/* More Catch Details */}
                <TouchableOpacity
                  style={styles.moreDetailsButton}
                  onPress={() =>
                    setIsCatchDetailsVisible(!isCatchDetailsVisible)
                  }
                >
                  <Text style={styles.moreDetailsButtonText}>
                    {isCatchDetailsVisible ? 'Hide Details' : 'More Catch Details'}
                  </Text>
                </TouchableOpacity>

                {isCatchDetailsVisible && (
                  <>
                    <View style={styles.row}>
                      <View style={styles.smallInputContainer}>
                        <Text style={styles.inputLabelSmall}>Weight:</Text>
                        <TextInput
                          style={styles.smallInput}
                          keyboardType="numeric"
                          placeholder="e.g., 2.5"
                          value={logData.weight}
                          onChangeText={(value) =>
                            handleInputChange('weight', value)
                          }
                        />
                        <Text style={styles.unit}>kg</Text>
                      </View>
                      <View style={styles.smallInputContainer}>
                        <Text style={styles.inputLabelSmall}>Length:</Text>
                        <TextInput
                          style={styles.smallInput}
                          keyboardType="numeric"
                          placeholder="e.g., 50"
                          value={logData.length}
                          onChangeText={(value) =>
                            handleInputChange('length', value)
                          }
                        />
                        <Text style={styles.unit}>cm</Text>
                      </View>
                    </View>
                  </>
                )}

                <Text style={styles.inputLabel}>Gear Used:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Spinning Rod, Jig"
                  value={logData.gear}
                  onChangeText={(value) => handleInputChange('gear', value)}
                />
              </KeyboardAwareScrollView>

              <View style={styles.modalButtons}>
                <Pressable style={styles.saveButton} onPress={addLog}>
                  <Text style={styles.saveButtonText}>Save Log</Text>
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Date Picker */}
      {isDatePickerVisible && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {isDatePickerVisible && Platform.OS === 'ios' && (
  <Modal
  transparent={true}
  animationType="slide"
  visible={isDatePickerVisible}
  onRequestClose={() => setIsDatePickerVisible(false)}
>
  <View style={styles.datePickerModal}>
    <View style={styles.datePickerContainer}>
      <View style={styles.datePickerWrapper}>
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          textColor="black" // Explicitly set the text color
          style={styles.datePickerWheel}
          onChange={(event, selectedDate) => setDate(selectedDate || date)}
        />
      </View>
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => {
          confirmIOSDate();
          setIsDatePickerVisible(false);
        }}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
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
    flexWrap: 'nowrap',
    flexShrink: 1,
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
    color: '#333',
    marginBottom: 5,
  },
  logField: {
    fontWeight: 'bold',
    color: 'indigo',
  },
  addButton: {
    backgroundColor: 'indigo',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  form: {
    marginBottom: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center', // Align vertically to the center
    marginBottom: 10,
  },
  smallInputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align label and input vertically
    flex: 1, // Distribute space evenly between Weight and Length
    marginRight: 10, // Add spacing between Weight and Length containers
  },
  smallInput: {
    flex: 1, // Allow the input field to grow within the container
    backgroundColor: '#f9f9f9',
    padding: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 10,
  },
  inputLabelSmall: {
    fontFamily: 'MononokiRegular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8, // Space between label and input field
  },
  unit: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5, // Space between input and unit
  },
  halfInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  halfInput: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: 'indigo',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
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
  dateInput: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  datePickerModal: {
    flex: 0.95,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  datePickerWrapper: {
    backgroundColor: 'whitesmoke', // Add white background to the picker itself
    width: '100%',
    height: 200, // Ensure height matches the wheel picker
    justifyContent: 'center',
    zIndex: 10, // Ensure the picker is on top of other elements
    borderRadius: 20,
  },
  datePickerWheel: {
    width: '100%', // Full width for the wheel picker
    height: '100%', // Match the height of the wrapper
  },
  doneButton: {
    marginTop: 10,
    backgroundColor: 'mediumpurple',
    borderRadius: 10,
    padding: 10,
    width: 100,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});