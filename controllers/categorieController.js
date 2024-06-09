import { supabase } from '../lib/supabase';

// Create a new category
export const createCategoria = async (category) => {
    try {
        const { data, error } = await supabase
            .from('categorie')
            .insert([category]);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

// Fetch all categories
export const getCategorie = async () => {
    try {
        const { data, error } = await supabase
            .from('categorie')
            .select('*');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching categorie:', error);
        throw error;
    }
};
export const getCategoria = async (id) => {
    try {
        const { data, error } = await supabase
            .from('categorie')
            .select('*')
            .eq('id', id);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching categorie:', error);
        throw error;
    }
};

// Update a specific category
export const updateCategoria = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('categorie')
            .update(updates)
            .eq('id', id);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

// Delete a specific category
export const deleteCategoria = async (id) => {
    try {
        const { data, error } = await supabase
            .from('categorie')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};
