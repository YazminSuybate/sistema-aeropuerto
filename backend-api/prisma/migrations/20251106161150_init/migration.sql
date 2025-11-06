-- CreateTable
CREATE TABLE `area` (
    `id_area` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_area` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `area_nombre_area_key`(`nombre_area`),
    PRIMARY KEY (`id_area`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `rol_nombre_rol_key`(`nombre_rol`),
    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fecha_registro` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `refresh_token` VARCHAR(255) NULL,
    `id_rol` INTEGER NOT NULL,
    `id_area` INTEGER NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado` (
    `id_estado` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_estado` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`id_estado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_categoria` VARCHAR(100) NOT NULL,
    `prioridad` VARCHAR(10) NOT NULL,
    `sla_horas` INTEGER NOT NULL,
    `id_area_default` INTEGER NOT NULL,

    UNIQUE INDEX `categoria_nombre_categoria_key`(`nombre_categoria`),
    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pasajero` (
    `id_pasajero` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `documento_id` VARCHAR(50) NOT NULL,
    `info_contacto` VARCHAR(255) NULL,

    PRIMARY KEY (`id_pasajero`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket` (
    `id_ticket` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `fecha_creacion` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_resolucion` TIMESTAMP(0) NULL,
    `fecha_limite_sla` TIMESTAMP(0) NULL,
    `id_usuario_creador` INTEGER NOT NULL,
    `id_usuario_responsable` INTEGER NULL,
    `id_area_asignada` INTEGER NOT NULL,
    `id_estado` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,
    `id_pasajero` INTEGER NULL,

    PRIMARY KEY (`id_ticket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_cambio_area` (
    `id_solicitud` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_solicitud` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_respuesta` TIMESTAMP(0) NULL,
    `motivo` TEXT NOT NULL,
    `estado_solicitud` VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    `id_ticket` INTEGER NOT NULL,
    `id_usuario_solicitante` INTEGER NOT NULL,
    `id_usuario_aprobador` INTEGER NULL,
    `id_area_origen` INTEGER NOT NULL,
    `id_area_destino` INTEGER NOT NULL,

    PRIMARY KEY (`id_solicitud`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `liberacion_ticket` (
    `id_liberacion` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_liberacion` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `comentario_liberacion` TEXT NULL,
    `id_ticket` INTEGER NOT NULL,
    `id_usuario_liberador` INTEGER NOT NULL,

    PRIMARY KEY (`id_liberacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comentario` (
    `id_comentario` INTEGER NOT NULL AUTO_INCREMENT,
    `mensaje` TEXT NOT NULL,
    `fecha_comentario` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_ticket` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,

    PRIMARY KEY (`id_comentario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evidencia` (
    `id_evidencia` INTEGER NOT NULL AUTO_INCREMENT,
    `url_archivo` VARCHAR(512) NOT NULL,
    `tipo_mime` VARCHAR(50) NOT NULL,
    `fecha_subida` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_ticket` INTEGER NOT NULL,

    PRIMARY KEY (`id_evidencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_ticket` (
    `id_historial` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_cambio` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_ticket` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `tipo_cambio` VARCHAR(50) NOT NULL,
    `valor_anterior` TEXT NULL,
    `valor_nuevo` TEXT NULL,

    PRIMARY KEY (`id_historial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permiso` (
    `id_permiso` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `permiso_nombre_key`(`nombre`),
    PRIMARY KEY (`id_permiso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol_permiso` (
    `id_rol_permiso` INTEGER NOT NULL AUTO_INCREMENT,
    `id_rol` INTEGER NOT NULL,
    `id_permiso` INTEGER NOT NULL,

    UNIQUE INDEX `UQ_RolPermiso`(`id_rol`, `id_permiso`),
    PRIMARY KEY (`id_rol_permiso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_id_area_fkey` FOREIGN KEY (`id_area`) REFERENCES `area`(`id_area`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categoria` ADD CONSTRAINT `categoria_id_area_default_fkey` FOREIGN KEY (`id_area_default`) REFERENCES `area`(`id_area`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_id_usuario_creador_fkey` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_id_usuario_responsable_fkey` FOREIGN KEY (`id_usuario_responsable`) REFERENCES `usuario`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_id_area_asignada_fkey` FOREIGN KEY (`id_area_asignada`) REFERENCES `area`(`id_area`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `estado`(`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_id_pasajero_fkey` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajero`(`id_pasajero`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_cambio_area` ADD CONSTRAINT `solicitud_cambio_area_id_ticket_fkey` FOREIGN KEY (`id_ticket`) REFERENCES `ticket`(`id_ticket`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_cambio_area` ADD CONSTRAINT `solicitud_cambio_area_id_usuario_solicitante_fkey` FOREIGN KEY (`id_usuario_solicitante`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_cambio_area` ADD CONSTRAINT `solicitud_cambio_area_id_usuario_aprobador_fkey` FOREIGN KEY (`id_usuario_aprobador`) REFERENCES `usuario`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_cambio_area` ADD CONSTRAINT `solicitud_cambio_area_id_area_origen_fkey` FOREIGN KEY (`id_area_origen`) REFERENCES `area`(`id_area`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_cambio_area` ADD CONSTRAINT `solicitud_cambio_area_id_area_destino_fkey` FOREIGN KEY (`id_area_destino`) REFERENCES `area`(`id_area`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `liberacion_ticket` ADD CONSTRAINT `liberacion_ticket_id_ticket_fkey` FOREIGN KEY (`id_ticket`) REFERENCES `ticket`(`id_ticket`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `liberacion_ticket` ADD CONSTRAINT `liberacion_ticket_id_usuario_liberador_fkey` FOREIGN KEY (`id_usuario_liberador`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentario` ADD CONSTRAINT `comentario_id_ticket_fkey` FOREIGN KEY (`id_ticket`) REFERENCES `ticket`(`id_ticket`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentario` ADD CONSTRAINT `comentario_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidencia` ADD CONSTRAINT `evidencia_id_ticket_fkey` FOREIGN KEY (`id_ticket`) REFERENCES `ticket`(`id_ticket`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_ticket` ADD CONSTRAINT `historial_ticket_id_ticket_fkey` FOREIGN KEY (`id_ticket`) REFERENCES `ticket`(`id_ticket`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_ticket` ADD CONSTRAINT `historial_ticket_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rol_permiso` ADD CONSTRAINT `rol_permiso_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rol_permiso` ADD CONSTRAINT `rol_permiso_id_permiso_fkey` FOREIGN KEY (`id_permiso`) REFERENCES `permiso`(`id_permiso`) ON DELETE RESTRICT ON UPDATE CASCADE;
