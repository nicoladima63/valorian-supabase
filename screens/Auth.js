import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Input, Icon } from '@rneui/themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import Background from '../components/Background';
import {
    Title

} from '../styledComponents'

export default function Auth({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const route = useRoute();
    //const { isNewUser } = route.params;
    const { isNewUser} = route.params ;

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert(error.message);
        } else {
            // Torna indietro alla schermata precedente
            navigation.replace('Home');
            //navigation.replace('Welcome');
        }
        setLoading(false);
    }

    async function signUpWithEmail() {
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
                // Torna indietro alla schermata precedente
                navigation.replace('Home');
                //navigation.replace('Welcome');

            }
        }
        setLoading(false);
    }

    return (
        <Background>
            <View style={styles.container}>
                <Title>{isNewUser ? 'Nuovo Account' : 'Login'}</Title>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Input style={styles.input}
                        label="Email"
                        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <Input style={styles.input}
                        label="Password"
                        leftIcon={{ type: 'font-awesome', name: 'lock' }}
                        rightIcon={
                            <Icon
                                type='font-awesome'
                                name={showPassword ? 'eye' : 'eye-slash'}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={!showPassword}
                        placeholder="Password"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    {isNewUser ? (
                        <Button title="Sign up" onPress={signUpWithEmail} loading={loading} />
                    ) : (
                        <Button title="Sign in" onPress={signInWithEmail} loading={loading} />
                    )}
                </View>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
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
    input: {
        color: 'grey',
    },
});
