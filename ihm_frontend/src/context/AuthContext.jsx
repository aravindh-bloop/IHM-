import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API Base URL - uses proxy in development
const API_BASE_URL = '/api';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Initial loading for auth check

    // This is a derived value. If 'user' exists, we are authenticated.
    const isAuthenticated = !!user;

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if we have stored user data
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        
        try {
            // Map frontend role to backend role
            // Frontend: chef, admin, vendor
            // Backend: stall (for chef), admin, vendor
            const backendRole = credentials.role === 'chef' ? 'stall' : credentials.role;
            
            // Prepare login data for fastapi-users cookie authentication
            const formData = new URLSearchParams();
            formData.append('username', credentials.email);
            formData.append('password', credentials.password);

            console.log('Attempting login with:', credentials.email);

            // Login using fastapi-users cookie endpoint
            const response = await axios.post(
                `${API_BASE_URL}/auth/cookie/login`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    withCredentials: true, // Important for cookies
                }
            );

            console.log('Login response:', response.status);

            if (response.status === 204 || response.status === 200) {
                // Login successful, now fetch user details
                console.log('Fetching user details...');
                const userResponse = await axios.get(
                    `${API_BASE_URL}/users/me`,
                    {
                        withCredentials: true,
                    }
                );

                console.log('User data:', userResponse.data);

                const userData = userResponse.data;
                
                // Map backend role to frontend role
                const frontendRole = userData.role === 'stall' ? 'chef' : userData.role;
                
                const userInfo = {
                    id: userData.id,
                    email: userData.email,
                    role: frontendRole,
                    kitchen: credentials.kitchen || null, // Store kitchen if chef
                };

                setUser(userInfo);
                localStorage.setItem('user', JSON.stringify(userInfo));
                setLoading(false);
                return { success: true };
            }
        } catch (error) {
            setLoading(false);
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = 'Invalid credentials. Please check your email and password.';
                } else if (error.response.status === 401) {
                    errorMessage = 'Invalid credentials. Please check your email and password.';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (error.response.data?.detail) {
                    errorMessage = error.response.data.detail;
                }
            } else if (error.request) {
                errorMessage = 'Cannot connect to server. Please check your connection.';
            }
            
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            // Call backend logout endpoint
            await axios.post(
                `${API_BASE_URL}/auth/cookie/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local state regardless of backend response
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    // Provide the context value to children
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create the custom hook to use the context
export const useAuth = () => useContext(AuthContext);