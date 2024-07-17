

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext';
import Sidebar from '../components/Sidebar';

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
