-- Database: db_miftahulkhoir (MySQL)
-- Jalankan: mysql -u root -p < db_miftahulkhoir.sql

CREATE DATABASE IF NOT EXISTS db_miftahulkhoir
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE db_miftahulkhoir;

-- Admin users (password disimpan hashed, mis. bcrypt)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homepage_settings (
  id VARCHAR(20) PRIMARY KEY DEFAULT 'homepage',
  hero_image_url VARCHAR(500),
  hero_title VARCHAR(200) NOT NULL DEFAULT 'MASJID MIFTAHUL KHOIR',
  hero_tagline VARCHAR(200) NOT NULL DEFAULT 'Menebar Kebaikan, Membangun Ummah',
  hero_description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'Umum',
  image_url VARCHAR(500) NOT NULL,
  taken_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  cover_url VARCHAR(500),
  category_id INT,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES news_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  location VARCHAR(200),
  start_at DATETIME NOT NULL,
  end_at DATETIME,
  status ENUM('upcoming','past','cancelled') NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donation_programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'Infaq',
  image_url VARCHAR(500),
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  account_holder VARCHAR(100),
  qris_url VARCHAR(500),
  whatsapp VARCHAR(30),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- seed
INSERT INTO homepage_settings (id, hero_title, hero_tagline, hero_description)
VALUES ('homepage', 'MASJID MIFTAHUL KHOIR', 'Menebar Kebaikan, Membangun Ummah', 'Website resmi Masjid Miftahul Khoir.')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO news_categories (name, slug) VALUES ('Pengumuman','pengumuman'),('Kegiatan','kegiatan')
ON DUPLICATE KEY UPDATE slug = slug;

-- Admin demo (password: 123456 — ganti hash sebelum produksi!)
-- Generate hash dengan bcrypt di aplikasi Anda, lalu:
-- INSERT INTO admins (username, password_hash, full_name) VALUES ('miftahulkhoir123', '<bcrypt-hash>', 'Admin');
