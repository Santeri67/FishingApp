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
  // State Variables
  const [logs, setLogs] = useState([]);
  const [logData, setLogData] = useState(initialLogData());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCatchDetailsVisible, setIsCatchDetailsVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedLogIndex, setSelectedLogIndex] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showSuggestion, setShowSuggestion] = useState(true);

  // Initial Log Data
  function initialLogData() {
    return {
      bait: '',
      fishSpot: '',
      weather: '',
      date: '',
      catchDetails: '',
      weight: '',
      length: '',
      gear: '',
    };
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowSuggestion(false), 5000); // Hide after 5 seconds
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Effect: Load Logs from AsyncStorage
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

  // Effect: Save Logs to AsyncStorage
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

  // Handlers for Input and Form Actions
  const handleInputChange = (field, value) => setLogData((prev) => ({ ...prev, [field]: value }));

  const addLog = () => {
    setLogs((prevLogs) => [...prevLogs, logData]);
    resetLogForm();
  };

  const resetLogForm = () => {
    setLogData(initialLogData());
    setIsModalVisible(false);
    setIsCatchDetailsVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'ios') {
      setDate(selectedDate || date);
    } else {
      setIsDatePickerVisible(false);
      if (selectedDate) updateDate(selectedDate);
    }
  };

  const updateDate = (selectedDate) => {
    setDate(selectedDate);
    handleInputChange('date', selectedDate.toISOString().split('T')[0]); // Format: YYYY-MM-DD
  };

  const confirmIOSDate = () => {
    updateDate(date);
    setIsDatePickerVisible(false);
  };

  const deleteLog = () => {
    if (selectedLogIndex !== null) {
      setLogs((prevLogs) => prevLogs.filter((_, index) => index !== selectedLogIndex));
      setSelectedLogIndex(null);
      setIsDeleteModalVisible(false);
    }
  };

  // Render Functions
  const renderLogs = () =>
    logs.length === 0 ? (
      <Text style={styles.emptyMessage}>No logs yet. Start adding some!</Text>
    ) : (
      logs.map((log, index) => (
        <TouchableOpacity
          key={index}
          style={styles.logItem}
          onLongPress={() => {
            setSelectedLogIndex(index);
            setIsDeleteModalVisible(true);
            console.log(`Log at index ${index} is ready to delete`);
          }}
        >
          <Text style={styles.logText}>{`Log ${index + 1}`}</Text>
        {Object.entries(log).map(([key, value]) => {
          if (value) {
            // Display "Fish Species" instead of "CatchDetails"
            const displayKey =
              key === "catchDetails" ? "Fish Species" : key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <Text style={styles.logText} key={key}>
                <Text style={styles.logField}>{displayKey}:</Text> {value}
              </Text>
            );
          }
        })}
      </TouchableOpacity>
    ))
  );

  const renderDatePickerModal = () =>
    isDatePickerVisible && Platform.OS === 'ios' && (
      <Modal transparent={true} animationType="fade" visible={isDatePickerVisible} onRequestClose={() => setIsDatePickerVisible(false)}>
        <View style={styles.datePickerModal}>
          <DateTimePicker value={date} mode="date" display="spinner" onChange={handleDateChange} />
          <Pressable style={styles.doneButton} onPress={confirmIOSDate}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </Modal>
    );

  // Main Component
  return (
    <View style={styles.container}>
      {/* Suggestion Banner */}
      {showSuggestion && (
        <View style={styles.suggestionBanner}>
          <Text style={styles.suggestionText}>
            Long press a log to delete it!
          </Text>
        </View>
      )}
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Fishing Logbook</Text>
      </View>
  
      {/* Log List */}
      <ScrollView style={styles.logList}>{renderLogs()}</ScrollView>
  
      {/* Add Log Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Log</Text>
      </TouchableOpacity>
  
      {/* Add Log Modal */}
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
                extraScrollHeight={-160}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
              >
                {/* Input Fields */}
                <Text style={styles.inputLabel}>Bait & Lure:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Worm, Minnow"
                  placeholderTextColor="rgba(0, 0, 0, 0.1)" // Adjust placeholder visibility
                  value={logData.bait}
                  onChangeText={(value) => handleInputChange('bait', value)}
                />
  
                <Text style={styles.inputLabel}>Fish Spot:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Riverbank, Lake"
                  placeholderTextColor='rgba(0, 0, 0, 0.1)' // Adjust placeholder visibility
                  value={logData.fishSpot}
                  onChangeText={(value) => handleInputChange('fishSpot', value)}
                />
  
                <View style={styles.row}>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabelSmall}>Weather:</Text>
                    <TextInput
                      style={styles.halfInput}
                      placeholder="Sunny, Rainy etc"
                      placeholderTextColor= 'rgba(0, 0, 0, 0.1)' // Adjust placeholder visibility
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
                  placeholderTextColor='rgba(0, 0, 0, 0.1)' // Adjust placeholder color for better visibility
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
              placeholderTextColor='rgba(0, 0, 0, 0.11)' // Adjust placeholder color for better visibility
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
        transparent={true}
        animationType="fade"
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.modalTitle}>Do you want to delete this log?</Text>
            <Text style={styles.modalSubtitle}>Are you sure?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.saveButton} onPress={deleteLog}>
                <Text style={styles.saveButtonText}>Yes, Delete</Text>
              </Pressable>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
  
      {/* Date Picker Modal */}
      {renderDatePickerModal()}
    </View>
  );
  
}

// Custom Components
const TextInputField = ({ label, placeholder, value, onChangeText }) => (
  <>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={onChangeText} />
  </>
);

const MoreCatchDetails = ({ isVisible, onToggle, logData, onChange }) => (
  <>
    <TouchableOpacity style={styles.moreDetailsButton} onPress={onToggle}>
      <Text style={styles.moreDetailsButtonText}>{isVisible ? 'Hide Details' : 'More Catch Details'}</Text>
    </TouchableOpacity>
    {isVisible && (
      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.inputLabelSmall}>Weight:</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.smallInput}
              placeholder="e.g., 2.5"
              placeholderTextColor="rgba(0, 0, 0, 0.1)" // Adjust placeholder color
              value={logData.weight}
              onChangeText={(value) => onChange('weight', value)}
              keyboardType="numeric" // Ensure numeric keyboard for weight
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
              placeholderTextColor="rgba(0, 0, 0, 0.1)" // Adjust placeholder color
              value={logData.length}
              onChangeText={(value) => onChange('length', value)}
              keyboardType="numeric" // Ensure numeric keyboard for length
            />
            <Text style={styles.unit}>cm</Text>
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
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.15)',
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
    flex: 0.9, // Ensure it doesn’t take too much screen space
    justifyContent: 'flex-end', // Center the picker vertically
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
    padding: 10,
  },
  datePickerWrapper: {
    backgroundColor: 'yellow',
    color: 'yellow',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 20,
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
});
