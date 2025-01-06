import logo from './logo.svg';
import './App.css';
import Chat from './Chat';
import LoginPage from './Pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from '../src/Pages/SignUp';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
  <Router>

    <Routes>
      <Route path = '/' element = {<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path = "/dashboard" element= {<ChatPage />} />
    </Routes>
  </Router>
  );
}

export default App;
