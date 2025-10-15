-- Migration 018: Ajouter les paramètres de frais de retrait
-- Date: 2025-10-14

-- Vérifier si la table platform_settings existe
CREATE TABLE IF NOT EXISTS platform_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  withdrawal_fee_pct DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Pourcentage de frais sur les retraits',
  min_withdrawal_amount DECIMAL(15,4) DEFAULT 10.00 COMMENT 'Montant minimum de retrait',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer les paramètres par défaut si la table est vide
INSERT INTO platform_settings (id, withdrawal_fee_pct, min_withdrawal_amount)
SELECT 1, 0.00, 10.00
WHERE NOT EXISTS (SELECT 1 FROM platform_settings WHERE id = 1);

-- Si la colonne n'existe pas déjà, l'ajouter
SET @dbname = DATABASE();
SET @tablename = 'platform_settings';
SET @columnname = 'withdrawal_fee_pct';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(5,2) DEFAULT 0.00 COMMENT "Pourcentage de frais sur les retraits"')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;
