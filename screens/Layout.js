import React from 'react';
import { View,  StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TopBar from '../components/TopBar';
import { useTheme } from '../context/ThemeContext';
import {
    SafeAreaView, LayoutView
} from '../styledComponents';
const Layout = ({ children, navigation, showTopBar = true }) => {
    const { theme } = useTheme();

    return (
        <SafeAreaView >
            <StatusBar barStyle={theme.statusBarStyle} />
            {showTopBar && <TopBar navigation={navigation} />}
            <LayoutView>
                {children}
            </LayoutView>
        </SafeAreaView>
    );
};

export default Layout;
