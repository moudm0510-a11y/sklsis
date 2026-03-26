import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Grades from './pages/Grades';
import AdminPanel from './pages/AdminPanel';
import SuperAdmin from './pages/SuperAdmin';
import CahierDeTexte from './pages/CahierDeTexte';
import Calendar from './pages/Calendar';
import Onboarding from './components/Onboarding';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // REDIRECTION INTELLIGENTE SELON LE RÔLE
    if (userData.role === 'super_admin') setActiveTab('super');
    else if (userData.role === 'admin') setActiveTab('admin'); 
    else setActiveTab('home');
  };

  if (!user) return <Login onLoginSuccess={handleLoginSuccess} />;

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode}
      onLogout={() => setUser(null)}
    >
      <div className="w-full animate-in fade-in duration-500">
        {activeTab === 'home' && <Dashboard user={user} />}
        {activeTab === 'schedule' && <Schedule user={user} />}
        {activeTab === 'grades' && <Grades user={user} />}
        {activeTab === 'notebook' && <CahierDeTexte user={user} />}
        {activeTab === 'admin' && <AdminPanel user={user} />}
        {activeTab === 'super' && <SuperAdmin />}
        {activeTab === 'calendar' && <Calendar user={user} />}
      </div>
    </Layout>
  );
}