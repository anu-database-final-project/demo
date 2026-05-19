import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Employee, Ticket, Role, TicketStatus, Comment } from '../types';

const API_URL = 'http://localhost:3001/api';

interface StoreState {
  role: Role;
  currentUser: User | null;
  currentEmployee: Employee | null;
  tickets: Ticket[];
  
  setRole: (role: Role) => void;
  loginUser: (user: User) => void;
  loginEmployee: (employee: Employee) => void;
  logout: () => void;
  
  fetchTickets: () => Promise<void>;
  addTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'createdBy' | 'assignedEmployee' | 'comments' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  assignTicket: (ticketId: string, employee: Employee) => Promise<void>;
  addComment: (ticketId: string, message: string) => Promise<void>;
}

export const users: User[] = [
  { id: 1, name: "Ayat" },
  { id: 2, name: "Heba" },
  { id: 3, name: "Doa'a" }
];

export const employees: Employee[] = [
  { id: 1, name: "Ala'a" },
  { id: 2, name: "Abdullah" },
  { id: 3, name: "Mustafa" }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      role: null,
      currentUser: null,
      currentEmployee: null,
      tickets: [],
      
      setRole: (role) => set({ role, currentUser: null, currentEmployee: null }),
      loginUser: (user) => set({ currentUser: user, role: 'User', currentEmployee: null }),
      loginEmployee: (employee) => set({ currentEmployee: employee, role: 'Employee', currentUser: null }),
      logout: () => set({ role: null, currentUser: null, currentEmployee: null }),
      
      fetchTickets: async () => {
        try {
          const res = await fetch(`${API_URL}/tickets`);
          if (res.ok) {
            const data = await res.json();
            // Map the db fields to frontend structure
            const formattedTickets: Ticket[] = data.map((t: any) => ({
              id: t.id,
              title: t.title,
              description: t.description,
              category: t.category,
              priority: t.priority,
              status: t.status,
              createdBy: { id: t.created_by_id, name: t.created_by_name },
              assignedEmployee: t.assigned_employee_id 
                ? { id: t.assigned_employee_id, name: t.assigned_employee_name }
                : null,
              createdAt: t.created_at,
              updatedAt: t.updated_at,
              comments: t.comments.map((c: any) => ({
                id: c.id,
                message: c.message,
                createdBy: c.createdBy,
                createdAt: c.createdAt
              }))
            }));
            set({ tickets: formattedTickets });
          }
        } catch (error) {
          console.error("Error fetching tickets:", error);
        }
      },
      
      addTicket: async (ticketData) => {
        const { currentUser, fetchTickets } = get();
        if (!currentUser) return;
        
        try {
          await fetch(`${API_URL}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ticketData, createdBy: currentUser })
          });
          await fetchTickets();
        } catch (error) {
          console.error("Error creating ticket:", error);
        }
      },
      
      updateTicketStatus: async (ticketId, status) => {
        const { fetchTickets } = get();
        try {
          await fetch(`${API_URL}/tickets/${ticketId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
          });
          await fetchTickets();
        } catch (error) {
          console.error("Error updating status:", error);
        }
      },
      
      assignTicket: async (ticketId, employee) => {
        const { fetchTickets } = get();
        try {
          await fetch(`${API_URL}/tickets/${ticketId}/assign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employee })
          });
          await fetchTickets();
        } catch (error) {
          console.error("Error assigning ticket:", error);
        }
      },
      
      addComment: async (ticketId, message) => {
        const { currentUser, currentEmployee, fetchTickets } = get();
        const authorId = currentUser?.id || currentEmployee?.id;
        
        if (!authorId) return;

        try {
          await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, createdById: authorId })
          });
          await fetchTickets();
        } catch (error) {
          console.error("Error adding comment:", error);
        }
      }
    }),
    {
      name: 'ticket-system-auth',
      // only persist auth state, not tickets since they come from DB now
      partialize: (state) => ({ 
        role: state.role, 
        currentUser: state.currentUser, 
        currentEmployee: state.currentEmployee 
      }),
    }
  )
);
