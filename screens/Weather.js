import axios from 'axios';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WeatherScreen() {
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            // Request permission for location
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

                // Define API Key and URL with units for Celsius
                const apiKey = '1ce8d81a5967e4046d0d64e086eb5bb0';
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

                // Fetch weather data
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
            <Text style={styles.text}>Weather Information</Text>
            {errorMsg ? <Text style={styles.text}>{errorMsg}</Text> : null}
            {weather ? (
                <>
                    <Text style={styles.text}>
                        Temperature: {Math.round(weather.main.temp)}°C
                    </Text>
                    <Text style={styles.text}>
                        Condition: {weather.weather[0].description}
                    </Text>
                    <Text style={styles.text}>
                        Location: {weather.name}
                    </Text>
                </>
            ) : null}
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
        marginBottom: 5,
    },
});
