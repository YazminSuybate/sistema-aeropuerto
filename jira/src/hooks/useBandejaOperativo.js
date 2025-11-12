"use client";

import { useState, useEffect } from "react";
// 1. Importamos las funciones de la API real
import {
  getTicketsDisponibles,
  getTicketsAsignados,
  claimTicket,
} from "../services/ticketApi"; // Asegúrate que la ruta sea correcta

// (Opcional, pero recomendado para notificaciones)
// import { toast } from "react-hot-toast";

export const useBandejaOperativo = () => {
  const [disponibles, setDisponibles] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect ahora llama a la API real
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usamos Promise.all para cargar ambas listas en paralelo
        const [disponiblesData, asignadosData] = await Promise.all([
          getTicketsDisponibles(),
          getTicketsAsignados(),
        ]);

        // El backend ya filtra, pero 'disponiblesData' puede incluir tickets
        // sin responsable pero que no son de tu área (si la lógica cambia).
        // Una doble verificación en el front es buena idea.
        const misIdsAsignados = new Set(asignadosData.map((t) => t.id_ticket));

        const ticketsRealmenteDisponibles = disponiblesData.filter(
          // Filtramos los que NO están ya asignados (en caso de lag de BD)
          // Y nos aseguramos que de verdad no tengan responsable
          (t) =>
            !misIdsAsignados.has(t.id_ticket) &&
            t.id_usuario_responsable === null
        );

        setDisponibles(ticketsRealmenteDisponibles);
        setAsignados(asignadosData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // El array vacío asegura que se ejecute solo 1 vez al montar

  // 3. ¡Añadimos la función para tomar el ticket!
  const handleClaimTicket = async (ticketId) => {
    try {
      // Llama a la API (PUT /api/tickets/:id/claim)
      await claimTicket(ticketId);

      // Actualiza el estado local de 'disponibles'
      setDisponibles((prevDisponibles) =>
        prevDisponibles.filter((ticket) => ticket.id_ticket !== ticketId)
      );

      try {
        const nuevosAsignados = await getTicketsAsignados();
        setAsignados(nuevosAsignados);
      } catch (err) {
        console.error("Error al recargar tickets asignados:", err);
        // Si falla, al menos el ticket desapareció de 'disponibles'
        setError("Error al refrescar la lista de asignados.");
      }

      // toast.success(`Ticket #${ticketId} tomado.`);
    } catch (err) {
      console.error("Error al tomar el ticket:", err);
      // El error de "área no coincide" o "ya asignado" vendrá aquí
      // toast.error(`Error: ${err.message}`);
    }
  };

  // 4. Retornamos la nueva función junto con lo demás
  return {
    disponibles,
    asignados,
    loading,
    error,
    handleClaimTicket,
  };
};
