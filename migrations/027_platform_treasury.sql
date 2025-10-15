-- Migration 027: Créer la trésorerie de la plateforme
-- Date: 2025-10-15
-- Objectif: Gérer les fonds collectés par la plateforme via les frais

USE agrikonbit;

-- Table pour la trésorerie de la plateforme
CREATE TABLE IF NOT EXISTS platform_treasury (
  id INT PRIMARY KEY AUTO_INCREMENT,
  balance_usd DECIMAL(15,4) DEFAULT 0.0000 COMMENT 'Solde actuel en USD',
  total_fees_collected DECIMAL(15,4) DEFAULT 0.0000 COMMENT 'Total des frais collectés',
  total_withdrawn DECIMAL(15,4) DEFAULT 0.0000 COMMENT 'Total retiré par les admins',
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer l'enregistrement initial si n'existe pas
INSERT INTO platform_treasury (id, balance_usd, total_fees_collected, total_withdrawn)
SELECT 1, 0.0000, 0.0000, 0.0000
WHERE NOT EXISTS (SELECT 1 FROM platform_treasury WHERE id = 1);

-- Table pour l'historique des transactions de la trésorerie
CREATE TABLE IF NOT EXISTS platform_treasury_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('fee_collection', 'admin_withdrawal', 'adjustment') NOT NULL COMMENT 'Type de transaction',
  amount_usd DECIMAL(15,4) NOT NULL COMMENT 'Montant de la transaction',
  source VARCHAR(100) DEFAULT NULL COMMENT 'Source des frais (withdrawal_fee, distribution_fee, etc.)',
  reference_type VARCHAR(50) DEFAULT NULL COMMENT 'Type de référence (withdrawal, investment, etc.)',
  reference_id INT DEFAULT NULL COMMENT 'ID de la référence',
  admin_id INT DEFAULT NULL COMMENT 'ID de l\'admin qui a effectué le retrait',
  notes TEXT DEFAULT NULL COMMENT 'Notes ou description',
  balance_before DECIMAL(15,4) NOT NULL COMMENT 'Solde avant transaction',
  balance_after DECIMAL(15,4) NOT NULL COMMENT 'Solde après transaction',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_reference (reference_type, reference_id),
  INDEX idx_created (created_at),
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajouter une colonne pour tracker si les frais ont été ajoutés à la trésorerie
SET @dbname = DATABASE();
SET @tablename = 'withdrawals';
SET @columnname = 'fee_added_to_treasury';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = @tablename
      AND table_schema = @dbname
      AND column_name = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' BOOLEAN DEFAULT FALSE COMMENT "Frais ajoutés à la trésorerie"')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Ajouter la même colonne pour project_withdrawal_requests
SET @tablename2 = 'project_withdrawal_requests';
SET @columnname2 = 'fee_added_to_treasury';
SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = @tablename2
      AND table_schema = @dbname
      AND column_name = @columnname2
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename2, ' ADD COLUMN ', @columnname2, ' BOOLEAN DEFAULT FALSE COMMENT "Frais ajoutés à la trésorerie"')
));
PREPARE alterIfNotExists2 FROM @preparedStatement2;
EXECUTE alterIfNotExists2;
DEALLOCATE PREPARE alterIfNotExists2;

SELECT 'Migration 027 terminée avec succès!' as message;
SELECT * FROM platform_treasury WHERE id = 1;
