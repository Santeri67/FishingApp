import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HourlyForecastScreen({ route }) {
    // Tilamuuttuja ennusteiden ja virheilmoitusten tallentamiseen
    const [hourlyForecast, setHourlyForecast] = useState(null); // Säilyttää sääennusteen tiedot
    const [errorMsg, setErrorMsg] = useState(null); // Säilyttää virheilmoituksen, jos haku epäonnistuu

    const { latitude, longitude } = route.params;
    // Parametrit, jotka saadaan reitityksestä (käyttäjän valitsemat sijaintitiedot)

    useEffect(() => {
        // Funktio, joka hakee tuntiennusteen OpenWeather API:sta
        const fetchHourlyForecast = async () => {
            try {
                const apiKey = '1ce8d81a5967e4046d0d64e086eb5bb0';
                const hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

                const response = await axios.get(hourlyUrl); // Suorittaa GET-pyynnön API:lle
                setHourlyForecast(response.data); // Tallentaa saadut ennustetiedot tilaan
            } catch (error) {
                setErrorMsg('Failed to fetch hourly forecast');
            }
        };

        fetchHourlyForecast(); // Kutsuu funktiota komponentin renderöinnin jälkeen
    }, []);

    // Apufunktio, joka muotoilee päivämäärän ja ajan
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime); // Muuttaa tekstimuotoisen ajan Date-objektiksi

        // Muotoilee päivämäärän: PP.KK.VVVV
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        // Muotoilee ajan: HH:mm
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
        // Palauttaa yhdistetyn päivämäärän ja ajan
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hourly Forecast</Text>

            {/* Tarkistaa, onko virheilmoitus, sääennusteet vai latausanimaatio näytettävä */}
            {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
            ) : hourlyForecast ? (
                // Näyttää tuntiennusteen
                <ScrollView style={styles.forecastContainer}>
                    {/* Ennusteiden läpikäynti, 12 ensimmäistä tuntia */}
                    {hourlyForecast.list.slice(0, 12).map((forecast, index) => (
                        <View key={index} style={styles.forecastItem}>
                            <Text style={styles.timeText}>{formatDateTime(forecast.dt_txt)}</Text>
                            {/* Näyttää ennusteen ajan muotoiltuna */}
                            <Text style={styles.tempText}>{Math.round(forecast.main.temp)}°C</Text>
                            {/* Näyttää lämpötilan pyöristettynä */}
                            <Text style={styles.descText}>{forecast.weather[0].description}</Text>
                            {/* Näyttää sääolosuhteet, esim. "clear sky" */}
                        </View>
                    ))}
                </ScrollView>
            ) : (
                // Latausanimaatio
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
