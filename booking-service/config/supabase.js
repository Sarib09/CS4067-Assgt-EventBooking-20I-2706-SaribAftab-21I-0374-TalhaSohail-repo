const { createClient } = require('@supabase/supabase-js');
const { logger } = require('../utils/logger');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Supabase URL or key is missing. Please check your environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const setAuthToken = (token) => {
  if (token) {
    supabase.auth.setSession({ access_token: token });
  }
};

module.exports = { supabase, setAuthToken }; 