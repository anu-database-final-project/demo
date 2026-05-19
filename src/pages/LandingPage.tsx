import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Support Ticket System
          </h1>
          <p className="text-xl text-gray-600">
            Select your role to continue into the demo environment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Card */}
          <button
            onClick={() => navigate('/select-role/user')}
            className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-left p-8"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Continue as User</h2>
              <p className="text-gray-500">
                Create new tickets, view your existing requests, and communicate with the support team.
              </p>
            </div>
          </button>

          {/* Employee Card */}
          <button
            onClick={() => navigate('/select-role/employee')}
            className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-left p-8"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-100 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Continue as Employee</h2>
              <p className="text-gray-500">
                Manage incoming tickets, assign them to yourself, and resolve user issues.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
