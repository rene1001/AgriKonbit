-- Add delivery confirmation fields to orders table
USE agrikonbit;

-- Add delivery_confirmed_at column if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'agrikonbit' AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'delivery_confirmed_at');

SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE orders ADD COLUMN delivery_confirmed_at DATETIME NULL AFTER updated_at', 
  'SELECT "Column delivery_confirmed_at already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add delivery_notes column if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'agrikonbit' AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'delivery_notes');

SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE orders ADD COLUMN delivery_notes TEXT NULL AFTER delivery_confirmed_at', 
  'SELECT "Column delivery_notes already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for faster queries if it doesn't exist
SET @idx_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = 'agrikonbit' AND TABLE_NAME = 'orders' AND INDEX_NAME = 'idx_delivery_confirmed');

SET @sql = IF(@idx_exists = 0, 
  'ALTER TABLE orders ADD INDEX idx_delivery_confirmed (delivery_confirmed_at)', 
  'SELECT "Index idx_delivery_confirmed already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
