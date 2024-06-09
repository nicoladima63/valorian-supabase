import React, { useEffect, useState, useCallback } from 'react';
import * as Controller from '../controllers/bisogniController';

import { ScrollView, RefreshControl, View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import 'dayjs/locale/it';
import dayjs from 'dayjs';
import Layout from './Layout';

export default function CalendarPage({ navigation }) {
    const [bisogni, setBisogni] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadBisogni();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchBisogni().then(() => {
            setRefreshing(false);
        });
    }, []);

    const loadBisogni = async () => {
        try {
            const data = await Controller.getBisogni();
            setBisogni(data);
        } catch (error) {
            console.error(error);
        }
    }

    const handlePrevMonth = () => {
        setCurrentDate(dayjs(currentDate).subtract(1, 'month').toDate());
    };

    const handleNextMonth = () => {
        setCurrentDate(dayjs(currentDate).add(1, 'month').toDate());
    };

    const handleSwipe = (direction) => {
        if (direction === 'LEFT') {
            handleNextMonth();
        } else if (direction === 'RIGHT') {
            handlePrevMonth();
        }
    };

    const renderHeader = (date) => {
        const monthName = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return (
            <View>
                <Text style={styles.headerText}>{monthName} {year}</Text>
            </View>
        );
    };

    const transformBisogniToEvents = () => {
        return bisogni.map(bisogno => ({
            title: bisogno.nome,
            start: new Date(bisogno.soddisfattoil),
            end: new Date(bisogno.soddisfattoil),
            color: bisogno.colore,
        }));
    };

    const events = transformBisogniToEvents();
    const eventCellStyle = (event, start, end, isSelected) => {
        return {
            height: 20,
            alignItems: 'center',
            backgroundColor: event.color,
            color: 'red',
        };
    };

    return (
        <Layout navigation={navigation} showTopBar={true}>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Calendar
                    events={events}
                    height={600}  // Altezza del calendario
                    mode="month"  // Modalità di visualizzazione mensile
                    locale="it"
                    weekStartsOn={1}  // Imposta il primo giorno della settimana a lunedì
                    eventCellStyle={eventCellStyle} // Applica lo stile personalizzato agli eventi
                    currentDate={currentDate}
                    onSwipeHorizontal={handleSwipe} // Gestisce lo swipe orizzontale
                    // theme={darkTheme}  // Opzionale: tema scuro
                    cellHeight={100}
                    renderHeader={renderHeader}
                />
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    headerText: {
        fontSize: 28,
        color: 'black',
    },
});
