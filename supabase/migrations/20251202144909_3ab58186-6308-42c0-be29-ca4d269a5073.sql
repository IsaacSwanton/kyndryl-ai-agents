-- Allow authenticated users to update the hidden field on agents
CREATE POLICY "Authenticated users can hide agents"
ON public.agents
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);