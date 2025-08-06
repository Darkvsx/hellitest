import { supabase } from './supabase';

export async function debugAuth() {
  console.log('=== AUTH DEBUG START ===');
  
  try {
    // Test 1: Check connection
    console.log('1. Testing basic connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact' });
    
    if (healthError) {
      console.error('Connection failed:', healthError);
      return false;
    }
    console.log('✅ Connection working');

    // Test 2: Check auth status
    console.log('2. Checking auth status...');
    const { data: session } = await supabase.auth.getSession();
    console.log('Current session:', session.session?.user?.email || 'None');

    // Test 3: Try a simple registration test (with cleanup)
    console.log('3. Testing registration flow...');
    const testEmail = `test.${Date.now()}@example.com`;
    const testPassword = 'testpass123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: { username: 'testuser' }
      }
    });

    if (signUpError) {
      console.error('SignUp failed:', signUpError);
    } else {
      console.log('✅ SignUp working, user created:', signUpData.user?.id);
      
      // Cleanup: Try to delete the test user
      if (signUpData.user) {
        try {
          await supabase.auth.admin.deleteUser(signUpData.user.id);
          console.log('✅ Test user cleaned up');
        } catch (cleanupError) {
          console.log('Note: Could not cleanup test user (expected in production)');
        }
      }
    }

    console.log('=== AUTH DEBUG END ===');
    return true;
  } catch (error) {
    console.error('Debug error:', error);
    return false;
  }
}
