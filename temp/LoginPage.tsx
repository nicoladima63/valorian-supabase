// screens/LoginPage.js
import React, { useState,useEffect } from 'react'
import { View, Text, Button, StyleSheet, Alert, AppState } from 'react-native';
import { supabase } from '../lib/supabase'
import { Input } from '@rneui/themed'
import * as SecureStore from 'expo-secure-store';

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function LoginPage({ navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadSavedData = async () => {
            try {
                const savedEmail = await SecureStore.getItemAsync('email');
                const savedPassword = await SecureStore.getItemAsync('password');
                if (savedEmail) setEmail(savedEmail);
                if (savedPassword) setPassword(savedPassword);
            } catch (error) {
                console.error('Errore nel caricamento dei dati memorizzati', error);
            }
        };

        loadSavedData();
    }, []);

    useEffect(() => {
        const saveData = async () => {
            try {
                await SecureStore.setItemAsync('email', email);
                await SecureStore.setItemAsync('password', password);
            } catch (error) {
                console.error('Errore nel salvataggio dei dati', error);
            }
        };

        saveData();
    }, [email, password]);

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            Alert.alert(error.message);
        } else {
            navigation.replace('Home'); // Vai alla pagina principale dopo il login
        }
        setLoading(false)
    }

    return (
        <View>
            <Text style={styles.title}>Login</Text>

            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button  title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
            </View>
        </View>
    );
};



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
        alignSelf: 'center',
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    button: {
        padding:20,
    }

});
