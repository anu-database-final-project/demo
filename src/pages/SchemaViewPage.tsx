import React, { useState } from 'react';
import { Database, Key, Link as LinkIcon, Hash, AlignLeft, Calendar, Type, X, Code, Map } from 'lucide-react';
import sqlContent from '../../database.sql?raw';
import MermaidDiagram from '../components/MermaidDiagram';
import * as XarrowsModule from 'react-xarrows';

const Xarrow = (XarrowsModule as any).default?.default || (XarrowsModule as any).default || XarrowsModule;
const Xwrapper = (XarrowsModule as any).default?.Xwrapper || (XarrowsModule as any).Xwrapper || React.Fragment;

interface ColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  notNull?: boolean;
  references?: string;
  icon?: React.ReactNode;
}

interface TableDef {
  id: string;
  name: string;
  color: string;
  columns: ColumnDef[];
  description?: string;
}

const TableCard = ({ table, onClick }: { table: TableDef, onClick: () => void }) => (
  <div 
    id={table.id}
    onClick={onClick}
    className="bg-white rounded-xl shadow-md border border-gray-200 text-sm cursor-pointer hover:border-blue-400 hover:shadow-xl transition-all w-[260px] z-10 overflow-hidden"
  >
    <div className={`${table.color} text-white font-bold text-center py-2 flex justify-between items-center px-3`}>
      <div className="w-4 h-4"></div> {/* spacer for centering */}
      <span>{table.name}</span>
      <div className="flex gap-0.5 opacity-60">
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="w-1 h-1 bg-white rounded-full"></div>
      </div>
    </div>
    <div className="py-2 px-1">
      {table.columns.map(col => (
        <div key={col.name} className="flex justify-between items-center px-2 py-1 hover:bg-gray-50 rounded mx-1">
          <div className="flex items-center gap-2">
            {col.isPk ? (
              <Key className="w-3.5 h-3.5 text-amber-500" />
            ) : col.isFk ? (
                <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
              </div>
            )}
            <span className="text-gray-700 font-medium">{col.name}</span>
          </div>
          <div className="text-gray-500 font-mono text-[10px] uppercase flex gap-1 items-center">
            {col.type}
            {col.notNull && <span className="text-gray-400 font-bold">NN</span>}
          </div>
        </div>
      ))}
    </div>
    {table.description && (
      <div className="px-3 pb-3 text-xs text-gray-500 border-t border-gray-100 pt-2 mt-1 bg-gray-50">
        {table.description}
      </div>
    )}
  </div>
);

export default function SchemaViewPage() {
  const [selectedTable, setSelectedTable] = useState<TableDef | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showErdModal, setShowErdModal] = useState(false);

  const usersTable: TableDef = {
    id: 'users-table',
    name: 'users',
    color: 'bg-purple-600',
    columns: [
      { name: 'id', type: 'INT(11)', isPk: true, notNull: true },
      { name: 'name', type: 'VARCHAR(100)', notNull: true },
      { name: 'role', type: 'VARCHAR(50)', notNull: true },
      { name: 'created_at', type: 'TIMESTAMP', notNull: false },
    ]
  };

  const ticketsTable: TableDef = {
    id: 'tickets-table',
    name: 'tickets',
    color: 'bg-green-600',
    description: 'Core ticket object storing issue details and status.',
    columns: [
      { name: 'id', type: 'VARCHAR(20)', isPk: true, notNull: true },
      { name: 'title', type: 'VARCHAR(255)', notNull: true },
      { name: 'description', type: 'TEXT', notNull: true },
      { name: 'category', type: 'VARCHAR(100)', notNull: true },
      { name: 'priority', type: 'VARCHAR(50)', notNull: true },
      { name: 'status', type: 'VARCHAR(50)', notNull: true },
      { name: 'created_by_id', type: 'INT(11)', isFk: true, notNull: true, references: 'users.id' },
      { name: 'assigned_employee_id', type: 'INT(11)', isFk: true, notNull: false, references: 'users.id' },
      { name: 'created_at', type: 'TIMESTAMP', notNull: false },
      { name: 'updated_at', type: 'TIMESTAMP', notNull: false },
    ]
  };

  const commentsTable: TableDef = {
    id: 'comments-table',
    name: 'ticket_comments',
    color: 'bg-teal-600',
    columns: [
      { name: 'id', type: 'INT(11)', isPk: true, notNull: true },
      { name: 'ticket_id', type: 'VARCHAR(20)', isFk: true, notNull: true, references: 'tickets.id' },
      { name: 'message', type: 'TEXT', notNull: true },
      { name: 'created_by_id', type: 'INT(11)', isFk: true, notNull: true, references: 'users.id' },
      { name: 'created_at', type: 'TIMESTAMP', notNull: false },
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-auto -m-8 p-8 font-sans text-gray-800 relative overflow-hidden">

      {/* Header Area */}
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-3">
            <Database className="w-7 h-7 text-blue-600" />
            Database tables
          </h1>
          <p className="text-gray-500 text-sm">SQL database tables and relationships</p>
        </div>
        <div className="flex gap-3 relative z-20">
          <button
            onClick={() => setShowErdModal(true)}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 text-sm rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <Map className="w-4 h-4 text-purple-600" />
            Visual ERD
          </button>
          <button
            onClick={() => setShowSqlModal(true)}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 text-sm rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Code className="w-4 h-4 text-blue-600" />
            SQL Script
          </button>
        </div>
      </div>

      {/* Database Schema Diagram Area */}
      <div className="relative w-full h-[600px] min-w-[1100px] flex items-center justify-center pt-10">
        <Xwrapper>
          <div className="absolute left-[10%] top-[20%]">
            <TableCard table={usersTable} onClick={() => setSelectedTable(usersTable)} />
          </div>
          <div className="absolute left-[40%] top-[40%]">
            <TableCard table={ticketsTable} onClick={() => setSelectedTable(ticketsTable)} />
          </div>
          <div className="absolute left-[70%] top-[10%]">
            <TableCard table={commentsTable} onClick={() => setSelectedTable(commentsTable)} />
          </div>

          <Xarrow
            start="users-table"
            end="tickets-table"
            path="smooth"
            startAnchor="right"
            endAnchor="left"
            color="#cbd5e1"
            strokeWidth={2}
            headSize={4}
            curveness={0.8}
          />
          <Xarrow
            start="tickets-table"
            end="comments-table"
            path="smooth"
            startAnchor="right"
            endAnchor="left"
            color="#cbd5e1"
            strokeWidth={2}
            headSize={4}
            curveness={0.8}
          />
          <Xarrow
            start="users-table"
            end="comments-table"
            path="smooth"
            startAnchor="right"
            endAnchor={
              {
                position: "left",
                offset: { y: -20 }
              }
            }
            color="#cbd5e1"
            strokeWidth={2}
            headSize={4}
            curveness={0.5}
          />
        </Xwrapper>
      </div>

      {/* Entity View Dialog / Modal */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            <div className={`${selectedTable.color} px-6 py-4 flex items-center justify-between text-white`}>
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-white/80" />
                <div>
                  <h2 className="text-lg font-bold">Table: {selectedTable.name}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTable(null)}
                className="p-1 hover:bg-black/10 rounded-lg transition-colors focus:outline-none"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-0 flex-1">
              <table className="w-full text-left border-collapse text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Column</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedTable.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 flex items-center gap-2">
                        {col.isPk ? <Key className="w-4 h-4 text-amber-500" /> : col.isFk ? <LinkIcon className="w-4 h-4 text-gray-400" /> : <div className="w-4 h-4" />}
                        <span className="font-mono text-gray-900 font-medium">{col.name}</span>
                      </td>
                      <td className="px-6 py-3 font-mono text-gray-500 text-xs">
                        {col.type} {col.notNull && <span className="text-gray-400 font-bold ml-1">NN</span>}
                      </td>
                      <td className="px-6 py-3">
                        {col.isPk && <span className="text-amber-600 text-xs border border-amber-200 px-2.5 py-1 rounded bg-amber-50 font-bold">PRIMARY KEY</span>}
                        {col.isFk && <span className="text-purple-600 text-xs border border-purple-200 px-2.5 py-1 rounded bg-purple-50 font-bold ml-2">FK &rarr; {col.references}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SQL Script Dialog / Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">database.sql</h2>
              </div>
              <button onClick={() => setShowSqlModal(false)} className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 flex-1 bg-gray-900">
              <pre className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                <code>{sqlContent}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ERD Dialog / Modal */}
      {showErdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Map className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Chen's Entity-Relationship Diagram</h2>
              </div>
              <button onClick={() => setShowErdModal(false)} className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 flex-1 bg-white flex items-center justify-center min-h-[500px]">
              <MermaidDiagram chart={`
flowchart TD
    %% Entities
    U[Users]
    T[Tickets]
    C[Ticket Comments]

    %% Relationships
    creates{Creates}
    assigned{Assigned To}
    has{Has}
    writes{Writes}

    %% Attributes - Users
    uid([PK: id])
    uname([name])
    urole([role])

    %% Attributes - Tickets
    tid([PK: id])
    ttitle([title])
    tstatus([status])

    %% Attributes - Comments
    cid([PK: id])
    cmsg([message])

    %% Connect Attributes
    U --- uid
    U --- uname
    U --- urole

    T --- tid
    T --- ttitle
    T --- tstatus

    C --- cid
    C --- cmsg

    %% Connect Entities through Relationships
    U --- creates
    creates --- T
    
    U --- assigned
    assigned --- T
    
    T --- has
    has --- C

    U --- writes
    writes --- C

    classDef entity fill:#a3e635,stroke:#333,stroke-width:2px;
    classDef attribute fill:#fb923c,stroke:#333,stroke-width:2px;
    classDef relationship fill:#60a5fa,stroke:#333,stroke-width:2px;

    class U,T,C entity;
    class uid,uname,urole,tid,ttitle,tdesc,tcat,tprio,tstatus,cid,cmsg attribute;
    class creates,assigned,has,writes relationship;
              `} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
