import { useState, useEffect, useMemo } from "react";
import Button from "./Button";
import "../../../../styles/UserForm.css";
import { useRoles } from "../../hooks/useRoles";
import { useAreas } from "../../hooks/useAreas";

const UserForm = ({ user, onSubmit, onCancel, isLoading: isMutationLoading = false }) => {
  const { roles, loading: loadingRoles, operativeRoleIds } = useRoles();
  const { areas, loading: loadingAreas } = useAreas();
  const isDataLoading = loadingRoles || loadingAreas;

  const initialFormData = useMemo(() => ({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    activo: true,
    id_rol: "",
    id_area: "",
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        password: "",
        activo: user.activo,
        id_rol: user.id_rol || "",
        id_area: user.id_area || "",
      });
    } else {
      setFormData({
        ...initialFormData,
        id_rol: roles.length > 0
          ? roles.find(r => r.nombre_rol === 'Atención al Pasajero')?.id_rol || roles[0].id_rol
          : '',
      });
    }
    setErrors({});
  }, [user, roles, initialFormData]);

  const isOperativeRole = useMemo(() => {
    return formData.id_rol && operativeRoleIds.includes(Number(formData.id_rol));
  }, [formData.id_rol, operativeRoleIds]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = "La contraseña es requerida para el nuevo usuario";
    } else if (formData.password.trim() && formData.password.trim().length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!formData.id_rol) {
      newErrors.id_rol = "El rol es obligatorio";
    }

    if (isOperativeRole && !formData.id_area) {
      newErrors.id_area = "Debe seleccionar un área para roles operativos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSend = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        id_rol: Number(formData.id_rol),

        ...(user && { activo: formData.activo }),
      };

      if (formData.password.trim()) {
        dataToSend.password = formData.password.trim();
      }

      const finalAreaId = isOperativeRole && formData.id_area ? Number(formData.id_area) : null;
      dataToSend.id_area = finalAreaId;

      const finalData = user ? Object.fromEntries(
        Object.entries(dataToSend).filter(([key, value]) => {
          if (key === 'password' && !value) return false;

          if (key === 'id_area' || key === 'id_rol' || key === 'activo') return true;

          return value !== '';
        })
      ) : dataToSend;


      onSubmit(finalData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;
    if (name === 'activo' && type === 'checkbox') {
      newValue = checked;
    } else if (name === 'id_rol' || name === 'id_area') {
      newValue = value === "" ? "" : Number(value);
    }

    if (name === 'id_rol') {
      const selectedRoleId = Number(newValue);
      if (!operativeRoleIds.includes(selectedRoleId)) {
        setFormData((prev) => ({
          ...prev,
          id_area: "",
          [name]: newValue,
        }));
        setErrors(prev => ({ ...prev, id_area: "" }));
        return;
      }
    }


    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (isDataLoading) {
    return <div className="p-4 text-center text-gray-500">Cargando configuración de roles y áreas...</div>;
  }

  if (roles.length === 0 || areas.length === 0) {
    return <div className="p-4 text-center text-red-500">Error: No se pudieron cargar datos de Roles o Áreas. Verifique la conexión o permisos (ROL_READ/AREA_READ).</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`form-input ${errors.nombre ? "form-input--error" : ""}`}
            placeholder="Ingrese el nombre"
            disabled={isMutationLoading}
          />
          {errors.nombre && (
            <span className="form-error">{errors.nombre}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="apellido" className="form-label">
            Apellido *
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={`form-input ${errors.apellido ? "form-input--error" : ""}`}
            placeholder="Ingrese el apellido"
            disabled={isMutationLoading}
          />
          {errors.apellido && (
            <span className="form-error">{errors.apellido}</span>
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
            disabled={isMutationLoading}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña {user ? "" : "*"}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? "form-input--error" : ""}`}
            placeholder={user ? "********" : "Mínimo 8 caracteres"}
            disabled={!!user || isMutationLoading}
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="id_rol" className="form-label">
            Rol *
          </label>
          <select
            id="id_rol"
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            className={`form-select ${errors.id_rol ? "form-select--error" : ""}`}
            disabled={isMutationLoading}
          >
            <option value="">Seleccione un rol</option>
            {roles.map((role) => (
              <option key={role.id_rol} value={role.id_rol}>
                {role.nombre_rol}
              </option>
            ))}
          </select>
          {errors.id_rol && <span className="form-error">{errors.id_rol}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="id_area" className="form-label">
            Área {isOperativeRole ? "*" : "(No necesaria)"}
          </label>
          <select
            id="id_area"
            name="id_area"
            value={formData.id_area}
            onChange={handleChange}
            className={`form-select ${errors.id_area ? "form-select--error" : ""}`}
            disabled={isMutationLoading || !isOperativeRole}
          >
            <option value="">{isOperativeRole ? "Seleccione un área" : "No aplica"}</option>
            {areas.map((area) => (
              <option key={area.id_area} value={area.id_area}>
                {area.nombre_area}
              </option>
            ))}
          </select>
          {errors.id_area && <span className="form-error">{errors.id_area}</span>}
        </div>

        {user && (
          <div className="form-group form-group--full">
            <label htmlFor="activo" className="form-label cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                disabled={isMutationLoading}
                className="h-4 w-4 text-primary-blue border-gray-300 rounded"
              />
              <span>Usuario Activo</span>
            </label>
          </div>
        )}
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isMutationLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isMutationLoading}>
          {isMutationLoading
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