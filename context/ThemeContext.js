// src/context/ThemeContext.js
import React, { createContext, useState, useContext } from 'react';
import DefaultTheme from '../themes/DefaultTheme';
import DarkTheme from '../themes/DarkTheme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(DefaultTheme);

    const toggleTheme = () => {
        setTheme(theme === DefaultTheme ? DarkTheme : DefaultTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
