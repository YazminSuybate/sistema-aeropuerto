import { useState, useMemo } from "react";
import Table from "../components/userManagement/Table";
import Button from "../components/userManagement/Button";
import Badge from "../components/userManagement/Badge";
import SearchInput from "../components/userManagement/SearchInput";
import "../../../styles/UserManagement.css";
import Modal from "../../../components/Modal";
import UserForm from "../components/userManagement/UserForm";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useUsers } from "../hooks/useUsers";
import { useRoles } from "../hooks/useRoles";
import { useAreas } from "../hooks/useAreas";
import toast, { Toaster } from 'react-hot-toast';

const USERS_PER_PAGE = 5;

const UserManagement = () => {
  const {
    users,
    loading: isFetching,
    error,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  const { loading: loadingRoles } = useRoles();
  const { loading: loadingAreas } = useAreas();

  const isDataLoading = isFetching || loadingRoles || loadingAreas;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");

  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isMutationLoading, setIsMutationLoading] = useState(false);

  const filteredUsers = useMemo(() => {
    setCurrentPage(1);
    if (isDataLoading || error || !users) return [];

    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.area.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "Todos" || user.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, filterStatus, isDataLoading, error]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    return status === "Activo" ? (
      <Badge variant="success">Activo</Badge>
    ) : (
      <Badge variant="danger">Inactivo</Badge>
    );
  };

  const getRoleBadge = (role) => {
    let variant = "default";
    switch (role) {
      case "Administrador":
        variant = "role-purple"; 
        break;
      case "Gerencia":
        variant = "role-teal"; 
        break;
      case "Agente Operativo Senior":
        variant = "role-orange"; 
        break;
      case "Agente Operativo Junior":
        variant = "role-pink"; 
        break;
      case "Atención al Pasajero":
        variant = "role-gray"; 
        break;
      default:
        variant = "default";
        break;
    }
    return <Badge variant={variant}>{role}</Badge>;
  };

  const handleCreateUser = async (userData) => {
    setIsMutationLoading(true);
    const promise = createUser(userData);

    await toast.promise(promise, {
      loading: 'Creando usuario...',
      success: 'Usuario creado exitosamente.',
      error: (err) => err.message || 'Error al crear el usuario.',
    });

    setIsCreateModalOpen(false);
    setIsMutationLoading(false);
  };

  const handleEditUser = async (userData) => {
    if (!selectedUser) return;
    setIsMutationLoading(true);
    const promise = updateUser(selectedUser.id, userData);

    await toast.promise(promise, {
      loading: 'Actualizando usuario...',
      success: 'Usuario actualizado exitosamente.',
      error: (err) => err.message || 'Error al actualizar el usuario.',
    });

    setIsEditModalOpen(false);
    setSelectedUser(null);
    setIsMutationLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsMutationLoading(true);
    const promise = deleteUser(selectedUser.id);

    await toast.promise(promise, {
      loading: 'Desactivando usuario...',
      success: 'Usuario desactivado exitosamente (eliminación lógica).',
      error: (err) => err.message || 'Error al desactivar el usuario.',
    });

    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    setIsMutationLoading(false);
  };

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex justify-center items-center gap-2 mt-4 p-4 border-t border-light-gray">
        <Button
          variant="outline"
          size="small"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isMutationLoading}
        >
          Anterior
        </Button>
        {pageNumbers.map(number => (
          <Button
            key={number}
            variant={number === currentPage ? "primary" : "outline"}
            size="small"
            onClick={() => handlePageChange(number)}
            disabled={isMutationLoading}
            className="w-8 h-8 flex justify-center items-center"
          >
            {number}
          </Button>
        ))}
        <Button
          variant="outline"
          size="small"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isMutationLoading}
        >
          Siguiente
        </Button>
      </div>
    );
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Cálculo de conteos
  const totalUsers = users ? users.length : 0;
  const activeUsers = users ? users.filter((u) => u.status === "Activo").length : 0;
  const inactiveUsers = users ? users.filter((u) => u.status === "Inactivo").length : 0;


  return (
    <div className="user-management-container">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="user-management">
        <div className="user-management__header">
          <h1 className="user-management__title">Gestión de Usuarios</h1>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isDataLoading || isMutationLoading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            Nuevo Usuario
          </Button>
        </div>

        <div className="user-management__filters">
          <SearchInput
            placeholder="Buscar por nombre, email o área..."
            value={searchTerm}
            onChange={handleSearch}
            disabled={isDataLoading}
          />

          <div className="filter-buttons">
            <Button
              variant={filterStatus === "Todos" ? "primary" : "outline"}
              size="small"
              onClick={() => handleStatusFilter("Todos")}
              disabled={isDataLoading}
            >
              Todos ({totalUsers})
            </Button>
            <Button
              variant={filterStatus === "Activo" ? "secondary" : "outline"}
              size="small"
              onClick={() => handleStatusFilter("Activo")}
              disabled={isDataLoading}
            >
              Activos ({activeUsers})
            </Button>
            <Button
              variant={filterStatus === "Inactivo" ? "danger" : "outline"}
              size="small"
              onClick={() => handleStatusFilter("Inactivo")}
              disabled={isDataLoading}
            >
              Inactivos ({inactiveUsers})
            </Button>
          </div>
        </div>

        <div className="user-management__content">

          {error && <div className="error-message">Hubo un error al cargar los usuarios: {error}</div>}

          {isDataLoading ? (
            <div className="loading-state">Cargando datos de usuarios y configuración...</div>
          ) : (
            <>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Nombre Completo</Table.HeaderCell>
                    <Table.HeaderCell>Correo Electrónico</Table.HeaderCell>
                    <Table.HeaderCell>Rol</Table.HeaderCell>
                    <Table.HeaderCell>Área</Table.HeaderCell>
                    <Table.HeaderCell>Estado</Table.HeaderCell>
                    <Table.HeaderCell>Fecha de Registro</Table.HeaderCell>
                    <Table.HeaderCell>Acciones</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {paginatedUsers.map((user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell>
                        {user.id}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)}
                          </div>
                          <span className="user-name">{user.fullName}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{getRoleBadge(user.role)}</Table.Cell>
                      <Table.Cell>{user.area}</Table.Cell>
                      <Table.Cell>{getStatusBadge(user.status)}</Table.Cell>
                      <Table.Cell>{formatDate(user.registrationDate)}</Table.Cell>
                      <Table.Cell>
                        <div className="action-buttons">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => openEditModal(user)}
                            disabled={isMutationLoading}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => openDeleteDialog(user)}
                            disabled={isMutationLoading || user.status === 'Inactivo'}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
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

              {paginatedUsers.length === 0 && filteredUsers.length > 0 && (
                <div className="no-results">
                  <p>
                    No se encontraron usuarios en la página actual.
                  </p>
                </div>
              )}

              {filteredUsers.length === 0 && !isDataLoading && (
                <div className="no-results">
                  <p>
                    No se encontraron usuarios que coincidan con los criterios de
                    búsqueda o filtros.
                  </p>
                </div>
              )}

              <PaginationControls />
            </>
          )}
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => { setIsCreateModalOpen(false); setSelectedUser(null); }}
          title="Nuevo Usuario"
          size="large"
        >
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isMutationLoading}
          />
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
          title="Editar Usuario"
          size="large"
        >
          <UserForm
            user={selectedUser}
            onSubmit={handleEditUser}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={isMutationLoading}
          />
        </Modal>

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => { setIsDeleteDialogOpen(false); setSelectedUser(null); }}
          onConfirm={handleDeleteUser}
          title="Desactivar Usuario"
          message={`¿Estás seguro de que deseas desactivar al usuario "${selectedUser?.fullName}"? Esta acción solo lo marca como inactivo (eliminación lógica).`}
          confirmText="Desactivar"
          cancelText="Cancelar"
          variant="danger"
          isLoading={isMutationLoading}
        />
      </div>
    </div>
  );
};

export default UserManagement;