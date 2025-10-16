import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, CssBaseline } from '@mui/material';
// Import the ApiService we will use to talk to the backend
import ApiService from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // A new state to hold any error messages

  const handleSubmit = async (event) => {
    event.preventDefault(); // This stops the page from reloading
    setError(''); // Clear any previous errors

    try {
      // FastAPI Users cookie auth returns 204 (No Content) on success
      await ApiService.login({ username: email, password });

      // On success the server sets an HttpOnly cookie; use it for subsequent requests
      alert('Login successful!');
      // Example: you could now fetch the current user or navigate
      // const me = await ApiService.request('/api/users/me');
      // console.log('Current user:', me);
    } catch (err) {
      // If the API call fails (e.g., wrong password, server error)
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
      alert('Login Failed: ' + (err.message || 'Please check your credentials.'));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          FUMU Portal Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Display an error message if one exists */}
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;