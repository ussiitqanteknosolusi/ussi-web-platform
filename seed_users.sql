-- Script Pembuatan Akun User untuk Semua Role
-- Password untuk semua akun: password123
-- Hash: $2b$10$r5irrmQGdEWkEO6Y1AUgqeG/4mSgnDmk.wnSg9u0kD55BFqxDtjCy

INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`) VALUES
('Super Admin', 'admin@ussiits.com', '$2b$10$r5irrmQGdEWkEO6Y1AUgqeG/4mSgnDmk.wnSg9u0kD55BFqxDtjCy', 'SUPERADMIN', NOW()),
('Editor Content', 'editor@ussiits.com', '$2b$10$r5irrmQGdEWkEO6Y1AUgqeG/4mSgnDmk.wnSg9u0kD55BFqxDtjCy', 'EDITOR', NOW()),
('Sales Representative', 'sales@ussiits.com', '$2b$10$r5irrmQGdEWkEO6Y1AUgqeG/4mSgnDmk.wnSg9u0kD55BFqxDtjCy', 'SALES', NOW()),
('Client Admin', 'client_admin@ussiits.com', '$2b$10$r5irrmQGdEWkEO6Y1AUgqeG/4mSgnDmk.wnSg9u0kD55BFqxDtjCy', 'CLIENT_ADMIN', NOW()),
('Client User', 'client_user@ussiits.com', '$2b$10$r5irrmQGdEWkEO6Y1AUgqeG/4mSgnDmk.wnSg9u0kD55BFqxDtjCy', 'CLIENT_USER', NOW());
