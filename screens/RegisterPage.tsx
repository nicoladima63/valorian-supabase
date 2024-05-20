import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { View, Text, Button, StyleSheet, Alert, AppState } from 'react-native';
import { Input } from '@rneui/themed'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)


    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            Alert.alert(error.message);
        } else {
            navigation.replace('Home'); // Vai alla pagina principale dopo il login
        }
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrazione utente</Text>
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
            <View style={styles.verticallySpaced}>
                <Button style={styles.button} title="Registrati" disabled={loading} onPress={() => signUpWithEmail()} />
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
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
        backgroundColor: '#007BFF',
        paddingVertical: 15, // Altezza del pulsante
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center',
    },
})
