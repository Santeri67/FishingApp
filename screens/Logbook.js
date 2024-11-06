import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LogbookScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fishing Logbook</Text>
      {/* Add functionality to log fishing spots, catches, etc. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    color: '#333333',
    fontSize: 18,
  },
});