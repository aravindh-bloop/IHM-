import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios'; // <-- No longer needed

// const API_BASE_URL = '/api'; // <-- No longer needed
const AuthContext = createContext(null);

// --- DUMMY USER DATA ---
// Passwords can be anything, like '123'
const DUMMY_USERS = {
  'chef@ihm.edu': {
    password: '123',
    userData: { id: 'dummy-chef', email: 'chef@ihm.edu', role: 'chef' } // Kitchen added dynamically
  },
  'admin@ihm.edu': {
    password: '123',
    userData: { id: 'dummy-admin', email: 'admin@ihm.edu', role: 'admin' }
  },
  'vendor@ihm.edu': {
    password: '123',
    userData: { id: 'dummy-vendor', email: 'vendor@ihm.edu', role: 'vendor' }
  }
};
// -----------------------


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading for auth check

  const isAuthenticated = !!user;

  // Check if user is already logged in on mount (FROM LOCAL STORAGE ONLY)
  useEffect(() => {
    const checkAuth = () => { // Removed 'async'
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        try {
          // If validation succeeds, set the user from storage
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // If validation fails, clear the bad local data
          console.error('Local storage parsing failed:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      // Set loading to false only after the check is complete
      setLoading(false);
    };

    checkAuth();
  }, []);

  // --- MODIFIED DUMMY LOGIN FUNCTION ---
  const login = async (credentials) => {
    console.log('Attempting dummy login with:', credentials.email);

    const potentialUser = DUMMY_USERS[credentials.email];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user exists and password matches
    if (potentialUser && potentialUser.password === credentials.password) {
        
        // Check if the role they selected on the form matches the dummy user's role
        if (potentialUser.userData.role !== credentials.role) {
            return { success: false, error: `Invalid credentials for the '${credentials.role}' role.` };
        }

        let userInfo = { ...potentialUser.userData };

        // Add kitchen specifically for the chef role
        if (userInfo.role === 'chef') {
            userInfo.kitchen = credentials.kitchen || 'Unknown'; // Get kitchen from login form
        }

        console.log('Dummy login successful:', userInfo);
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
        return { success: true };
    } else {
        // Generic error for security
        console.log('Dummy login failed');
        return { success: false, error: 'Invalid email or password.' };
    }
  };

  // --- MODIFIED DUMMY LOGOUT FUNCTION ---
  const logout = () => { // Removed 'async'
    try {
      // No API call needed
      console.log('Logging out (dummy)');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add this line to disable the warning for your hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);