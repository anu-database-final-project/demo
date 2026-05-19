import React from 'react';
import { useStore } from '../../store/useStore';
import TicketCard from '../../components/TicketCard';

export default function AssignedTicketsPage() {
  const { tickets, currentEmployee } = useStore();
  
  const assignedTickets = tickets.filter(t => t.assignedEmployee?.id === currentEmployee?.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Assigned Tickets</h1>
        <p className="text-gray-500 mt-2">Tickets currently assigned to you for resolution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedTickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} basePath="/employee" />
        ))}
        {assignedTickets.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500 text-lg">You don't have any tickets assigned to you right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
