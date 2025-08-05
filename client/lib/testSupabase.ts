import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact' });

    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }

    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase test error:', error);
    return false;
  }
}

export async function testSupabaseAuth() {
  try {
    console.log('Testing Supabase Auth...');
    
    const { data } = await supabase.auth.getSession();
    console.log('Current session:', data.session?.user?.email || 'No session');
    
    return true;
  } catch (error) {
    console.error('Supabase auth test error:', error);
    return false;
  }
}
