// src/context/ThemeContext.js
import React, { createContext, useState, useContext } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { LightTheme, DarkTheme } from '../themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(LightTheme);

    const toggleTheme = () => {
        setTheme(theme === LightTheme ? DarkTheme : LightTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
        </ThemeContext.Provider>
    );
};
export const useTheme = () => useContext(ThemeContext);
