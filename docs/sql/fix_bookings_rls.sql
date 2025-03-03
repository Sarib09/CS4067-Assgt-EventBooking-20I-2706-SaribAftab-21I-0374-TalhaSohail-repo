-- First, drop existing policies
DROP POLICY IF EXISTS booking_select_policy ON bookings;
DROP POLICY IF EXISTS booking_insert_policy ON bookings;
DROP POLICY IF EXISTS booking_update_policy ON bookings;

-- Force RLS and create service role bypass policy
ALTER TABLE bookings FORCE ROW LEVEL SECURITY;
CREATE POLICY admin_all ON bookings TO service_role USING (true) WITH CHECK (true);

-- Recreate user policies
CREATE POLICY booking_select_policy ON bookings 
    FOR SELECT 
    TO authenticated
    USING (auth.uid()::text = user_id::text);

CREATE POLICY booking_insert_policy ON bookings 
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY booking_update_policy ON bookings 
    FOR UPDATE 
    TO authenticated
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text); 