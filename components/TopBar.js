import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StatusBar } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useTheme } from '../context/ThemeContext';
import { useNavigationState } from '@react-navigation/native';
import { supabase } from '../lib/supabase'; // Importa il client Supabase
import {
    TopBarContainer,
    TopBarTitle,
    TopBarAvatarContainer,
    TopBarIcon,
} from '../styledComponents';

const TopBar = ({ navigation }) => {
    const { toggleTheme, theme } = useTheme();
    const routeName = useNavigationState(state => state.routes[state.index].name);
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        fetchProfile();
        if (avatarUrl) downloadImage(avatarUrl)

    }, [avatarUrl]);

    const fetchProfile = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        try {
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
            console.error('Error fetching profile:', error.message);
        }
    };

    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)

            if (error) {
                throw error
            }

            const fr = new FileReader()
            fr.readAsDataURL(data)
            fr.onload = () => {
                setAvatarUrl(fr.result)
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error downloading image: ', error.message)
            }
        }
    }

    return (
        <TopBarContainer>
            <StatusBar barStyle={theme.statusBarStyle} />
            <TopBarAvatarContainer onPress={() => navigation.navigate('Profile')}>
                {avatarUrl ? (
                    <Avatar
                        rounded
                        source={{ uri: avatarUrl }}
                        size="small"
                    />
                ) : (
                    <Avatar
                        rounded
                        source={require('../assets/icon.png')} // Immagine predefinita nel caso in cui non ci sia un avatar caricato
                        size="small"
                    />
                )}
            </TopBarAvatarContainer>
            <TopBarTitle>{routeName}</TopBarTitle>
            <TouchableOpacity onPress={toggleTheme}>
                <TopBarIcon name='refresh' type='font-awesome' />
            </TouchableOpacity>
        </TopBarContainer>
    );
};

export default TopBar;
