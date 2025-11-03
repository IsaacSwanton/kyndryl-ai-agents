-- Add order column to agents table for drag-to-reorder functionality
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Set initial order based on created_at
UPDATE agents 
SET display_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM agents
) AS subquery
WHERE agents.id = subquery.id AND agents.display_order IS NULL;