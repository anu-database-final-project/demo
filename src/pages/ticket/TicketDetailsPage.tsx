import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Send, User, Calendar, Tag, AlertCircle } from 'lucide-react';
import { TicketStatus } from '../../types';
import clsx from 'clsx';

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tickets, role, currentUser, currentEmployee, assignTicket, updateTicketStatus, addComment } = useStore();
  
  const [commentText, setCommentText] = useState('');
  
  const ticket = tickets.find(t => t.id === id);
  
  if (!ticket) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Ticket not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const isUser = role === 'User';
  const isEmployee = role === 'Employee';
  const isTicketOwner = isUser && ticket.createdBy.id === currentUser?.id;
  const isAssignedEmployee = isEmployee && ticket.assignedEmployee?.id === currentEmployee?.id;
  
  const handleAssignToMe = () => {
    if (isEmployee && currentEmployee) {
      assignTicket(ticket.id, currentEmployee);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isAssignedEmployee) {
      updateTicketStatus(ticket.id, e.target.value as TicketStatus);
    }
  };

  const handleCloseTicket = () => {
    if (isTicketOwner && ticket.status !== 'Completed' && ticket.status !== 'Closed') {
      updateTicketStatus(ticket.id, 'Closed');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    addComment(ticket.id, commentText);
    setCommentText('');
  };

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
    <div className="max-w-4xl mx-auto pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm font-semibold text-gray-500">{ticket.id}</span>
                <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColors[ticket.status])}>
                  {ticket.status}
                </span>
                <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium", priorityColors[ticket.priority])}>
                  {ticket.priority} Priority
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{ticket.title}</h1>
              <div className="prose prose-sm text-gray-700 max-w-none">
                <p>{ticket.description}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Discussion</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {ticket.comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                    {comment.createdBy.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">{comment.createdBy}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg rounded-tl-none border border-gray-100">
                      {comment.message}
                    </div>
                  </div>
                </div>
              ))}
              
              {ticket.comments.length === 0 && (
                <div className="text-center py-6 text-gray-500 italic text-sm">
                  No comments yet.
                </div>
              )}
            </div>

            {/* Add Comment Form */}
            {ticket.status !== 'Closed' && ticket.status !== 'Completed' && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <form onSubmit={handleAddComment} className="flex gap-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900">Ticket Details</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> Created By
                </div>
                <div className="text-sm font-semibold text-gray-900">{ticket.createdBy.name}</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> Assigned To
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {ticket.assignedEmployee ? ticket.assignedEmployee.name : 'Unassigned'}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Category
                </div>
                <div className="text-sm font-semibold text-gray-900">{ticket.category}</div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Created
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Last Updated
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date(ticket.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Actions panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900">Actions</h3>
            </div>
            <div className="p-5 space-y-3">
              {/* Employee Actions */}
              {isEmployee && !ticket.assignedEmployee && ticket.status === 'Open' && (
                <button
                  onClick={handleAssignToMe}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex justify-center items-center gap-2"
                >
                  <User className="w-4 h-4" /> Take Ticket
                </button>
              )}

              {isEmployee && isAssignedEmployee && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Update Status</label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={ticket.status}
                    onChange={handleStatusChange}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              )}

              {/* User Actions */}
              {isUser && isTicketOwner && ticket.status !== 'Closed' && ticket.status !== 'Completed' && (
                <button
                  onClick={handleCloseTicket}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium text-sm flex justify-center items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" /> Close Ticket
                </button>
              )}
              
              {/* Generic info when no actions available */}
              {((isUser && (!isTicketOwner || ticket.status === 'Closed' || ticket.status === 'Completed')) || 
                 (isEmployee && ticket.assignedEmployee && !isAssignedEmployee)) && (
                <div className="text-sm text-gray-500 text-center italic">
                  No actions available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
