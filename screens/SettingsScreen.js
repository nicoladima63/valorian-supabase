import React from 'react';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import Layout from './Layout';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ElevatedView from 'react-native-elevated-view';

const SettingsScreen = ({ navigation }) => {
    const { toggleTheme, theme } = useTheme();
    const { isDarkTheme, setIsDarkTheme } = React.useContext(AppContext)

    return (
        <Layout navigation={navigation} showTopBar={true}>
            <ElevatedView elevation={4} style={theme.stayElevated}>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                    paddingVertical: 20,
                    borderRadius: 8,
                    alignItems: 'center'
                }}
                    onPress={() => {
                        setIsDarkTheme(!isDarkTheme);
                        toggleTheme();
                    }}>
                    <Ionicons name={isDarkTheme ? 'checkbox' : 'square-outline'} size={24} color={theme.colors.text} />
                    <Text style={{
                        color: theme.colors.text,
                        marginLeft: 8
                    }}>{isDarkTheme ? 'Tema chiaro' : 'Tema Scuro'}</Text>
                </TouchableOpacity>
            </ElevatedView>
            <ElevatedView elevation={4} style={theme.stayElevated}>
                <Button  onPress={() => navigation.navigate('Categorie')} title="Categorie"  />
            </ElevatedView>

        </Layout>
    )
};

export default SettingsScreen;
