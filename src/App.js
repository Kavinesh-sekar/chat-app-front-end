import logo from './logo.svg';
import './App.css';
import Chat from './Chat';
import LoginPage from './Pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from '../src/Pages/SignUp';

function App() {
  return (
  <Router>

    <Routes>
      <Route path = '/' element = {<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
  );
}

export default App;
