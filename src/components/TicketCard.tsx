import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../types';
import { Calendar, User as UserIcon, Tag } from 'lucide-react';
import clsx from 'clsx';

export default function TicketCard({ ticket, basePath }: { ticket: Ticket; basePath: string }) {
  const navigate = useNavigate();
  
  const statusColors = {
    'Open': 'bg-green-100 text-green-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Waiting': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-purple-100 text-purple-800',
    'Closed': 'bg-gray-100 text-gray-800',
  };
  
  const priorityColors = {
    'Low': 'bg-gray-100 text-gray-800',
    'Medium': 'bg-orange-100 text-orange-800',
    'High': 'bg-red-100 text-red-800',
  };

  return (
    <div 
      onClick={() => navigate(`${basePath}/ticket/${ticket.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-gray-500">{ticket.id}</span>
          <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColors[ticket.status])}>
            {ticket.status}
          </span>
          <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium", priorityColors[ticket.priority])}>
            {ticket.priority}
          </span>
        </div>
        <div className="text-xs text-gray-400 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {ticket.title}
      </h3>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <UserIcon className="w-4 h-4 mr-1.5" />
          {ticket.assignedEmployee ? (
            <span>Assigned to: <span className="font-medium text-gray-700">{ticket.assignedEmployee.name}</span></span>
          ) : (
            <span className="italic">Unassigned</span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Tag className="w-4 h-4 mr-1.5" />
          {ticket.category}
        </div>
      </div>
    </div>
  );
}
