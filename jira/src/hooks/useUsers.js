import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
    console.error("FATAL ERROR: VITE_API_BASE_URL no está definida.");
}

const API_URL = `${API_BASE_URL}/usuarios`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return { 'Content-Type': 'application/json' };
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

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

            if (response.status === 401 || response.status === 403) {
                setError("No autorizado. Permisos insuficientes o sesión expirada.");
                toast.error("No autorizado. Permisos insuficientes o sesión expirada.");
                return;
            }

            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }

            const data = await response.json();
            const transformedUsers = data.map(transformUserForFrontend);
            setUsers(transformedUsers);

        } catch (err) {
            console.error(err);
            setError(err.message);
            toast.error(err.message || 'Error de red/servidor.');
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (newUserData) => {
        toast.error("ADVERTENCIA: La creación fallará. UserForm.jsx debe enviar id_rol e id_area.");

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
            const createdUser = await response.json();
            const transformedUser = transformUserForFrontend(createdUser);
            setUsers(prevUsers => [...prevUsers, transformedUser]);
            toast.success("Usuario creado exitosamente.");
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Error de red/servidor.');
            throw err;
        }
    };


    const updateUser = async (id, updatedData) => {
        toast.error("ADVERTENCIA: La actualización fallará. UserForm.jsx debe enviar id_rol e id_area.");

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
            const updatedUser = await response.json();

            setUsers(prevUsers =>
                prevUsers.map(user => (user.id === updatedUser.id_usuario ? transformUserForFrontend(updatedUser) : user))
            );
            toast.success("Usuario actualizado exitosamente.");
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Error de red/servidor.');
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
                throw new Error(errorData.message || 'Error al eliminar el usuario');
            }

            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            toast.success("Usuario desactivado exitosamente.");
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Error de red/servidor.');
            throw err;
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser };
}