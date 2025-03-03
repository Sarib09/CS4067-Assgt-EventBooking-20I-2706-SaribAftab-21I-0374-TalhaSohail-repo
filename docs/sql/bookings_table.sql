-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id VARCHAR(255) NOT NULL,
  tickets INTEGER NOT NULL CHECK (tickets > 0),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'refunded')),
  payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create RLS (Row Level Security) policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS
ALTER TABLE bookings FORCE ROW LEVEL SECURITY;
CREATE POLICY admin_all ON bookings TO service_role USING (true) WITH CHECK (true);

-- Policy for users to view only their own bookings
CREATE POLICY booking_select_policy ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own bookings
CREATE POLICY booking_insert_policy ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update only their own bookings
CREATE POLICY booking_update_policy ON bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 