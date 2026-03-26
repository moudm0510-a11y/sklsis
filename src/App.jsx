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
import Parents from './pages/Parents';
import Onboarding from './components/Onboarding';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.title = "SKLSIS PRO";
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'super_admin') setActiveTab('super');
    else if (userData.role === 'parent') setActiveTab('parents');
    else setActiveTab('home');
  };

  if (!user) return <Login onLoginSuccess={handleLoginSuccess} />;

  // SYSTÈME DE ONBOARDING (Si premier login activé)
  if (user.role === 'student' && user.premier_login) {
    return <Onboarding user={user} onComplete={() => setUser({...user, premier_login: false})} />;
  }

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode}
      onLogout={() => { setUser(null); setActiveTab('home'); }}
    >
      <div className="w-full animate-fade-in">
        {activeTab === 'home' && <Dashboard user={user} />}
        {activeTab === 'schedule' && <Schedule user={user} />}
        {activeTab === 'grades' && <Grades user={user} />}
        {activeTab === 'notebook' && <CahierDeTexte user={user} />}
        {activeTab === 'admin' && <AdminPanel user={user} />}
        {activeTab === 'super' && <SuperAdmin />}
        {activeTab === 'calendar' && <Calendar user={user} />}
        {activeTab === 'parents' && <Parents user={user} />}
      </div>
    </Layout>
  );
}