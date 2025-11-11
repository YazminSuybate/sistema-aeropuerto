/*
  Warnings:

  - A unique constraint covering the columns `[documento_id]` on the table `pasajero` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `pasajero_documento_id_key` ON `pasajero`(`documento_id`);
