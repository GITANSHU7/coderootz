import { Flowbite } from "flowbite-react";
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar';
import { AuthProvider } from './Context/AuthContext';
import Dashboard from './pages/Dashboard';
import RoleList from './pages/RoleList';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import UserList from './pages/UserList';
import PrivateRoute from "./Context/PrivateRoute";

function App() {
    return (
        <AuthProvider>
            <Flowbite>

                <Toaster />


                <Router>
                    <Routes>
                        <Route element={<PrivateRoute />}>
                            <Route path="/user-list" element={<UserList />} />
                            <Route path="/role-list" element={<RoleList />} />
                            <Route path="/" element={<Dashboard />} />
                            {/* <Route path='/products' element={<Products />} /> */}
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
