import React from 'react';
import { PillIcon, UserIcon } from './Icons';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white shadow-md w-full p-4 sm:p-6 border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <PillIcon className="h-12 w-12 text-blue-600" />
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">
            MediCare Companion
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xl text-gray-600">{currentDate}</p>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full" />
                <button onClick={onLogout} className="text-lg bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold">Logout</button>
              </div>
            ) : (
               <button onClick={onLogin} className="flex items-center gap-2 text-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-lg">
                  <UserIcon className="h-6 w-6"/>
                  Sign In
               </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;