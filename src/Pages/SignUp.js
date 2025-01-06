import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import '../Styles/LoginPage.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import {registerUser} from '../api/authAPI';

function Signup() {
  const navigate = useNavigate();

  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    password: '',
    confirmpassword: '',
  });

  function validateEmail(email) {
    // Basic email regex for validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const  handleRegister= async ()=> {
    let validationErrors = {};

    if (!userName.trim()) {
      validationErrors.userName = 'userName is required';
    }

    if (!email.trim() || !validateEmail(email)) {
      validationErrors.email = 'Valid email is required';
    }

    if (!password.trim()) {
      validationErrors.password = 'Password is required';
    }

    if (password !== confirmpassword) {
      validationErrors.confirmpassword = 'Passwords do not match';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation failed:', validationErrors);
      return;
    }

    console.log('userName:', userName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmpassword);

    try{
      const sendData = await registerUser({userName,email,password})
      console.log('se',sendData);
      navigate('/');
      
    }
    catch(error){
      console.log(error.response?.data?.message || 'Register failed!');
      
    }


    // Proceed with the registration logic (e.g., API call)
   
  }

  return (
    <>
      <div className="LoginContainer">
        <h1 className="head">Sign Up</h1>
        <div className="LoginBox">
          <TextField
            className="user"
            label="userName"
            variant="outlined"
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
            placeholder="userName"
            error={!!errors.userName}
            helperText={errors.userName}
          />
          <TextField
            className="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            className="pass"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            className="pass"
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            error={!!errors.confirmpassword}
            helperText={errors.confirmpassword}
          />
          <Button className="login-btn" variant="contained" onClick={handleRegister}>
            Register
          </Button>
        </div>
      </div>
    </>
  );
}

export default Signup;
