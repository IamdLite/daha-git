import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ChangeThemes from '../components/ChangesThemes';
import { useAuth } from '../contexts/AuthContext';
import { requestTelegramCode, verifyTelegramCode, TelegramCodeRequest, TelegramCodeVerify } from '../api/auth';
import { TextField, Button, Box, Typography } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [mockCode, setMockCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestCode = async () => {
    setError(null);
    setIsLoading(true);
    console.log('Request code clicked, username:', username);

    // Validate username
    const normalizedUsername = username.replace(/^@/, '');
    if (!normalizedUsername || normalizedUsername.length < 5) {
      setError('Username must be at least 5 characters');
      setIsLoading(false);
      toast.error('Invalid username');
      console.log('Validation failed: Username too short');
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(normalizedUsername)) {
      setError('Username can only contain letters, numbers, and underscores');
      setIsLoading(false);
      toast.error('Invalid username format');
      console.log('Validation failed: Invalid username format');
      return;
    }

    try {
      // Get mock code
      const response = await requestTelegramCode({ username: normalizedUsername });
      console.log('Mock: Code request response:', response);
      setMockCode(response.code);
      setIsLoading(false);
      toast.success('Verification code sent! Check below for mock code.');
    } catch (error) {
      setError('Failed to request code');
      setIsLoading(false);
      toast.error('Failed to request code');
      console.error('Mock: Code request error:', error);
    }
  };

  const handleVerifyCode = async () => {
    setError(null);
    setIsLoading(true);
    console.log('Verify code clicked, username:', username, 'Code:', code);

    // Validate username
    const normalizedUsername = username.replace(/^@/, '');
    if (!normalizedUsername || normalizedUsername.length < 5) {
      setError('Username must be at least 5 characters');
      setIsLoading(false);
      toast.error('Invalid username');
      console.log('Validation failed: Username too short');
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(normalizedUsername)) {
      setError('Username can only contain letters, numbers, and underscores');
      setIsLoading(false);
      toast.error('Invalid username format');
      console.log('Validation failed: Invalid username format');
      return;
    }

    // Validate code
    if (!code || code.length !== 4 || !/^\d{4}$/.test(code)) {
      setError('Code must be a 4-digit number');
      setIsLoading(false);
      toast.error('Invalid code');
      console.log('Validation failed: Invalid code format');
      return;
    }
    if (!mockCode) {
      setError('No code requested. Please request a code first.');
      setIsLoading(false);
      toast.error('Request a code first');
      console.log('Validation failed: No mock code available');
      return;
    }
    if (code !== mockCode) {
      setError('Incorrect verification code');
      setIsLoading(false);
      toast.error('Incorrect code');
      console.log('Validation failed: Code mismatch, entered:', code, 'expected:', mockCode);
      return;
    }

    try {
      // Verify mock code
      const response = await verifyTelegramCode({ username: normalizedUsername, code });
      console.log('Mock: Code verification response:', response);
      setAuth(response.access_token);
      setIsLoading(false);
      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      setError('Failed to verify code');
      setIsLoading(false);
      toast.error('Failed to verify code');
      console.error('Mock: Code verification error:', error);
    }
  };

  const handleDebug = () => {
    console.group('Debug State');
    console.log('Username:', username);
    console.log('Code:', code);
    console.log('Mock Code:', mockCode);
    console.log('Is Loading:', isLoading);
    console.log('Error:', error);
    console.log('LocalStorage:', {
      isAuthenticated: localStorage.getItem('isAuthenticated'),
      access_token: localStorage.getItem('access_token'),
    });
    console.groupEnd();
    toast('Debug info logged to console');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
      }}
    >
      <div
        style={{
          minWidth: 340,
          maxWidth: 380,
          padding: '2.5rem 2rem 2rem 2rem',
          borderRadius: 18,
          background: '#fff',
          boxShadow: '0 6px 32px 0 rgba(60,72,88,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <ChangeThemes />
        </div>
        <Typography variant="h4" style={{ fontSize: 26, fontWeight: 700, color: '#3b3b3b', letterSpacing: 0.5 }}>
          DAHA Admin Portal
        </Typography>
        <Typography variant="h6" style={{ fontSize: 18, fontWeight: 500, color: '#6366f1' }}>
          Hello, 👋 Welcome Back!
        </Typography>
        <Box sx={{ width: '100%', mt: 2 }}>
          <TextField
            fullWidth
            label="Telegram Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Telegram username (e.g., @username)"
            variant="outlined"
            disabled={isLoading}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleRequestCode}
            disabled={isLoading || !username}
            sx={{
              backgroundColor: '#6366f1',
              color: '#fff',
              textTransform: 'none',
              borderRadius: '8px',
              padding: '0.75rem',
              '&:hover': { backgroundColor: '#4f46e5' },
            }}
          >
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </Box>
        {mockCode && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography style={{ color: '#6366f1', fontSize: 14, textAlign: 'center', marginBottom: 8 }}>
              Mock Code (for testing): {mockCode}
            </Typography>
            <TextField
              fullWidth
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the 4-digit code"
              variant="outlined"
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyCode}
              disabled={isLoading || !code}
              sx={{
                backgroundColor: '#6366f1',
                color: '#fff',
                textTransform: 'none',
                borderRadius: '8px',
                padding: '0.75rem',
                '&:hover': { backgroundColor: '#4f46e5' },
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleDebug}
              sx={{ mt: 1, textTransform: 'none', borderRadius: '8px', padding: '0.5rem' }}
            >
              Debug
            </Button>
          </Box>
        )}
        {error && (
          <Typography style={{ color: '#ef4444', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
            {error}
            <br />
            Please ensure:
            <br />
            1. Username is at least 5 characters (e.g., @username)
            <br />
            2. Code is a 4-digit number
          </Typography>
        )}
        {isLoading && !error && (
          <Typography style={{ color: '#6366f1', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
            Processing...
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Login;
