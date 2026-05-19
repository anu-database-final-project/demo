import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import TicketCard from '../../components/TicketCard';
import { Search, Filter, Database } from 'lucide-react';
import { TicketStatus } from '../../types';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { tickets, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const navigate = useNavigate();

  const userTickets = tickets.filter(t => t.createdBy.id === currentUser?.id);
  
  const filteredTickets = userTickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: (TicketStatus | 'All')[] = ['All', 'Open', 'In Progress', 'Waiting', 'Completed', 'Closed'];

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-500 mt-2">Manage and track all your support requests.</p>
        </div>
        
        {/* Schema View Card */}
        <button 
          onClick={() => navigate('/user/schema')}
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

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by ticket title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="block w-full py-2 pl-3 pr-10 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} basePath="/user" />
        ))}
        {filteredTickets.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500">No tickets found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
