import axios from 'axios';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function WeatherScreen() {
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            // permission for location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Get user's location
            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            if (loc) {
                setLocation(loc);
                const { latitude, longitude } = loc.coords;

                // API Key and URL
                const apiKey = '1ce8d81a5967e4046d0d64e086eb5bb0';
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

                // Fetch weather
                try {
                    const response = await axios.get(weatherUrl);
                    setWeather(response.data);
                } catch (error) {
                    setErrorMsg('Failed to fetch weather data');
                }
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            {/* Title Section */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Weather Information</Text>
            </View>

            {/* Weather Details Section */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {errorMsg ? (
                    <Text style={styles.errorText}>{errorMsg}</Text>
                ) : weather ? (
                    <>
                        <View style={styles.weatherBox}>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Temperature:</Text> {Math.round(weather.main.temp)}°C
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Condition:</Text> {weather.weather[0].description}
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Location:</Text> {weather.name}
                            </Text>
                        </View>
                    </>
                ) : (
                    <Text style={styles.loadingText}>Loading weather data...</Text>
                )}
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
        backgroundColor: 'indigo', // Match the title style
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: 15,
      },
      title: {
        fontSize: 30,
        color: '#fff', // White text for better readability
        textAlign: 'center',
        fontFamily: 'MononokiBold',
        flexWrap: 'nowrap',
        flexShrink: 1,
      },
      
    contentContainer: {
        padding: 20,
    },
    weatherBox: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoText: {
        fontSize: 18,
        color: '#333333',
        marginBottom: 10,
    },
    boldText: {
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
    },
});
