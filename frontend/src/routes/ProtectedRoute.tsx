import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
    const adminSession = localStorage.getItem('admin_session');

    if (!adminSession) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};