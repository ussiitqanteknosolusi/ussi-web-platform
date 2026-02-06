/*
  Warnings:

  - You are about to drop the column `is_highlighted` on the `pricelist_items` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `pricelist_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `pricelist_items` table. All the data in the column will be lost.
  - Added the required column `service_id` to the `pricelist_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tier` to the `pricelist_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pricelist_items` DROP FOREIGN KEY `pricelist_items_product_id_fkey`;

-- AlterTable
ALTER TABLE `pricelist_items` DROP COLUMN `is_highlighted`,
    DROP COLUMN `product_id`,
    DROP COLUMN `unit`,
    ADD COLUMN `service_id` INTEGER NOT NULL,
    ADD COLUMN `tier` VARCHAR(191) NOT NULL,
    ADD COLUMN `whatsapp_url` VARCHAR(191) NULL,
    MODIFY `price` DECIMAL(12, 2) NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `detail_image` VARCHAR(191) NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `services` ADD COLUMN `hero_image` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `pricelist_items` ADD CONSTRAINT `pricelist_items_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
