import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useCategories } from "../../hooks/useCategories";
import { useAreas } from "../../hooks/useAreas";
import Table from "../userManagement/Table";
import Button from "../userManagement/Button";
import Modal from "../../../../components/Modal";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import CategoryForm from "./CategoryForm";

export default function TiemposMaximos() {
  const {
    categories,
    loading: isFetching,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const { areas } = useAreas();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMutationLoading, setIsMutationLoading] = useState(false);

  const getAreaName = (id) => {
    return areas.find(a => a.id_area === id)?.nombre_area || 'Área no encontrada';
  };

  const handleCreateCategory = async (categoryData) => {
    setIsMutationLoading(true);
    const promise = createCategory(categoryData);

    await toast.promise(promise, {
      loading: 'Creando categoría...',
      success: 'Categoría creada exitosamente.',
      error: (err) => err.message || 'Error al crear la categoría.',
    });

    setIsCreateModalOpen(false);
    setIsMutationLoading(false);
  };

  const handleEditCategory = async (categoryData) => {
    if (!selectedCategory) return;
    setIsMutationLoading(true);
    const promise = updateCategory(selectedCategory.id, categoryData);

    await toast.promise(promise, {
      loading: 'Actualizando categoría...',
      success: 'Categoría actualizada exitosamente.',
      error: (err) => err.message || 'Error al actualizar la categoría.',
    });

    setIsEditModalOpen(false);
    setSelectedCategory(null);
    setIsMutationLoading(false);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsMutationLoading(true);
    const promise = deleteCategory(selectedCategory.id);

    await toast.promise(promise, {
      loading: 'Eliminando categoría...',
      success: 'Categoría eliminada exitosamente.',
      error: (err) => err.message || 'Error al eliminar la categoría.',
    });

    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
    setIsMutationLoading(false);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  if (isFetching) {
    return <div className="p-8 text-center text-gray-500">Cargando categorías...</div>;
  }

  return (
    <div className="admin-panel-content p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold" style={{
          color: "var(--color-dark)",
          fontSize: '32px',
          fontWeight: 700,
          margin: 0
        }}>
          Gestión de Categorías y SLA
        </h2>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isFetching || isMutationLoading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nueva Categoría
        </Button>
      </div>

      <p className="mb-8 text-gray-600">
        Define las categorías de tickets, su prioridad por defecto y el Tiempo Máximo de Resolución (SLA) en horas, así como el área a la que serán asignados inicialmente.
      </p>

      {error && <div className="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
        Hubo un error al cargar las categorías: {error}
      </div>}

      {/* Tabla de Categorías (CRUD) */}
      <Table className="mb-10">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Categoría</Table.HeaderCell>
            <Table.HeaderCell>Prioridad Default</Table.HeaderCell>
            <Table.HeaderCell>SLA (Horas)</Table.HeaderCell>
            <Table.HeaderCell>Área Asignación</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((cat) => (
            <Table.Row key={cat.id}>
              <Table.Cell>{cat.id}</Table.Cell>
              <Table.Cell>{cat.name}</Table.Cell>
              <Table.Cell>{cat.priority}</Table.Cell>
              <Table.Cell>{cat.slaHours} hrs</Table.Cell>
              <Table.Cell>{getAreaName(cat.id_area_default)}</Table.Cell>
              <Table.Cell>
                <div className="action-buttons">
                  <Button variant="outline" size="small" onClick={() => openEditModal(cat)} disabled={isMutationLoading}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Button>
                  <Button variant="danger" size="small" onClick={() => openDeleteDialog(cat)} disabled={isMutationLoading}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                    </svg>
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Sección de Monitoreo SLA */}
      {/* <h3 className="text-xl font-bold mb-3" style={{ color: "var(--color-secondary)" }}>
        Monitoreo de Tickets con SLA
      </h3>
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
        <p className="text-sm">Esta sección muestra una tabla/gráfico con tickets cuyo SLA está cerca de vencer o ya ha vencido (Vencidos - Tiempos Excedidos en el Dashboard).</p>
      </div> */}


      {/* Modal Crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setSelectedCategory(null); }}
        title="Nueva Categoría de Ticket"
        size="medium"
      >
        <CategoryForm
          onSubmit={handleCreateCategory}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isMutationLoading}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedCategory(null); }}
        title={`Editar Categoría: ${selectedCategory?.name}`}
        size="medium"
      >
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleEditCategory}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={isMutationLoading}
        />
      </Modal>

      {/* Dialog Eliminar */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedCategory(null); }}
        onConfirm={handleDeleteCategory}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${selectedCategory?.name}"? Esta acción es permanente y puede afectar a tickets existentes.`}
        confirmText="Eliminar Categoría"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isMutationLoading}
      />
    </div>
  );
}