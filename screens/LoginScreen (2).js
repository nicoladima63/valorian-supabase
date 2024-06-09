import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Pressable, Image, Switch,TextInput } from 'react-native';
import { supabase } from '../lib/supabase';
import { Input, Icon } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ navigation }) {
    const [click, setClick] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useTheme();

    const [loading, setLoading] = useState(false);
    const { setSession } = useAuth();

    const logo = require("../assets/images/logo.png")
    const facebook = require("../assets/images/react-logo.png")
    const linkedin = require("../assets/images/react-logo.png")
    const tiktok = require("../assets/images/react-logo.png")


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

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }



    async function signInWithEmail() {
        if (!validateEmail(email)) {
            setEmailError('Inserisci un indirizzo email valido.');
            return;
        }
        if (!validatePassword(password)) {
            setPasswordError('La password deve essere di almeno 6 caratteri.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert(error.message);
        } else {
            navigation.replace('Main');
        }
        setLoading(false);
    }


    const CustomButton = ({ title, onPress }) => (
        <Pressable onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.image} resizeMode='contain' />

            <Text style={styles.title}>Login</Text>
            <View style={theme.inputView}>
                <TextInput
                    style={styles.input}
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => {
                        setEmail(text);
                        setEmailError('');
                    }}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError('');
                    }}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    rightIcon={
                        <Icon
                            type='font-awesome'
                            name={showPassword ? 'eye' : 'eye-slash'}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.rememberView}>
                <View style={styles.switch}>
                    <Switch value={click} onValueChange={setClick} trackColor={{ true: "green", false: "gray" }} />
                    <Text style={styles.rememberText}>Ricordami</Text>
                </View>
                <View>
                    <Pressable onPress={() => navigateToForgetPasswordScreen()}>
                        <Text style={styles.forgetText}>Password diemnticata?</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.buttonView}>
                <Pressable  onPress={() => signInWithEmail()}>
                    <Text style={styles.buttonText}>Entra</Text>
                </Pressable>
                <Text style={styles.optionsText}>Oppure entra con</Text>
            </View>

            <View style={styles.mediaIcons}>
                <Image source={facebook} style={styles.icons} />
                <Image source={tiktok} style={styles.icons} />
                <Image source={linkedin} style={styles.icons} />
            </View>

            <Text style={styles.footerText}>Don't Have Account?<Text style={styles.signup}>  Sign Up</Text></Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
    },
    image: {
        height: 160,
        width: 170
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "red"
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 7
    },
    rememberView: {
        width: "100%",
        paddingHorizontal: 50,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 8
    },
    switch: {
        flexDirection: "row",
        gap: 1,
        justifyContent: "center",
        alignItems: "center"

    },
    rememberText: {
        fontSize: 13
    },
    forgetText: {
        fontSize: 11,
        color: "red"
    },
    button: {
        backgroundColor: "red",
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 50
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    mediaIcons: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 23
    },
    icons: {
        width: 40,
        height: 40,
    },
    footerText: {
        textAlign: "center",
        color: "gray",
    },
    signup: {
        color: "red",
        fontSize: 13
    }
})