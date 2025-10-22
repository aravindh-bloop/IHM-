import { createContext, useContext, useState } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // For login/logout loading

    // This is a derived value. If 'user' exists, we are authenticated.
    const isAuthenticated = !!user; 

    // Simulates a network request
    const fakeNetworkRequest = () => {
        return new Promise((resolve) => {
            setTimeout(resolve, 500); // 0.5 second delay
        });
    };

    const login = async (credentials) => {
        setLoading(true);
        await fakeNetworkRequest(); // Simulate loading
        setLoading(false);

        // --- DUMMY LOGIN LOGIC ---
        let success = false;
        let error = '';
        let userData = null;

        if (credentials.role === 'chef') {
            if (credentials.email === 'chef@ihm.edu' && credentials.password === '123') {
                userData = {
                    email: 'chef@ihm.edu',
                    role: 'chef',
                    kitchen: credentials.kitchen 
                };
                success = true;
            } else {
                error = 'Invalid chef credentials';
            }
        } else if (credentials.role === 'admin') {
            if (credentials.email === 'admin@ihm.edu' && credentials.password === '123') {
                userData = {
                    email: 'admin@ihm.edu',
                    role: 'admin'
                };
                success = true;
            } else {
                error = 'Invalid admin credentials';
            }
        } else if (credentials.role === 'vendor') {
            if (credentials.email === 'vendor@ihm.edu' && credentials.password === '123') {
                userData = {
                    email: 'vendor@ihm.edu',
                    role: 'vendor'
                };
                success = true;
            } else {
                error = 'Invalid vendor credentials';
            }
        } else {
             error = 'Invalid role';
        }
        
        if (success) {
            setUser(userData);
            return { success: true };
        } else {
            return { success: false, error: error };
        }
    };

    const logout = () => {
        setUser(null);
    };

    // 3. Provide the context value to children
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Create the custom hook to use the context
export const useAuth = () => useContext(AuthContext);