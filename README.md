# 🚀 Sistema de Gestión de Aeropuerto (JiraAirlands)

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb?logo=react)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

El Sistema JiraAirlands es una plataforma de gestión de tickets, fullstack y modular, enfocada en la eficiencia aeroportuaria, que utiliza React/Node.js y asegura el acceso con control estricto de roles y permisos (RBAC/JWT).

## 📝 Descripción

Plataforma fullstack de alto rendimiento diseñada para la administración integral de tickets, la eficiencia operativa y el estricto control de acceso en entornos aeroportuarios.

- 👥 **Gestión de Usuarios**: Administración completa de usuarios con diferentes niveles de acceso
- 🔐 **Sistema de Autenticación**: Login seguro con JWT y refresh tokens
- 💼 **Roles y Permisos**: Sistema flexible de roles con permisos granulares
- 🏢 **Áreas del Aeropuerto**: Organización por departamentos y áreas operativas
- 🛡️ **Seguridad**: Middleware de autorización y validación de datos
- 📊 **Dashboard Administrativo**: Panel de control con estadísticas y gráficas

## ✨ Características

### Backend (API REST)
- ✅ Arquitectura en capas (Controller, Service, Repository)
- ✅ Autenticación con JWT y Refresh Tokens
- ✅ Middleware de autorización basado en roles
- ✅ Validación de datos con express-validator
- ✅ ORM Prisma para gestión de base de datos
- ✅ Migraciones automáticas de base de datos
- ✅ Encriptación de contraseñas con bcrypt
- ✅ CORS configurado para desarrollo y producción
- ✅ TypeScript para tipado estático

### Frontend (React)
- ✅ Interfaz moderna con React 19 y Vite
- ✅ Diseño responsive con TailwindCSS 4
- ✅ Componentes reutilizables con Radix UI
- ✅ Routing con React Router DOM v7
- ✅ Gráficas y dashboards con Recharts
- ✅ Iconos con React Icons
- ✅ Gestión de estado con hooks personalizados
- ✅ Mock Service Worker para desarrollo
- ✅ ESLint para calidad de código

## 🏛️ Arquitectura

```
sistema-aeropuerto/
├── backend-api/          # API REST con TypeScript + Express + Prisma
│   ├── src/
│   │   ├── controllers/   # Lógica de controladores
│   │   ├── services/      # Lógica de negocio
│   │   ├── repositories/  # Acceso a datos
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Definición de rutas
│   │   ├── middleware/    # Middleware de autenticación y validación
│   │   └── index.ts       # Punto de entrada
│   └── prisma/
│       ├── schema.prisma  # Esquema de base de datos
│       └── migrations/    # Migraciones
│
└── jira/                 # Frontend React + Vite + TailwindCSS
    ├── src/
    │   ├── components/    # Componentes React reutilizables
    │   ├── pages/         # Páginas de la aplicación
    │   ├── hooks/         # Custom hooks
    │   ├── mocks/         # Mock Service Worker
    │   └── App.jsx        # Componente principal
    └── public/            # Recursos estáticos
```

## 📦 Requisitos

Asegúrate de tener instalado:

| Software | Versión Mínima | Descarga |
|----------|----------------|----------|
| Node.js | 18.x | [nodejs.org](https://nodejs.org/) |
| npm | 9.x | Incluido con Node.js |
| MySQL | 8.0+ | [mysql.com](https://www.mysql.com/) |
| Git | 2.0+ | [git-scm.com](https://git-scm.com/) |
| Docker | 4.0+ (Desktop) | [docker.com](docker.com) |

### Verificar instalaciones

```bash
node --version   # v18.x o superior
npm --version    # 9.x o superior
mysql --version  # 8.0 o superior
```

## 💻 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/sistema-aeropuerto.git
cd sistema-aeropuerto
```

### 2. Instalar dependencias del Backend

```bash
cd backend-api
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../jira
npm install
```

## ⚙️ Configuración

### Backend

1. **Inicia el contenedor `mysql-prisma`**

   ```bash
     docker compose up -d
   ```
   
2. **Crear archivo de variables de entorno**

   En la carpeta `backend-api`, crea un archivo `.env`:
   
   ```bash
   cd backend-api
   cp .env.example .env
   ```

3. **Configurar variables de entorno**

   Edita el archivo `.env`:
   
   ```env
   # Base de Datos
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/sistema_aeropuerto_db"
   
   # JWT Secrets (genera claves seguras)
   JWT_SECRET="tu_clave_secreta_jwt_muy_segura_256bits_minimo"
   REFRESH_SECRET="tu_clave_secreta_refresh_token_diferente"
   ```
   
4. **Ejecutar migraciones de Prisma**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. ** Poblar la base de datos**

   ```bash
   npx prisma db seed
   ```

### Frontend

No requiere configuración adicional. El frontend se conecta por defecto a `http://localhost:3000` (backend).

Si necesitas cambiar la URL de la API, crea un archivo `.env` en la carpeta `jira`:

```env
VITE_API_URL=http://localhost:3000
```

## 🏃 Ejecución

### Modo Desarrollo

Necesitas **dos terminales** abiertas:

#### Terminal 1: Backend

```bash
cd backend-api
npm run dev
```

El backend estará disponible en: **http://localhost:3000**

#### Terminal 2: Frontend

```bash
cd jira
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

## 📚 API Endpoints

### Base URL: `http://localhost:3000/api`

### 🔑 Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Iniciar sesión | No |
| POST | `/refresh` | Renovar token | Sí |
| POST | `/logout` | Cerrar sesión | Sí |

**Ejemplo Login:**
```json
POST /api/login
{
  "email": "admin@aeropuerto.com",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@aeropuerto.com",
    "rol": "ADMIN"
  }
}
```

## 📊 Características Técnicas

### Seguridad
- ✅ **Autenticación JWT** con tokens de acceso y refresh
- ✅ **Encriptación bcrypt** para contraseñas (10 rounds)
- ✅ **Middleware de autorización** basado en roles
- ✅ **Validación de datos** en todas las rutas
- ✅ **CORS configurado** para seguridad
- ✅ **Headers de seguridad** implementados

### Base de Datos
- ✅ **Prisma ORM** para tipado seguro
- ✅ **Migraciones versionadas** automáticas
- ✅ **Relaciones** entre entidades bien definidas
- ✅ **Índices** para optimización de consultas
- ✅ **Transacciones** para operaciones críticas

### Frontend
- ✅ **React 19** con las últimas features
- ✅ **Vite** para desarrollo rápido
- ✅ **TailwindCSS 4** con diseño moderno
- ✅ **Componentes reutilizables** y modulares
- ✅ **Routing dinámico** con React Router
- ✅ **Custom Hooks** para lógica reutilizable

## 🛠️ Scripts Disponibles

### Backend

```bash
npm run dev          # Desarrollo con hot reload
npm run tsc          # Compilar TypeScript
npm start            # Ejecutar en producción
npx prisma studio    # Abrir Prisma Studio
npx prisma migrate dev # Crear nueva migración
```

### Frontend

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
```

## 🚀 Roadmap

- [ ] Sistema de notificaciones en tiempo real
- [ ] Dashboard con métricas y analíticas
- [ ] Generación de reportes PDF
- [ ] Tests unitarios y de integración
- [ ] Documentación con Swagger/OpenAPI
- [ ] Docker y Docker Compose
- [ ] CI/CD con GitHub Actions

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request


## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

<div align="center">

⭐ **Si te gusta este proyecto, considera darle una estrella en GitHub** ⭐

*Desarrollado con ❤️ para la gestión aeroportuaria moderna*

**© 2025 Sistema de Gestión de Aeropuerto**

</div>
