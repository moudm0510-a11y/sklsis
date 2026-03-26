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

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Synchronisation du thème
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // ACTION APRÈS CONNEXION RÉUSSIE
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // On redirige vers l'onglet le plus important pour chaque rôle
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
      onLogout={() => { setUser(null); setActiveTab('home'); }}
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {activeTab === 'home' && <Dashboard user={user} />}
        {activeTab === 'schedule' && <Schedule user={user} />}
        {activeTab === 'grades' && <Grades user={user} />}
        {activeTab === 'notebook' && <CahierDeTexte user={user} />}
        {activeTab === 'admin' && user.role === 'admin' && <AdminPanel user={user} />}
        {activeTab === 'super' && user.role === 'super_admin' && <SuperAdmin user={user} />}
        {activeTab === 'calendar' && <Calendar user={user} />}
      </div>
    </Layout>
  );
}