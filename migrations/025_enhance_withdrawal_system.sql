-- Migration 025: Amélioration du système de retrait avec frais
-- Date: 2025-10-14
-- Objectif: Ajouter les colonnes pour gérer les frais de retrait

USE agrikonbit;

-- Ajouter les colonnes de frais aux retraits d'investisseurs
SET @dbname = DATABASE();
SET @tablename = 'withdrawals';

-- Colonne pour le montant des frais
SET @columnname = 'fee_amount_gyt';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(12,4) DEFAULT 0.00 COMMENT "Montant des frais prélevés en GYT"')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Colonne pour le pourcentage de frais appliqué
SET @columnname2 = 'fee_percentage';
SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname2)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname2, ' DECIMAL(5,2) DEFAULT 0.00 COMMENT "Pourcentage de frais appliqué"')
));
PREPARE alterIfNotExists2 FROM @preparedStatement2;
EXECUTE alterIfNotExists2;
DEALLOCATE PREPARE alterIfNotExists2;

-- Colonne pour le montant net reçu
SET @columnname3 = 'net_amount_gyt';
SET @preparedStatement3 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname3)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname3, ' DECIMAL(12,4) DEFAULT 0.00 COMMENT "Montant net après frais"')
));
PREPARE alterIfNotExists3 FROM @preparedStatement3;
EXECUTE alterIfNotExists3;
DEALLOCATE PREPARE alterIfNotExists3;

-- Ajouter des paramètres supplémentaires à platform_settings
SET @tablename2 = 'platform_settings';

-- Frais de distribution des retours
SET @columnname4 = 'distribution_fee_pct';
SET @preparedStatement4 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename2)
      AND (table_schema = @dbname)
      AND (column_name = @columnname4)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename2, ' ADD COLUMN ', @columnname4, ' DECIMAL(5,2) DEFAULT 0.00 COMMENT "Pourcentage de frais sur la distribution des retours"')
));
PREPARE alterIfNotExists4 FROM @preparedStatement4;
EXECUTE alterIfNotExists4;
DEALLOCATE PREPARE alterIfNotExists4;

-- Frais de retrait de projet
SET @columnname5 = 'project_withdrawal_fee_pct';
SET @preparedStatement5 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename2)
      AND (table_schema = @dbname)
      AND (column_name = @columnname5)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename2, ' ADD COLUMN ', @columnname5, ' DECIMAL(5,2) DEFAULT 0.00 COMMENT "Pourcentage de frais sur les retraits de projet"')
));
PREPARE alterIfNotExists5 FROM @preparedStatement5;
EXECUTE alterIfNotExists5;
DEALLOCATE PREPARE alterIfNotExists5;

-- Ajouter un type de transaction pour les frais
ALTER TABLE transactions 
MODIFY COLUMN type ENUM('deposit','withdrawal','investment','purchase','sale','refund','commission','payment','return','project_withdrawal','fee') NOT NULL;
