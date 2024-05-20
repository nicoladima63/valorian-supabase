// screens/HomePage.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import AddBisogno from '../components/AddBisogno';

const HomePage = ({ navigation }) => {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [bisogni, setBisogni] = useState([]);
    const [selectedBisogno, setSelectedBisogno] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [user, setUser] = useState(null)
    useEffect(() => {
        fetchUserData();
        fetchBisogni();
    }, []);

    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        console.log("user", user)
        setUser(user)
        //const user = supabase.auth.user();
    //    if (user) {
    //        const { data, error } = await supabase
    //            .from('profiles')
    //            .select('avatar_url')
    //            .eq('id', user.id)
    //            .single();
    //        if (data) {
    //            setAvatarUrl(data.avatar_url);
    //        }
    //    }
    };

    const fetchBisogni = async () => {
        const { data, error } = await supabase
            .from('bisogni')
            .select('*');
        if (data) {
            setBisogni(data);
        }
    };

    const handleAddNeed = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        fetchBisogni(); // Refresh needs after adding a new one
    };

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Valorian</Text>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <Image
                                source={{ uri: avatarUrl }}
                                style={styles.avatar}
                                onPress={() => setMenuVisible(true)}
                            />
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('Profile');
                            }}
                            title="Profilo"
                        />
                        <Menu.Item
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('Settings');
                            }}
                            title="Impostazioni"
                        />
                    </Menu>
                </View>
                <View style={styles.content}>

                    {bisogni.map((bisogno) => (
                        <Text key={bisogno.id} label={bisogno.name} value={bisogno.id} />
                    ))}

                    <Button title="Aggiungi Bisogno" onPress={handleAddNeed} />
                </View>
                <AddBisogno
                    visible={modalVisible}
                    onClose={handleModalClose}
                    onAdd={fetchBisogni}
                    userId={user.id}
                />
            </View>
        </Provider>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
});
