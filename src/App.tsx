import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import LocationInput from './components/LocationInput';
import AlumniMap from './components/AlumniMap';
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

// Demo mode state
const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    sub: 'demo-user-id'
  });

  return { isDemoMode, setIsDemoMode, demoUser };
};

// Demo Login component
const DemoLogin = () => {
  const { setIsDemoMode } = useDemoMode();
  const navigate = useNavigate();

  const startDemo = () => {
    setIsDemoMode(true);
    navigate('/location');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>UWCCR Alumni Network</h1>
          <p>Connect with fellow UWCCR alumni around the world</p>
        </div>

        <div className="login-tabs">
          <div className="tab active">Demo Mode</div>
        </div>

        <div className="demo-info">
          <p>🚀 Try the full experience without setting up Auth0!</p>
          <p>This demo will show you:</p>
          <ul>
            <li>Location input with autocomplete</li>
            <li>Interactive global map</li>
            <li>Alumni location visualization</li>
          </ul>
        </div>

        <button 
          onClick={startDemo} 
          className="login-button primary"
        >
          Start Demo
        </button>

        <div className="login-footer">
          <p>To set up real authentication, see <code>setup-auth0.md</code></p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { isDemoMode, setIsDemoMode, demoUser } = useDemoMode();
  
  // Get Auth0 configuration from environment variables
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  // If in demo mode, render without Auth0
  if (isDemoMode) {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/location" element={<LocationInput />} />
            <Route path="/map" element={<AlumniMap />} />
            <Route path="/" element={<Navigate to="/location" />} />
          </Routes>
        </div>
      </Router>
    );
  }

  // Check if Auth0 is configured - if not, show demo mode
  if (!domain || !clientId || domain === 'your-domain.auth0.com' || clientId === 'your-client-id-here') {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<DemoLogin />} />
            <Route path="/location" element={<LocationInput />} />
            <Route path="/map" element={<AlumniMap />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`
      }}
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
