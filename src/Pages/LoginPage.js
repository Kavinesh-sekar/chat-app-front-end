import React ,{useState}from 'react'
import TextField from '@mui/material/TextField';
import '../Styles/LoginPage.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Signup from './SignUp';


function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ username: false, password: false });

    const navigate = useNavigate();
    
    console.log('test');
    


    function handeLogin(){
      setError({ username: false, password: false });

      let hasError = false;

      if (username.trim() === '') {
        setError((prev) => ({ ...prev, username: true }));
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
  
      console.log('Username:', username);
      console.log('Password:', password);
    }
  return (
   <>
   
    <div className='LoginContainer'>
        <h1 className='head'>Login</h1>
        <div className='LoginBox'>
        <TextField className ='user' label="Email"variant="outlined"
         value={username} onChange={(e) => setUsername(e.target.value)}
          placeholder='Username'
          error={error.username}
          helperText={error.username ? 'Email is required' : ''} 
          
          />


        <TextField  className ='pass'
         label="Password" variant="outlined" type='password' 
         value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder='Password' 
          error={error.password} 
          helperText={error.password ? 'Password is required' : ''}
          
          />

        <Button className= 'login-btn' variant="contained" onClick={handeLogin}>Login </Button>

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
  )
}

export default LoginPage
