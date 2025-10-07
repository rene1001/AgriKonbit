ALTER TABLE delivery_events
  ADD COLUMN latitude DECIMAL(9,6) NULL AFTER location,
  ADD COLUMN longitude DECIMAL(9,6) NULL AFTER latitude;
