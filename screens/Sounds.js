import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Layout from './Layout';
import { useTheme } from '../context/ThemeContext';
const Sounds = ({ navigation }) => {


    return (
        <Layout navigation={navigation}>
            <View style={styles.container}>
                <Text style={styles.title}>Sounds</Text>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default Sounds;
