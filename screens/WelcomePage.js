//WelcomePage.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { View, Text, Button, StyleSheet } from 'react-native';

const WelcomePage = ({ navigation }) => {
    console.log(supabase.auth);
    const [loading, setLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Controlla lo stato dell'autenticazione all'avvio del componente
    useEffect(() => {
        const session = supabase.auth.getSession();
        if (session) {
            // Se c'è una sessione attiva, l'utente è già autenticato, quindi reindirizza alla Home
            navigation.replace('Home');
        } else {
            // Altrimenti, l'utente non è autenticato
            setIsAuthenticated(false);
            navigation.replace('Login');

        }
    }, []);
    const handleGetStarted = () => {
        navigation.push('Register'); // Vai alla pagina di login
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Benvenuto nella nostra App!</Text>

            <Text style={styles.description}>Spiegazione della app...</Text>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button style={styles.input} title="Registrati" onPress={handleGetStarted} />
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
        marginTop: 40,
        padding: 12,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
    },
    verticallySpaced: {
        paddingTop: 16,
        paddingBottom: 16,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    input: {
        height: 80,
    },
});
