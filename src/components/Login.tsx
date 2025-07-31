import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { loginWithRedirect, loginWithPopup, isAuthenticated } = useAuth0();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // If already authenticated, redirect to location input
  if (isAuthenticated) {
    navigate('/location');
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginWithRedirect({
        authorizationParams: {
          username: email,
          password: password,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSSO = async () => {
    setIsLoading(true);
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error('SSO error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Alumni Network Map</h1>
          <p>Connect with fellow alumni around the world</p>
        </div>

        <div className="login-tabs">
          <div className="tab active">Sign In</div>
        </div>

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

        <div className="divider">
          <span>or</span>
        </div>

        <button 
          onClick={handleSSO} 
          className="login-button sso"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Continue with SSO'}
        </button>

        <div className="login-footer">
          <p>Don't have an account? <a href="#" onClick={handleSSO}>Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 