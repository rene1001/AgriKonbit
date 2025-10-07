-- Migration: Create admin_actions table for audit logging
-- This table tracks all admin and moderator actions for security and compliance

CREATE TABLE IF NOT EXISTS admin_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id INT,
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_admin_id (admin_id),
  INDEX idx_action_type (action_type),
  INDEX idx_target (target_type, target_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajouter la clé étrangère séparément (peut échouer si table users incompatible)
-- ALTER TABLE admin_actions 
--   ADD CONSTRAINT fk_admin_actions_user 
--   FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE;

-- Sample action types:
-- 'user.activate', 'user.deactivate', 'user.role_change'
-- 'project.approve', 'project.reject'
-- 'product.activate', 'product.deactivate'
-- 'settings.update'
-- 'export.csv'
