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
      // Call the login function from our ApiService, sending the email and password
      const response = await ApiService.login({ email, password });

      // The SRS document mentions JWT. The backend will likely send an "access_token"
      if (response.access_token) {
        // For now, just show a success message
        alert('Login Successful! Token received.');
        console.log('Received Token:', response.access_token);
        
        // In a real app, we would save this token and redirect the user
        // localStorage.setItem('authToken', response.access_token);
        // window.location.href = '/dashboard';
      } else {
        setError('Login did not return a token.');
      }

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