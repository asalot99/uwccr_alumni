import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { loginWithRedirect, loginWithPopup, isAuthenticated, logout } = useAuth0();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  // Force logout if user is authenticated when reaching login page
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated on login page, logging out...');
      logout({
        logoutParams: {
          returnTo: window.location.origin + '/login'
        }
      });
    }
  }, [isAuthenticated, logout]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'login',
          login_hint: email,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
          login_hint: email,
          // Pass additional signup data
          signup: {
            given_name: firstName,
            family_name: lastName,
          }
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSSO = async () => {
    setIsLoading(true);
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: activeTab === 'signup' ? 'signup' : 'login',
        },
      });
    } catch (error) {
      console.error('SSO error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>UWCCR Alumni Network</h1>
          <p>Connect with fellow alumni around the world</p>
        </div>

        <div className="login-tabs">
          <div 
            className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </div>
          <div 
            className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </div>
        </div>

        {activeTab === 'signin' ? (
          <form onSubmit={handleEmailLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="login-button primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="login-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signupEmail">Email</label>
              <input
                type="email"
                id="signupEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input
                type="password"
                id="signupPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min 8 characters)"
                minLength={8}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="login-button primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="divider">
          <span>or</span>
        </div>

        <button 
          onClick={handleSSO} 
          className="login-button sso"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : `Continue with SSO ${activeTab === 'signup' ? '(Sign Up)' : '(Sign In)'}`}
        </button>

        <div className="login-footer">
          <p className="privacy-note">
            🔒 Your data is secure and only used to connect you with fellow alumni
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
