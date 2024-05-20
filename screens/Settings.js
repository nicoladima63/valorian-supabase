// screens/Settings.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../supabase';

const Settings = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSave = async () => {
        const user = supabase.auth.getUser();

        if (email) {
            const { error } = await supabase.auth.update({ email });
            if (error) {
                console.log('Error updating email:', error);
            }
        }

        if (password) {
            const { error } = await supabase.auth.update({ password });
            if (error) {
                console.log('Error updating password:', error);
            }
        }

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Impostazioni</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Nuova Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Salva" onPress={handleSave} />
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});
