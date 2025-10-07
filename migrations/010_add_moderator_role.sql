-- Migration: Add 'moderator' role to users.role ENUM
-- Note: This ALTER redefines the ENUM including all existing values plus 'moderator'
-- Ensure to run during a maintenance window if your MySQL variant rebuilds the table for ENUM change.

ALTER TABLE users
  MODIFY COLUMN role ENUM('admin','investor','farmer','consumer','moderator') NOT NULL DEFAULT 'consumer';
