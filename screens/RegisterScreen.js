import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

import { useTheme } from '../context/ThemeContext';

import {
    View, Text, Alert,  Pressable, Image,
     TextInput, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Input, Icon } from '@rneui/themed';

import Spinner from 'react-native-loading-spinner-overlay';
export default function RegisterScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useTheme();

    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const passwordRef = useRef(null); // Riferimento al TextInput della password

    const logo = require("../assets/images/logo.png")


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

    async function signUpWithEmail() {
        if (!validateEmail(email)) {
            setEmailError('Inserisci un indirizzo email valido.');
            return;
        }
        if (!validatePassword(password)) {
            setPasswordError('La password deve essere di almeno 6 caratteri.');
            return;
        }

        setLoading(true);
        const { data: { session }, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert(error.message);
        } else {
            if (!session) {
                Alert.alert('Controlla la tua email per verificare il tuo account!');
                navigation.replace('Welcome');
            } else {
                navigation.replace('Home');
            }
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
                <Text style={theme.LoginSubtitle}>Nuovo Utente</Text>
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
                        returnKeyType="next" // Imposta il tipo di tasto di ritorno
                        onSubmitEditing={() => passwordRef.current.focus()} // Passa al prossimo TextInput quando viene premuto il tasto "Vai"
                    />
                    {emailError ? <Text style={theme.errorText}>{emailError}</Text> : null}
                    <Input
                        ref={passwordRef} // Associa il riferimento
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
                        returnKeyType="go" // Imposta il tipo di tasto di ritorno
                        onSubmitEditing={signUpWithEmail} // Chiamata alla funzione di registrazione quando viene premuto "Vai"
                    />
                    {passwordError ? <Text style={theme.errorText}>{passwordError}</Text> : null}
                </View>

                <View style={theme.LoginbuttonView}>
                    <CustomButton title="Registrati" onPress={signUpWithEmail} />
                </View>

                <View style={theme.LoginmediaIcons}>
                    <Text source='{facebook}' style={theme.Loginicons} />
                    <Text source='{tiktok}' style={theme.Loginicons} />
                    <Text source='{linkedin}' style={theme.Loginicons} />
                </View>

                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={theme.LoginfooterText}>Hai un Account?
                        <Text style={theme.Loginsignup}>  Accedi</Text>
                    </Text>
                </Pressable>

            </View>
        </TouchableWithoutFeedback>
    );
}


