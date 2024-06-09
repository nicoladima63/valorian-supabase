import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import {
    View, Text, Alert, Pressable, Image,
    Switch, TextInput, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Input, Icon } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import Spinner from 'react-native-loading-spinner-overlay';
export default function LoginScreen({ navigation }) {
    const [click, setClick] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useTheme();

    const [loading, setLoading] = useState(false);
    const { setSession } = useAuth();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

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

    const handlePressEmptySpace = () => {
        Keyboard.dismiss(); // Nascondi la tastiera quando si tocca uno spazio vuoto
    };
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
        <Pressable onPress={onPress} style={theme.Loginbutton}>
            <Text style={theme.LoginbuttonText}>{title}</Text>
        </Pressable>
    );

    return (
        <TouchableWithoutFeedback onPress={handlePressEmptySpace}>
            <View style={theme.Logincontainer}>
                <Spinner
                    visible={loading} // Visualizza lo spinner quando loading è true
                    textContent={'Loading...'}
                    textStyle={theme.spinnerTextStyle}
                />
                <Image source={logo} style={theme.Loginimage} resizeMode='contain' />
                <Text style={theme.Logintitle}>Valorian</Text>
                <Text style={theme.LoginSubtitle}>login</Text>
                <View style={theme.LogininputView}>
                    <Input
                        //style={theme.Logininput}
                        label="Email"
                        placeholder='email@esempio.com'
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError('');
                        }}
                        autoCorrect={false}
                        autoCapitalize='none'
                    />
                    {emailError ? <Text style={theme.errorText}>{emailError}</Text> : null}
                    <Input
                        //style={theme.Logininput}
                        placeholder='password'
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError('');
                        }}
                        autoCorrect={false}
                        rightIcon={
                            <Icon
                                type='font-awesome'
                                name={showPassword ? 'eye' : 'eye-slash'}
                                onPress={() => setShowPassword(!showPassword)}
                            />

                        }
                        autoCapitalize="none"
                    />
                    {passwordError ? <Text style={theme.errorText}>{passwordError}</Text> : null}
                </View>
                <View style={theme.LoginrememberView}>
                    <View style={theme.Loginswitch}>
                        <Switch value={click} onValueChange={setClick} trackColor={{ true: "green", false: "gray" }} />
                        <Text style={theme.LoginfooterText}>Ricordami</Text>
                    </View>
                    <View>
                        <Pressable onPress={() => Alert.alert("Forget Password!")}>
                            <Text style={theme.LoginforgetText}>Password dimenticata?</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={theme.LoginbuttonView}>
                    <CustomButton title="Accedi" onPress={() => signInWithEmail()} />
                    <Text style={theme.LoginoptionsText}>Oppure entra con</Text>
                </View>

                <View style={theme.LoginmediaIcons}>
                    <Image source={facebook} style={theme.Loginicons} />
                    <Image source={tiktok} style={theme.Loginicons} />
                    <Image source={linkedin} style={theme.Loginicons} />
                </View>

                <Pressable onPress={() => navigation.navigate('Register')}>
                    <Text style={theme.LoginfooterText}>Non hai un Account?
                        <Text style={theme.Loginsignup}>  Registrati</Text>
                    </Text>
                </Pressable>

            </View>
        </TouchableWithoutFeedback>
    );
}
