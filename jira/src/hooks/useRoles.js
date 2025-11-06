import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getAuthHeaders, handleTokenExpiry } from './useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/roles`;

const OPERATIVE_ROLE_NAMES = ['Agente Operativo Junior', 'Agente Operativo Senior'];

export function useRoles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const operativeRoleIds = useMemo(() => {
        return roles
            .filter(rol => OPERATIVE_ROLE_NAMES.includes(rol.nombre_rol))
            .map(rol => rol.id_rol);
    }, [roles]);

    const fetchRoles = async () => {
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
            setRoles(data.map(rol => ({
                id_rol: rol.id_rol,
                nombre_rol: rol.nombre_rol,
                descripcion: rol.descripcion
            })));

        } catch (err) {
            console.error(err);
            setError(err.message);
            if (error?.message?.indexOf('Permisos insuficientes') === -1) {
                toast.error(err.message || 'Error de red/servidor al cargar roles.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return { roles, loading, error, operativeRoleIds };
}