import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, FlatList, Text, Switch, Button, Alert, Pressable } from "react-native";
import { ButtonGroup } from '@rneui/themed';
import { supabase } from '../lib/supabase'; // Assicurati che questa importazione sia corretta
import AddBisogno from '../components/AddBisogno';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';

const FlatListComponent = () => {
    const [enabledStates, setEnabledStates] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null); // Initialize as null
    const [bisogni, setBisogni] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        const initializeData = async () => {
            await fetchUserData();
            await fetchBisogni();
        };
        initializeData();
    }, []);

    useEffect(() => {
        if (bisogni.length > 0) {
            setEnabledStates(bisogni.reduce((acc, item) => ({ ...acc, [item.id]: item.enabled }), {}));
        }
    }, [bisogni]);

    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    const fetchBisogni = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Se l'utente non è stato recuperato correttamente, esegui le azioni appropriate
                console.error('Failed to fetch user data');
                return;
            }

            const { data, error } = await supabase
                .from('bisogni')
                .select('*')
                .eq('uuid', user.id);
            if (error) {
                throw error;
            }
            if (data) {
                setBisogni(data);
            }
        } catch (error) {
            console.error('Errore nel recupero dei bisogni', error);
            Alert.alert('Errore nel recupero dei bisogni');
        }
        console.log('bisogni', bisogni);
    };


    const toggleSwitch = async (id) => {
        const newState = !enabledStates[id];
        setEnabledStates(prevStates => ({
            ...prevStates,
            [id]: newState
        }));

        // Chiamata al database per aggiornare il valore
        try {
            const { data, error } = await supabase
                .from('bisogni')
                .update({ enabled: newState })
                .eq('id', id);

            if (error) {
                console.error('Errore durante l\'aggiornamento:', error);
                Alert.alert('Errore durante l\'aggiornamento');
            } else {
                console.log('Record aggiornato:', data);
            }
        } catch (error) {
            console.error('Errore durante l\'aggiornamento:', error);
            Alert.alert('Errore durante l\'aggiornamento');
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
        fetchBisogni(); // Refresh needs after adding a new one
    };

    const CustomButton = ({ title, onPress }) => (
        <Pressable onPress={onPress} style={theme.customButton}>
            <Icon name="plus" size={20} color="#fff" style={theme.customButtonIcon} />
            <Text style={theme.customButtonText} >{title}</Text>
        </Pressable>
    );

    const getInitial = (text) => {
        return text ? text.charAt(0).toUpperCase() : '';
    };

    const Item = ({ nome, isEnabled, toggleSwitch }) => (
        <View style={theme.item}>
            <View style={theme.itemAvatar}>
                <Text style={theme.itemAvatarText}>{getInitial(nome)}</Text>
            </View>
            <Text style={theme.itemText}>{nome}</Text>
            <Switch
                style={theme.switch}
                trackColor={{ false: '#fff', true: '#fff' }}
                thumbColor={isEnabled ? '#007BFF' : '#767577'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    );

    if (!user) {
        return <View><Text>Loading...</Text></View>; // Show a loading indicator while fetching user data
    }

    return (
        <View style={theme.container}>
            <ButtonGroup
                buttons={['Tutti', 'Abilitati', 'Disabilitati']}
                selectedIndex={selectedIndex}
                onPress={(value) => setSelectedIndex(value)}
                containerStyle={theme.buttonGroup.containerStyle}
                selectedButtonStyle={theme.buttonGroup.selectedButtonStyle}
                textStyle={theme.buttonGroup.textStyle}
            />
            <FlatList
                data={filterData()}
                renderItem={({ item }) =>
                    <Item
                        key={item.id}
                        nome={item.nome}
                        isEnabled={enabledStates[item.id]}
                        toggleSwitch={() => toggleSwitch(item.id)}
                    />}
                keyExtractor={item => item.id}
            />

            <CustomButton title="Bisogno" onPress={handleAddNeed} />

            <AddBisogno
                visible={modalVisible}
                onClose={handleModalClose}
                onAdd={fetchBisogni}
                userId={user.id}
            />

        </View>
    );
};

export default FlatListComponent;
