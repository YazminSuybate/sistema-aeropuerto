import { useState, useEffect } from 'react';
import { getAuthHeaders, handleTokenExpiry } from './useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
    console.error("FATAL ERROR: VITE_API_BASE_URL no está definida.");
}

const API_URL = `${API_BASE_URL}/usuarios`;

const transformUserForFrontend = (backendUser) => {
    return {
        id: backendUser.id_usuario,
        fullName: `${backendUser.nombre} ${backendUser.apellido}`,
        email: backendUser.email,
        role: backendUser.rol.nombre_rol,
        area: backendUser.area?.nombre_area || 'No necesita',
        status: backendUser.activo ? 'Activo' : 'Inactivo',
        registrationDate: backendUser.fecha_registro,

        id_rol: backendUser.id_rol,
        id_area: backendUser.id_area,
        nombre: backendUser.nombre,
        apellido: backendUser.apellido,
        activo: backendUser.activo
    };
};

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL, {
                headers: getAuthHeaders(),
            });

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
            
            const transformedUsers = data.map(transformUserForFrontend);
            setUsers(transformedUsers);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (newUserData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newUserData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el usuario');
            }

            await fetchUsers();
        } catch (err) {
            throw err;
        }
    };


    const updateUser = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el usuario');
            }

            await fetchUsers();
        } catch (err) {
            throw err;
        }
    };

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al desactivar el usuario');
            }

            await fetchUsers();
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser };
}