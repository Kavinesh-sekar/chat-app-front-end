// import React, { useState } from 'react';
// import TextField from '@mui/material/TextField';
// import '../Styles/LoginPage.css';
// import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';
// import {registerUser} from '../api/authAPI';

// function Signup() {
//   const navigate = useNavigate();

//   const [userName, setuserName] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [confirmpassword, setConfirmPassword] = useState('');
//   const [errors, setErrors] = useState({
//     userName: '',
//     email: '',
//     password: '',
//     confirmpassword: '',
//   });

//   function validateEmail(email) {
//     // Basic email regex for validation
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   }

//   const  handleRegister= async ()=> {
//     let validationErrors = {};

//     if (!userName.trim()) {
//       validationErrors.userName = 'userName is required';
//     }

//     if (!email.trim() || !validateEmail(email)) {
//       validationErrors.email = 'Valid email is required';
//     }

//     if (!password.trim()) {
//       validationErrors.password = 'Password is required';
//     }

//     if (password !== confirmpassword) {
//       validationErrors.confirmpassword = 'Passwords do not match';
//     }

//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length > 0) {
//       console.log('Validation failed:', validationErrors);
//       return;
//     }

//     console.log('userName:', userName);
//     console.log('Email:', email);
//     console.log('Password:', password);
//     console.log('Confirm Password:', confirmpassword);

//     try{
//       const sendData = await registerUser({userName,email,password})
//       console.log('se',sendData);
//       navigate('/');
      
//     }
//     catch(error){
//       console.log(error.response?.data?.message || 'Register failed!');
      
//     }


//     // Proceed with the registration logic (e.g., API call)
   
//   }

//   return (
//     <>
//       <div className="LoginContainer">
//         <h1 className="head">Sign Up</h1>
//         <div className="LoginBox">
//           <TextField
//             className="user"
//             label="userName"
//             variant="outlined"
//             value={userName}
//             onChange={(e) => setuserName(e.target.value)}
//             placeholder="userName"
//             error={!!errors.userName}
//             helperText={errors.userName}
//           />
//           <TextField
//             className="email"
//             label="Email"
//             variant="outlined"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             error={!!errors.email}
//             helperText={errors.email}
//           />
//           <TextField
//             className="pass"
//             label="Password"
//             variant="outlined"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             error={!!errors.password}
//             helperText={errors.password}
//           />
//           <TextField
//             className="pass"
//             label="Confirm Password"
//             variant="outlined"
//             type="password"
//             value={confirmpassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             placeholder="Confirm Password"
//             error={!!errors.confirmpassword}
//             helperText={errors.confirmpassword}
//           />
//           <Button className="login-btn" variant="contained" onClick={handleRegister}>
//             Register
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Signup;


import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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
  // if (file) formData.append('files', file);

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
    // formData.append('profileImage', profileImage);

    console.log('pppppppp',profileImage);
    

    if (profileImage) formData.append('files', profileImage);

    try {
      const sendData = await registerUser(formData);
      console.log('Response:', sendData);
      navigate('/');
    } catch (error) {
      console.log('register error',error);
      
      console.log(error.response?.data?.message || 'Register failed!');
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
        <Button className="RegisterButton" variant="contained" onClick={handleRegister}>
          Register
        </Button>
      </div>
    </div>
  );
}

export default Signup;
