import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, Pressable } from 'react-native';
import supabase from '@/lib/supabase';
import Layout from './Layout';
import { useTheme } from '../context/ThemeContext';

const Settings = ({ navigation }) => {
    const [showStatus, setShowStatus] = useState(false);
    const [showSongs, setShowSongs] = useState(false);
    const [showNeeds, setShowNeeds] = useState(false);
    const { toggleTheme } = useTheme();
    const { theme } = useTheme();
    const savePreferences = async () => {
        const { data, error } = await supabase
            .from('user_preferences')
            .upsert({ user_id: userId, show_status: showStatus, show_songs: showSongs, show_needs: showNeeds });
        if (error) {
            console.error('Error saving preferences:', error);
        } else {
            console.log('Preferences saved:', data);
        }
    };

    const toggleSwitch = (setting, value) => {
        switch (setting) {
            case 'showStatus':
                setShowStatus(value);
                break;
            case 'showSongs':
                setShowSongs(value);
                break;
            case 'showNeeds':
                setShowNeeds(value);
                break;
            default:
                break;
        }
    };

    const Item = ({ title, value, onValueChange }) => (
        <View style={theme.item}>
            <Text style={theme.itemText}>{title}</Text>
            <Switch
                style={theme.switch}
                trackColor={{ false: '#fff', true: '#fff' }}
                thumbColor={value ? '#007BFF' : '#767577'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    const CustomButton = ({ title, onPress }) => (
        <Pressable onPress={onPress} style={theme.customButton}>
            <Text style={theme.customButtonText} >{title}</Text>
        </Pressable>
    );

    const GetUser =async () => {
        const authUser = supabase.auth.getUser(); 
        alert(JSON.stringify(authUser));
    }

    return (
        <Layout navigation={navigation}>
            <View style={theme.container}>
                <Text style={theme.title}>Impostazioni</Text>

                <Item
                    title="Mostra Stato Generale"
                    value={showStatus}
                    onValueChange={(value) => toggleSwitch('showStatus', value)}
                />
                <Item
                    title="Mostra Brani Caricati"
                    value={showSongs}
                    onValueChange={(value) => toggleSwitch('showSongs', value)}
                />
                <Item
                    title="Mostra Numero Bisogni"
                    value={showNeeds}
                    onValueChange={(value) => toggleSwitch('showNeeds', value)}
                />
                <Text style={theme.title}>Cambia tema</Text>
                <Switch onValueChange={toggleTheme} />
                <CustomButton title="Salva Preferenze" onPress={savePreferences} />
                <Text>------------------------</Text>
                <Button title="Esci" onPress={() => supabase.auth.signOut()} />
                <Text>------------------------</Text>
                <Button title="REmove all subscription" onPress={() => supabase.removeAllSubscriptions()} />
                <Text>------------------------</Text>
                <Button title="GetUSer" onPress={() => GetUser()} />
            </View>
        </Layout>
    );
};


export default Settings;
