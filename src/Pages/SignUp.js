import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Material-UI Circular Loader
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authAPI';
import '../Styles/SignUpPage.css';

function Signup() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    password: '',
    confirmpassword: '',
    profileImage: '',
  });

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async () => {
    let validationErrors = {};

    if (!userName.trim()) {
      validationErrors.userName = 'Username is required';
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

    if (!profileImage) {
      validationErrors.profileImage = 'Profile image is required';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation failed:', validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('password', password);
    if (profileImage) formData.append('files', profileImage);

    setLoading(true); // Start loading
    try {
      const sendData = await registerUser(formData);
      console.log('Response:', sendData);
      setLoading(false); // Stop loading
      navigate('/');
    } catch (error) {
      console.log('register error', error);
      console.log(error.response?.data?.message || 'Register failed!');
      setLoading(false); // Stop loading even on failure
    }
  };

  return (
    <div className="SignupContainer">
      <h1 className="SignupHeading">Sign Up</h1>
      <div className="SignupBox">
        <div className="ProfileImageContainer">
          {profilePreview ? (
            <img src={profilePreview} alt="Profile Preview" className="ProfilePreview" />
          ) : (
            <div className="PlaceholderImage">Profile Image</div>
          )}
          <Button
            variant="contained"
            component="label"
            className="UploadButton"
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </Button>
          {errors.profileImage && <p className="ErrorText">{errors.profileImage}</p>}
        </div>
        <TextField
          className="InputField"
          label="Username"
          variant="outlined"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          error={!!errors.userName}
          helperText={errors.userName}
        />
        <TextField
          className="InputField"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          className="InputField"
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
          className="InputField"
          label="Confirm Password"
          variant="outlined"
          type="password"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          error={!!errors.confirmpassword}
          helperText={errors.confirmpassword}
        />

        {/* Show loading indicator or the Register button */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CircularProgress size={20} />
            <span>Creating account...</span>
          </div>
        ) : (
          <Button className="RegisterButton" variant="contained" onClick={handleRegister}>
            Register
          </Button>
        )}
      </div>
    </div>
  );
}

export default Signup;
