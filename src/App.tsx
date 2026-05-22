import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore, API_URL } from './store/useStore';
import { Loader2 } from 'lucide-react';
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

const FullScreenLoader = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
    <h2 className="text-xl font-semibold text-slate-800">Connecting to Server...</h2>
    <p className="text-slate-500 mt-2">Please wait while we establish a connection.</p>
  </div>
);

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'User' | 'Employee' }) {
  const { role } = useStore();
  
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const checkHeartbeat = async () => {
      try {
        const response = await fetch(`${API_URL}/heartbeat`);
        if (response.status === 200) {
          setIsServerReady(true);
        } else {
          timeoutId = setTimeout(checkHeartbeat, 5000);
        }
      } catch (error) {
        timeoutId = setTimeout(checkHeartbeat, 5000);
      }
    };

    checkHeartbeat();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!isServerReady) {
    return <FullScreenLoader />;
  }

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
