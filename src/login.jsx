// LoginPage.jsx
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
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
  const navigate = useNavigate();

 
  const { login } = useAuth();

const handleLogin = () => {
  if (email === 'tamizhs@files.com' && password === '14081604') {
    setError('');
    login();            // mark user as authenticated
    navigate('/home');  // go to home
  } else {
    setError('Invalid credentials');
  }
};


  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: darkMode
          ? 'linear-gradient(135deg, #200122, #6f0000)'
          : 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        px: 2,
        transition: 'all 0.5s ease',
      }}
    >
      {/* <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleTheme} />}
        label={darkMode ? 'Dark Mode' : 'Light Mode'}
        sx={{ position: 'absolute', top: 20, right: 20, color: darkMode ? '#fff' : '#333' }}
      /> */}

      <Typography
        variant="h3"
        sx={{
          color: darkMode ? '#fff' : '#333',
          fontWeight: 'bold',
          mb: 1,
          textShadow: darkMode ? '0 2px 5px rgba(0,0,0,0.5)' : 'none',
          textAlign: 'center',
        }}
      >
       Unlock your world, securely and easily....
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          color: darkMode ? '#ddd' : '#fff',
          mb: 4,
         // animation: `${fadeInUp} 2s ease-out, ${pulseGlow} 3s ease-in-out infinite`,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        Safe, simple, and secure: Your login, our commitment.
      </Typography>

      <Paper
        elevation={12}
        sx={{
          p: 5,
          maxWidth: 400,
          width: '100%',
          borderRadius: 5,
          background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant="h4"
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
          sx={{
            mb: 3,
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

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
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
          Login
        </Button>
      </Paper>
    </Box>
  );
}
