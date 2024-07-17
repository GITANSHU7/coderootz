

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext';
import Sidebar from '../components/Sidebar';
import AppFooter from '../components/Footer';

const PrivateRoutes = () => {
    const { authenticated } = useAuth();
    return (
        authenticated ? <>
            <Sidebar />
            <Outlet />
            
        </> : <Navigate to='/signin' />
    )
}

export default PrivateRoutes;
