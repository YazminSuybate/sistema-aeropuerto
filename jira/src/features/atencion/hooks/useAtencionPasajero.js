import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { authService } from "../../auth/api/auth.service";
import { storage } from "../../auth/utils/storage";
import {
  getTickets,
  getCategorias,
  getPasajeros,
  createTicket,
  createComment,
} from "../../tickets/api/ticketApi";

export const useAtencionPasajero = () => {
  const [view, setView] = useState("list");
  const [tickets, setTickets] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pasajeros, setPasajeros] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [user, ticketsData, categoriasData, pasajerosData] =
          await Promise.all([
            authService.getProfile(storage.getToken()),
            getTickets(),
            getCategorias(),
            getPasajeros(),
          ]);

        setCurrentUser(user);
        setTickets(ticketsData);
        setCategorias(categoriasData);
        setPasajeros(pasajerosData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateTicket = async (formData) => {
    if (!currentUser) {
      setError("No se pudo identificar al usuario creador.");
      return;
    }

    try {
      const dataParaApi = {
        ...formData,
        id_usuario_creador: currentUser.id_usuario,
      };

      const newTicketFromApi = await createTicket(dataParaApi);

      setTickets((prevTickets) => [newTicketFromApi, ...prevTickets]);
      setView("list");

      toast.success(`Ticket #${newTicketFromApi.id_ticket} creado.`);
    } catch (err) {
      console.error("Error en handleCreateTicket:", err);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleSelectTicket = (id_ticket) => {
    const ticket = tickets.find((t) => t.id_ticket === id_ticket);
    if (ticket) {
      setSelectedTicket(ticket);
      setView("detail");
    } else {
      console.error(`No se pudo encontrar el ticket con ID: ${id_ticket}`);
      toast.error("No se pudo encontrar el ticket.");
    }
  };

  const handleSubmitComment = async (commentData) => {
    if (!currentUser) {
      setError("No se pudo identificar al usuario creador.");
      return;
    }

    try {
      const newComment = await createComment(commentData);

      const newCommentWithUser = {
        ...newComment,
        usuario: newComment.usuario || currentUser,
      };

      setSelectedTicket((prevTicket) => ({
        ...prevTicket,
        comentarios: [...(prevTicket.comentarios || []), newCommentWithUser],
      }));

      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t.id_ticket === commentData.id_ticket
            ? {
                ...t,
                comentarios: [...(t.comentarios || []), newCommentWithUser],
              }
            : t
        )
      );
      toast.success("Comentario enviado.");
    } catch (err) {
      console.error("Error en handleSubmitComment:", err);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

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
