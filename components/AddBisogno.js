import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
    View, Text, TextInput, StyleSheet,
    Modal, Pressable, TouchableOpacity, Button,
    ActivityIndicator
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTheme } from '../context/ThemeContext';
import ColorPicker from 'react-native-wheel-color-picker';


const AddBisogno = ({ visible, onClose, onAdd, userId, isTestPhase }) => {
    const [nome, setNome] = useState('');
    const [importanza, setImportanza] = useState('');
    const [tolleranza, setTolleranza] = useState('');
    const [colore, setColore] = useState('');
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const importanzaRef = useRef(null);
    const tolleranzaRef = useRef(null);

    useEffect(() => {
        if (!visible) {
            resetForm();
        }
    }, [visible]);


    const onColorChange = colore => {
        setColore(colore);
    }; const handleSubmit = async () => {
        validateForm();
        if (!isFormValid) {
            return;
        }
        setLoading(true);

        if (nome && importanza && tolleranza && userId) {
            const { data, error } = await supabase
                .from('bisogni')
                .insert([{
                    nome,
                    importanza,
                    tolleranza,
                    colore,
                    soddisfattoil: new Date(),
                    creatoil: new Date(),
                    enabled: true,
                    uuid: userId
                }]);

            if (error) {
                console.log('Error adding need:', error);
            } else {
                onAdd();
                onClose();
            }
        }
        setLoading(false);
    };

    const validateForm = () => {
        let errors = {};

        // Validate name field 
        if (!nome) {
            errors.nome = 'Nome richiesto.';
        }

        // Validate importanza field 
        if (!importanza) {
            errors.importanza = 'Importanza richiesta.';
        }

        // Validate tolleranza field 
        if (!tolleranza) {
            errors.tolleranza = 'Tolleranza richiesta.';
        }

        // Validate colore field 
        if (!colore) {
            errors.colore = 'Colore richiesto.';
        }

        // Set the errors and update form validity 
        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    };

    const resetForm = () => {
        setNome('');
        setImportanza('');
        setTolleranza('');
        setColore('');
        setErrors({});
        setIsFormValid(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <Text>{isTestPhase ? "This is the test phase" : ""}</Text>
            <View style={styles.container}>
                <Text style={styles.title}>Aggiungi Bisogno</Text>
                <TextInput
                    style={[styles.input, errors.nome && styles.inputError]}
                    placeholder="Nome"
                    aria-label="Nome"
                    value={nome}
                    onChangeText={setNome}
                    returnKeyType="next"
                    onSubmitEditing={() => importanzaRef.current.focus()}
                    blurOnSubmit={false}
                />
                {isTestPhase ? null : (
                    <>
                        <TextInput
                            ref={importanzaRef}
                            style={[styles.input, errors.importanza && styles.inputError]}
                            placeholder="Importanza"
                            value={importanza}
                            onChangeText={setImportanza}
                            returnKeyType="next"
                            onSubmitEditing={() => tolleranzaRef.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            ref={tolleranzaRef}
                            style={[styles.input, errors.tolleranza && styles.inputError]}
                            placeholder="Tolleranza"
                            value={tolleranza}
                            onChangeText={setTolleranza}
                            returnKeyType="next"
                            blurOnSubmit={false}
                        />
                        <TouchableOpacity
                            style={[styles.colorInput, { backgroundColor: colore || '#fff' }, errors.colore && styles.inputError]}

                        >
                            <Text style={styles.colorInputText}>{colore || 'Seleziona un colore'}</Text>
                        </TouchableOpacity>
                    </>
                )}
                <View style={styles.colorPickerContainer}>
                    <ColorPicker style={styles.colorPicker}
                        swatchesOnly={false}
                        swatches={false}
                        sliderHidden={true}
                        color={colore}
                        onColorChange={(colore) => onColorChange(colore)}
                        onColorChangeComplete={colore => setColore(colore)}
                        thumbSize={30}
                        noSnap={true}
                        row={false}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={handleClose}>
                        <Text style={styles.text}>Annulla</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.text}>Aggiungi</Text>
                    </Pressable>
                </View>
            </View>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
        </Modal>
    );
};

export default AddBisogno;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#dedede',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#800080',
    },
    input: {
        backgroundColor: '#99999933',
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    colorInput: {
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 10,
    },
    colorInputText: {
        color: '#000',
    },
    inputError: {
        borderColor: 'red',
    },
    colorPickerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101010',
        height: 300,
    },
    colorPicker: {
        height: 300,
        width: 300,
        alignSelf: 'center',

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        height: 51,
        width: 148,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        alignSelf: 'center',
        position: 'bottom',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});
