import { Flowbite } from "flowbite-react";
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar';
import { AuthProvider } from './Context/AuthContext';
import Dashboard from './pages/Dashboard';
import RoleList from './pages/RoleList';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import UserList from './pages/UserList';
import PrivateRoute from "./Context/PrivateRoute";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";

function App() {

   
    return (
        <AuthProvider>
            <Flowbite>
                <Toaster />

                <Router>
                    <Routes>
                        <Route element={<PrivateRoute />}>
                            <Route path="/user-management" element={<UserList />} />
                            <Route path="/role-management" element={<RoleList />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/notifications" element={<Notification />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />                     
                        </Route>
                        <Route path='/signin' element={<Signin />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </Router>

            </Flowbite>
        </AuthProvider>
    );
}

export default App;
