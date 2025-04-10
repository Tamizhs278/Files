import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useAuth } from './AuthContext';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0% {
    text-shadow: 0 0 5px #fff, 0 0 10px #ff416c, 0 0 15px #ff416c;
  }
  50% {
    text-shadow: 0 0 10px #fff, 0 0 20px #ff4b2b, 0 0 30px #ff4b2b;
  }
  100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #ff416c, 0 0 15px #ff416c;
  }
`;

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (email === 'tamizhs@files.com' && password === '14081604') {
        setError('');
        login();
        navigate('/home');
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: darkMode
          ? 'linear-gradient(135deg, #200122, #6f0000)'
          : 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        px: 2,
        py: 4,
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'all 0.5s ease',
      }}
    >
      {/* Optional Dark Mode Toggle */}
      {/* <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleTheme} />}
        label={darkMode ? 'Dark Mode' : 'Light Mode'}
        sx={{ position: 'absolute', top: 20, right: 20, color: darkMode ? '#fff' : '#333' }}
      /> */}

      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography
          variant="h4"
          sx={{
            color: darkMode ? '#fff' : '#333',
            fontWeight: 'bold',
            mb: 1,
            textAlign: 'center',
            textShadow: darkMode ? '0 2px 5px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          Unlock your world, securely and easily....
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            color: darkMode ? '#ccc' : '#555',
            mb: 4,
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          Safe, simple, and secure: Your login, our commitment.
        </Typography>

        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 5,
            background: darkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 3,
              fontWeight: 'bold',
              color: darkMode ? '#fff' : '#222',
            }}
          >
            🔒 Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            inputProps={{ style: { fontSize: 16 } }}
            sx={{
              mb: 2,
              input: { color: darkMode ? '#fff' : '#000' },
              label: { color: darkMode ? '#ccc' : '#666' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ccc' : '#999' },
                '&:hover fieldset': { borderColor: darkMode ? '#fff' : '#444' },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            inputProps={{ style: { fontSize: 16 } }}
            sx={{
              mb: 2,
              input: { color: darkMode ? '#fff' : '#000' },
              label: { color: darkMode ? '#ccc' : '#666' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: darkMode ? '#ccc' : '#999' },
                '&:hover fieldset': { borderColor: darkMode ? '#fff' : '#444' },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: darkMode ? '#fff' : '#000' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              textAlign: 'right',
              color: darkMode ? '#ccc' : '#444',
              mb: 2,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => alert('Feature coming soon!')}
          >
            Forgot Password?
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              background: 'linear-gradient(to right, #ff4b2b, #ff416c)',
              fontWeight: 'bold',
              color: '#fff',
              py: 1.5,
              borderRadius: 3,
              '&:hover': {
                background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
              },
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
