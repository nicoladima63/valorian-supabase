import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Import Supabase client
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Background from '../components/Background';
import {
    TextContentJustify,
    SubHeaderAlert, Header,
    SubHeaderAlertText,
    ButtonContainerSE,
    Button, Title16, Title20, Container
} from '../styledComponents';
import { buttonColors } from '../constants/buttonColors'
const WelcomePage = ({ navigation }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        })
        if (session && session.user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [])

    const handleGetStarted = (isNewUser) => {
        navigation.navigate('Auth', { isNewUser });
    };

    return (
        <Background>
            <SubHeaderAlert>
                <SubHeaderAlertText>
                    {isAuthenticated ? 'Autenticato' : 'Non autenticato'}
                </SubHeaderAlertText>
            </SubHeaderAlert>
            {/* Header */}
            <Header>
                <Title20>
                    Benvenuto in VALORIAN
                </Title20>
            </Header>
            {/* Contenuto centrale */}
            <Container>
                <TextContentJustify>
                    Spiegazione della app...
                    {session && session.user && <Text>{session.user.id}</Text>}
                </TextContentJustify>
            </Container>
            {/* Pulsanti in fondo */}
            <ButtonContainerSE>
                <Button bgColor={buttonColors.primary} onPress={() => handleGetStarted(true)}>
                    <Title16>Nuovo Account</Title16>
                </Button>
                <Button bgColor={buttonColors.primary} onPress={() => handleGetStarted(false)}>
                    <Title16>Login</Title16>
                </Button>
            </ButtonContainerSE>
        </Background>
    );
};

export default WelcomePage;

