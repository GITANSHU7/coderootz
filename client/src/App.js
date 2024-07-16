import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import Signin from './pages/Signin';
import Sidebar from './components/Sidebar';
import UserList from './pages/UserList';

function App() {
  return (
    <>
      <Sidebar />
      <Toaster />
      <Routes> 
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/user-list" element={<UserList/>} />
          <Route path="/" element={<Dashboard/>} />
         
        </Routes>
    </>
  );
}

export default App;
