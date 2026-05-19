import React from 'react';
import { useStore } from '../../store/useStore';
import TicketCard from '../../components/TicketCard';

export default function OpenTicketsPage() {
  const { tickets } = useStore();
  
  const openTickets = tickets.filter(t => t.status === 'Open' && !t.assignedEmployee);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Open Tickets</h1>
        <p className="text-gray-500 mt-2">Unassigned tickets that require attention.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openTickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} basePath="/employee" />
        ))}
        {openTickets.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500 text-lg">Hooray! No open tickets at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
