import { useState, useEffect } from 'react';
import { getAuthHeaders, handleTokenExpiry } from './useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/categorias`;

const transformCategoryForFrontend = (backendCategory) => {
    return {
        id: backendCategory.id_categoria,
        name: backendCategory.nombre_categoria,
        priority: backendCategory.prioridad,
        slaHours: backendCategory.sla_horas,
        id_area_default: backendCategory.id_area_default,
        areaDefaultName: backendCategory.area_default?.nombre_area || 'No Asignada'
    };
};

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL, { headers: getAuthHeaders() });
            const tokenExpired = await handleTokenExpiry(response);
            if (tokenExpired) {
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 403) {
                    setError("No autorizado. Permisos insuficientes o sesión expirada.");
                }
                throw new Error(errorData.message || 'Error al obtener los usuarios');
            }

            const data = await response.json();
            setCategories(data.map(transformCategoryForFrontend));

        } catch (err) {
            console.error("Error en fetchCategories:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createCategory = async (newCategoryData) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(newCategoryData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear la categoría');
        }
        await fetchCategories();
    };

    const updateCategory = async (id, updatedData) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar la categoría');
        }
        await fetchCategories();
    };

    const deleteCategory = async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar la categoría');
        }
        await fetchCategories();
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory
    };
}