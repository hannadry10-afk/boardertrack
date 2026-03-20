import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Boarders from './pages/Boarders';
import Expenses from './pages/Expenses';
import ActivityLog from './pages/ActivityLog';
import Settings from './pages/Settings';

const NAV = [
  { id: 'dashboard', label: '🏠 Dashboard' },
  { id: 'boarders', label: '👥 Boarders' },
  { id: 'expenses', label: '🧾 Expenses' },
  { id: 'activity', label: '📋 Activity Log' },
  { id: 'settings', label: '⚙️ Settings' },
];

const PAGES = {
  dashboard: Dashboard,
  boarders: Boarders,
  expenses: Expenses,
  activity: ActivityLog,
  settings: Settings,
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const Page = PAGES[page];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-md flex flex-col">
        <div className="p-5 border-b">
          <h1 className="text-lg font-bold text-blue-700">🏘️ BoarderTrack</h1>
          <p className="text-xs text-gray-400 mt-1">Boarding House Manager</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                page === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Page />
      </main>
    </div>
  );
}
