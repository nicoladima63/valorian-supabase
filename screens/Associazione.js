import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { RefreshControl, View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import Layout from './Layout';
import Color from 'color';

const CategoryItem = ({ categoria, isSelected, onSelect, colore }) => {
    const backgroundColorWithOpacity = Color(colore).alpha(0.5).rgb().string();
    return (
        <TouchableOpacity
            style={[
                styles.categoryItem,
                { backgroundColor: backgroundColorWithOpacity },
                isSelected ? styles.selected : null,
            ]}
            onPress={() => onSelect(categoria)}
        >
            <Text style={styles.categoryText}>{categoria.nome}</Text>
        </TouchableOpacity>
    );
};

const NeedItem = ({ need, isSelected, onSelect, style }) => (
    <TouchableOpacity
        style={[styles.needItem, isSelected ? styles.selectedNeed : null, style]}
        onPress={() => onSelect(need)}
    >
        <Text style={styles.needText}>{need.nome}</Text>
    </TouchableOpacity>
);

const CategorySelector = ({ navigation }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedNeed, setSelectedNeed] = useState(null);
    const [user, setUser] = useState({});
    const [bisogni, setBisogni] = useState([]);
    const [categorie, setCategorie] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        fetchUserData();
        fetchBisogni();
        fetchCategorie();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCategorie().then(() => {
            setRefreshing(false);
        });
    }, []);

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
            const { data, error } = await supabase
                .from('bisogni')
                .select('*');
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
    };

    const fetchCategorie = async () => {
        try {
            const { data, error } = await supabase
                .from('categorie')
                .select('*');
            if (error) {
                throw error;
            }
            if (data) {
                setCategorie(data);
            }
        } catch (error) {
            console.error('Errore nel recupero delle categorie', error);
            Alert.alert('Errore nel recupero delle categorie');
        }
    };

    const fetchAssociations = async (needId) => {
        try {
            const { data, error } = await supabase
                .from('bisincat')
                .select('categoriaid')
                .eq('bisognoid', needId);
            if (error) {
                throw error;
            }
            if (data) {
                const associatedCategoryIds = data.map((item) => item.categoriaid);
                const associatedCategories = categorie.filter((cat) => associatedCategoryIds.includes(cat.id));
                setSelectedCategories(associatedCategories);
            }
        } catch (error) {
            console.error('Errore nel recupero delle associazioni', error);
            Alert.alert('Errore nel recupero delle associazioni');
        }
    };

    const generateStripedBackground = (categories) => {
        const stripeWidth = 100 / categories.length; // larghezza di ciascuna striscia
        let background = '';

        // Creazione delle strisce colorate
        categories.forEach((category, index) => {
            background += `linear-gradient(to right, ${category.colore} ${stripeWidth * index}%, ${category.colore} ${stripeWidth * (index + 1)}%)`;

            // Aggiungere una virgola se non è l'ultima striscia
            if (index !== categories.length - 1) {
                background += ', ';
            }
        });

        return background;
    };
    const handleSelectCategory = async (category) => {
        // Verifica se la categoria è già stata associata
        const isCategorySelected = selectedCategories.includes(category);

        try {
            // Rimuovi l'associazione precedente per questa categoria
            await supabase
                .from('bisincat')
                .delete()
                .eq('bisognoid', selectedNeed.id)
                .eq('categoriaid', category.id);

            // Se la categoria non era già associata, aggiungi la nuova associazione
            if (!isCategorySelected) {
                await supabase
                    .from('bisincat')
                    .insert([{ bisognoid: selectedNeed.id, categoriaid: category.id }]);
            }

            // Aggiorna lo stato delle categorie selezionate
            setSelectedCategories((prevSelected) =>
                isCategorySelected
                    ? prevSelected.filter((cat) => cat !== category)
                    : [...prevSelected, category]
            );
        } catch (error) {
            console.error('Errore nell\'aggiornamento delle associazioni', error);
            Alert.alert('Errore nell\'aggiornamento delle associazioni');
        }
    };

    const handleSelectNeed = (need) => {
        setSelectedNeed(need);
        fetchAssociations(need.id);
    };

    const handleAssociate = async () => {
        alert('bisogno', selectedNeed.nome)
        try {
            const { data, error } = await supabase
                .from('bisincat')
                .insert(selectedCategories.map(cat => ({
                    bisognoid: selectedNeed.id,
                    categoriaid: cat.id
                })));

            if (error) {
                throw error;
            }

            Alert.alert(
                'Association Successful',
                `Need: ${selectedNeed.nome}\nCategories: ${selectedCategories.map(cat => cat.nome).join(', ')}`,
                [{ text: 'OK', onPress: () => resetSelections() }]
            );
        } catch (error) {
            console.error('Errore nell\'associazione dei bisogni alle categorie', error);
            Alert.alert('Errore nell\'associazione dei bisogni alle categorie');
        }
    };

    const resetSelections = () => {
        setSelectedCategories([]);
        setSelectedNeed(null);
    };

    return (
        <Layout navigation={navigation} showTopBar={true}>
                <Text style={theme.title}>Seleziona un bisogno:</Text>
                <FlatList
                    data={bisogni}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <NeedItem
                            need={item}
                            isSelected={selectedNeed === item}
                            onSelect={handleSelectNeed}
                        />
                    )}
                    numColumns={4}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.grid}
                />

                <Text style={styles.title}>Poi seleziona i tags:</Text>
                <FlatList
                    data={categorie}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CategoryItem
                            categoria={item}
                            isSelected={selectedCategories.includes(item)}
                            onSelect={handleSelectCategory}
                            colore={item.colore}
                        />
                    )}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.grid}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />

                <TouchableOpacity style={styles.button} onPress={handleAssociate}>
                    <Text style={styles.buttonText}>Associa</Text>
                </TouchableOpacity>
        </Layout>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#c893f6',
        marginTop: 80,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    grid: {
        justifyContent: 'space-between',
    },
    row: {
        justifyContent: 'space-between',
    },
    categoryItem: {
        flex: 1,
        margin: 5,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    selected: {
        borderWidth: 2,
        borderColor: 'purple',
    },
    categoryText: {
        color: '#333',
    },
    needItem: {
        flex: 1,
        margin: 5,
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        alignItems: 'center',
        height: 80,
        width: 80,
    },
    selectedNeed: {
        backgroundColor: '#7ca9d7',
    },
    needText: {
        color: '#333',
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#3ca9d7',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default CategorySelector;
