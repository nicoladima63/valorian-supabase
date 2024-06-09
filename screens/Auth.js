import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Input, Icon } from '@rneui/themed';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const route = useRoute();
    const isNewUser = route.params;
    const navigation = useNavigation();

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
            navigation.replace('Home');
        }
        setLoading(false);
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isNewUser ? 'Nuovo Account' : 'Login'}</Text>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input
                    style={styles.input}
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setEmailError('');
                    }}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                    errorMessage={emailError}
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input
                    style={styles.input}
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    placeholder="Password"
                    rightIcon={
                        <Icon
                            type='font-awesome'
                            name={showPassword ? 'eye' : 'eye-slash'}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError('');
                    }}
                    secureTextEntry={!showPassword}
                    placeholder="Password"
                    autoCapitalize={'none'}
                    errorMessage={passwordError}
                />
            </View>
            <Button
                buttonStyle={{ width: 250, padding: 15 }}
                containerStyle={{ margin: 5 }}
                loading={loading}
                titleStyle={{ marginHorizontal: 5, fontSize: 20 }}
                title={isNewUser ? 'Registrati' : 'Accedi'}
                onPress={isNewUser ? signUpWithEmail : signInWithEmail}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    inputx: {
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        width: 150,
        marginTop: 20,
        padding: 30
    }
});
