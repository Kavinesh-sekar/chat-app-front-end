import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import '../Styles/LoginPage.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authAPI';
import {jwtDecode} from 'jwt-decode';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: false, password: false });
  const [loginError, setLoginError] = useState(''); // State for login error message

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError({ email: false, password: false });
    setLoginError(''); // Reset login error message

    let hasError = false;

    if (email.trim() === '') {
      setError((prev) => ({ ...prev, email: true }));
      hasError = true;
    }

    if (password.trim() === '') {
      setError((prev) => ({ ...prev, password: true }));
      hasError = true;
    }

    if (hasError) {
      console.log('Validation failed. Please fill all required fields.');
      return;
    }

    console.log('email:', email);
    console.log('Password:', password);

    try {
      const data = await loginUser({ email, password });
      console.log('data:', data);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      const decodedToken = jwtDecode(data.accessToken);
      localStorage.setItem('ids', decodedToken.id);

      navigate('/dashboard');
    } catch (error) {
      console.log(error.response?.data?.message || 'Login failed!');
      // Set the login error message
      setLoginError('Username or password is incorrect');
    }
  };

  return (
    <>
      <div className="LoginContainer">
        <h2>Chat App</h2>
        <h3 className="head">Login</h3>
        <div className="LoginBox">
          <TextField
            className="user"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            error={error.email}
            helperText={error.email ? 'Email is required' : ''}
          />

          <TextField
            className="pass"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            error={error.password}
            helperText={error.password ? 'Password is required' : ''}
          />

          {loginError && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{loginError}</p>
          )}

          <Button size="small" variant="contained" onClick={handleLogin}>
            Login
          </Button>

          <p>
            Create the New Account{' '}
            <span
              className="signup-link"
              onClick={() => navigate('/Signup')}
              style={{ color: 'blue', cursor: 'pointer' }}
            >
              here
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
