-- Migration 021: Système de retours sur investissement
-- Date: 2025-10-14

-- Ajouter des colonnes aux investissements pour suivre les retours
SET @dbname = DATABASE();
SET @tablename = 'investments';

-- Colonne pour le statut de retour
SET @columnname = 'return_status';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ENUM("pending", "distributed", "completed") DEFAULT "pending" COMMENT "Statut du retour sur investissement"')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Colonne pour le montant du retour
SET @columnname2 = 'return_amount_gyt';
SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname2)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname2, ' DECIMAL(15,4) DEFAULT 0.00 COMMENT "Montant du retour reçu en GYT"')
));
PREPARE alterIfNotExists2 FROM @preparedStatement2;
EXECUTE alterIfNotExists2;
DEALLOCATE PREPARE alterIfNotExists2;

-- Colonne pour la date de retour
SET @columnname3 = 'returned_at';
SET @preparedStatement3 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname3)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname3, ' DATETIME COMMENT "Date de distribution du retour"')
));
PREPARE alterIfNotExists3 FROM @preparedStatement3;
EXECUTE alterIfNotExists3;
DEALLOCATE PREPARE alterIfNotExists3;

-- Ajouter un nouveau statut au projet pour "finalized" (après distribution des retours)
ALTER TABLE projects MODIFY COLUMN status 
  ENUM('pending', 'validated', 'active', 'completed', 'finalized', 'rejected', 'cancelled') 
  DEFAULT 'pending';
