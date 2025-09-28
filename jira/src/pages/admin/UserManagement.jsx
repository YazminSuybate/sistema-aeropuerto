import { useState, useMemo } from "react";
import Table from "../../components/admin/userManagement/Table";
import Button from "../../components/admin/userManagement/Button";
import Badge from "../../components/admin/userManagement/Badge";
import SearchInput from "../../components/admin/userManagement/SearchInput";
import "../../styles/UserManagement.css";

// Datos de ejemplo
const mockUsers = [
  {
    id: 1,
    fullName: "Ana García López",
    email: "ana.garcia@empresa.com",
    role: "Atención al pasajero",
    area: "------------------",
    status: "activo",
    registrationDate: "2024-01-15",
  },
  {
    id: 2,
    fullName: "Carlos Rodríguez Pérez",
    email: "carlos.rodriguez@empresa.com",
    role: "Operativo",
    area: "Mantenimiento",
    status: "activo",
    registrationDate: "2024-02-20",
  },
  {
    id: 3,
    fullName: "María Fernández Silva",
    email: "maria.fernandez@empresa.com",
    role: "Gerencia",
    area: "------------------",
    status: "inactivo",
    registrationDate: "2024-01-10",
  },
  {
    id: 4,
    fullName: "José Martínez González",
    email: "jose.martinez@empresa.com",
    role: "Admin",
    area: "ARRIBA ALIANZA CAAAAAAAAAAARAJO",
    status: "activo",
    registrationDate: "2024-03-05",
  },
  {
    id: 5,
    fullName: "Laura Sánchez Torres",
    email: "laura.sanchez@empresa.com",
    role: "Operativo",
    area: "Seguridad",
    status: "activo",
    registrationDate: "2024-02-28",
  },
];

const UserManagement = () => {
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Filtrar usuarios basado en búsqueda y estado
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.area.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "todos" || user.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, filterStatus]);

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

  return (
    <div className="user-management-container">
      <div className="user-management">
        <div className="user-management__header">
          <h1 className="user-management__title">Gestión de Usuarios</h1>
          <Button variant="primary">
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
          />

          <div className="filter-buttons">
            <Button
              variant={filterStatus === "todos" ? "primary" : "outline"}
              size="small"
              onClick={() => handleStatusFilter("todos")}
            >
              Todos ({users.length})
            </Button>
            <Button
              variant={filterStatus === "activo" ? "secondary" : "outline"}
              size="small"
              onClick={() => handleStatusFilter("activo")}
            >
              Activos ({users.filter((u) => u.status === "activo").length})
            </Button>
            <Button
              variant={filterStatus === "inactivo" ? "danger" : "outline"}
              size="small"
              onClick={() => handleStatusFilter("inactivo")}
            >
              Inactivos ({users.filter((u) => u.status === "inactivo").length})
            </Button>
          </div>
        </div>

        <div className="user-management__content">
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
                      <Button variant="outline" size="small">
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
                      <Button variant="danger" size="small">
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
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
