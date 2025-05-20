import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Login({ onLogin, theme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  
  // Check for remembered user on component mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const parsedUser = JSON.parse(rememberedUser);
        if (parsedUser.username) {
          setUsername(parsedUser.username);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error parsing remembered user:', error);
      }
    }
  }, []);
  
  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'GTA5':
        return {
          container: 'bg-gta-dark border-gta-secondary shadow-lg shadow-gta-primary/20',
          input: 'bg-gray-800 text-gta-primary border-gta-secondary focus:ring-gta-primary focus:border-gta-primary',
          button: 'bg-gta-secondary text-gta-dark hover:bg-gta-primary',
          socialButton: 'bg-gray-800 hover:bg-gray-700 text-gta-primary',
          title: 'text-gta-primary',
          label: 'text-gta-primary',
          link: 'text-gta-primary hover:text-gta-secondary',
          divider: 'border-gta-secondary/30',
        };
      case 'RDR2':
        return {
          container: 'bg-rdr2-dark border-rdr2-secondary shadow-lg shadow-rdr2-primary/20',
          input: 'bg-gray-800 text-rdr2-primary border-rdr2-secondary focus:ring-rdr2-primary focus:border-rdr2-primary',
          button: 'bg-rdr2-secondary text-rdr2-dark hover:bg-rdr2-primary',
          socialButton: 'bg-gray-800 hover:bg-gray-700 text-rdr2-primary',
          title: 'text-rdr2-primary',
          label: 'text-rdr2-primary',
          link: 'text-rdr2-primary hover:text-rdr2-secondary',
          divider: 'border-rdr2-secondary/30',
        };
      case 'RDR':
        return {
          container: 'bg-rdr-dark border-rdr-secondary shadow-lg shadow-rdr-primary/20',
          input: 'bg-gray-800 text-rdr-primary border-rdr-secondary focus:ring-rdr-primary focus:border-rdr-primary',
          button: 'bg-rdr-secondary text-rdr-dark hover:bg-rdr-primary',
          socialButton: 'bg-gray-800 hover:bg-gray-700 text-rdr-primary',
          title: 'text-rdr-primary',
          label: 'text-rdr-primary',
          link: 'text-rdr-primary hover:text-rdr-secondary',
          divider: 'border-rdr-secondary/30',
        };
      case 'Cyberpunk2077':
        return {
          container: 'bg-cyberpunk-dark border-cyberpunk-secondary shadow-lg shadow-cyberpunk-primary/20',
          input: 'bg-gray-800 text-cyberpunk-primary border-cyberpunk-secondary focus:ring-cyberpunk-primary focus:border-cyberpunk-primary',
          button: 'bg-cyberpunk-secondary text-cyberpunk-dark hover:bg-cyberpunk-primary',
          socialButton: 'bg-gray-800 hover:bg-gray-700 text-cyberpunk-primary',
          title: 'text-cyberpunk-primary',
          label: 'text-cyberpunk-primary',
          link: 'text-cyberpunk-primary hover:text-cyberpunk-secondary',
          divider: 'border-cyberpunk-secondary/30',
        };
      default:
        return {
          container: 'bg-gray-800 border-gray-600 shadow-lg shadow-blue-500/20',
          input: 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500',
          button: 'bg-blue-600 text-white hover:bg-blue-500',
          socialButton: 'bg-gray-700 hover:bg-gray-600 text-white',
          title: 'text-white',
          label: 'text-white',
          link: 'text-blue-400 hover:text-blue-300',
          divider: 'border-gray-600',
        };
    }
  };

  const styles = getThemeStyles();
  
  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Attempt login
      const response = await axios.post('http://localhost:5000/api/user/login', { 
        username,
        password: password || undefined, // Only send if present
        email: email || undefined // Only send if present
      });
      
      // Handle successful login
      const userData = response.data.user;
      
      // Store auth token
      localStorage.setItem('token', response.data.token);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Handle "Remember me" option
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      
      // Complete login
      onLogin(userData);
    } catch (error) {
      // If login fails, try to register if not in explicit register mode
      if (error.response && error.response.status === 404 && !showRegister) {
        setError('User not found. Please register first.');
        setShowRegister(true);
      } else {
        setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (isEmailLogin && !email.trim()) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Register new user
      const registerResponse = await axios.post('http://localhost:5000/api/user/register', { 
        username,
        email: email || undefined,
        password: password || undefined,
        preferredTheme: theme 
      });
      
      // Store auth data
      localStorage.setItem('user', JSON.stringify(registerResponse.data.user));
      localStorage.setItem('token', registerResponse.data.token);
      
      // Handle "Remember me" option
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username }));
      }
      
      // Complete login
      onLogin(registerResponse.data.user);
    } catch (registerError) {
      setError(registerError.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle social login
  const handleSocialLogin = (provider) => {
    // In a real app, this would redirect to OAuth flow
    console.log(`Login with ${provider}`);
    setError(`${provider} login is not implemented in this demo`);
  };

  // Toggle between simple and email login
  const toggleLoginMode = () => {
    setIsEmailLogin(!isEmailLogin);
    setError('');
  };

  return (
    <div className={`max-w-md mx-auto my-4 md:my-8 p-4 md:p-6 rounded-lg border ${styles.container}`}>
      <h2 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center ${styles.title}`}>
        {showRegister ? "Create your ChronoMap account" : "Sign in to ChronoMap"}
      </h2>
      
      <form onSubmit={showRegister ? handleRegister : handleLogin}>
        {/* Username field */}
        <div className="mb-3 md:mb-4">
          <label className={`block mb-1 md:mb-2 text-sm font-medium ${styles.label}`}>
            Username
          </label>
          <input
            type="text"
            className={`w-full p-2 md:p-3 text-sm md:text-base rounded-lg ${styles.input}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        
        {/* Email field - shown in advanced mode or registration */}
        {(isEmailLogin || showRegister) && (
          <div className="mb-3 md:mb-4">
            <label className={`block mb-1 md:mb-2 text-sm font-medium ${styles.label}`}>
              Email
            </label>
            <input
              type="email"
              className={`w-full p-2 md:p-3 text-sm md:text-base rounded-lg ${styles.input}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
        )}
        
        {/* Password field - shown in advanced mode or registration */}
        {(isEmailLogin || showRegister) && (
          <div className="mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-1 md:mb-2">
              <label className={`text-sm font-medium ${styles.label}`}>
                Password
              </label>
              {!showRegister && (
                <a href="#" className={`text-xs md:text-sm ${styles.link}`}>
                  Forgot password?
                </a>
              )}
            </div>
            <input
              type="password"
              className={`w-full p-2 md:p-3 text-sm md:text-base rounded-lg ${styles.input}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={showRegister ? "Create a password" : "Enter your password"}
            />
          </div>
        )}
        
        {/* Remember me checkbox */}
        <div className="flex items-center mb-4 md:mb-6">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember" className={`ml-2 text-xs md:text-sm ${styles.label}`}>
            Remember me
          </label>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-3 md:mb-4 p-2 bg-red-900/30 border border-red-800 rounded text-xs md:text-sm text-red-400">
            {error}
          </div>
        )}
        
        {/* Submit button */}
        <button
          type="submit"
          className={`w-full py-2 md:py-3 px-4 rounded-lg text-sm md:text-base font-medium ${styles.button}`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : (showRegister ? 'Create Account' : 'Sign In')}
        </button>
        
        {/* Switch between login/register */}
        <div className="mt-3 md:mt-4 text-center">
          <button 
            type="button" 
            className={`text-xs md:text-sm ${styles.link}`}
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </div>
        
        {/* Divider */}
        <div className="flex items-center my-4 md:my-6">
          <div className={`flex-grow border-t ${styles.divider}`}></div>
          <span className={`px-3 md:px-4 text-xs md:text-sm ${styles.label}`}>or continue with</span>
          <div className={`flex-grow border-t ${styles.divider}`}></div>
        </div>
        
        {/* Social login buttons */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <button
            type="button"
            className={`py-1 md:py-2 px-2 md:px-4 rounded-lg flex justify-center items-center text-xs md:text-sm ${styles.socialButton}`}
            onClick={() => handleSocialLogin('Google')}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className={`py-1 md:py-2 px-2 md:px-4 rounded-lg flex justify-center items-center text-xs md:text-sm ${styles.socialButton}`}
            onClick={() => handleSocialLogin('Apple')}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M16.198 0H7.802C3.496 0 0 3.496 0 7.802v8.396C0 20.504 3.496 24 7.802 24h8.396c4.306 0 7.802-3.496 7.802-7.802V7.802C24 3.496 20.504 0 16.198 0zm-8-0h-.5.5zm8.5.5V.499v.001z"/>
            </svg>
            Apple
          </button>
          <button
            type="button"
            className={`py-1 md:py-2 px-2 md:px-4 rounded-lg flex justify-center items-center text-xs md:text-sm ${styles.socialButton}`}
            onClick={() => handleSocialLogin('Facebook')}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/>
            </svg>
            Facebook
          </button>
        </div>
        
        {/* Login mode toggle */}
        <div className="mt-4 md:mt-6 text-center">
          <button
            type="button"
            className={`text-xs md:text-sm ${styles.link}`}
            onClick={toggleLoginMode}
          >
            {isEmailLogin 
              ? "Use simple login with username only" 
              : "Use email and password instead"}
          </button>
        </div>
      </form>
    </div>
  );
} 