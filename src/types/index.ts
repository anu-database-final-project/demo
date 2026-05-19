export type Role = 'User' | 'Employee' | null;

export interface User {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
}

export type TicketStatus = 'Open' | 'In Progress' | 'Waiting' | 'Completed' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High';

export interface Comment {
  id: number;
  message: string;
  createdBy: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: User;
  assignedEmployee: Employee | null;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}
