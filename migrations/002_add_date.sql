ALTER TABLE map
ADD updated_at TEXT;

UPDATE map
SET updated_at = '2026-01-31';

UPDATE map 
SET page = 1
WHERE description IS NOT NULL;
