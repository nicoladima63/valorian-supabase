// InitialSetup.js
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';
export const InitialSetup = ({ children }) => {
    const [initialRoute, setInitialRoute] = useState(null);
    const [isTestPhase, setIsTestPhase] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
                if (isFirstLaunch === null) {
                    await AsyncStorage.setItem('isFirstLaunch', 'false');
                    setInitialRoute('Welcome');
                } else {
                    await fetchConfig();
                }
            } catch (error) {
                console.error('Error accessing AsyncStorage:', error);
            }
        };

        const fetchConfig = async () => {
            try {
                let { data, error } = await supabase
                    .from('config')
                    .select('value')
                    .eq('key', 'isTestPhase')
                    .single();
                console.log('data:', data);
                if (!error && data !== null) {
                    setIsTestPhase(data.value);
                } else {
                    console.error('Error fetching config:', error);
                }
            } catch (error) {
                console.error('Error fetching config from Supabase:', error);
            }
        };

        const determineInitialRoute = async () => {
            await checkFirstLaunch();
            setLoading(false);
        };

        determineInitialRoute();
    }, []);

    useEffect(() => {
        if (isTestPhase !== null && initialRoute !== 'Welcome') {
            setInitialRoute(isTestPhase ? 'Test' : 'Home');
            console.log('isTestPhase:', isTestPhase);
        }
    }, [isTestPhase]);

    return loading ? null : children;
};


// Tabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage';
import Settings from '../screens/Settings';
import Profile from '../screens/Profile';
import Calendar from '../screens/Calendario';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'ios-home' : 'ios-home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'ios-settings' : 'ios-settings-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'ios-person' : 'ios-person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#d42fc2',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { backgroundColor: '#181d23', height: 55, borderTopColor: '#2b3038' },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomePage}
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="home" color={color} />,
                    tabBarLabelStyle: { marginBottom: 8 }
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarLabel: 'Impostazioni',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="cog" color={color} />,
                    tabBarLabelStyle: { marginBottom: 8 }
                }}
            />
            <Tab.Screen
                name="Calendario"
                component={Calendar}
                options={{
                    tabBarLabel: 'Calendario',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="calendar" color={color} />,
                    tabBarLabelStyle: { marginBottom: 8 }
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Profilo',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="user" color={color} />,
                    tabBarLabelStyle: { marginBottom: 8 }
                }}
            />
        </Tab.Navigator>
    );
};




import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Input } from '@rneui/themed';
import Avatar from './Avatar';
import Layout from './Layout';

export default function Account({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        // Controlla se la sessione è stata stabilita correttamente
        const checkSession = async () => {
            try {
                setLoading(true);
                const userSession = supabase.auth.session();
                if (userSession) {
                    // Ottieni le informazioni dell'utente dalla sessione
                    const { user } = userSession;
                    if (user) {
                        // Eseguire le operazioni necessarie per ottenere i dati dell'utente
                        // ad esempio, ottenere il profilo dell'utente dal database
                        await getProfile(user.id);
                    } else {
                        throw new Error('User not found in session');
                    }
                } else {
                    throw new Error('No active session found');
                }
            } catch (error) {
                Alert.alert('Errore durante il recupero dei dati dell\'utente:', error.message);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // Funzione per ottenere i dati del profilo dell'utente
    async function getProfile(userId) {
        // Esegui le operazioni necessarie per ottenere i dati del profilo dell'utente
        // ad esempio, fare una query al database per ottenere il profilo dell'utente
        // e aggiornare lo stato del componente con i dati ottenuti
    }

    return (
        <Layout navigation={navigation}>
            <View style={styles.container}>
                {/* Aggiungi qui il codice per mostrare le informazioni dell'utente */}
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
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



<Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
    }}>
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
        </View>
    </View>
</Modal>











        SafeAreaView style={styles.container}>
        
        <Image source={logo} style={styles.image} resizeMode='contain' />
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='EMAIL OR USERNAME' value={username} onChangeText={setUsername} autoCorrect={false}
        autoCapitalize='none' />
            <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
        </View>
        <View style={styles.rememberView}>
            <View style={styles.switch}>
                <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
                <Text style={styles.rememberText}>Remember Me</Text>
            </View>
            <View>
                <Pressable onPress={() => Alert.alert("Forget Password!")}>
                    <Text style={styles.forgetText}>Forgot Password?</Text>
                </Pressable>
            </View>
        </View>

        <View style={styles.buttonView}>
            <Pressable style={styles.button} onPress={() => Alert.alert("Login Successfuly!","see you in my instagram if you have questions : must_ait6")}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </Pressable>
            <Text style={styles.optionsText}>OR LOGIN WITH</Text>
        </View>
        
        <View style={styles.mediaIcons}>
                <Image source={facebook} style={styles.icons}   />
                <Image source={tiktok} style={styles.icons}  />
                <Image source={linkedin} style={styles.icons}  />
        </View>

        <Text style={styles.footerText}>Don't Have Account?<Text style={styles.signup}>  Sign Up</Text></Text>

        
    </SafeAreaView>