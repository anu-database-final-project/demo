import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, users, employees } from '../store/useStore';
import { ArrowLeft, User as UserIcon } from 'lucide-react';

export default function RoleSelectionPage() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { loginUser, loginEmployee } = useStore();

  const isUser = role === 'user';
  const accounts = isUser ? users : employees;
  const title = isUser ? 'Select User Account' : 'Select Employee Account';

  const handleSelectAccount = (account: any) => {
    if (isUser) {
      loginUser(account);
      navigate('/user');
    } else {
      loginEmployee(account);
      navigate('/employee');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Roles
        </button>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
        
        <div className="space-y-4">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => handleSelectAccount(account)}
              className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg group-hover:bg-blue-200 transition-colors">
                {account.name.charAt(0)}
              </div>
              <div className="ml-4 flex-1 text-left">
                <div className="text-lg font-semibold text-gray-900">{account.name}</div>
                <div className="text-sm text-gray-500">ID: {account.id}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
