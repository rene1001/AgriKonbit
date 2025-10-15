-- Migration 019: Table des demandes de retrait de fonds de projet
-- Date: 2025-10-14

CREATE TABLE IF NOT EXISTS project_withdrawal_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  farmer_id INT NOT NULL,
  amount_gyt DECIMAL(15,4) NOT NULL COMMENT 'Montant demandé en GYT',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes TEXT COMMENT 'Notes de l\'administrateur',
  approved_by INT COMMENT 'ID de l\'admin qui a approuvé/rejeté',
  approved_at DATETIME COMMENT 'Date d\'approbation/rejet',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_project (project_id),
  INDEX idx_farmer (farmer_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Demandes de retrait de fonds de projet par les agriculteurs';

-- Ajouter une colonne au projet pour suivre si les fonds ont été retirés
SET @dbname = DATABASE();
SET @tablename = 'projects';
SET @columnname = 'funds_withdrawn';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' BOOLEAN DEFAULT FALSE COMMENT "Indique si les fonds ont été retirés"')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Ajouter une colonne pour la date de retrait
SET @columnname2 = 'withdrawn_at';
SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname2)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname2, ' DATETIME COMMENT "Date de retrait des fonds"')
));
PREPARE alterIfNotExists2 FROM @preparedStatement2;
EXECUTE alterIfNotExists2;
DEALLOCATE PREPARE alterIfNotExists2;
