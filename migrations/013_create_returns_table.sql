-- Migration: Create returns table for tracking investor returns
CREATE TABLE IF NOT EXISTS `returns` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  investor_id INT NOT NULL,
  project_id INT NOT NULL,
  type ENUM('financial','physical') NOT NULL,
  amount_gyt DECIMAL(18,4) DEFAULT NULL,
  quantity DECIMAL(18,4) DEFAULT NULL,
  unit VARCHAR(50) DEFAULT NULL,
  status ENUM('pending','available','delivered','withdrawn') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (investor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_investor (investor_id),
  INDEX idx_project (project_id),
  INDEX idx_type (type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
