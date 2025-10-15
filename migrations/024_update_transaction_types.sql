-- Update transaction types to include 'payment'
USE agrikonbit;

-- Modify the type ENUM to include 'payment'
ALTER TABLE transactions 
MODIFY COLUMN type ENUM('deposit','withdrawal','investment','purchase','sale','refund','commission','payment') NOT NULL;
