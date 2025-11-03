-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_id_area_fkey`;

-- DropIndex
DROP INDEX `usuario_id_area_fkey` ON `usuario`;

-- AlterTable
ALTER TABLE `usuario` MODIFY `id_area` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_id_area_fkey` FOREIGN KEY (`id_area`) REFERENCES `area`(`id_area`) ON DELETE SET NULL ON UPDATE CASCADE;
