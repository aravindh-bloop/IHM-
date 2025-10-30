import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';

import ChefDashboard from './pages/ChefDashboard';

import AdminDashboard from './pages/AdminDashboard';

import VendorDashboard from './pages/VendorDashboard';

import './App.css';



// Main content that switches based on auth state

function AppContent() {

  const { user, isAuthenticated, loading } = useAuth();



  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>

          <p className="mt-4 text-gray-600">Loading...</p>

        </div>

      </div>

    );

  }



  if (!isAuthenticated) {

    return <LoginPage />;

  }



  // Show dashboard based on user role (backend uses 'stall' for chef role)

  switch (user?.role) {

    case 'stall':

      return <ChefDashboard />;

    case 'admin':

      return <AdminDashboard />;

    case 'vendor':

      return <VendorDashboard />;

    default:

      return (

        <div className="min-h-screen flex items-center justify-center">

          <div className="text-center text-red-600">

            <p>Unknown role: {user?.role}</p>

            <p className="text-sm text-gray-600 mt-2">Please contact administrator</p>

          </div>

        </div>

      );

  }

}



function App() {

  return (

    <AuthProvider>

      <AppContent />

    </AuthProvider>

  );

}



export default App;

