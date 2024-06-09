// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };

        fetchSession();

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            //data.unsubscribe();
        };
    }, []);

    const signInWithEmail = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword(email, password);

        if (error) {
            console.error('Login Error:', error.message);
            alert(error.message);
            return null;
        } else {
            setSession(data.session);
            return data.session;
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ session, signInWithEmail, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
