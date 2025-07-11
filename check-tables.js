// Script to check if the goals and milestones tables exist in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTablesExist() {
  try {
    // Query the information schema to check if tables exist
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['goals', 'milestones']);
    
    if (error) {
      throw error;
    }
    
    console.log('Tables found:', tables);
    
    const goalsTableExists = tables.some(t => t.table_name === 'goals');
    const milestonesTableExists = tables.some(t => t.table_name === 'milestones');
    
    console.log('Goals table exists:', goalsTableExists);
    console.log('Milestones table exists:', milestonesTableExists);
    
    return { goalsTableExists, milestonesTableExists };
  } catch (err) {
    console.error('Error checking tables:', err);
    return { goalsTableExists: false, milestonesTableExists: false, error: err };
  }
}

checkTablesExist().then(result => {
  console.log('Check complete:', result);
});