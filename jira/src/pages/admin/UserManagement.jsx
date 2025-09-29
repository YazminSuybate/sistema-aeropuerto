import { useState, useMemo } from "react";
import Table from "../../components/admin/userManagement/Table";
import Button from "../../components/admin/userManagement/Button";
import Badge from "../../components/admin/userManagement/Badge";
import SearchInput from "../../components/admin/userManagement/SearchInput";
import "../../styles/UserManagement.css";
import Modal from "../../components/Modal";
import UserForm from "../../components/admin/userManagement/UserForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useUsers } from "../../hooks/useUsers"; 

const UserManagement = () => {
  const { 
    users, 
    loading: isFetching, 
    error, 
    createUser, 
    updateUser, 
    deleteUser 
  } = useUsers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [isMutationLoading, setIsMutationLoading] = useState(false); 

  const filteredUsers = useMemo(() => {
    if (isFetching || error || !users) return [];

    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.area.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "todos" || user.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, filterStatus, isFetching, error]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
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
    return status === "activo" ? (
      <Badge variant="success">Activo</Badge>
    ) : (
      <Badge variant="danger">Inactivo</Badge>
    );
  };

  const getRoleBadge = (role) => {
    const variant =
      role === "Admin"
        ? "primary"
        : role === "Operativo"
        ? "warning"
        : "default";
    return <Badge variant={variant}>{role}</Badge>;
  };

  const handleCreateUser = async (userData) => {
    setIsMutationLoading(true);
    try {
      await createUser(userData); 
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsMutationLoading(false);
    }
  };

  const handleEditUser = async (userData) => {
    if (!selectedUser) return;
    setIsMutationLoading(true);
    try {
      await updateUser(selectedUser.id, userData); 

      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsMutationLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsMutationLoading(true);
    try {
      await deleteUser(selectedUser.id); 
      
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsMutationLoading(false);
    }
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
  const activeUsers = users ? users.filter((u) => u.status === "activo").length : 0;
  const inactiveUsers = users ? users.filter((u) => u.status === "inactivo").length : 0;


  return (
    <div className="user-management-container">
      <div className="user-management">
        <div className="user-management__header">
          <h1 className="user-management__title">Gestión de Usuarios</h1>
          <Button 
            variant="primary" 
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isFetching || isMutationLoading} 
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
            disabled={isFetching}
          />

          <div className="filter-buttons">
            <Button
              variant={filterStatus === "todos" ? "primary" : "outline"}
              size="small"
              onClick={() => handleStatusFilter("todos")}
              disabled={isFetching}
            >
              Todos ({totalUsers})
            </Button>
            <Button
              variant={filterStatus === "activo" ? "secondary" : "outline"}
              size="small"
              onClick={() => handleStatusFilter("activo")}
              disabled={isFetching}
            >
              Activos ({activeUsers})
            </Button>
            <Button
              variant={filterStatus === "inactivo" ? "danger" : "outline"}
              size="small"
              onClick={() => handleStatusFilter("inactivo")}
              disabled={isFetching}
            >
              Inactivos ({inactiveUsers})
            </Button>
          </div>
        </div>

        <div className="user-management__content">
          
          {error && <div className="error-message">Hubo un error al cargar los usuarios.</div>}
          
          {isFetching ? (
            <div className="loading-state">Cargando datos de usuarios...</div>
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
                  {filteredUsers.map((user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell>
                        #{user.id.toString().padStart(3, "0")}
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

              {filteredUsers.length === 0 && (
                <div className="no-results">
                  <p>
                    No se encontraron usuarios que coincidan con los criterios de
                    búsqueda.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {setIsCreateModalOpen(false); setSelectedUser(null);}}
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
          onClose={() => {setIsEditModalOpen(false); setSelectedUser(null);}}
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
          onClose={() => {setIsDeleteDialogOpen(false); setSelectedUser(null);}}
          onConfirm={handleDeleteUser}
          title="Eliminar Usuario"
          message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUser?.fullName}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
          isLoading={isMutationLoading}
        />
      </div>
    </div>
  );
};

export default UserManagement;
