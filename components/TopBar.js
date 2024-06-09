import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

import { TouchableOpacity, View, Text } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { useNavigationState } from '@react-navigation/native';

const TopBar = ({ navigation }) => {
    const { toggleTheme, theme } = useTheme();
    const routeName = useNavigationState(state => state.routes[state.index].name);
    const { session } = useAuth();
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            fetchProfile();
        }
    }, [session]);

    useEffect(() => {
        if (avatarUrl) {
            downloadImage(avatarUrl);
        }
    }, [avatarUrl]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('avatar_url')
                .eq('id', session.user.id)
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            //console.error('TopBar Error fetching profile:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = async (path) => {
        try {
            //console.log('Downloading image from path:', path);
            const { data, error } = await supabase.storage
                .from('avatars')
                .download(path);

            if (error) {
                throw error;
            }

            if (!data) {
                //console.error('TopBar Error downloading image: Data is null');
                return;
            }

            const fr = new FileReader();
            fr.onload = () => {
                setAvatarUrl(fr.result);
                //console.log('Image successfully read:', fr.result);
            };
            fr.onerror = (err) => {
                //console.error('TopBar Error reading file:', err);
            };
            fr.readAsDataURL(data);
        } catch (error) {
            //console.error('TopBar Error downloading image:', error.message);
        }
    };

    return (
        <View style={theme.topBarContainer}>

            <Text style={theme.title}>{routeName}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                <Avatar
                    rounded
                    source={avatarUrl ? { uri: avatarUrl } : require('../assets/icon.png')}
                    size="small"
                />
            </TouchableOpacity>
        </View>
    );
};

export default TopBar;
