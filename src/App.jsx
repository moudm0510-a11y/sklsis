import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Grades from './pages/Grades';
import AdminPanel from './pages/AdminPanel';
import SuperAdmin from './pages/SuperAdmin';
import CahierDeTexte from './pages/CahierDeTexte';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.title = "SKLSIS - Système de Gestion";
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  // Redirection automatique après le Login selon le rôle
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'super_admin') {
      setActiveTab('super'); // Super Admin arrive sur son registre
    } else {
      setActiveTab('home'); // Les autres sur l'accueil
    }
  };

  const handleLogout = () => { setUser(null); setActiveTab('home'); };

  if (!user) return <Login onLoginSuccess={handleLoginSuccess} />;

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode}
      onLogout={handleLogout}
    >
      <div className="page-container animate-in">
        {/* SÉCURITÉ : On ne rend le composant QUE si le rôle a le droit */}
        
        {/* Tout le monde sauf Super Admin accède à ces onglets */}
        {user.role !== 'super_admin' && (
          <>
            {activeTab === 'home' && <Dashboard user={user} />}
            {activeTab === 'schedule' && <Schedule />}
            {activeTab === 'grades' && <Grades user={user} />}
            {activeTab === 'notebook' && <CahierDeTexte user={user} />}
          </>
        )}

        {/* Accès Admin École uniquement */}
        {user.role === 'admin' && activeTab === 'admin' && <AdminPanel user={user} />}

        {/* Accès Super Admin Uniquement */}
        {user.role === 'super_admin' && activeTab === 'super' && <SuperAdmin />}
      </div>
    </Layout>
  );
}