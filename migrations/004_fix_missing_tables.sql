-- Migration 004: Fix missing tables and columns
-- Date: 2025-10-01
-- Purpose: Add transactions table, withdrawals table, and missing notification columns

USE agrikonbit;

-- Add missing columns to notifications table (check if they exist first)
ALTER TABLE notifications 
ADD COLUMN reference_type VARCHAR(50) NULL AFTER data,
ADD COLUMN reference_id INT NULL AFTER reference_type;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('deposit', 'withdrawal', 'investment', 'purchase', 'sale', 'refund', 'reward') NOT NULL,
  amount_gyt DECIMAL(12,4) NOT NULL,
  amount_usd DECIMAL(12,2) NULL,
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  description TEXT NULL,
  reference_type VARCHAR(50) NULL,
  reference_id INT NULL,
  tx_hash VARCHAR(255) NULL,
  payment_method VARCHAR(50) NULL,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_created (created_at),
  INDEX idx_reference (reference_type, reference_id)
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount_gyt DECIMAL(12,4) NOT NULL,
  amount_usd DECIMAL(12,2) NULL,
  method ENUM('bank_transfer', 'mobile_money', 'crypto_wallet', 'paypal') NOT NULL,
  destination TEXT NOT NULL,
  notes TEXT NULL,
  status ENUM('pending', 'processing', 'completed', 'rejected', 'cancelled') DEFAULT 'pending',
  admin_notes TEXT NULL,
  processed_by INT NULL,
  processed_at DATETIME NULL,
  tx_hash VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- Add indexes for better performance on notifications
ALTER TABLE notifications
ADD INDEX idx_reference (reference_type, reference_id);

-- Note: The user_wallets table already has the correct columns, no changes needed
