import React ,{useState}from 'react'
import TextField from '@mui/material/TextField';
import '../Styles/LoginPage.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Signup from './SignUp';
import { loginUser } from '../api/authAPI';
import {jwtDecode} from 'jwt-decode'



function LoginPage() {

    const [email, SetEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ email: false, password: false });

    const navigate = useNavigate();
    
    console.log('test');
    


    const  handeLogin= async()=>{
      setError({ email: false, password: false });

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

      try{
        const data =  await loginUser({email,password})
        console.log('dataaaa',data);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        const decodedToken = jwtDecode(data.accessToken);
        localStorage.setItem('ids',decodedToken.id );


    

   
        navigate('/dashboard');

        

        
      }catch(error){
        console.log(error.response?.data?.message || 'Login failed!');
        
      }
    }
  return (
   <>
   
    <div className='LoginContainer'>
        <h1 className='head'>Login</h1>
        <div className='LoginBox'>
        <TextField className ='user' label="Email"variant="outlined"
         value={email} onChange={(e) => SetEmail(e.target.value)}
          placeholder='email'
          error={error.email}
          helperText={error.email ? 'Email is required' : ''} 
          
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
