import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AssetsManagement from './pages/AssetsManagement';
import AssetForm from './pages/AssetForm';
import EmployeeManagement from './pages/EmployeeManagement';
import Assignment from './pages/Assignment';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="assets" element={<AssetsManagement />} />
                    <Route path="assets/new" element={<AssetForm />} />
                    <Route path="assets/edit/:id" element={<AssetForm />} />
                    <Route path="employees" element={<EmployeeManagement />} />
                    <Route path="assignments" element={<Assignment />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="audit-logs" element={<AuditLogs />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
