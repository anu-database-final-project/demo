import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import UserDashboard from './pages/user/UserDashboard';
import CreateTicketPage from './pages/user/CreateTicketPage';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import OpenTicketsPage from './pages/employee/OpenTicketsPage';
import AssignedTicketsPage from './pages/employee/AssignedTicketsPage';
import TicketDetailsPage from './pages/ticket/TicketDetailsPage';

import SchemaViewPage from './pages/SchemaViewPage';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'User' | 'Employee' }) {
  const { role } = useStore();
  
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-role/:role" element={<RoleSelectionPage />} />
        
        {/* User Routes */}
        <Route path="/user" element={
          <ProtectedRoute allowedRole="User">
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<UserDashboard />} />
          <Route path="create-ticket" element={<CreateTicketPage />} />
          <Route path="ticket/:id" element={<TicketDetailsPage />} />
          <Route path="schema" element={<SchemaViewPage />} />
        </Route>
        
        {/* Employee Routes */}
        <Route path="/employee" element={
          <ProtectedRoute allowedRole="Employee">
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<EmployeeDashboard />} />
          <Route path="open-tickets" element={<OpenTicketsPage />} />
          <Route path="assigned-tickets" element={<AssignedTicketsPage />} />
          <Route path="ticket/:id" element={<TicketDetailsPage />} />
          <Route path="schema" element={<SchemaViewPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
