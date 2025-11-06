import toast from 'react-hot-toast';

export const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export async function handleTokenExpiry(response) {
    if (response.status === 401) {
        const clonedResponse = response.clone();

        try {
            const errorData = await clonedResponse.json();

            if (errorData.code === 'TOKEN_EXPIRED') {
                toast.error("Su sesión ha expirado. Redirigiendo al inicio de sesión.");

                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");

                setTimeout(() => {
                    window.location.href = "/auth";
                }, 1500);

                return true;
            }
        } catch (e) {
            error("Error al manejar la expiración del token:", e);
        }
    }

    return false;
}