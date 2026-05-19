import React, { useState } from 'react';
import { Database, Key, Link as LinkIcon, Hash, AlignLeft, Calendar, Type, X, Code } from 'lucide-react';
import sqlContent from '../../database.sql?raw';

interface ColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  references?: string;
  icon: React.ReactNode;
}

interface TableDef {
  name: string;
  columns: ColumnDef[];
}

const TableCard = ({ table, onClick }: { table: TableDef, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex-1 min-w-[300px] transform transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
  >
    <div className="bg-blue-600 px-4 py-3 flex items-center justify-between text-white group-hover:bg-blue-700 transition-colors">
      <div className="flex items-center gap-2">
        <Database className="w-5 h-5" />
        <h3 className="font-bold text-lg tracking-wide">{table.name}</h3>
      </div>
      <span className="text-xs bg-blue-500 px-2 py-1 rounded-full text-blue-50 font-medium">Click to view</span>
    </div>
    <div className="p-0">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
          <tr>
            <th className="px-4 py-2 font-medium">Column</th>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Key</th>
          </tr>
        </thead>
        <tbody>
          {table.columns.map((col, idx) => (
            <tr key={col.name} className={idx !== table.columns.length - 1 ? "border-b border-gray-50" : ""}>
              <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                {col.icon}
                {col.name}
              </td>
              <td className="px-4 py-3 text-blue-600 font-mono text-xs">{col.type}</td>
              <td className="px-4 py-3">
                {col.isPk && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-bold">
                    <Key className="w-3 h-3" /> PK
                  </span>
                )}
                {col.isFk && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs font-bold mt-1 md:mt-0">
                    <LinkIcon className="w-3 h-3" /> FK ({col.references})
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function SchemaViewPage() {
  const [selectedTable, setSelectedTable] = useState<TableDef | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);

  const usersTable: TableDef = {
    name: 'users',
    columns: [
      { name: 'id', type: 'SERIAL', isPk: true, icon: <Hash className="w-4 h-4 text-gray-400" /> },
      { name: 'name', type: 'VARCHAR(100)', icon: <Type className="w-4 h-4 text-gray-400" /> },
      { name: 'role', type: 'VARCHAR(50)', icon: <Type className="w-4 h-4 text-gray-400" /> },
      { name: 'created_at', type: 'TIMESTAMP', icon: <Calendar className="w-4 h-4 text-gray-400" /> },
    ]
  };

  const ticketsTable: TableDef = {
    name: 'tickets',
    columns: [
      { name: 'id', type: 'VARCHAR(20)', isPk: true, icon: <Hash className="w-4 h-4 text-gray-400" /> },
      { name: 'title', type: 'VARCHAR(255)', icon: <Type className="w-4 h-4 text-gray-400" /> },
      { name: 'description', type: 'TEXT', icon: <AlignLeft className="w-4 h-4 text-gray-400" /> },
      { name: 'category', type: 'VARCHAR(100)', icon: <Type className="w-4 h-4 text-gray-400" /> },
      { name: 'priority', type: 'VARCHAR(50)', icon: <Type className="w-4 h-4 text-gray-400" /> },
      { name: 'status', type: 'VARCHAR(50)', icon: <Type className="w-4 h-4 text-gray-400" /> },
      { name: 'created_by_id', type: 'INT', isFk: true, references: 'users.id', icon: <Hash className="w-4 h-4 text-purple-500" /> },
      { name: 'assigned_employee_id', type: 'INT', isFk: true, references: 'users.id', icon: <Hash className="w-4 h-4 text-purple-500" /> },
      { name: 'created_at', type: 'TIMESTAMP', icon: <Calendar className="w-4 h-4 text-gray-400" /> },
      { name: 'updated_at', type: 'TIMESTAMP', icon: <Calendar className="w-4 h-4 text-gray-400" /> },
    ]
  };

  const commentsTable: TableDef = {
    name: 'ticket_comments',
    columns: [
      { name: 'id', type: 'SERIAL', isPk: true, icon: <Hash className="w-4 h-4 text-gray-400" /> },
      { name: 'ticket_id', type: 'VARCHAR(20)', isFk: true, references: 'tickets.id', icon: <Hash className="w-4 h-4 text-purple-500" /> },
      { name: 'message', type: 'TEXT', icon: <AlignLeft className="w-4 h-4 text-gray-400" /> },
      { name: 'created_by_id', type: 'INT', isFk: true, references: 'users.id', icon: <Hash className="w-4 h-4 text-purple-500" /> },
      { name: 'created_at', type: 'TIMESTAMP', icon: <Calendar className="w-4 h-4 text-gray-400" /> },
    ]
  };

  return (
    <div className="pb-12 relative">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Database Schema & Relations
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Visual representation of the PostgreSQL tables and their foreign key relationships.
          </p>
        </div>
        <button
          onClick={() => setShowSqlModal(true)}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Code className="w-5 h-5 text-blue-600" />
          View SQL Script
        </button>
      </div>

      <div className="bg-gray-100 p-8 rounded-2xl border border-gray-200 relative overflow-hidden">
        {/* Background decorative lines to simulate relations */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8 w-full lg:w-1/3">
            <TableCard table={usersTable} onClick={() => setSelectedTable(usersTable)} />
            <div className="hidden lg:flex flex-col items-center opacity-50">
              <div className="h-16 border-l-2 border-dashed border-purple-500"></div>
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full my-2">1 : N</span>
              <div className="h-16 border-l-2 border-dashed border-purple-500"></div>
            </div>
          </div>

          {/* Center Column */}
          <div className="flex flex-col gap-8 w-full lg:w-1/3">
            <TableCard table={ticketsTable} onClick={() => setSelectedTable(ticketsTable)} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 w-full lg:w-1/3">
            <div className="hidden lg:flex items-center justify-center h-32 opacity-50">
              <div className="w-full border-t-2 border-dashed border-purple-500 mr-2"></div>
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap">1 : N</span>
              <div className="w-full border-t-2 border-dashed border-purple-500 ml-2"></div>
            </div>
            <TableCard table={commentsTable} onClick={() => setSelectedTable(commentsTable)} />
          </div>

        </div>

        <div className="mt-12 bg-blue-50 p-6 rounded-xl border border-blue-100 text-sm text-blue-900">
          <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Relationship Summary
          </h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Users &rarr; Tickets:</strong> A user can create many tickets (<code className="font-mono bg-blue-100 px-1 rounded">created_by_id</code>).</li>
            <li><strong>Users &rarr; Tickets:</strong> An employee (user) can be assigned to many tickets (<code className="font-mono bg-blue-100 px-1 rounded">assigned_employee_id</code>).</li>
            <li><strong>Tickets &rarr; Comments:</strong> A ticket can have multiple discussion comments (<code className="font-mono bg-blue-100 px-1 rounded">ticket_id</code>).</li>
            <li><strong>Users &rarr; Comments:</strong> A user can write many comments (<code className="font-mono bg-blue-100 px-1 rounded">created_by_id</code>).</li>
          </ul>
        </div>
      </div>

      {/* Entity View Dialog / Modal */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-200" />
                <div>
                  <h2 className="text-xl font-bold">Entity: {selectedTable.name}</h2>
                  <p className="text-blue-200 text-xs font-medium">Table Structure</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTable(null)}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto p-6 bg-gray-50 flex-1">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-600 text-sm border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Attribute</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Data Type</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Constraints / Keys</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedTable.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 text-gray-900 font-medium">
                            <span className="p-1.5 bg-gray-100 rounded-md text-gray-500">
                              {col.icon}
                            </span>
                            {col.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-mono text-sm border border-blue-100">
                            {col.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 items-start">
                            {col.isPk ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                                <Key className="w-3.5 h-3.5" /> PRIMARY KEY
                              </span>
                            ) : null}
                            
                            {col.isFk ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                                <LinkIcon className="w-3.5 h-3.5" /> FOREIGN KEY &rarr; {col.references}
                              </span>
                            ) : null}
                            
                            {!col.isPk && !col.isFk && (
                              <span className="text-gray-400 text-sm italic">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-white flex justify-end">
              <button
                onClick={() => setSelectedTable(null)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SQL Script Dialog / Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-700">
            {/* Modal Header */}
            <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-gray-300" />
                <div>
                  <h2 className="text-xl font-bold text-white">database.sql</h2>
                  <p className="text-gray-400 text-xs font-medium">Raw SQL Schema & Stored Procedures</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSqlModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto p-6 flex-1 bg-gray-950">
              <pre className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                <code>{sqlContent}</code>
              </pre>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-700 px-6 py-4 bg-gray-800 flex justify-end">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
