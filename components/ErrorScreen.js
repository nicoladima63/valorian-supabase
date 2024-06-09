import React from 'react';
import { Text, View } from 'react-native';

const ErrorScreen = ({ message }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red', marginTop: 100 }}>
                ERRORE: {message}
            </Text>
        </View>
    );
};

export default ErrorScreen;