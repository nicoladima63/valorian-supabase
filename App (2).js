import React, { useEffect, useState, useContext } from 'react';
import { StatusBar, AppState, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import AccountScreen from './screens/AccountScreen';
import { Tabs } from './navigation/Tabs';

import { ThemeProvider } from './context/ThemeContext'; // Importa ThemeProvider
import DarkTheme from './themes/DarkTheme';
import DefaultTheme from './themes/DefaultTheme';

import { AppContext } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

const Stack = createNativeStackNavigator();

function AuthLoadingScreen({ navigation }) {
    const { session } = useAuth();

    useEffect(() => {
        if (session) {
            navigation.replace('Home');
        } else {
            navigation.replace('Login');
        }
    }, [session, navigation]);

    return null;
}

export default function App() {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                supabase.auth.startAutoRefresh();
            } else {
                supabase.auth.stopAutoRefresh();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const appContext = {
        isDarkTheme,
        setIsDarkTheme,
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemeProvider>
                <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
                    backgroundColor={isDarkTheme ? DarkTheme.colors.background : DefaultTheme.colors.background}
                />
                <AuthProvider>
                    <NavigationContainer theme={isDarkTheme ? DarkTheme : DefaultTheme}>
                        <AppContext.Provider value={appContext}>
                            <Stack.Navigator initialRouteName='AuthLoading' screenOptions={{ headerShown: false }}>
                                <Stack.Screen
                                    name='AuthLoading'
                                    component={AuthLoadingScreen}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name='Home'
                                    component={HomeScreen}
                                    options={{ headerShown: false, title: 'Home' }}
                                />
                                <Stack.Screen
                                    name='Settings'
                                    component={SettingsScreen}
                                    options={{ headerShown: true, title: 'Settings' }}
                                />
                                <Stack.Screen
                                    name='Login'
                                    component={LoginScreen}
                                    options={{ headerShown: false, title: 'Login' }}
                                />
                                <Stack.Screen
                                    name='Account'
                                    component={AccountScreen}
                                    options={{
                                        headerShown: true,
                                        title: 'Account',
                                        headerStyle: {                                        
                                            backgroundColor: isDarkTheme ? DefaultTheme.colors.background : DarkTheme.colors.background,
                                        },
                                        headerTintColor: isDarkTheme ? DefaultTheme.colors.text : DarkTheme.colors.text,
                                        headerTitleStyle: {
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                <Stack.Screen
                                    name="Main"
                                    component={Tabs}
                                    options={{ headerShown: false }}
                                />
                            </Stack.Navigator>
                        </AppContext.Provider>
                    </NavigationContainer>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaView>
    );
}
