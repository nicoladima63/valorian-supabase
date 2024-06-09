import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { View, TouchableOpacity, Text } from 'react-native';
import TopBar from '../components/TopBar';
import { Ionicons } from '@expo/vector-icons';

const Layout = ({ children, navigation, showTopBar }) => {
    const { session } = useAuth();
    const { theme } = useTheme();

    const navigateToSettings = () => {
        navigation.navigate('Settings');
    };



    return (
        <View style={theme.container}>
            {showTopBar && <TopBar navigation={navigation} />}
            <View style={theme.content}>
                {children}
            </View>
        </View>
    );
};

export default Layout;
