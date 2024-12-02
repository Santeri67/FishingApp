import axios from 'axios';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function WeatherScreen({ navigation }) {
    // Tila käyttäjän sijainnille
    const [location, setLocation] = useState(null);
    // Tila säädatalle
    const [weather, setWeather] = useState(null);
    // Tila virheviesteille,
    const [errorMsg, setErrorMsg] = useState(null);

    // Funktio, joka laskee tuulen suunnan asteista ja palauttaa tekstimuotoisen suunnan
    const getWindDirection = (deg) => {
        if (deg > 337.5 || deg <= 22.5) return 'North';
        if (deg > 22.5 && deg <= 67.5) return 'North-East';
        if (deg > 67.5 && deg <= 112.5) return 'East';
        if (deg > 112.5 && deg <= 157.5) return 'South-East';
        if (deg > 157.5 && deg <= 202.5) return 'South';
        if (deg > 202.5 && deg <= 247.5) return 'South-West';
        if (deg > 247.5 && deg <= 292.5) return 'West';
        if (deg > 292.5 && deg <= 337.5) return 'North-West';
        return 'Unknown';
    };

    // Funktio, joka palauttaa säätilaan sopivan taustakuvan
    const getBackgroundImage = (condition) => {
        switch (condition.toLowerCase()) {
            case 'clear':
                return require('../assets/sunny.gif');
            case 'rain':
                return require('../assets/rainy.gif');
            case 'clouds':
                return require('../assets/cloudy.jpg');
            case 'snow':
                return require('../assets/snowy.gif');
            default:
                return require('../assets/default.png'); // Oletustausta, jos tilanne ei vastaa mitään
        }
    };

    // Hakee sijainnin ja säädatan kun komponentti latautuu
    useEffect(() => {
        (async () => {
            try {
                // Pyydetään lupaa sijainnin käyttöön
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                // Hakee käyttäjän sijainnin tarkalla asetuksella
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                });

                // Jos sijainti löytyy, tallennetaan se tilaan
                if (loc) {
                    setLocation(loc);
                    const { latitude, longitude } = loc.coords;

                    // Säädatan API-osoite ja avain
                    const apiKey = '1ce8d81a5967e4046d0d64e086eb5bb0';
                    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

                    // Hakee säädatan API:sta ja tallentaa sen tilaan
                    const response = await axios.get(weatherUrl);
                    setWeather(response.data);
                }
            } catch (error) {
                setErrorMsg('Failed to fetch weather data');
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            {/* Otsikko-osio */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Weather Information</Text>
            </View>

            {/* Säädatan näyttäminen */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {errorMsg ? (
                    <Text style={styles.errorText}>{errorMsg}</Text>
                ) : weather ? (
                    <>
                        {/* Säälaatikko taustakuvan kanssa */}
                        <ImageBackground
                            source={getBackgroundImage(weather.weather[0].main)} // Haetaan taustakuva sään perusteella
                            style={styles.weatherBoxWithBackground}
                            imageStyle={{ borderRadius: 10 }}
                        >
                            <View style={styles.iconContainer}>
                                {/* Sään ikoni */}
                                {weather.weather[0].icon && (
                                    <Image
                                        source={{
                                            uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                                        }}
                                        style={styles.weatherIcon}
                                    />
                                )}
                            </View>

                            {/* Säätekstit laatikossa */}
                            <View style={styles.textOverlay}>
                                <Text style={styles.upperBoxText}>
                                    <Text style={styles.upperBoxBoldText}>Temperature:</Text>{' '}
                                    {Math.round(weather.main.temp)}°C
                                </Text>
                                <Text style={styles.upperBoxText}>
                                    <Text style={styles.upperBoxBoldText}>Condition:</Text>{' '}
                                    {weather.weather[0].description}
                                </Text>
                                <Text style={styles.upperBoxText}>
                                    <Text style={styles.upperBoxBoldText}>Location:</Text>{' '}
                                    {weather.name}
                                </Text>
                            </View>
                        </ImageBackground>

                        {/* Tuuli- ja lisätiedot */}
                        <View style={styles.weatherBox}>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Wind Speed:</Text>{' '}
                                {weather.wind.speed} m/s
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Wind Direction:</Text>{' '}
                                {weather.wind.deg}° ({getWindDirection(weather.wind.deg)})
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Humidity:</Text>{' '}
                                {weather.main.humidity}%
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Pressure:</Text>{' '}
                                {weather.main.pressure} hPa
                            </Text>
                        </View>

                        {/* Tunnin ennusteen painike */}
                        <TouchableOpacity
                            style={styles.ctaButton}
                            onPress={() =>
                                navigation.navigate('HourlyForecastScreen', {
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                })
                            }
                        >
                            <Text style={styles.ctaButtonText}>Check Hourly Forecast</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    // Latausanimaatio, kun säädataa haetaan
                    <ActivityIndicator
                        size="large"
                        color="indigo"
                        style={styles.loadingSpinner}
                    />
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
    padding: 20,
},
weatherBoxWithBackground: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
},
iconContainer: {
    alignItems: 'baseline',
    marginBottom: 10,
},
weatherIcon: {
    width: 80,
    height: 80,
},
textOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
},
upperBoxText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
},
upperBoxBoldText: {
    fontWeight: 'bold',
    color: '#fff',
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
    marginBottom: 15,
},
infoText: {
    fontSize: 18,
    color: '#696969',
    marginBottom: 10,
},
boldText: {
    fontWeight: 'bold',
    color: '#2F4F4F',
},
ctaButton: {
    backgroundColor: 'indigo',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
},
ctaButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'FiraCodeBold',
},
errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
},
loadingSpinner: {
    marginTop: 20,
},
});
