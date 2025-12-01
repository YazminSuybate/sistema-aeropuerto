import { useState, useEffect, useMemo } from "react";
import Button from "../userManagement/Button";
import "../../../../styles/UserForm.css";
import { useAreas } from "../../hooks/useAreas";

const PRIORITY_OPTIONS = ["Alta", "Media", "Baja", "Muy Baja"];

const CategoryForm = ({ category, onSubmit, onCancel, isLoading: isMutationLoading = false }) => {
    const { areas, loading: loadingAreas } = useAreas();
    const isEditMode = !!category;

    const initialFormData = useMemo(() => ({
        nombre_categoria: "",
        prioridad: PRIORITY_OPTIONS[0],
        sla_horas: 48,
        id_area_default: "",
    }), []);

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (category) {
            setFormData({
                nombre_categoria: category.name || "",
                prioridad: category.priority || PRIORITY_OPTIONS[0],
                sla_horas: category.slaHours || 48,
                id_area_default: category.id_area_default || "",
            });
        } else {
            setFormData({
                ...initialFormData,
                id_area_default: areas.length > 0 ? areas[0].id_area : "",
            });
        }
        setErrors({});
    }, [category, areas, initialFormData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre_categoria.trim()) {
            newErrors.nombre_categoria = "El nombre de la categoría es requerido";
        }

        if (!formData.id_area_default) {
            newErrors.id_area_default = "El área por defecto es requerida";
        }

        const slaHours = Number(formData.sla_horas);
        if (slaHours < 1 || isNaN(slaHours)) {
            newErrors.sla_horas = "SLA debe ser un número entero positivo de horas";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSend = {
                nombre_categoria: formData.nombre_categoria,
                prioridad: formData.prioridad,
                sla_horas: Number(formData.sla_horas),
                id_area_default: Number(formData.id_area_default),
            };

            onSubmit(dataToSend);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;
        if (name === 'sla_horas' || name === 'id_area_default') {
            newValue = value === "" ? "" : Number(value);
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

    if (loadingAreas) {
        return <div className="p-4 text-center text-gray-500">Cargando áreas disponibles...</div>;
    }

    if (areas.length === 0) {
        return <div className="p-4 text-center text-red-500">Error: No se pudieron cargar datos de Áreas. Verifique la conexión o permisos (AREA_READ).</div>;
    }


    return (
        <form onSubmit={handleSubmit} className="user-form">
            <div className="form-grid">
                <div className="form-group form-group--full">
                    <label htmlFor="nombre_categoria" className="form-label">
                        Nombre de la Categoría *
                    </label>
                    <input
                        type="text"
                        id="nombre_categoria"
                        name="nombre_categoria"
                        value={formData.nombre_categoria}
                        onChange={handleChange}
                        className={`form-input ${errors.nombre_categoria ? "form-input--error" : ""}`}
                        placeholder="Ej: Fallo de Sistema, Problema de Equipaje"
                        disabled={isMutationLoading}
                    />
                    {errors.nombre_categoria && (
                        <span className="form-error">{errors.nombre_categoria}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="prioridad" className="form-label">
                        Prioridad por Defecto *
                    </label>
                    <select
                        id="prioridad"
                        name="prioridad"
                        value={formData.prioridad}
                        onChange={handleChange}
                        className={`form-select ${errors.prioridad ? "form-select--error" : ""}`}
                        disabled={isMutationLoading}
                    >
                        {PRIORITY_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                    {errors.prioridad && <span className="form-error">{errors.prioridad}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="sla_horas" className="form-label">
                        SLA (Tiempo Máximo de Resolución en Horas) *
                    </label>
                    <input
                        type="number"
                        id="sla_horas"
                        name="sla_horas"
                        min="1"
                        value={formData.sla_horas}
                        onChange={handleChange}
                        className={`form-input ${errors.sla_horas ? "form-input--error" : ""}`}
                        placeholder="Ej: 48 (horas)"
                        disabled={isMutationLoading}
                    />
                    {errors.sla_horas && <span className="form-error">{errors.sla_horas}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="id_area_default" className="form-label">
                        Área de Asignación por Defecto *
                    </label>
                    <select
                        id="id_area_default"
                        name="id_area_default"
                        value={formData.id_area_default}
                        onChange={handleChange}
                        className={`form-select ${errors.id_area_default ? "form-select--error" : ""}`}
                        disabled={isMutationLoading}
                    >
                        <option value="">Seleccione un área</option>
                        {areas.map((area) => (
                            <option key={area.id_area} value={area.id_area}>
                                {area.nombre_area}
                            </option>
                        ))}
                    </select>
                    {errors.id_area_default && <span className="form-error">{errors.id_area_default}</span>}
                </div>

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
                <Button type="submit" variant="secondary" disabled={isMutationLoading}>
                    {isMutationLoading
                        ? "Guardando..."
                        : isEditMode
                            ? "Actualizar Categoría"
                            : "Crear Categoría"}
                </Button>
            </div>
        </form>
    );
};

export default CategoryForm;