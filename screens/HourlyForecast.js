import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HourlyForecastScreen({ route }) {
    const [hourlyForecast, setHourlyForecast] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const { latitude, longitude } = route.params;

    useEffect(() => {
        const fetchHourlyForecast = async () => {
            try {
                const apiKey = '1ce8d81a5967e4046d0d64e086eb5bb0'; // Replace with your OpenWeather API key
                const hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

                const response = await axios.get(hourlyUrl);
                setHourlyForecast(response.data);
            } catch (error) {
                setErrorMsg('Failed to fetch hourly forecast');
            }
        };

        fetchHourlyForecast();
    }, []);

    // Helper function to format date and time
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);

        // Format the date as DD.MM.YYYY
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();

        // Format the time as HH:mm
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`; // Combine date and time
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hourly Forecast</Text>
            {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
            ) : hourlyForecast ? (
                <ScrollView style={styles.forecastContainer}>
                    {hourlyForecast.list.slice(0, 12).map((forecast, index) => (
                        <View key={index} style={styles.forecastItem}>
                            <Text style={styles.timeText}>{formatDateTime(forecast.dt_txt)}</Text>
                            <Text style={styles.tempText}>{Math.round(forecast.main.temp)}°C</Text>
                            <Text style={styles.descText}>{forecast.weather[0].description}</Text>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <ActivityIndicator size="large" color="indigo" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingTop: 18,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: 'indigo',
        fontFamily: 'MononokiBold',
    },
    forecastContainer: {
        marginTop: 10,
    },
    forecastItem: {
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
    timeText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    tempText: {
        fontSize: 16,
        color: 'indigo',
    },
    descText: {
        fontSize: 14,
        color: '#666',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});
