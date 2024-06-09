import React, { useEffect, useState } from 'react';

import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Layout from './Layout';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getBisogni, deleteBisogno, toggleBisogno } from '../controllers/bisogniController';
import { getDettagli, createDettaglio, deleteDettaglio } from '../controllers/dettagliController';
import EditBisogno from '../components/EditBisogno'; // Importa il modal per la modifica del bisogno

const BisogniList = ({ navigation }) => {
    const [bisogni, setBisogni] = useState([]);
    const [selectedBisogno, setSelectedBisogno] = useState(null);
    const [dettagli, setDettagli] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false); // Stato per la visibilità del modal


    useEffect(() => {
        const loadBisogni = async () => {
            try {
                const data = await getBisogni();
                setBisogni(data);
            } catch (error) {
                console.error(error);
            }
        };
        loadBisogni();
    }, []);

    useEffect(() => {
        if (selectedBisogno) {
            const loadDettagli = async () => {
                try {
                    const data = await getDettagli(selectedBisogno.id);
                    setDettagli(data);
                } catch (error) {
                    console.error(error);
                }
            };
            loadDettagli();
        }
    }, [selectedBisogno]);

    const toggleBisognoHandler = async (id, enabled) => {
        try {
            await toggleBisogno(id, enabled);
            const updatedBisogni = bisogni.map(bisogno => {
                if (bisogno.id === id) {
                    return { ...bisogno, enabled: !enabled };
                }
                return bisogno;
            });
            setBisogni(updatedBisogni);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteBisognoHandler = async (id) => {
        try {
            await deleteBisogno(id);
            const updatedBisogni = bisogni.filter(bisogno => bisogno.id !== id);
            setBisogni(updatedBisogni);
        } catch (error) {
            console.error(error);
        }
    };

    // Funzione per aprire il modal di modifica del bisogno
    const openEditModal = (bisogno) => {
        setSelectedBisogno(bisogno);
        setIsModalVisible(true);
    };

    // Funzione per gestire il salvataggio dei dati nel modal
    const handleSave = (updatedBisogno) => {
        // Aggiorna il bisogno nel tuo array di bisogni o effettua qualsiasi altra azione necessaria
        // Qui puoi aggiornare il bisogno nel tuo array di bisogni utilizzando setBisogni([...]);
        setIsModalVisible(false);
    };

    return (
        <Layout navigation={navigation} showTopBar={true}>
        <View>
            <FlatList
                data={bisogni}
                renderItem={({ item }) => (
                    <View style={styles.bisognoContainer}>
                        <Text style={styles.bisognoText}>{item.nome}</Text>
                        <Text style={styles.bisognoValues}>[{item.importanza}, {item.tolleranza}]</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => toggleBisognoHandler(item.id, item.enabled)}>
                                <Icon name={item.enabled ? "toggle-on" : "toggle-off"} size={30} color="blue" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteBisognoHandler(item.id)}>
                                <Icon name="trash" size={30} color="red" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openEditModal(item)}>
                                <Icon name="info-circle" size={30} color="green" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <EditBisogno
                    bisogno={selectedBisogno}
                    onSave={handleSave}
                    onClose={() => setIsModalVisible(false)}
                />
            </Modal>
        </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    bisognoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    bisognoText: {
        flex: 2,
    },
    bisognoValues: {
        flex: 1,
        textAlign: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
});

export default BisogniList;
