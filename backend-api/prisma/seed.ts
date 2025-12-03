import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Definición de permisos
const permissionsData = [
    { nombre: 'USUARIO_READ', descripcion: 'Permite listar todos los usuarios.' },
    { nombre: 'USUARIO_READ_ID', descripcion: 'Permite ver el detalle de un usuario.' },
    { nombre: 'USUARIO_CREATE', descripcion: 'Permite crear nuevos usuarios.' },
    { nombre: 'USUARIO_UPDATE', descripcion: 'Permite actualizar datos de usuarios.' },
    { nombre: 'USUARIO_DELETE', descripcion: 'Permite realizar la eliminación lógica de usuarios.' },

    // Permisos de Roles
    { nombre: 'ROL_READ', descripcion: 'Permite listar todos los roles.' },
    { nombre: 'ROL_READ_ID', descripcion: 'Permite ver el detalle de un rol.' },
    { nombre: 'ROL_CREATE', descripcion: 'Permite crear nuevos roles.' },
    { nombre: 'ROL_UPDATE', descripcion: 'Permite actualizar roles existentes.' },
    { nombre: 'ROL_DELETE', descripcion: 'Permite eliminar roles.' },

    // Permisos de Áreas
    { nombre: 'AREA_READ', descripcion: 'Permite listar todas las áreas.' },
    { nombre: 'AREA_READ_ID', descripcion: 'Permite ver el detalle de un área.' },
    { nombre: 'AREA_CREATE', descripcion: 'Permite crear nuevas áreas.' },
    { nombre: 'AREA_UPDATE', descripcion: 'Permite actualizar áreas existentes.' },
    { nombre: 'AREA_DELETE', descripcion: 'Permite eliminar áreas.' },

    // Permisos de Categoría (NEW)
    { nombre: 'CATEGORIA_READ', descripcion: 'Permite listar todas las categorías.' },
    { nombre: 'CATEGORIA_READ_ID', descripcion: 'Permite ver el detalle de una categoría.' },
    { nombre: 'CATEGORIA_CREATE', descripcion: 'Permite crear nuevas categorías.' },
    { nombre: 'CATEGORIA_UPDATE', descripcion: 'Permite actualizar categorías existentes.' },
    { nombre: 'CATEGORIA_DELETE', descripcion: 'Permite eliminar categorías.' },

    // Permisos de Estado (NEW)
    { nombre: 'ESTADO_READ', descripcion: 'Permite listar todos los estados.' },
    { nombre: 'ESTADO_READ_ID', descripcion: 'Permite ver el detalle de un estado.' },
    { nombre: 'ESTADO_CREATE', descripcion: 'Permite crear nuevos estados.' },
    { nombre: 'ESTADO_UPDATE', descripcion: 'Permite actualizar estados existentes.' },
    { nombre: 'ESTADO_DELETE', descripcion: 'Permite eliminar estados.' },

    // Permisos de Pasajero (NEW)
    { nombre: 'PASAJERO_READ', descripcion: 'Permite listar todos los pasajeros.' },
    { nombre: 'PASAJERO_READ_ID', descripcion: 'Permite ver el detalle de un pasajero.' },
    { nombre: 'PASAJERO_CREATE', descripcion: 'Permite crear nuevos pasajeros.' },
    { nombre: 'PASAJERO_UPDATE', descripcion: 'Permite actualizar pasajeros existentes.' },
    { nombre: 'PASAJERO_DELETE', descripcion: 'Permite eliminar pasajeros.' },

    // Permisos relacionados con Tickets
    { nombre: 'TICKET_READ_ALL', descripcion: 'Permite ver la lista de todos los tickets' },
    { nombre: 'TICKET_READ_ID', descripcion: 'Permite ver el detalle de un ticket específico' },
    { nombre: 'TICKET_CREATE', descripcion: 'Permite crear nuevos tickets' },
    { nombre: 'TICKET_UPDATE', descripcion: 'Permite actualizar los detalles de un ticket' },
    { nombre: 'TICKET_DELETE', descripcion: 'Permite eliminar (o cancelar) un ticket' },
    { nombre: 'TICKET_READ_BY_AREA', descripcion: 'Permite ver la lista de tickets de un área' },
    { nombre: 'TICKET_READ_BY_RESPONSIBLE', descripcion: 'Permite ver la lista de tickets de un responsable' },
    { nombre: 'TICKET_ASSIGN', descripcion: 'Permite asignar un ticket a un operador' },
    { nombre: 'TICKET_CLAIM', descripcion: 'Permite a un operador tomar un ticket disponible' },

    // --- NUEVO PERMISO AGREGADO AQUÍ ---
    { nombre: 'COMENTARIO_CREATE', descripcion: 'Permite agregar comentarios a un ticket.' },
];

// Roles definidos 
const rolesData = [
    { nombre_rol: 'Administrador', descripcion: 'Acceso total al sistema' },
    { nombre_rol: 'Gerencia', descripcion: 'Acceso de lectura a reportes y dashboards.' },
    { nombre_rol: 'Agente Operativo Senior', descripcion: 'Experto en resolución de tickets. Puede liberar o solicitar cambio de área.' },
    { nombre_rol: 'Agente Operativo Junior', descripcion: 'Agente de primer nivel. Puede liberar tickets a Senior.' },
    { nombre_rol: 'Atención al Pasajero', descripcion: 'Agente de contacto directo, generalmente solo crea tickets.' },
];

// Áreas operativas 
const areasData = [
    { nombre_area: 'Operaciones de Vuelo', descripcion: 'Gestión y coordinación de itinerarios de vuelos, asignación de tripulaciones y cumplimiento normativo de aeronaves.' },
    { nombre_area: 'Mantenimiento', descripcion: 'Responsable del mantenimiento correctivo y preventivo de aeronaves, instalaciones y equipos de apoyo en tierra.' },
    { nombre_area: 'Ground Staff', descripcion: 'Atención directa al pasajero, manejo de equipaje, servicios en puerta y gestión de incidencias de servicio.' },
    { nombre_area: 'Seguridad', descripcion: 'Supervisión de seguridad aeroportuaria, control de accesos, inspección de zonas críticas y respuesta a incidentes de seguridad.' },
    { nombre_area: 'IT / Sistemas', descripcion: 'Soporte técnico a usuarios, administración de la infraestructura de red, sistemas de vuelo y resolución de problemas de software.' },
];

// Estados de ticket por defecto (NEW)
const estadosData = [
    { nombre_estado: 'Abierto', descripcion: 'El ticket ha sido creado.' },
    { nombre_estado: 'Asignado', descripcion: 'El ticket ha sido tomado por un agente.' },
    { nombre_estado: 'En Proceso', descripcion: 'El agente está trabajando activamente en la solución.' },
    { nombre_estado: 'Pendiente', descripcion: 'Esperando información del pasajero o de otra área.' },
    { nombre_estado: 'Resuelto', descripcion: 'El ticket ha sido resuelto y está pendiente de cierre.' },
    { nombre_estado: 'Cerrado', descripcion: 'El ticket ha sido completado y finalizado.' },
];

// Categorías de ticket por defecto (NEW)
async function createCategorias(areaMap: Map<string, number>) {
    return [
        {
            nombre_categoria: 'Fallo de Sistema Crítico',
            prioridad: 'Alta',
            sla_horas: 4,
            id_area_default: areaMap.get('IT / Sistemas')!,
        },
        {
            nombre_categoria: 'Problema de Equipaje',
            prioridad: 'Media',
            sla_horas: 24,
            id_area_default: areaMap.get('Ground Staff')!,
        },
        {
            nombre_categoria: 'Mantenimiento de Aeronave (Rutina)',
            prioridad: 'Baja',
            sla_horas: 72,
            id_area_default: areaMap.get('Mantenimiento')!,
        },
        {
            nombre_categoria: 'Incidente de Seguridad',
            prioridad: 'Alta',
            sla_horas: 2,
            id_area_default: areaMap.get('Seguridad')!,
        },
    ];
}


async function main() {
    console.log('Iniciando el proceso de seeding...');
    console.log('Limpiando tablas...');
    await prisma.solicitud_cambio_area.deleteMany();
    await prisma.liberacion_ticket.deleteMany();
    await prisma.comentario.deleteMany();
    await prisma.evidencia.deleteMany();
    await prisma.historial_ticket.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.pasajero.deleteMany();
    await prisma.categoria.deleteMany();
    await prisma.estado.deleteMany();
    await prisma.rol_permiso.deleteMany();
    await prisma.refresh_token.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.rol.deleteMany();
    await prisma.permiso.deleteMany();
    await prisma.area.deleteMany();
    console.log('Tablas limpiadas y listas para el seeding.');

    // --- 2. Crear Permisos ---
    const createdPermisos = await Promise.all(
        permissionsData.map(p => prisma.permiso.create({ data: p }))
    );
    console.log(`Creados ${createdPermisos.length} permisos.`);

    const permisoMap = new Map(createdPermisos.map(p => [p.nombre, p.id_permiso]));

    // --- 3. Crear Áreas ---
    const createdAreas = await Promise.all(
        areasData.map(a => prisma.area.create({ data: a }))
    );
    console.log(`Creadas ${createdAreas.length} áreas.`);
    const areaMap = new Map(createdAreas.map(a => [a.nombre_area, a.id_area]));

    // --- 4. Crear Roles ---
    const createdRoles = await Promise.all(
        rolesData.map(r => prisma.rol.create({ data: r }))
    );
    console.log(`Creados ${createdRoles.length} roles.`);
    const rolMap = new Map(createdRoles.map(r => [r.nombre_rol, r.id_rol]));


    // --- 5. Definir y Crear Rol-Permisos ---

    // Permisos para el Administrador (Todos los permisos)
    const adminPermissions = createdPermisos.map(p => ({
        id_rol: rolMap.get('Administrador')!,
        id_permiso: p.id_permiso,
    }));

    // Permisos básicos para Gerencia 
    const gerenciaPermissions = createdPermisos
        .filter(p => p.nombre.includes('_READ') && !p.nombre.includes('_ID'))
        .map(p => ({
            id_rol: rolMap.get('Gerencia')!,
            id_permiso: p.id_permiso,
        }));

    // Define los nombres de los permisos que quieres asignar
    const operativoPermissionNames = [
        'TICKET_READ_BY_AREA',
        'TICKET_READ_BY_RESPONSIBLE',
        'TICKET_ASSIGN',
        'TICKET_CLAIM',
        'AREA_READ',
        'COMENTARIO_CREATE', // Asumimos que los operativos también deberían poder comentar
        'TICKET_READ_ID'
    ];

    // Obtén los IDs de esos permisos del Map que creamos
    const operativoPermisoIds = operativoPermissionNames
        .map(nombre => permisoMap.get(nombre)!) // '!' asegura que existe
        .filter(id => id !== undefined); // Filtra por si acaso

    // Mapea los permisos para el ROL SENIOR
    const seniorTicketPermissions = operativoPermisoIds.map(permisoId => ({
        id_rol: rolMap.get('Agente Operativo Senior')!,
        id_permiso: permisoId,
    }));

    // Mapea los mismos permisos para el ROL JUNIOR (como solicitaste)
    const juniorTicketPermissions = operativoPermisoIds.map(permisoId => ({
        id_rol: rolMap.get('Agente Operativo Junior')!,
        id_permiso: permisoId,
    }));

    // Permisos para Atención al Pasajero
    const atencionPermissionNames = [
        'TICKET_CREATE',      // Puede crear tickets
        'TICKET_READ_ALL',    // Puede ver la lista de tickets
        'TICKET_READ_ID',     // Puede ver el detalle de un ticket
        'TICKET_UPDATE',      // Necesario para añadir comentarios
        'CATEGORIA_READ',   // Necesario para el formulario de creación
        'PASAJERO_READ',    // Necesario para el formulario de creación
        'ESTADO_READ',      // <-- ¡ESTE ES EL PERMISO QUE FALTABA!
        'AREA_READ',
        'COMENTARIO_CREATE' // <-- ¡ESTE ES EL NUEVO PERMISO PARA COMENTAR!
    ];

    const atencionPermisoIds = atencionPermissionNames
        .map(nombre => permisoMap.get(nombre)!)
        .filter(id => id !== undefined);

    const atencionPermissions = atencionPermisoIds.map(permisoId => ({
        id_rol: rolMap.get('Atención al Pasajero')!,
        id_permiso: permisoId,
    }));

    const allRolePermissions = [
        ...adminPermissions,
        ...gerenciaPermissions,
        ...seniorTicketPermissions,
        ...juniorTicketPermissions,
        ...atencionPermissions,
    ];

    await prisma.rol_permiso.createMany({
        data: allRolePermissions,
        skipDuplicates: true,
    });
    console.log(`Creadas ${allRolePermissions.length} asignaciones de rol-permiso.`);

    // --- 6. Crear Estados de Ticket por defecto (NEW) ---
    const createdEstados = await prisma.estado.createMany({
        data: estadosData,
        skipDuplicates: true,
    });
    console.log(`Creados ${createdEstados.count} estados de ticket.`);

    const estadoAbierto = await prisma.estado.findFirst({ where: { nombre_estado: 'Abierto' } });
    const estadoAbiertoId = estadoAbierto!.id_estado;

    // --- 7. Crear Categorías de Ticket por defecto (NEW) ---
    const categoriasToCreate = await createCategorias(areaMap);
    await prisma.categoria.createMany({
        data: categoriasToCreate,
        skipDuplicates: true,
    });
    console.log(`Creadas ${categoriasToCreate.length} categorías de ticket.`);
    // --- NUEVO: Crear Map para categorías ---
    const createdCategorias = await prisma.categoria.findMany();
    const categoriaMap = new Map(createdCategorias.map(c => [c.nombre_categoria, c.id_categoria]));

    // --- 8. Crear Pasajeros de prueba (NEW) ---
    await prisma.pasajero.createMany({
        data: [
            { nombre: 'Juan', documento_id: 'PA123456', info_contacto: 'juan.p@mail.com' },
            { nombre: 'Ana', documento_id: 'PA987654', info_contacto: 'ana.s@mail.com' },
        ],
        skipDuplicates: true,
    });
    console.log('Pasajeros de prueba creados.');

    // --- 9. Crear Usuarios por Defecto (Original) ---
    const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);

    const adminUser = {
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@aeropuerto.com',
        password: hashedPassword,
        activo: true,
        id_rol: rolMap.get('Administrador')!,
        id_area: null,
    };
    const gerenciaUser = {
        nombre: 'Maria',
        apellido: 'Gerencia',
        email: 'maria.gerencia@aeropuerto.com',
        password: hashedPassword,
        activo: true,
        id_rol: rolMap.get('Gerencia')!,
        id_area: null,
    };
    const seniorUser = {
        nombre: 'Carlos',
        apellido: 'Operativo',
        email: 'carlos.operativo@aeropuerto.com',
        password: hashedPassword,
        activo: true,
        id_rol: rolMap.get('Agente Operativo Senior')!,
        id_area: areaMap.get('Mantenimiento')!,
    };
    const juniorUser = {
        nombre: 'Lucia',
        apellido: 'Operativa',
        email: 'lucia.operativa@aeropuerto.com',
        password: hashedPassword,
        activo: true,
        id_rol: rolMap.get('Agente Operativo Junior')!,
        id_area: areaMap.get('Mantenimiento')!,
    };

    const atencionUser = {
        nombre: 'Ana',
        apellido: 'Atencion',
        email: 'ana.atencion@aeropuerto.com',
        password: hashedPassword,
        activo: true,
        id_rol: rolMap.get('Atención al Pasajero')!,
        id_area: null,
    };

    await prisma.usuario.createMany({
        data: [adminUser, gerenciaUser, seniorUser, juniorUser, atencionUser],
        skipDuplicates: true,
    });
    console.log('Usuarios por defecto creados.');

    const userAdmin = await prisma.usuario.findFirst({ where: { email: adminUser.email } });

    // --- 10. Crear Tickets de Ejemplo ---
    console.log('Creando tickets de ejemplo...');
    await prisma.ticket.createMany({
        data: [
            {
                titulo: 'Wi-Fi no funciona en Sala VIP (Puerta A-20)',
                descripcion: 'Varios pasajeros reportan que la red "Aeropuerto_Gratis" no da acceso a internet.',
                fecha_limite_sla: new Date('2025-11-11T12:00:00'),
                id_usuario_creador: userAdmin!.id_usuario,
                id_area_asignada: areaMap.get('Mantenimiento')!,
                id_estado: estadoAbiertoId,
                id_categoria: categoriaMap.get('Fallo de Sistema Crítico')!,
            },
            {
                titulo: 'Escalera mecánica detenida (Sector C)',
                descripcion: 'La escalera que sube al área de embarque C está detenida.',
                fecha_limite_sla: new Date('2025-11-11T10:15:00'),
                id_usuario_creador: userAdmin!.id_usuario,
                id_area_asignada: areaMap.get('Mantenimiento')!,
                id_estado: estadoAbiertoId,
                id_categoria: categoriaMap.get('Mantenimiento de Aeronave (Rutina)')!,
            },
            {
                titulo: 'Fuga de agua en baños (T1 - Llegadas)',
                descripcion: 'Un charco grande se está formando en los baños de hombres.',
                fecha_limite_sla: new Date('2025-11-11T09:30:00'),
                id_usuario_creador: userAdmin!.id_usuario,
                id_area_asignada: areaMap.get('Mantenimiento')!,
                id_estado: estadoAbiertoId,
                id_categoria: categoriaMap.get('Mantenimiento de Aeronave (Rutina)')!,
            },
            {
                titulo: 'Check-in (Mostrador B-12) sin personal',
                descripcion: 'Larga fila de pasajeros para el vuelo AA-451.',
                fecha_limite_sla: new Date('2025-11-11T09:30:00'),
                id_usuario_creador: userAdmin!.id_usuario,
                id_area_asignada: areaMap.get('Mantenimiento')!,
                id_estado: estadoAbiertoId,
                id_categoria: categoriaMap.get('Problema de Equipaje')!,
            },
            {
                titulo: 'Cinta de equipaje 3 detenida',
                descripcion: 'La cinta de equipaje 3 (vuelos internacionales) se detuvo.',
                fecha_limite_sla: new Date('2025-11-11T10:20:00'),
                id_usuario_creador: userAdmin!.id_usuario,
                id_area_asignada: areaMap.get('Mantenimiento')!,
                id_estado: estadoAbiertoId,
                id_categoria: categoriaMap.get('Problema de Equipaje')!,
            },
        ],
        skipDuplicates: true,
    });
    console.log('Tickets de ejemplo creados.');

}

main()
    .catch((e) => {
        console.error('Error durante el seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('Proceso de seeding finalizado.');
    });