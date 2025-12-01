import { useState, useEffect, useRef } from "react";
import Button from "../../admin/components/userManagement/Button"; // Usamos tu Button
import {
  Loader2,
  ArrowLeft,
  MessageSquare,
  User,
  Tag,
  Ticket,
  Grip,
  Calendar,
  ShieldAlert,
  Clock,
  Send,
} from "lucide-react"; // Asumiendo que usas lucide-react

// Funciones de color (copiadas de tu AtencionTicketCard)
const getEstadoColor = (estado) => {
  switch (estado) {
    case "Abierto": return "bg-blue-100 text-blue-800";
    case "Asignado": return "bg-purple-100 text-purple-800";
    case "En Proceso": return "bg-orange-100 text-orange-800";
    case "Pendiente": return "bg-pink-100 text-pink-800";
    case "Resuelto": return "bg-green-100 text-green-800";
    case "Cerrado": return "bg-gray-100 text-gray-600";
    default: return "bg-gray-100 text-gray-600";
  }
};
const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
    case "Alta": return "text-red-500";
    case "Media": return "text-yellow-500";
    default: return "text-green-500";
  }
};


// Este componente muestra el chat y los detalles
export const TicketDetailView = ({
  ticket,
  currentUser,
  onSubmitComment,
  onCancel,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    setIsSubmitting(true);
    await onSubmitComment({
      mensaje: newComment,
      id_ticket: ticket.id_ticket,
      id_usuario: currentUser.id_usuario,
    });
    setNewComment("");
    setIsSubmitting(false);
  };

  // Auto-scroll al final del chat cuando llegan nuevos mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.comentarios]);

  return (
    <div className="animate-fade-in">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 mb-4 text-sm text-blue-600 font-semibold hover:underline"
      >
        <ArrowLeft size={16} />
        Volver al listado
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Detalle del Ticket #{ticket.id_ticket}
      </h2>
      <p className="text-xl text-gray-600 mb-6">{ticket.titulo}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal: Chat/Comentarios */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Descripción
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {ticket.descripcion}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <MessageSquare size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Chat Interno
              </h3>
            </div>
            <div className="p-6 space-y-5 max-h-[400px] overflow-y-auto bg-gray-50">
              {ticket.comentarios.length === 0 && (
                <p className="text-center text-gray-500 italic">
                  No hay comentarios.
                </p>
              )}
              {ticket.comentarios.map((comment) => {
                // El repositorio de ticket y comentario debe hacer 'include' del usuario
                const isCurrentUser =
                  comment.usuario.id_usuario === currentUser.id_usuario;
                return (
                  <div
                    key={comment.id_comentario}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-lg max-w-[80%] ${
                        isCurrentUser
                          ? "bg-blue-600 text-white"
                          : "bg-white shadow-sm border"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <User size={14} />
                        <span className="text-sm font-bold">
                          {comment.usuario.nombre} {comment.usuario.apellido}
                        </span>
                      </div>
                      <p className="text-sm">{comment.mensaje}</p>
                      <span
                        className={`text-xs mt-2 block ${
                          isCurrentUser ? "text-blue-200" : "text-gray-500"
                        }`}
                      >
                        {new Date(comment.fecha_comentario).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  disabled={isSubmitting}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="medium" // Añadido para consistencia
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Columna Lateral: Detalles Clave */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Detalles
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Grip size={18} className="text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Estado</span>
                  <p
                    className={`font-semibold px-2 py-0.5 rounded text-sm inline-block ${getEstadoColor(
                      ticket.estado.nombre_estado
                    )}`}
                  >
                    {ticket.estado.nombre_estado}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Responsable</span>
                  <p className="font-semibold text-gray-700">
                    {ticket.responsable
                      ? `${ticket.responsable.nombre} ${ticket.responsable.apellido}`
                      : "Sin asignar"}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Tag size={18} className="text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Categoría</span>
                  <p className="font-semibold text-gray-700">
                    {ticket.categoria_info.nombre_categoria}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <ShieldAlert
                  size={18}
                  className={getPrioridadColor(
                    ticket.categoria_info.prioridad
                  )}
                />
                <div>
                  <span className="text-xs text-gray-500">Prioridad</span>
                  <p className="font-semibold text-gray-700">
                    {ticket.categoria_info.prioridad}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">SLA (Horas)</span>
                  <p className="font-semibold text-gray-700">
                    {ticket.categoria_info.sla_horas}h
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Creación</span>
                  <p className="font-semibold text-gray-700">
                    {new Date(ticket.fecha_creacion).toLocaleString()}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Ticket size={18} className="text-gray-500" />
                <div>
                  <span className="text-xs text-gray-500">Documento</span>
                  <p className="font-semibold text-gray-700">
                    {ticket.pasajero_info.documento_id}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};