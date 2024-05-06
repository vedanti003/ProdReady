import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './component/Register';
import Login from './component/Login';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    // <Register/>
    <>
    
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/qrDetail' element={<UserProfile/>} />
      
    </Routes>
    </BrowserRouter>
    </>
    
  );
}

export default App;
