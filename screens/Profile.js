import React from 'react';
import { View, Text } from 'react-native';
import Layout from './Layout';

const ProfilePage = ({ navigation }) => {
    return (
        <Layout navigation={navigation} showTopBar={false}>
            <View style={{ flex: 1 }}>
                <Text>Profile Page Content</Text>
            </View>
        </Layout>
    );
};

export default ProfilePage;
