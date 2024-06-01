import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Assicurati che questa importazione sia corretta
import { View, Text, StyleSheet, Pressable, Alert, FlatList, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AddBisogno from '../components/AddBisogno';
import Icon from 'react-native-vector-icons/FontAwesome';
import Snackbar from '../components/Snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import { StatusBar } from 'expo-status-bar';
import { useRoute } from '@react-navigation/native'; // Importa useRoute da React Navigation
import { useTheme } from '../context/ThemeContext';
import Layout from './Layout';


const HomeTest = ({ isTestPhase, navigation }) => {
    const { theme } = useTheme();
    const [bisogni, setBisogni] = useState([]);
    const [user, setUser] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const route = useRoute();

    useEffect(() => {
        fetchUserData();
        fetchBisogni();
    }, []);


    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            console.log('User data fetched:', user.id);
        } catch (error) {
            console.error('test 33 Failed to fetch user data', error);
        }
    };
    const fetchBisogni = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('bisogni')
                .select('*');
            if (error) {
                throw error;
            }
            if (data) {
                setBisogni(data);
                console.log(JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.error('Errore nel recupero dei bisogni', error);
            Alert.alert('Errore nel recupero dei bisogni');
        }
        setLoading(false);
    };
    const onPress = async (id, nome) => {
        setLoading(true);

        if (!user.id) {
            Alert.alert('Errore', 'Utente non trovato');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('dettagli')
                .insert([{
                    bisognoid: id,
                    soddisfattoil: new Date(),
                    uuid: user.id // Assicurati di avere l'id dell'utente
                }]);

            if (error) {
                console.error('Errore durante l\'aggiornamento:', error);
                Alert.alert('Errore durante l\'aggiornamento');
            } else {
                console.log('Record aggiornato:', data);
                setSnackbarMessage(`Bisogno "${nome}" aggiornato`);
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.error('Errore durante l\'aggiornamento:', error);
            Alert.alert('Errore durante l\'aggiornamento');
        }
        setLoading(false);
    };
    const handleAddNeed = () => {
        setModalVisible(true);
    };
    const handleModalClose = () => {
        setModalVisible(false);
        fetchBisogni(); // Refresh needs after adding a new one
    };
    const getInitial = (text) => {
        return text ? text.charAt(0).toUpperCase() : '';
    };
    const onDelete = async (id) => {
        setLoading(true);
        if (!user.id) {
            Alert.alert('Errore', 'Utente non trovato');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('bisogni')
                .delete()
                .eq('id', id);
            if (error) {
                throw error;
            }
            setBisogni(bisogni.filter(bisogno => bisogno.id !== id));
            setSnackbarMessage('Bisogno eliminato');
            setSnackbarVisible(true);
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
            Alert.alert('Errore durante l\'eliminazione');
        }
        setLoading(false);
    };
    const CustomButton = ({ title, onPress }) => (
        <Pressable onPress={onPress} style={styles.button}>
            <Icon name="plus" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
    const Item = ({ nome, onPress, onDelete }) => (
        <View style={theme.item}>
            <Pressable onPress={onPress} style={styles.container}>
                <View style={theme.itemAvatar}>
                    <Text style={theme.itemAvatarText}>{getInitial(nome)}</Text>
                </View>
                <Text style={theme.itemText}>{nome}</Text>
            </Pressable>
            <Pressable onPress={onDelete} style={styles.deleteButton}>
                <Icon name="trash" size={24} color="red" />
            </Pressable>
        </View>
    );

    return (
        <Layout navigation={navigation}>
            <PaperProvider>
                {isTestPhase && <Text>This is the test phase</Text>}
                <StatusBar style="auto" />
                <View style={theme.container}>
                <Text style={theme.subHeader}>Clicca sul bisogno quando lo soddisfi</Text>
                <Spinner
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <FlatList
                    data={bisogni}
                    renderItem={({ item }) =>
                        <Item
                            key={item.id}
                            nome={item.nome}
                            onPress={() => onPress(item.id, item.nome)}
                            onDelete={() => onDelete(item.id)}
                        />}
                    keyExtractor={item => item.id.toString()} // Assicurati che sia una stringa
                />
                <Snackbar
                    isVisible={snackbarVisible}
                    message={snackbarMessage}
                    actionText=""
                    duration={2500}
                    position="bottom"
                    backgroundColor="#1e1e1e"
                    textColor="white"
                    actionTextColor="white"
                    containerStyle={{ marginHorizontal: 12 }}
                    messageStyle={{ textAlign: "center" }}
                    actionTextStyle={{}}
                    onDismiss={() => setSnackbarVisible(false)}
                />
                <CustomButton title="Bisogno" onPress={handleAddNeed} />
            </View>

            <AddBisogno
                visible={modalVisible}
                onClose={handleModalClose}
                onAdd={fetchBisogni}
                userId={user.id}
                isTestPhase={isTestPhase}
            />
        </PaperProvider>
        </Layout>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 10,
        backgroundColor: '#101010',
    },
    subHeader: {
        backgroundColor: "#101010",
        color: "#dedede",
        textAlign: "center",
        padding: 12,
        marginBottom: 10,
        height: 46,
        fontSize: 16,
        width: "100%",
    },
    button: {
        flexDirection: 'row',
        height: 40,
        width: '70%',
        backgroundColor: '#d42fc275',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        alignSelf: 'center',
        marginHorizontal: 16,
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    icon: {
        marginRight: 30,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#252525',
        height: 65,
        borderColor: '#303030',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,

    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3b3b3b',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        fontSize: 20,
        color: '#dedede',
    },
    text: {
        flex: 1,
        fontSize: 16,
        color: '#dadada',
        fontWeight: '500',
    },
    deleteButton: {
        padding: 10,
    },
});
export default HomeTest;
