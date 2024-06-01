import React from 'react';
import Layout from './Layout';

import { View, Text, ScrollView } from 'react-native';
import FlatListComponent from '../components/FlatListComponent';

const HomePage = ({ navigation }) => {

    return (
        <Layout navigation={navigation}>
            <View style={{ flex: 1 }}>
            <FlatListComponent/>
            </View>
        </Layout>
    );
};

export default HomePage;
