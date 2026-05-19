# Ayat Database Project - Ticket Handling System

A full-stack, role-based ticket management system designed to demonstrate robust client-server architecture, where complex data mutation and business logic are securely encapsulated within PostgreSQL Stored Procedures.

## 🎯 Project Goals
1. **Database-Driven Business Logic**: Shift core data mutations (creating tickets, assigning employees, changing statuses, adding comments) strictly into the database layer using SQL Stored Procedures to ensure data integrity and security.
2. **Role-Based Workflows**: Create a seamless user experience that differentiates between standard **Users** (who report issues) and **Employees** (who resolve issues).
3. **Interactive Documentation**: Provide built-in, dynamic visualizations of the database schema and structure directly within the application's user interface.

## ✨ Key Features
- **User Portal**: Users can submit new support tickets, track the status of their ongoing issues, and communicate with support staff via threaded comments.
- **Employee Dashboard**: Employees can view a queue of unassigned tickets, assign tickets to themselves, update ticket resolutions (In Progress, Completed, Closed), and reply to users.
- **Database-First Approach**: The Node.js backend serves primarily as a lightweight bridge; the heavy lifting is done via custom PostgreSQL procedures (`sp_create_ticket`, `sp_assign_ticket`, `sp_add_comment`, etc.) and data aggregation functions.
- **Live Database Schema Viewer**: An interactive UI tool built into the dashboard that visually maps out the `users`, `tickets`, and `ticket_comments` tables, their constraints, foreign key relationships, and even displays the raw `database.sql` code.
- **State Synchronization**: The frontend seamlessly stays up-to-date with the database via polling mechanisms and global Zustand state management.

## 🛠️ Technology Stack
### Frontend
- **Framework**: React 18 built with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Lucide-React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database Driver**: `pg` (node-postgres)
- **CORS & Environment**: `cors`, `dotenv`

### Database
- **Engine**: PostgreSQL
- **Architecture**: Relational mapping with cascading foreign keys and PL/pgSQL Stored Procedures.

---

## 📂 Project Structure

```text
/
├── server/                      # Node.js / Express Backend
│   ├── index.js                 # Main REST API server bridging frontend to SQL procedures
│   ├── .env                     # Backend environment configuration (DATABASE_URL)
│   └── package.json             # Backend dependencies
│
├── src/                         # React Frontend Client
│   ├── components/              # Reusable UI elements (TicketCard, Status Badges)
│   ├── layouts/                 # Page layouts (MainLayout with responsive Sidebar)
│   ├── pages/                   # Application views:
│   │   ├── employee/            # Employee-specific views (Queue, Assigned)
│   │   ├── user/                # User-specific views (Creation, My Tickets)
│   │   ├── ticket/              # Shared views (Ticket Details/Comments)
│   │   └── SchemaViewPage.tsx   # Interactive ER Diagram & SQL Viewer
│   ├── store/                   # Zustand global state (API interactions & auth)
│   ├── types/                   # TypeScript interfaces mapping the DB schema
│   ├── App.tsx                  # Application routing definition
│   └── index.css                # Global Tailwind utilities
│
├── database.sql                 # Core database schema, seeds, sequences, and procedures
├── tailwind.config.js           # Tailwind design system configuration
└── vite.config.ts               # Vite bundler configuration
```

---

## 🚀 Setup & Installation

### 1. Database Initialization
1. Ensure you have a running PostgreSQL instance (Local or Cloud like Supabase/Neon).
2. Execute the entire contents of `database.sql` against your PostgreSQL database. This will:
   - Create the `users`, `tickets`, and `ticket_comments` tables.
   - Seed the initial Users and Employees.
   - Deploy the required Stored Procedures and Functions.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and define your connection string:
   ```env
   DATABASE_URL=postgres://username:password@host:port/database_name
   PORT=5000
   ```
4. Start the Express server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. From the project root directory, install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).
