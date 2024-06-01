import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { supabase } from "../lib/supabase"; // Import Supabase client
import Layout from './Layout';
import Avatar from "./Avatar";
import {
    StyleSheet,
    View,
    Alert,
    Text, ActivityIndicator
} from "react-native";
import { Input } from '@rneui/themed';
import {
    ButtonContainerSE,
    Button, Title16
} from '../styledComponents';
import { buttonColors } from '../constants/buttonColors';

export default function Account() {
    const navigation = useNavigation();
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(true); // Loading state

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
        <Layout navigation={navigation}>
            {loading ? (
                <View style={styles.container}>
                    <Text style={{ color: 'red', textAlign: 'center' }}>Loading...</Text>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <Text>{user?.email}</Text>
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            label="Username"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            label="Website"
                            value={website}
                            onChangeText={(text) => setWebsite(text)}
                        />
                    </View>
                    <View>
                        <Avatar size={100} url={avatarUrl} onUpload={(url) => {
                            setAvatarUrl(url);
                            updateProfile({ username, website, avatar_url: url });
                        }} />
                    </View>
                    <ButtonContainerSE>
                            <Button bgColor='primary' onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}>
                            <Title16>{loading ? "Loading ..." : "Update"}</Title16>
                        </Button>
                        <Button bgColor='danger' onPress={() => supabase.auth.signOut()} >
                            <Title16>Esci</Title16>
                        </Button>
                    </ButtonContainerSE>
                </View>
            )}
        </Layout>
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
});
