-- Migration 020: Historique des statuts de commande
-- Date: 2025-10-14

CREATE TABLE IF NOT EXISTS order_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL,
  notes TEXT COMMENT 'Notes sur le changement de statut',
  changed_by INT COMMENT 'ID de l\'utilisateur qui a changé le statut',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_order (order_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historique des changements de statut des commandes';

-- Insérer l'historique initial pour les commandes existantes
INSERT INTO order_status_history (order_id, status, notes, created_at)
SELECT id, status, 'Statut initial', created_at 
FROM orders
WHERE NOT EXISTS (
  SELECT 1 FROM order_status_history WHERE order_id = orders.id
);

-- Ajouter une colonne pour la confirmation de livraison
SET @dbname = DATABASE();
SET @tablename = 'orders';
SET @columnname = 'delivery_confirmed_at';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATETIME COMMENT "Date de confirmation de livraison par le client"')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Ajouter une colonne pour les notes de livraison
SET @columnname2 = 'delivery_notes';
SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname2)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname2, ' TEXT COMMENT "Notes de livraison"')
));
PREPARE alterIfNotExists2 FROM @preparedStatement2;
EXECUTE alterIfNotExists2;
DEALLOCATE PREPARE alterIfNotExists2;
