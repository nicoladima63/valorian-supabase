import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Modal, Pressable, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditBisogni = ({ bisogni }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBisogno, setSelectedBisogno] = useState(null);
    const [newName, setNewName] = useState('');

    const openModal = (bisogno) => {
        setSelectedBisogno(bisogno);
        setNewName(bisogno.nome);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedBisogno(null);
        setNewName('');
        setModalVisible(false);
    };

    const saveChanges = () => {
        if (!selectedBisogno) return;

        // Esegui l'aggiornamento del nome del bisogno nel tuo database
        // Qui puoi utilizzare Supabase o qualsiasi altra API per aggiornare i dati

        Alert.alert('Successo', 'Nome del bisogno aggiornato con successo');
        closeModal();
    };

    const renderItem = ({ item }) => (
        <Pressable onPress={() => openModal(item)} style={styles.item}>
            <Text>{item.nome}</Text>
            <Icon name="edit" size={20} color="#900" />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={bisogni}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Nuovo nome del bisogno"
                        />

                        <Pressable style={[styles.button, styles.buttonSave]} onPress={saveChanges}>
                            <Text style={styles.textStyle}>Salva modifiche</Text>
                        </Pressable>

                        <Pressable style={[styles.button, styles.buttonClose]} onPress={closeModal}>
                            <Text style={styles.textStyle}>Chiudi</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 22,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 5,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    buttonSave: {
        backgroundColor: 'green',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default EditBisogni;
