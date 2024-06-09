import { supabase } from '../lib/supabase';

// Helper function to get the current user
const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error('User not authenticated');
    return user;
};

// Create a new bisogno
export const createBisogno = async (bisogno) => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('bisogni')
            .insert([{ ...bisogno, uuid: user.id }]);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating bisogno:', error);
        throw error;
    }
};

// Fetch all bisogni for the current user
export const getBisogni = async () => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('bisogni')
            .select('*')
            .eq('uuid', user.id);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching bisogni:', error);
        throw error;
    }
};
export const getBisogno = async (id) => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('bisogni')
            .select('*')
            .eq('id', id)
            .eq('uuid', user.id); // Ensure the bisogno belongs to the current user
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching bisogni:', error);
        throw error;
    }
};

// Update a specific bisogno
export const updateBisogno = async (id, updates) => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('bisogni')
            .update(updates)
            .eq('id', id)
            .eq('uuid', user.id); // Ensure the bisogno belongs to the current user
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating bisogno:', error);
        throw error;
    }
};

// Delete a specific bisogno
export const deleteBisogno = async (id) => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('bisogni')
            .delete()
            .eq('id', id)
            .eq('uuid', user.id); // Ensure the bisogno belongs to the current user
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error deleting bisogno:', error);
        throw error;
    }
};

// Toggle the 'enabled' status of a specific bisogno
export const toggleBisogno = async (id, currentState) => {
    try {
        const user = await getCurrentUser();
        const { data, error } = await supabase
            .from('bisogni')
            .update({ enabled: !currentState })
            .eq('id', id)
            .eq('uuid', user.id); // Ensure the bisogno belongs to the current user
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error toggling bisogno:', error);
        throw error;
    }
};
