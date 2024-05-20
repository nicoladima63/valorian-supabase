// components/AddBisogno.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';
import { supabase } from '../lib/supabase'

const AddBisogno = ({ visible, onClose, onAdd, userId }) => {
    const [nome, setNome] = useState('');
    const [importanza, setImportanza] = useState('');
    const [tolleranza, setTolleranza] = useState('');

    const handleSubmit = async () => {
        console.log('aggiungo bisogno',nome,importanza,tolleranza,userId);
        if (nome && importanza && tolleranza && userId) {
            const { data, error } = await supabase
                .from('bisogni')
                .insert([{
                    nome,
                    importanza,
                    tolleranza,
                    soddisfattoil: new Date(),
                    creatoil: new Date(),
                    uuid: userId
                }]);

            if (error) {
                console.log('Error adding need:', error);
            } else {
                onAdd();
                onClose();
            }
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>Aggiungi Bisogno</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    aria-label="Nome"
                    value={nome}
                    onChangeText={setNome}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Importanza"
                    value={importanza}
                    onChangeText={setImportanza}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tolleranza"
                    value={tolleranza}
                    onChangeText={setTolleranza}
                />
                <Button title="Aggiungi" onPress={handleSubmit} />
                <Button title="Annulla" onPress={onClose} color="red" />
            </View>
        </Modal>
    );
};

export default AddBisogno;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});
