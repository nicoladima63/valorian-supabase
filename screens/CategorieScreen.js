import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import * as Controller from '../controllers/categorieController';

import { View, Text, FlatList, Button, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Layout from './Layout';
import FAButton from "../components/FAButton";
import ElevatedView from 'react-native-elevated-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CategorieScreen = ({ route, navigation }) => {
    const { theme } = useTheme();
    const [categorie, setCategorie] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [nome, setNome] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [colore, setColore] = useState('');
    const [categoriaDaEliminare, setCategoriaDaEliminare] = useState(null);

    useEffect(() => {
        loadCategorie();
    }, []);

    const loadCategorie = async () => {
        try {
            const data = await Controller.getCategorie();
            setCategorie(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategoria = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        // Pulisci i campi del form quando si chiude la modal
        setNome('');
        setDescrizione('');
        setColore('');
    };

    const handleSaveCategoria = async () => {
        try {
            await Controller.createCategoria({ nome, descrizione, colore });
            // Aggiorna la lista delle categorie
            loadCategorie();
            // Chiudi la modal
            handleCloseModal();
        } catch (error) {
            console.error('Error creating categoria:', error);
        }
    };

    const handleDeleteCategoria = async () => {
        try {
            await Controller.deleteCategoria(categoriaDaEliminare.id);
            // Aggiorna la lista delle categorie
            loadCategorie();
            // Nascondi la modal di conferma cancellazione
            setCategoriaDaEliminare(null);
        } catch (error) {
            console.error('Error deleting categoria:', error);
        }
    };

    const renderCategoriaItem = ({ item }) => (
        <ElevatedView elevation={4} style={theme.stayElevated}>
            <View style={theme.content}>
                <Text style={theme.title}>{item.nome}</Text>
                <Text style={theme.paragrafo}>{item.descrizione}</Text>
                <TouchableOpacity onPress={() => setCategoriaDaEliminare(item)}>
                    <Ionicons name="trash-bin" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </ElevatedView>
    );

    return (
        <Layout navigation={navigation} showTopBar={false}>
            <FAButton onPress={handleAddCategoria} icon="plus" />
            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Aggiungi Categoria</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Descrizione"
                        value={descrizione}
                        onChangeText={setDescrizione}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Colore"
                        value={colore}
                        onChangeText={setColore}
                    />
                    <Button title="Salva" onPress={handleSaveCategoria} />
                    <Button title="Annulla" onPress={handleCloseModal} />
                </View>
            </Modal>
            <Modal visible={!!categoriaDaEliminare} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Conferma Cancellazione</Text>
                    <Text>Sei sicuro di voler cancellare questa categoria?</Text>
                    <View style={styles.modalButtonContainer}>
                        <Button title="Annulla" onPress={() => setCategoriaDaEliminare(null)} />
                        <Button title="Conferma" onPress={handleDeleteCategoria} />
                    </View>
                </View>
            </Modal>
            <View style={{ backgroundColor: theme.colors.background }}>
                <FlatList
                    data={categorie}
                    renderItem={renderCategoriaItem}
                />
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
});

export default CategorieScreen;
