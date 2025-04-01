import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircleDollarSign, LayoutDashboard, PiggyBank, Settings as SettingsIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analysis from './pages/Analysis';
import SettingsPage from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-gray-50">
              <nav className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-8">
                    <CircleDollarSign className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-xl font-bold">FinanceTracker</h1>
                  </div>
                  <ul className="space-y-2">
                    <NavItem icon={<LayoutDashboard />} to="/dashboard" label="Dashboard" />
                    <NavItem icon={<CircleDollarSign />} to="/transactions" label="Transactions" />
                    <NavItem icon={<PiggyBank />} to="/analysis" label="Analysis" />
                    <NavItem icon={<SettingsIcon />} to="/settings" label="Settings" />
                  </ul>
                </div>
              </nav>
              
              <main className="ml-64 p-8">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  to: string;
  label: string;
}

function NavItem({ icon, to, label }: NavItemProps) {
  return (
    <li>
      <a
        href={to}
        className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
      >
        {icon}
        <span>{label}</span>
      </a>
    </li>
  );
}

export default App;