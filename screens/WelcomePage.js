import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Import Supabase client
import { View, Text, StyleSheet, Button } from 'react-native';

const WelcomePage = ({ navigation }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [session, setSession] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setIsAuthenticated(!!session?.user);
        };
        getSession();
    }, []);

    const handleGetStarted = (isNewUser) => {
        navigation.navigate('Auth', { isNewUser });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                {isAuthenticated ? 'Autenticato' : 'Non autenticato'}
            </Text>
            <Text style={styles.title}>Benvenuto in VALORIAN</Text>
            <Text>Spiegazione della app...</Text>
            {session && session.user && <Text>{session.user.id}</Text>}
            <View style={styles.buttonContainer}>
                <Button title="Nuovo Account" onPress={() => handleGetStarted(true)} />
                <Button title="Login" onPress={() => handleGetStarted(false)} />
            </View>
        </View>
    );
};
export default WelcomePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 18,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
});

