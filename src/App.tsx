import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Login from './components/Login';
import LocationInput from './components/LocationInput';
import AlumniMap from './components/AlumniMap';
import { performOneTimeCleanup } from './utils/clearAuthCache';
import './App.css';

// Auth Callback component
const AuthCallback = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/location');
      } else if (error) {
        console.error('Auth error:', error);
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, error, navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Authenticating...</p>
      </div>
    );
  }

  return null;
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  // Perform one-time cleanup of cached authentication data
  useEffect(() => {
    performOneTimeCleanup();
  }, []);

  // Get Auth0 configuration from environment variables
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  // Ensure Auth0 is configured
  if (!domain || !clientId) {
    return (
      <div className="error-container">
        <h1>Configuration Error</h1>
        <p>Auth0 configuration is missing. Please check your .env file.</p>
        <p>Required variables:</p>
        <ul>
          <li>VITE_AUTH0_DOMAIN</li>
          <li>VITE_AUTH0_CLIENT_ID</li>
        </ul>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`
      }}
      cacheLocation="memory"
      useRefreshTokens={false}
    >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<AuthCallback />} />
            <Route path="/location" element={<ProtectedRoute><LocationInput /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><AlumniMap /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  );
}

export default App;
