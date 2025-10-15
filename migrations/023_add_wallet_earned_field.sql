-- Add total_earned_gyt field to user_wallets table
USE agrikonbit;

-- Add total_earned_gyt column if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'agrikonbit' AND TABLE_NAME = 'user_wallets' AND COLUMN_NAME = 'total_earned_gyt');

SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE user_wallets ADD COLUMN total_earned_gyt DECIMAL(12,4) DEFAULT 0 AFTER total_spent_gyt', 
  'SELECT "Column total_earned_gyt already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records to set total_earned_gyt to 0 if NULL
UPDATE user_wallets SET total_earned_gyt = 0 WHERE total_earned_gyt IS NULL;
