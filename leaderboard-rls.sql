-- FIX LEADERBOARD RLS ISSUE
-- The leaderboard requires reading 'points' and 'id' from all users, 
-- but default Supabase RLS usually restricts SELECT to only the owner's row.
-- This policy allows any authenticated user to view all user profiles.

-- Enable RLS just in case it's not enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop the existing read policy if we created one before (optional, prevents conflict)
DROP POLICY IF EXISTS "Users can view all profiles for leaderboard" ON public.user_profiles;

-- Create the new policy that allows all logged-in users to see the leaderboard data
CREATE POLICY "Users can view all profiles for leaderboard" 
ON public.user_profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');
