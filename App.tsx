import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomePage from './screens/WelcomePage';
import Home from './screens/HomePage';
import LoginPage from './screens/LoginPage'; // Aggiungi la tua pagina di login
import RegisterPage from './screens/RegisterPage'; // Aggiungi la tua pagina di login

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        const checkFirstLaunch = async () => {
            const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
            //const isFirstLaunch = null;
            if (isFirstLaunch === null) {
                await AsyncStorage.setItem('isFirstLaunch', 'false');
                setInitialRoute('Welcome');
            } else {
                setInitialRoute('Login'); // O 'Home' se l'utente è già autenticato
            }
        };

        checkFirstLaunch();
    }, []);

    if (initialRoute === null) {
        return null; // O un indicatore di caricamento
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen name="Valorian" component={WelcomePage} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={LoginPage} />
                <Stack.Screen name="Register" component={RegisterPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
