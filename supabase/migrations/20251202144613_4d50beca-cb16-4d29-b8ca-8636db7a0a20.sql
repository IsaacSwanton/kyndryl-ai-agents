-- Add hidden column to agents table
ALTER TABLE public.agents ADD COLUMN hidden boolean NOT NULL DEFAULT false;