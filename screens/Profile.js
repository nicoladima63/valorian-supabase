// screens/Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { supabase } from '../supabase';
import * as ImagePicker from 'expo-image-picker';

const Profile = ({ navigation }) => {
    const [profileData, setProfileData] = useState({ username: '', avatar_url: '' });
    const [newAvatar, setNewAvatar] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        const user = supabase.auth.user();
        if (user) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error) {
                console.log('Error fetching profile data:', error);
            } else if (data) {
                setProfileData(data);
            }
        }
    };

    const handleSave = async () => {
        const user = supabase.auth.user();
        if (user) {
            const updates = {
                id: user.id,
                username: profileData.username,
                avatar_url: profileData.avatar_url,
                updated_at: new Date(),
            };
            const { data, error } = await supabase
                .from('profiles')
                .upsert(updates, { returning: 'minimal' });
            if (error) {
                console.log('Error updating profile data:', error);
            } else {
                navigation.goBack();
            }
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            const { uri } = result;
            setNewAvatar(uri);

            const response = await fetch(uri);
            const blob = await response.blob();

            const { data, error } = await supabase
                .storage
                .from('avatars')
                .upload(`public/${supabase.auth.user().id}`, blob, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (error) {
                console.log('Error uploading avatar:', error);
            } else {
                const publicURL = supabase
                    .storage
                    .from('avatars')
                    .getPublicUrl(data.Key).publicURL;
                setProfileData({ ...profileData, avatar_url: publicURL });
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profilo</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={profileData.username}
                onChangeText={(text) => setProfileData({ ...profileData, username: text })}
            />
            <Button title="Scegli Avatar" onPress={pickImage} />
            {newAvatar && (
                <Image source={{ uri: newAvatar }} style={styles.avatar} />
            )}
            <Button title="Salva" onPress={handleSave} />
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 10,
    },
});
