import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { supabase } from "../lib/supabase"; // Import Supabase client
import { useTheme } from '../context/ThemeContext';

import Layout from './Layout';
import Avatar from "./Avatar";
import {
    StyleSheet,
    View,
    Alert, Button,
    Text, ActivityIndicator, TextInput
} from "react-native";

export default function AccountScreen() {
    const navigation = useNavigation();
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(true); // Loading state
    const { theme } = useTheme();

    const [username, setUsername] = useState(""); // Username state
    const [website, setWebsite] = useState(""); // Website state
    const [avatarUrl, setAvatarUrl] = useState(""); // Avatar URL state

    useEffect(() => {
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error getting session:", error);
                return;
            }
            setSession(session);
            if (session && session.user) {
                fetchUser(session.user.id);
            }
        };
        getSession();
    }, []);

    const fetchUser = async (userId) => {
        try {
            setLoading(true);
            const { data, error, status } = await supabase
                .from("profiles")
                .select(`username, website, avatar_url`)
                .eq("id", userId)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUser(data);
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async ({ username, website, avatar_url }) => {
        try {
            setLoading(true);
            const updates = {
                id: user?.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            };

            const { error } = await supabase.from("profiles").upsert(updates);

            if (error) {
                throw error;
            }

            Alert.alert("Profile updated successfully!");
        } catch (error) {
            Alert.alert("Error updating profile:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <View style={theme.container}>
                    <Text style={{ color: 'red', textAlign: 'center' }}>Loading...</Text>
                    <ActivityIndicator size="large" />
                </View>
            ) : (

                <View style={theme.container}>

                    <Text style={{
                        color: theme.colors.text,
                        fontSize: 18,
                        fontWeight: '600',
                        marginBottom: 16,
                            marginTop: 16,
                        alignSelf: 'center',
                    }}>
                        Bentornato, {username}
                    </Text>

                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <TextInput
                            label="Email"
                            value={session?.user?.email}
                            editable={false}
                            style={styles.input}
                        />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <TextInput
                            style={styles.input}
                            label="Username"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                        />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <TextInput
                            style={styles.input}
                            label="Website"
                            value={website}
                            onChangeText={(text) => setWebsite(text)}
                        />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <Avatar
                            size={80}
                            url={avatarUrl}
                            onUpload={(url) => {
                                setAvatarUrl(url);
                                updateProfile({ username, website, avatar_url: url });
                            }}
                        />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <Button
                            onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
                            title={loading ? "Loading ..." : "Update"}
                        />
                        <Button
                            onPress={async () => {
                                await supabase.auth.signOut();
                                navigation.replace('Login'); // Naviga verso la schermata di accesso dopo il logout
                            }}
                            title="Esci"
                        />
                    </View>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
        color: "#000",
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
});
