import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import { View, Text, FlatList } from 'react-native';
import Layout from './Layout';
import FlatListComponent from '../components/FlatListComponent';
import FAButton from "../components/FAButton";

const HomeScreen = ({ route, navigation }) => {
    const { theme } = useTheme();
    const { session } = useAuth(); // Accedi ai dati della sessione
    const flatListRef = useRef(null);

    if (!session) {
        return <Text>Loading session data...</Text>; // O qualsiasi UI di caricamento
    }
    const displayAlert = () => {
        alert("Welcome to GeeksforGeeks");
    }; 

    return (
        <Layout navigation={navigation} showTopBar={true}>
            <FAButton
                onPress={() => flatListRef.current.handleAddNeed()}
                title=""
                icon="plus" />
            <View style={{ backgroundColor: theme.colors.background }}>
                <FlatListComponent
                    navigation={navigation}
                    session={session}
                    ref={flatListRef} />
            </View>
        </Layout>
    );
}

export default HomeScreen;
