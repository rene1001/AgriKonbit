-- Migration 026: Corriger et compléter la table platform_settings
-- Date: 2025-10-14

USE agrikonbit;

-- Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS platform_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  withdrawal_fee_pct DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Pourcentage de frais sur les retraits investisseurs',
  distribution_fee_pct DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Pourcentage de frais sur la distribution des retours',
  project_withdrawal_fee_pct DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Pourcentage de frais sur les retraits de projet',
  min_withdrawal_amount DECIMAL(15,4) DEFAULT 10.00 COMMENT 'Montant minimum de retrait',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajouter les colonnes manquantes si elles n'existent pas
SET @dbname = DATABASE();
SET @tablename = 'platform_settings';

-- Colonne distribution_fee_pct
SET @columnname = 'distribution_fee_pct';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = @tablename
      AND table_schema = @dbname
      AND column_name = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(5,2) DEFAULT 0.00 COMMENT "Pourcentage de frais sur la distribution des retours"')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Colonne project_withdrawal_fee_pct
SET @columnname2 = 'project_withdrawal_fee_pct';
SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = @tablename
      AND table_schema = @dbname
      AND column_name = @columnname2
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname2, ' DECIMAL(5,2) DEFAULT 0.00 COMMENT "Pourcentage de frais sur les retraits de projet"')
));
PREPARE alterIfNotExists2 FROM @preparedStatement2;
EXECUTE alterIfNotExists2;
DEALLOCATE PREPARE alterIfNotExists2;

-- Insérer les paramètres par défaut si la table est vide
INSERT INTO platform_settings (id, withdrawal_fee_pct, distribution_fee_pct, project_withdrawal_fee_pct, min_withdrawal_amount)
SELECT 1, 2.50, 1.00, 3.00, 10.00
WHERE NOT EXISTS (SELECT 1 FROM platform_settings WHERE id = 1);

-- Afficher le résultat
SELECT 'Migration 026 terminée avec succès!' as message;
SELECT * FROM platform_settings WHERE id = 1;
