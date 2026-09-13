-- Check current auth user
SELECT auth.uid() as current_user_id;

-- Check all profiles
SELECT id, email, role FROM profiles;