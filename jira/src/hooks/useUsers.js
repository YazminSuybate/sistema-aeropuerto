import { useState, useEffect } from 'react';

const API_URL = '/api/users';

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //obtiene
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener los usuarios');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    //crea
    const createUser = async (newUserData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserData),
            });
            if (!response.ok) throw new Error('Error al crear el usuario');
            const createdUser = await response.json();
            setUsers(prevUsers => [...prevUsers, createdUser]);
        } catch (err) {
            setError(err.message);
        }
    };


    //actualiza
    const updateUser = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('Error al actualizar el usuario');
            const updatedUser = await response.json();

            setUsers(prevUsers =>
                prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    //eliminar
    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar el usuario');
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser };
}