import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.SUPABASE_TEST_EMAIL!,
    password: process.env.SUPABASE_TEST_PASSWORD!,
  });

  if (error) {
    console.error('Login failed:', error.message);
  } else {
    console.log('JWT token:', data.session?.access_token);
  }
})();