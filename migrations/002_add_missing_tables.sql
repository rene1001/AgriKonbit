-- Migration: Add missing tables and columns
-- Version: 1.0.1
-- Date: 2025-10-01

USE agrikonbit;

-- Add missing columns to notifications table (if they don't exist)
ALTER TABLE notifications 
ADD COLUMN reference_type VARCHAR(50) NULL AFTER data,
ADD COLUMN reference_id INT NULL AFTER reference_type;

-- Add index for reference columns
ALTER TABLE notifications 
ADD INDEX idx_reference (reference_type, reference_id);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('deposit','withdrawal','investment','purchase','sale','refund','commission') NOT NULL,
  amount_gyt DECIMAL(12,4) NOT NULL,
  amount_usd DECIMAL(12,2) NULL,
  status ENUM('pending','completed','failed','cancelled') DEFAULT 'pending',
  description TEXT NULL,
  reference_type VARCHAR(50) NULL,
  reference_id INT NULL,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_reference (reference_type, reference_id),
  INDEX idx_created (created_at)
);

-- Create withdrawals table (referenced in farmer.js)
CREATE TABLE IF NOT EXISTS withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount_gyt DECIMAL(12,4) NOT NULL,
  amount_usd DECIMAL(12,2) NULL,
  method ENUM('bank_transfer','mobile_money','crypto_wallet') NOT NULL,
  destination VARCHAR(255) NOT NULL,
  notes TEXT NULL,
  status ENUM('pending','processing','completed','rejected','cancelled') DEFAULT 'pending',
  admin_notes TEXT NULL,
  processed_by INT NULL,
  processed_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- Create messages table (referenced in routes)
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  subject VARCHAR(255) NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  parent_message_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE SET NULL,
  INDEX idx_sender (sender_id),
  INDEX idx_recipient (recipient_id),
  INDEX idx_read (is_read),
  INDEX idx_created (created_at)
);

-- Create documents table (for KYC and project documents)
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_id INT NULL,
  document_type ENUM('kyc_id','kyc_address','kyc_business','project_plan','certification','other') NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  admin_notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_project (project_id),
  INDEX idx_type (document_type),
  INDEX idx_status (status)
);
