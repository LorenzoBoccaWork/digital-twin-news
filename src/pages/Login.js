import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';
import {
  Box, Button, TextField, Typography,
  Paper, Alert, CircularProgress
} from '@mui/material';

// Pagina di login
// Gestisce autenticazione e memorizza il token JWT e company_id
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Funzione login: invia credenziali al backend e salva token
const handleLogin = async () => {
  setLoading(true);
  setError('');

  // Login temporaneo di test (da rimuovere quando il backend è pronto)
  if (username === 'Lorenzo' && password === 'Bocca') {
    localStorage.setItem('token', 'test-token-temporaneo');
    localStorage.setItem('company_id', '001');
    navigate('/dashboard');
    setLoading(false);
    return;
  }

  try {
    const res = await API.post('/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('company_id', res.data.company_id);
    navigate('/dashboard');
  } catch (err) {
    setError('Credenziali non valide. Riprova.');
  } finally {
    setLoading(false);
  }
};
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Paper sx={{ p: 4, width: 360, borderRadius: 3 }} elevation={4}>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          📰 Digital Twin News
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Accedi per visualizzare la dashboard
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Username" fullWidth margin="normal"
          value={username} onChange={e => setUsername(e.target.value)}
        />
        <TextField
          label="Password" type="password" fullWidth margin="normal"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleLogin()}
        />
        <Button
          variant="contained" fullWidth sx={{ mt: 2, py: 1.5 }}
          onClick={handleLogin} disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Accedi'}
        </Button>
      </Paper>
    </Box>
  );
}

