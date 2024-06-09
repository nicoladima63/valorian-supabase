import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert, Image, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';

export default function Avatar({ url, size = 150, onUpload }) {
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const avatarSize = { height: size, width: size };
    const { theme } = useTheme();

    useEffect(() => {
        if (url) {
            downloadImage(url);
        }
    }, [url]);

    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path);

            if (error) {
                throw error;
            }

            const fr = new FileReader();
            fr.readAsDataURL(data);
            fr.onload = () => {
                setAvatarUrl(fr.result);
            };
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error downloading image: ', error.message);
            }
        }
    }

    async function uploadAvatar() {
        try {
            setUploading(true);

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: false,
                allowsEditing: true,
                quality: 1,
                exif: false,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                console.log('User cancelled image picker.');
                return;
            }

            const image = result.assets[0];

            if (!image.uri) {
                throw new Error('No image uri!');
            }

            const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

            const fileExt = image.uri.split('.').pop().toLowerCase() ?? 'jpeg';
            const path = `${Date.now()}.${fileExt}`;
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(path, arraybuffer, {
                    contentType: image.mimeType ?? 'image/jpeg',
                });

            if (uploadError) {
                throw uploadError;
            }

            onUpload(data.path);
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            } else {
                throw error;
            }
        } finally {
            setUploading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={theme.avatarContainer}>
                {avatarUrl ? (
                    <Image
                        source={{ uri: avatarUrl }}
                        accessibilityLabel="Avatar"
                        style={[avatarSize, styles.avatar, styles.image]}
                    />
                ) : (
                    <View style={[avatarSize, styles.avatar, styles.noImage]} />
                )}
            </View>
            <View>
                <Button
                    onPress={uploadAvatar}
                    disabled={uploading}
                    title={uploading ? "Uploading..." : "Upload"}
                    color={theme.colors.primary}
                    accessibilityLabel="Upload your avatar image"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        borderRadius: 5,
        overflow: 'hidden',
        maxWidth: '100%',
    },
    image: {
        objectFit: 'cover',
        borderRadius: 100,
    },
    noImage: {
        backgroundColor: '#333',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgb(200, 200, 200)',
        borderRadius: 50,
    },
});
