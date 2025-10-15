-- Migration 013: Add profile enhancements
-- Adds bio and theme preference to users table

USE agrikonbit;

-- Add bio and theme_preference columns to users table
ALTER TABLE users 
ADD COLUMN bio TEXT NULL COMMENT 'User biography/description' AFTER address,
ADD COLUMN theme_preference ENUM('light', 'dark', 'auto') DEFAULT 'light' COMMENT 'User theme preference' AFTER bio;

-- Update existing users to have default theme
UPDATE users SET theme_preference = 'light' WHERE theme_preference IS NULL;

SELECT 'Migration 013 completed: Added bio and theme_preference columns' AS status;
