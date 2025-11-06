import { useState, useEffect } from "react";
import Button from "./Button";
import "../../../styles/UserForm.css";

const allRoles = [
  "Administrador",
  "Gerencia",
  "Agente Operativo Senior",
  "Agente Operativo Junior",
  "Atención al Pasajero",
];
const operativeRoles = [
  "Agente Operativo Senior",
  "Agente Operativo Junior",
];
const allAreas = [
  "Operaciones de Vuelo",
  "Mantenimiento",
  "Ground Staff",
  "Seguridad",
  "IT / Sistemas",
];

const UserForm = ({ user, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: allRoles.includes("Atención al Pasajero") ? "Atención al Pasajero" : allRoles[0],
    area: "",
    status: "activo",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || allRoles[0],
        area: user.area || "",
        status: user.status || "activo",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        role: allRoles.includes("Atención al Pasajero") ? "Atención al Pasajero" : allRoles[0],
        area: "",
        status: "activo",
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (operativeRoles.includes(formData.role) && !formData.area.trim()) {
      newErrors.area = "Debe seleccionar un área para roles Operativos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`form-input ${errors.fullName ? "form-input--error" : ""
              }`}
            placeholder="Ingrese el nombre completo"
          />
          {errors.fullName && (
            <span className="form-error">{errors.fullName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo Electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? "form-input--error" : ""}`}
            placeholder="usuario@empresa.com"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">
            Rol
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select"
          >
            {allRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="area" className="form-label">
            Área *
          </label>
          <select
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={`form-select ${errors.area ? "form-select--error" : ""}`}
          >
            <option value="">Seleccione un área</option>
            {allAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          {errors.area && <span className="form-error">{errors.area}</span>}
        </div>

        <div className="form-group form-group--full">
          <label htmlFor="status" className="form-label">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading
            ? "Guardando..."
            : user
              ? "Actualizar Usuario"
              : "Crear Usuario"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;