
-- 1. Tabel Konfigurasi Global (Settings)
CREATE TABLE `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `key_name` VARCHAR(50) NOT NULL UNIQUE,
  `value` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel Layanan (Services) dengan SEO Meta
CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `description` TEXT,
  `meta_description` VARCHAR(160), -- Untuk SEO
  `icon_path` VARCHAR(255),
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabel Fitur Detail Layanan
CREATE TABLE `service_features` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_id` INT,
  `feature_name` VARCHAR(255) NOT NULL,
  `feature_description` TEXT,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabel Klien & Partner
CREATE TABLE `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `industry` ENUM('Koperasi', 'BPR', 'LKM', 'Pesantren', 'Lainnya') DEFAULT 'Koperasi',
  `logo_url` VARCHAR(255),
  `testimonial` TEXT,
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Tabel User & Role
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('SUPERADMIN', 'EDITOR', 'SALES', 'CLIENT_ADMIN', 'CLIENT_USER') DEFAULT 'CLIENT_USER',
  `client_id` INT NULL,
  `image` VARCHAR(255), -- Foto Profil
  `email_verified` DATETIME NULL, -- Untuk Auth.js
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Tabel Auth.js Session Management
CREATE TABLE `sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_token` VARCHAR(255) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `expires` DATETIME NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Tabel Berita/Blog dengan SEO Meta
CREATE TABLE `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `content` LONGTEXT NOT NULL,
  `meta_description` VARCHAR(160),
  `thumbnail` VARCHAR(255),
  `category` VARCHAR(50) DEFAULT 'Berita',
  `status` ENUM('draft', 'published') DEFAULT 'draft',
  `author_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Tabel Leads/Inquiry
CREATE TABLE `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `company_name` VARCHAR(150),
  `message` TEXT NOT NULL,
  `status` ENUM('New', 'Processed', 'Closed') DEFAULT 'New',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. Tabel Tim/Management
CREATE TABLE `team` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `position` VARCHAR(100) NOT NULL,
  `photo_url` VARCHAR(255),
  `order_priority` INT DEFAULT 0
) ENGINE=InnoDB;

-- 10. Tabel Projects (Rekam Jejak Implementasi/Portofolio)
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL, -- Contoh: "Implementasi IBS Core System"
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `client_id` INT, -- Menghubungkan ke tabel clients yang sudah ada
  `service_id` INT, -- Menghubungkan ke tabel services (Produk apa yang diimplementasikan)
  `description` TEXT,
  `project_date` DATE, -- Kapan proyek selesai
  `thumbnail_url` VARCHAR(255),
  `status` ENUM('Ongoing', 'Completed') DEFAULT 'Completed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 11. Tabel Project Images (Jika satu proyek punya banyak foto/galeri)
CREATE TABLE `project_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT,
  `image_url` VARCHAR(255) NOT NULL,
  `caption` VARCHAR(255),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- DATA AWAL (SEEDING) --
INSERT INTO `settings` (`key_name`, `value`) VALUES 
('office_address', 'Jl. Raya ITS, Surabaya, Jawa Timur'),
('whatsapp_contact', '628123456789'),
('company_email', 'info@ussiits.com');

INSERT INTO `services` (`title`, `slug`, `description`, `meta_description`) VALUES 
('IBS Core Microbanking', 'ibs-core-system', 'Sistem inti perbankan mikro terpadu.', 'Solusi core microbanking terbaik untuk Koperasi dan BPR dari USSI ITS.'),
('IBS Mobile', 'ibs-mobile', 'Layanan mobile banking untuk anggota.', 'Digitalisasi koperasi dengan aplikasi IBS Mobile banking.');

-- SET FOREIGN_KEY_CHECKS = 1;