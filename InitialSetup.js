import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';

const InitialRouteContext = createContext();

export const InitialSetup = ({ children }) => {
    const [initialRoute, setInitialRoute] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
                if (isFirstLaunch === null) {
                    await AsyncStorage.setItem('isFirstLaunch', 'false');
                    setInitialRoute('Welcome'); // Welcome screen or component
                } else {
                    await fetchConfig(); // Call fetchConfig here
                }
            } catch (error) {
                console.error('Error accessing AsyncStorage:', error);
            }
        };

        const fetchConfig = async () => {
            try {
                let { data, error } = await supabase
                    .from('config')
                    .select('value')
                    .eq('key', 'isTestPhase')
                    .single();

                if (!error && data !== null) {
                    const isTestPhase = data.value;
                    await checkSession(isTestPhase); // Call checkSession with isTestPhase here
                } else {
                    console.error('Error fetching config:', error);
                }
            } catch (error) {
                console.error('Error fetching config from Supabase:', error);
            }
        };

        const checkSession = async (isTestPhase) => {
            try {
                const session = await AsyncStorage.getItem('session');
                if (session) {
                    setInitialRoute(isTestPhase ? 'Test' : 'Home'); // User is authenticated
                } else {
                    setInitialRoute('Welcome'); // User is not authenticated
                }
            } catch (error) {
                console.error('Error checking session:', error);
            }
        };

        const determineInitialRoute = async () => {
            await checkFirstLaunch(); // This will start the flow
            setLoading(false);
        };

        determineInitialRoute(); // Call the function to start the process
    }, []);

    return (
        <InitialRouteContext.Provider value={{ initialRoute }}>
            {!loading && children}
        </InitialRouteContext.Provider>
    );
};

export const useInitialRoute = () => useContext(InitialRouteContext);
