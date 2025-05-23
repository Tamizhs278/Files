import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import DeviceDetector from 'device-detector-js';
import { addDoc, collection } from "firebase/firestore";
import { db } from './Auth';

export default function LoginPage() {
  const [darkMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (email === 'tamizhs@files.com' && password === '1416') {
        setError('');
        login();
        navigate('/home');

        const detector = new DeviceDetector();
        const userAgent = navigator.userAgent;
        const parsedDevice = detector.parse(userAgent);
        const currentDateTime = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} ${new Date().toLocaleTimeString()}`;
         console.log(currentDateTime);
         

        const deviceInfo = {
          browser: `${parsedDevice.client?.name} ${parsedDevice.client?.version}`,
          os: `${parsedDevice.os?.name} ${parsedDevice.os?.version}`,
          device: parsedDevice.device?.model || 'Unknown Device',
          vendor: parsedDevice.device?.brand || 'Unknown Vendor',
          type: parsedDevice.device?.type || 'desktop',
          time: currentDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          userEmail: email,
        };

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            deviceInfo.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            await addDoc(collection(db, "LoginHistory"), deviceInfo);
          },
          async () => {
            deviceInfo.location = 'Location denied or unavailable';
            await addDoc(collection(db, "LoginHistory"), deviceInfo);
          }
        );
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      background: darkMode
        ? 'linear-gradient(135deg, #200122, #6f0000)'
        : 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
      px: 2,
    }}
    >
      <Typography
        variant="h3"
        sx={{
          color: darkMode ? '#fff' : '#333',
          fontWeight: 'bold',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Unlock your world, securely and easily...
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          color: darkMode ? '#ddd' : '#333',
          mb: 4,
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        Safe, simple, and secure: Your login, our commitment.
      </Typography>

      <Box display="flex" justifyContent="center">
        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 5 },
            maxWidth: 400,
            width: '100%',
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
              backgroundColor: "transparent"
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
