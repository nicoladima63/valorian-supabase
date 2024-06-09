import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './lib/supabase'; // Import Supabase client
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { InitialSetup, useInitialRoute } from './InitialSetup';
import ErrorScreen from './components/ErrorScreen';
import WelcomePage from './screens/WelcomePage';
import Auth from './screens/Auth';
import Account from './screens/Account';
import HomeTest from './screens/HomeTest'; // Ensure you have this screen
import { Tabs } from './navigation/Tabs';
import { ActivityIndicator, View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

const SessionChecker = ({ navigation }) => {
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setIsLoading(false);

            supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                if (session) {
                    navigation.navigate('Home');
                } else {
                    navigation.navigate('Auth');
                }
            });

            if (session) {
                // Redirect alla pagina principale
                navigation.navigate('Home');
            } else {
                // Redirect alla pagina di login
                navigation.navigate('Auth');
            }
        };

        checkSession();
    }, [navigation]);

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
};

const AppNavigator = () => {
    const { initialRoute } = useInitialRoute();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SessionChecker">
                <Stack.Screen name="SessionChecker" component={SessionChecker} options={{ headerShown: false }} />
                <Stack.Screen
                    name="Home"
                    component={Tabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Welcome"
                    component={WelcomePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
                <Stack.Screen name="Test" component={HomeTest} options={{ headerShown: false }} />
                <Stack.Screen name="Account" component={Account} options={{ headerShown: true, headerBackVisible: true }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <InitialSetup>
                    <AppNavigator />
                </InitialSetup>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
