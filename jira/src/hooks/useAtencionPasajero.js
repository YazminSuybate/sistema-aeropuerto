"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Importamos las funciones de tu API consolidada
import {
  getProfile,
  getTickets,
  getCategorias,
  getPasajeros,
  createTicket,
  createComment,
  getEstados,
} from "../services/api"; // Usamos el api.js centralizado

// (Opcional, pero recomendado para notificaciones)
// import { toast } from "react-hot-toast";

export const useAtencionPasajero = () => {
  const [view, setView] = useState("list"); // 'list' | 'create' | 'detail'
  const [tickets, setTickets] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pasajeros, setPasajeros] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [estados, setEstados] = useState([]); // <-- 2. AÑADIR ESTADO PARA 'ESTADOS'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 1. Carga inicial de datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtenemos todos los datos en paralelo
        const [user, ticketsData, categoriasData, pasajerosData, estadosData] =
          await Promise.all([
            getProfile(),   // De tu api.js
            getTickets(),   // De tu api.js
            getCategorias(),// De tu api.js
            getPasajeros(), // De tu api.js
            getEstados(), // <-- 4. LLAMAR A LA NUEVA FUNCIÓN
          ]);

        setCurrentUser(user);
        setTickets(ticketsData);
        setCategorias(categoriasData);
        setPasajeros(pasajerosData);
        setEstados(estadosData); // <-- 5. GUARDAR ESTADOS
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // El array vacío asegura que se ejecute solo 1 vez

  // 2. Función para crear el ticket (Función 1)
  const handleCreateTicket = async (formData) => {
    if (!currentUser) {
      setError("No se pudo identificar al usuario creador.");
      return;
    }

    try {
      // El backend (ticket.controller.ts) saca el id_usuario_creador del token
      const dataParaApi = {
        ...formData,
        id_usuario_creador: currentUser.id_usuario // Basado en el ticket.service
      };

      //const newTicket = await createTicket(dataParaApi); // De tu api.js
      // newTicketFromApi SÓLO TIENE IDs (ej. id_categoria: 1, id_estado: 1)
      const newTicketFromApi = await createTicket(dataParaApi); 

      // --- 6. ¡ESTE ES EL ARREGLO PRINCIPAL! ---
      // "Armamos" el objeto completo para la UI, usando los
      // datos que ya tenemos en el estado local.

      // Buscamos los objetos completos en nuestros estados locales
      const categoria = categorias.find(c => c.id_categoria === newTicketFromApi.id_categoria);
      const pasajero = pasajeros.find(p => p.id_pasajero === newTicketFromApi.id_pasajero);
      const estado = estados.find(e => e.id_estado === newTicketFromApi.id_estado);

      

      // Creamos el objeto que la UI espera
      const fullNewTicket = {
        ...newTicketFromApi,
        // Añadimos las relaciones que faltaban
        categoria_info: categoria || { prioridad: 'N/A' },
        pasajero_info: pasajero || { nombre: 'N/A' },
        estado: estado || { nombre_estado: 'N/A' },
        creador: currentUser, // El creador es el usuario actual
        responsable: null, // Un ticket nuevo no tiene responsable
        comentarios: [] // Un ticket nuevo no tiene comentarios
      };
      
      // Actualizar estado local y volver a la lista
      setTickets((prevTickets) => [fullNewTicket, ...prevTickets]);
      setView("list");
      // toast.success(`Ticket #${newTicket.id_ticket} creado.`);

    } catch (err) {
      console.error("Error en handleCreateTicket:", err);
      setError(err.message);
      // toast.error(`Error: ${err.message}`);
    }
  };

  // 3. Función para ver el detalle (Función 2)
  const handleSelectTicket = (id_ticket) => {
    const ticket = tickets.find((t) => t.id_ticket === id_ticket);
    if (ticket) {
      // --- ¡ESTE ES EL ARREGLO QUE SOLUCIONA EL CRASH! ---
      // El ticket de la lista solo tiene IDs (id_categoria, id_pasajero, etc.)
      // Buscamos los objetos completos en el estado del hook.
      const categoriaFound = categorias.find(c => c.id_categoria === ticket.id_categoria);
      const pasajeroFound = pasajeros.find(p => p.id_pasajero === ticket.id_pasajero);
      const estadoFound = estados.find(e => e.id_estado === ticket.id_estado);
      
      // Creamos un objeto de ticket "completo" para la vista de detalle
      const ticketCompletoParaDetalle = {
        ...ticket,
        // Aseguramos que 'comentarios' sea un array
        comentarios: ticket.comentarios || [], 
        
        // Añadimos los objetos relacionados (con un fallback por si acaso)
        categoria_info: categoriaFound || { nombre_categoria: "N/A", prioridad: "N/A" },
        pasajero_info: pasajeroFound || { documento_id: "N/A" },
        estado: estadoFound || { nombre_estado: "N/A" },
        // 'responsable' puede ser null, así que solo lo pasamos
        responsable: ticket.responsable || null 
      };
      
      setSelectedTicket(ticketCompletoParaDetalle); // Pasamos el ticket "completo"
      setView("detail");
    } else {
      console.error(`No se pudo encontrar el ticket con ID: ${id_ticket}`);
      // Opcional: toast.error("No se pudo encontrar el ticket.");
    }
    //setSelectedTicket(ticket);
    //setView("detail");
  };

  // 4. Función para enviar comentario (Función 2)
  const handleSubmitComment = async (commentData) => {
    if (!currentUser) {
      setError("No se pudo identificar al usuario creador.");
      return;
    }

    try {
      const newComment = await createComment(commentData); // De tu api.js
      
      // El 'newComment' que devuelve el backend (gracias al 'include' 
      // del repositorio) ya debería tener el objeto 'usuario'.
      const newCommentWithUser = { 
        ...newComment, 
        usuario: newComment.usuario || currentUser 
      };

      // Actualizamos el ticket localmente con el nuevo comentario
      setSelectedTicket((prevTicket) => ({
        ...prevTicket,
        comentarios: [...prevTicket.comentarios, newCommentWithUser],
      }));
      // Actualizamos la lista principal también
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t.id_ticket === commentData.id_ticket
            ? { ...t, comentarios: [...t.comentarios, newCommentWithUser] }
            : t
        )
      );
      // toast.success("Comentario enviado.");

    } catch (err) {
      console.error("Error en handleSubmitComment:", err);
      setError(err.message);
      // toast.error(`Error: ${err.message}`);
    }
  };
  
  // 5. Devolvemos el estado y los manejadores
  return {
    view,
    setView,
    tickets,
    categorias,
    pasajeros,
    loading,
    error,
    currentUser,
    selectedTicket,
    handleCreateTicket,
    handleSelectTicket,
    handleSubmitComment,
  };
};