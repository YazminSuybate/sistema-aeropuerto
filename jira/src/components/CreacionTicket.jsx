import { useState, useEffect } from "react";
import Button from "../components/admin/userManagement/Button"; // Usamos tu componente Button
import { Loader2, ArrowLeft } from "lucide-react"; // Asumiendo que usas lucide-react

// Este componente solo renderiza el formulario
export const CreateTicketForm = ({
  categorias,
  pasajeros,
  currentUser,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    id_categoria: "",
    id_pasajero: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efecto para popular los <select> con el primer valor
  useEffect(() => {
    if (categorias.length > 0 && formData.id_categoria === "") {
      setFormData(prev => ({ ...prev, id_categoria: categorias[0].id_categoria }));
    }
    if (pasajeros.length > 0 && formData.id_pasajero === "") {
      setFormData(prev => ({ ...prev, id_pasajero: pasajeros[0].id_pasajero }));
    }
  }, [categorias, pasajeros, formData.id_categoria, formData.id_pasajero]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await onSubmit({
      ...formData,
      id_categoria: Number(formData.id_categoria),
      id_pasajero: Number(formData.id_pasajero),
      // El hook 'useAtencionPasajero' añadirá el id_usuario_creador
    });

    setIsSubmitting(false); 
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md border border-gray-200 animate-fade-in"
    >
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 mb-4 text-sm text-blue-600 font-semibold hover:underline"
      >
        <ArrowLeft size={16} />
        Volver al listado
      </button>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Registrar Nueva Incidencia
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda: Título y Descripción */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows={10}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Columna Derecha: Pasajero y Categoría */}
        <div className="space-y-6">
          {currentUser && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Información del Agente
              </h4>
              <p className="text-sm text-blue-700">
                <strong>Agente (Creador):</strong> {currentUser.nombre}{" "}
                {currentUser.apellido} ({currentUser.rol.nombre_rol})
              </p>
            </div>
          )}
          <div>
            <label
              htmlFor="id_pasajero"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pasajero
            </label>
            <select
              id="id_pasajero"
              name="id_pasajero"
              value={formData.id_pasajero}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled>
                Seleccione pasajero...
              </option>
              {pasajeros.map((p) => (
                <option key={p.id_pasajero} value={p.id_pasajero}>
                  {p.nombre} ({p.documento_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="id_categoria"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoría
            </label>
            <select
              id="id_categoria"
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled>
                Seleccione categoría...
              </option>
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre_categoria} (P: {c.prioridad})
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              El sistema asignará el área automáticamente.
            </p>
          </div>
        </div>
      </div>
      {/* Pie del formulario: Botones */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          size="medium" // Añadido para consistencia
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          size="medium" // Añadido para consistencia
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : null}
          {isSubmitting ? "Guardando..." : "Guardar Ticket"}
        </Button>
      </div>
    </form>
  );
};