import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AssetsManagement = lazy(() => import('./pages/AssetsManagement'));
const AssetForm = lazy(() => import('./pages/AssetForm'));
const EmployeeManagement = lazy(() => import('./pages/EmployeeManagement'));
const Assignment = lazy(() => import('./pages/Assignment'));
const Reports = lazy(() => import('./pages/Reports'));
const AuditLogs = lazy(() => import('./pages/AuditLogs'));

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
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#0f172a',
                        color: '#e2e8f0',
                        border: '1px solid rgba(148,163,184,0.2)',
                    },
                }}
            />
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-200">Loading workspace...</div>}>
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
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
