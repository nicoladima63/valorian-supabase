import React from 'react';
import Layout from './Layout';
import { View, Text } from 'react-native';
import FlatListComponent from '../components/FlatListComponent';
import { useAuth } from '../context/AuthContext';
const HomePage = ({ navigation }) => {
    const { session } = useAuth(); // Accedi ai dati della sessione

    if (!session) {
        return <Text>Loading session data...</Text>; // O qualsiasi UI di caricamento
    }

    return (
        <Layout navigation={navigation}>
            <FlatListComponent session={session} />
        </Layout>
    );
};

export default HomePage;
