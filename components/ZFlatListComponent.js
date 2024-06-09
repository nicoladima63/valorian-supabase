import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, FlatList, Text, Switch, Alert, Pressable, Dimensions, ActivityIndicator } from "react-native";
import { ButtonGroup } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import AddBisogno from '../components/AddBisogno';
import Icon from 'react-native-vector-icons/FontAwesome';
import Snackbar from '../components/Snackbar';
//import { ProgressCircle } from 'react-native-svg-charts';

const numColumns = 3;
const WIDTH = Dimensions.get('window').width;

const FlatListComponent = () => {
    const [enabledStates, setEnabledStates] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [bisogni, setBisogni] = useState([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (user) {
            fetchBisogni();
        }
    }, [user]);

    useEffect(() => {
        if (bisogni.length > 0) {
            setEnabledStates(bisogni.reduce((acc, item) => ({ ...acc, [item.id]: item.enabled }), {}));
        }
        setLoading(false);
    }, [bisogni]);

    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        } catch (error) {
            console.error('Failed to fetch user data', error);
            Alert.alert('Errore', 'Errore nel recupero dei dati utente.');
            setLoading(false);
        }
    };

    const fetchBisogni = async () => {
        try {
            const { data, error } = await supabase
                .from('bisogni')
                .select('*')
                .eq('uuid', user.id);
            if (error) {
                throw error;
            }
            setBisogni(data);
        } catch (error) {
            console.error('Errore nel recupero dei bisogni', error);
            Alert.alert('Errore', 'Errore nel recupero dei bisogni.');
        }
    };

    const toggleSwitch = async (id) => {
        const newState = !enabledStates[id];
        setEnabledStates(prevStates => ({
            ...prevStates,
            [id]: newState
        }));

        try {
            const { data, error } = await supabase
                .from('bisogni')
                .update({ enabled: newState })
                .eq('id', id);

            if (error) {
                console.error('Errore durante l\'aggiornamento:', error);
                Alert.alert('Errore', 'Errore durante l\'aggiornamento');
            } else {
                console.log('Record aggiornato:', data);
            }
        } catch (error) {
            console.error('Errore durante l\'aggiornamento:', error);
            Alert.alert('Errore', 'Errore durante l\'aggiornamento');
        }
    };

    const filterData = () => {
        switch (selectedIndex) {
            case 1:
                return bisogni.filter(item => enabledStates[item.id]);
            case 2:
                return bisogni.filter(item => !enabledStates[item.id]);
            default:
                return bisogni;
        }
    };

    const handleAddNeed = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        fetchBisogni();
    };

    const onPress = async (id, nome) => {
        if (!user?.id) {
            Alert.alert('Errore', 'Utente non trovato');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('dettagli')
                .insert([{
                    bisognoid: id,
                    soddisfattoil: new Date(),
                    uuid: user.id
                }]);

            if (error) {
                console.error('Errore durante l\'aggiornamento:', error);
                Alert.alert('Errore', 'Errore durante l\'aggiornamento');
            } else {
                setSnackbarMessage(`Bisogno "${nome}" aggiornato`);
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.error('Errore durante l\'aggiornamento:', error);
            Alert.alert('Errore', 'Errore durante l\'aggiornamento');
        }
    };

    const CustomButton = ({ title, onPress }) => (
        <Pressable onPress={onPress} style={styles.button}>
            <Icon name="plus" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );

    const Item = ({ nome, isEnabled, toggleSwitch, onPress, empty }) => {
        if (empty) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View style={[styles.item, !isEnabled && styles.itemDisabled]}>
                <Pressable onPress={onPress} style={styles.topSection}>
                    {/*<ProgressCircle*/}
                    {/*    style={styles.progressCircle}*/}
                    {/*    progress={0.5}*/}
                    {/*    progressColor={'#800080'}*/}
                    {/*    startAngle={-90}*/}
                    {/*    endAngle={90}*/}
                    {/*/>*/}
                    <Text style={styles.text}>{nome}</Text>
                </Pressable>
                <View style={styles.divider} />
                <View style={styles.bottomSection}>
                    <Switch
                        onValueChange={toggleSwitch}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        value={isEnabled}
                    />
                </View>
            </View>
        );
    };

    const formatData = (bisogni, numColumns) => {
        const numberOfFullRows = Math.floor(bisogni.length / numColumns);
        let numberOfElementsLastRow = bisogni.length - (numberOfFullRows * numColumns);
        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            bisogni.push({ id: `blank-${numberOfElementsLastRow}`, nome: 'blank', empty: true });
            numberOfElementsLastRow++;
        }
        return bisogni;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#800080" />
            </View>
        );
    }

    return (
        <View style={styles.content}>
            <ButtonGroup
                buttons={['Tutti', 'Abilitati', 'Disabilitati']}
                selectedIndex={selectedIndex}
                onPress={(value) => setSelectedIndex(value)}
                containerStyle={{ marginBottom: 20 }}
                selectedButtonStyle={{ backgroundColor: '#800080' }}
                selectedTextStyle={{ color: '#fff' }}
                innerBorderStyle={{ width: 1 }}
                outerBorderStyle={{ width: 1 }}
                buttonStyle={{ backgroundColor: '#600080' }}
                buttonContainerStyle={{ backgroundColor: '#600080' }}
            />

            <FlatList
                //data={formatData(filterData(), numColumns)}
                data={filterData()}
                //numColumns={numColumns}
                renderItem={({ item }) => (
                    <Item
                        key={item.id}
                        nome={item.nome}
                        id={item.id}
                        onPress={() => onPress(item.id, item.nome)}
                        isEnabled={enabledStates[item.id]}
                        toggleSwitch={() => toggleSwitch(item.id)}
                        empty={item.empty}
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />

            <View style={styles.container}>
                <CustomButton title="Bisogno" onPress={handleAddNeed} />
            </View>

            <AddBisogno
                visible={modalVisible}
                onClose={handleModalClose}
                onAdd={fetchBisogni}
                userId={user.id}
            />
            <Snackbar
                isVisible={snackbarVisible}
                message={snackbarMessage}
                actionText="Dismiss"
                duration={2500}
                position="top"
                backgroundColor="#f3d500"
                textColor="black"
                actionTextColor="white"
                containerStyle={{ marginHorizontal: 12 }}
                messageStyle={{ alignSelf: "center" }}
                onDismiss={() => setSnackbarVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#800080',
        padding: 4,
        margin: 2,
        justifyContent: 'center',
        borderRadius: 2,
        borderColor: '#300080',
        borderWidth: 1,
        flex: 1,
        height: WIDTH / numColumns - 10,
    },
    itemInvisible: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    itemDisabled: {
        backgroundColor: 'rgba(128, 0, 128, 0.4)',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 18,
    },
    progressCircle: {
        height: 40,
        width: 40,
        marginRight: 10,
    },
    text: {
        fontSize: 18,
        color: '#ddd',
        fontWeight: '500',
    },
    button: {
        flexDirection: 'row',
        height: 50,
        width: 250,
        backgroundColor: '#800080',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    icon: {
        marginRight: 10,
    },
    topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FlatListComponent;
