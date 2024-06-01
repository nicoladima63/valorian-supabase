// components/Background.js
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const Background = ({ children }) => {
    return (
        <ImageBackground
            source={require('../assets/images/splash.png')} // Sostituisci con il percorso dell'immagine del tuo splash screen
            style={styles.background}
        >
            <View style={styles.overlay}>
                {children}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Opzionale: puoi aggiungere un overlay per migliorare la leggibilità del testo
    },
});

export default Background;
