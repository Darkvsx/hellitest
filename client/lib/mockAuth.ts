// Mock authentication system as fallback when Supabase is not available

interface MockUser {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  created_at: string;
}

const MOCK_USERS_KEY = 'helldivers_mock_users';
const MOCK_SESSION_KEY = 'helldivers_mock_session';

export class MockAuth {
  private static getUsers(): MockUser[] {
    const users = localStorage.getItem(MOCK_USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private static saveUsers(users: MockUser[]): void {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  private static getCurrentSession(): MockUser | null {
    const session = localStorage.getItem(MOCK_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }

  private static setSession(user: MockUser | null): void {
    if (user) {
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(MOCK_SESSION_KEY);
    }
  }

  static async signUp(email: string, password: string, username: string): Promise<{ user: MockUser | null, error: any }> {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        return {
          user: null,
          error: { message: 'User already exists' }
        };
      }

      const newUser: MockUser = {
        id: `mock_${Date.now()}`,
        email,
        username,
        role: email.includes('@helldivers.com') ? 'admin' : 'user',
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      this.saveUsers(users);

      console.log('Mock user created:', newUser);
      return { user: newUser, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  static async signIn(email: string, password: string): Promise<{ user: MockUser | null, error: any }> {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        return {
          user: null,
          error: { message: 'Invalid email or password' }
        };
      }

      this.setSession(user);
      console.log('Mock user signed in:', user);
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  static async signOut(): Promise<void> {
    this.setSession(null);
    console.log('Mock user signed out');
  }

  static async getSession(): Promise<{ user: MockUser | null }> {
    const user = this.getCurrentSession();
    return { user };
  }

  static onAuthStateChange(callback: (event: string, session: { user: MockUser | null } | null) => void) {
    // Immediately call with current session
    const currentSession = this.getCurrentSession();
    callback(currentSession ? 'SIGNED_IN' : 'SIGNED_OUT', { user: currentSession });

    // Return a mock subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }

  static async createProfile(user: MockUser): Promise<void> {
    // Mock profile creation - in real app this would be handled by Supabase trigger
    console.log('Mock profile created for user:', user.id);
  }
}
