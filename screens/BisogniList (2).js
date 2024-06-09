import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { useTheme } from '../context/ThemeContext';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getBisogni, deleteBisogno, toggleBisogno } from '../controllers/bisogniController';
import { getDettagli, createDettaglio, deleteDettaglio } from '../controllers/dettagliController';

const BisogniList = ({ navigation}) => {
    const [bisogni, setBisogni] = useState([]);
    const [selectedBisogno, setSelectedBisogno] = useState(null);
    const [dettagli, setDettagli] = useState([]);
    const { theme } = useTheme();

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

    const renderBisognoItem = ({ item }) => (
        <View style={theme.item}>
            <Text style={styles.bisognoText}>{item.nome}</Text>
            <Text style={styles.bisognoValues}>[{item.importanza}, {item.tolleranza}]</Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => toggleBisognoHandler(item.id, item.enabled)}>
                    <Icon name={item.enabled ? "toggle-on" : "toggle-off"} size={30} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteBisognoHandler(item.id)}>
                    <Icon name="trash" size={30} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedBisogno(item)}>
                    <Icon name="info-circle" size={30} color="green" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Layout navigation={navigation}>
        <View>
            <FlatList
                data={bisogni}
                renderItem={renderBisognoItem}
                keyExtractor={item => item.id.toString()}
            />
            {selectedBisogno && (
                <View>
                    <Text>Dettagli di {selectedBisogno.nome}</Text>
                    <FlatList
                        data={dettagli}
                        renderItem={({ item }) => (
                            <View style={styles.dettaglioContainer}>
                                <Text>{item.soddisfattoil}</Text>
                                <Button title="Elimina Dettaglio" onPress={() => deleteDettaglio(item.id)} />
                            </View>
                        )}
                        keyExtractor={item => item.id.toString()}
                    />
                    <Button title="Aggiungi Dettaglio" onPress={() => createDettaglio({ bisognoid: selectedBisogno.id, soddisfattoil: new Date() })} />
                </View>
            )}
        </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    bisognoContainer: {
        flex:1,
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    dettaglioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
});

export default BisogniList;
