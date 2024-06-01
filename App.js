import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Import Supabase client
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './context/ThemeContext';
import { InitialSetup, useInitialRoute } from './InitialSetup';
import ErrorScreen from './components/ErrorPage';
import WelcomePage from './screens/WelcomePage';
import LoginPage from './screens/Auth';
import Profile from './screens/Profile';
import HomeTest from './screens/HomeTest'; // Ensure you have this screen
import { Tabs } from './navigation/Tabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { initialRoute } = useInitialRoute();
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoading(false);
        })

    }, [])


    if (!initialRoute) {
        return null; // Optional loading indicator can be added here
    }

    return (
        <NavigationContainer>
            {isLoading ? (
                // Display loading indicator while fetching session
                <ActivityIndicator size="large" />
            ) : error ? (
                // Display error message if there's an error
                <ErrorScreen message={error.message} /> // Replace with your error component
            ) : (
                <Stack.Navigator initialRouteName={initialRoute}>
                    {session ? (
                        <Stack.Screen
                            name="Home"
                            component={Tabs}
                            options={{ headerShown: false }}
                            key={session.id}
                            initialParams={{ session }}
                        />


                    ) : (
                        <Stack.Screen
                            name="Welcome"
                            component={WelcomePage}
                            options={{ headerShown: false }}
                            initialParams={{ session }}
                        />
                    )}
                    <Stack.Screen name="Auth" component={LoginPage} options={{ headerShown: false }} />
                    <Stack.Screen name="Test" component={HomeTest} options={{ headerShown: false }} />
                            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true, headerBackVisible: true, }}  />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <InitialSetup>
                <AppNavigator />
            </InitialSetup>
        </ThemeProvider>
    );
};

export default App;
