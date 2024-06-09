import { BaseTheme } from './BaseTheme';

const DefaultColors = {
    primary: '#3b0458', // Viola scuro
    secondary: '#faad29', // Giallo
    inactive: '#85a290',
    background: '#e5dac6', // Crema per lo sfondo
    card: '#e5dac6', // Crema per le card
    text: '#3b283b', // Viola scuro per il testo
    border: '#3b0458',
    notification: '#85a290',
    grey: '#f8f8f8',
    white: '#ffffff',
};

const DefaultTheme = {
    dark: false,
    colors: DefaultColors,
    ...BaseTheme(DefaultColors),
};

export default DefaultTheme;