import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LogbookScreen() {
  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Fishing Logbook</Text>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.infoText}>
          {/* Placeholder for logbook functionality */}
          Log your fishing spots, catches, and more here!
        </Text>
      </View>
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
  
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
  },
});
