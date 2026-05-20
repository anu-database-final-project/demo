import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LogOut, Ticket, PlusCircle, Inbox, User as UserIcon, Database, Menu } from 'lucide-react';

export default function MainLayout() {
  const { role, currentUser, currentEmployee, logout, fetchTickets } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  React.useEffect(() => {
    fetchTickets();
    
    // Optional: poll every 10 seconds for demo purposes
    const interval = setInterval(() => {
      fetchTickets();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [fetchTickets]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = role === 'User' ? [
    { name: 'My Tickets', path: '/user', icon: Ticket },
    { name: 'Create Ticket', path: '/user/create-ticket', icon: PlusCircle },
    { name: 'Database Schema', path: '/user/schema', icon: Database },
  ] : [
    { name: 'Dashboard', path: '/employee', icon: UserIcon },
    { name: 'Open Tickets', path: '/employee/open-tickets', icon: Inbox },
    { name: 'My Assigned Tickets', path: '/employee/assigned-tickets', icon: Ticket },
    { name: 'Database Schema', path: '/employee/schema', icon: Database },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`bg-white border-r border-gray-200 flex flex-col shadow-sm z-30 transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0
          ${isSidebarOpen ? 'w-64' : 'w-0 border-r-0'}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200 w-64 flex-shrink-0">
          <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
            <Ticket className="w-6 h-6" />
            SupportDesk
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 w-64">
          <div className="px-4 mb-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Menu
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/user' && item.path !== '/employee');
                // special case for index routes
                const isExactActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isExactActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isExactActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 w-64 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {role === 'User' ? currentUser?.name.charAt(0) : currentEmployee?.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {role === 'User' ? currentUser?.name : currentEmployee?.name}
              </div>
              <div className="text-xs text-gray-500">{role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 flex-shrink-0 z-20">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
