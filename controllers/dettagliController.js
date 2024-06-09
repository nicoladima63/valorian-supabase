// src/controllers/dettagliController.js

import { supabase } from '../lib/supabase';

// Helper function to get the current user
const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error('User not authenticated');
    return user;
};

// Create a new dettaglio
export const createDettaglio = async (dettaglio) => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('dettagli')
            .insert([{ ...dettaglio, uuid: user.id }]);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating dettaglio:', error);
        throw error;
    }
};

// Fetch all dettagli for a specific bisogno
export const getDettagli = async (bisognoId) => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('dettagli')
            .select('*')
            .eq('bisognoid', bisognoId)
            .eq('uuid', user.id);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching dettagli:', error);
        throw error;
    }
};

// Update a specific dettaglio
export const updateDettaglio = async (id, updates) => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('dettagli')
            .update(updates)
            .eq('id', id)
            .eq('uuid', user.id); // Ensure the dettaglio belongs to the current user
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating dettaglio:', error);
        throw error;
    }
};

// Delete a specific dettaglio
export const deleteDettaglio = async (id) => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('dettagli')
            .delete()
            .eq('id', id)
            .eq('uuid', user.id); // Ensure the dettaglio belongs to the current user
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error deleting dettaglio:', error);
        throw error;
    }
};
