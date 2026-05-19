import React from 'react';
import { useStore } from '../../store/useStore';
import TicketCard from '../../components/TicketCard';
import { Inbox, CheckCircle, Clock, Database } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const { tickets, currentEmployee } = useStore();
  const navigate = useNavigate();
  
  const openTicketsCount = tickets.filter(t => t.status === 'Open' && !t.assignedEmployee).length;
  const assignedTicketsCount = tickets.filter(t => t.assignedEmployee?.id === currentEmployee?.id).length;
  const completedTicketsCount = tickets.filter(t => t.assignedEmployee?.id === currentEmployee?.id && t.status === 'Completed').length;

  const recentAssignedTickets = tickets
    .filter(t => t.assignedEmployee?.id === currentEmployee?.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back, {currentEmployee?.name}. Here's an overview of the tickets.</p>
        </div>
        
        {/* Schema View Card */}
        <button 
          onClick={() => navigate('/employee/schema')}
          className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 p-4 rounded-xl shadow-sm transition-all duration-200 flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="font-bold text-gray-900 text-sm">View Database Schema</div>
            <div className="text-xs text-gray-500">Explore table relationships</div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Unassigned Open Tickets</div>
            <div className="text-3xl font-bold text-gray-900">{openTicketsCount}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-4">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">My Active Tickets</div>
            <div className="text-3xl font-bold text-gray-900">{assignedTicketsCount}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Resolved by Me</div>
            <div className="text-3xl font-bold text-gray-900">{completedTicketsCount}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Recently Updated</h2>
          <Link to="/employee/assigned-tickets" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        
        <div className="p-6">
          {recentAssignedTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentAssignedTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} basePath="/employee" />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              You haven't been assigned to any tickets yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
