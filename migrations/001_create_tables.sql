-- AgriKonbit Database Schema
-- Version: 1.0.0

-- Dev convenience: drop existing DB if present
DROP DATABASE IF EXISTS agrikonbit;
CREATE DATABASE IF NOT EXISTS agrikonbit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agrikonbit;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  role ENUM('investor','farmer','consumer','admin') NOT NULL DEFAULT 'consumer',
  wallet_address VARCHAR(191) NULL,
  kyc_status ENUM('none','pending','verified','rejected') DEFAULT 'none',
  phone VARCHAR(20) NULL,
  country VARCHAR(100) NULL,
  city VARCHAR(100) NULL,
  address TEXT NULL,
  profile_image VARCHAR(500) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_wallet (wallet_address)
);

-- Projects table
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  budget_usd DECIMAL(12,2) NOT NULL,
  budget_gyt DECIMAL(12,2) NOT NULL,
  duration_days INT NOT NULL,
  estimated_return_pct DECIMAL(5,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  category ENUM('crops','livestock','fishing','forestry','other') NOT NULL,
  status ENUM('pending','validated','rejected','active','completed','cancelled') DEFAULT 'pending',
  funded_amount_usd DECIMAL(12,2) DEFAULT 0,
  funded_amount_gyt DECIMAL(12,2) DEFAULT 0,
  investor_count INT DEFAULT 0,
  start_date DATETIME NULL,
  end_date DATETIME NULL,
  images JSON NULL,
  documents JSON NULL,
  admin_notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_farmer (farmer_id),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_location (location)
);

-- Investments table
CREATE TABLE investments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  investor_id INT NOT NULL,
  amount_gyt DECIMAL(12,4) NOT NULL,
  amount_usd DECIMAL(12,2) NOT NULL,
  payment_method ENUM('stripe','paypal','metamask','gyt_wallet') NOT NULL,
  payment_id VARCHAR(255) NULL,
  tx_hash VARCHAR(255) NULL,
  status ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
  return_type ENUM('financial','physical','mixed') DEFAULT 'financial',
  physical_return_qty DECIMAL(10,2) NULL,
  physical_return_unit VARCHAR(50) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (investor_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project (project_id),
  INDEX idx_investor (investor_id),
  INDEX idx_status (status)
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  project_id INT NULL,
  name VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  price_gyt DECIMAL(10,4) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category ENUM('cereals','fruits','vegetables','honey','dairy','meat','other') NOT NULL,
  origin_country VARCHAR(100) NOT NULL,
  origin_region VARCHAR(100) NULL,
  organic_certified BOOLEAN DEFAULT FALSE,
  certification_number VARCHAR(100) NULL,
  harvest_date DATE NULL,
  expiry_date DATE NULL,
  weight_kg DECIMAL(8,2) NULL,
  nft_id VARCHAR(191) NULL,
  nft_metadata JSON NULL,
  qr_code VARCHAR(191) NULL,
  images JSON NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_farmer (farmer_id),
  INDEX idx_category (category),
  INDEX idx_origin (origin_country),
  INDEX idx_nft (nft_id)
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_usd DECIMAL(12,2) NOT NULL,
  total_gyt DECIMAL(12,4) NOT NULL,
  payment_method ENUM('stripe','paypal','gyt_wallet') NOT NULL,
  payment_id VARCHAR(255) NULL,
  status ENUM('pending','paid','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  shipping_address JSON NOT NULL,
  billing_address JSON NULL,
  tracking_number VARCHAR(100) NULL,
  shipping_cost_usd DECIMAL(8,2) DEFAULT 0,
  shipping_cost_gyt DECIMAL(8,4) DEFAULT 0,
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_order_number (order_number)
);

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  price_gyt DECIMAL(10,4) NOT NULL,
  total_usd DECIMAL(12,2) NOT NULL,
  total_gyt DECIMAL(12,4) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_order (order_id),
  INDEX idx_product (product_id)
);

-- User wallets table (for GYT balance tracking)
CREATE TABLE user_wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  gyt_balance DECIMAL(12,4) DEFAULT 0,
  total_deposited_usd DECIMAL(12,2) DEFAULT 0,
  total_deposited_gyt DECIMAL(12,4) DEFAULT 0,
  total_spent_gyt DECIMAL(12,4) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_wallet (user_id)
);

-- Project updates table
CREATE TABLE project_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  images JSON NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project (project_id),
  INDEX idx_created (created_at)
);

-- Notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info','success','warning','error') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  data JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_read (is_read),
  INDEX idx_created (created_at)
);

-- System settings table
CREATE TABLE system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('gyt_usd_rate', '1.0', 'GYT to USD exchange rate'),
('platform_fee_percent', '2.5', 'Platform fee percentage'),
('min_investment_gyt', '10', 'Minimum investment amount in GYT'),
('max_investment_gyt', '100000', 'Maximum investment amount in GYT'),
('project_validation_days', '7', 'Days to validate a project'),
('email_verification_required', 'true', 'Require email verification for new users'),
('kyc_required_investor', 'true', 'Require KYC for investors'),
('kyc_required_farmer', 'true', 'Require KYC for farmers');
