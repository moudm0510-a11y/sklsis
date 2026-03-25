import React from 'react';
import { Home, Calendar, GraduationCap, Settings, ShieldAlert, Moon, Sun, LogOut } from 'lucide-react';

export default function Layout({ children, user, activeTab, setActiveTab, isDarkMode, setIsDarkMode, onLogout }) {
  
  const menu = [];
  
  // LOGIQUE DES ONGLETS SELON LE RÔLE
  if (user.role === 'student') {
    menu.push({ id: 'home', icon: <Home size={18}/>, label: 'ACCUEIL' });
    menu.push({ id: 'schedule', icon: <Calendar size={18}/>, label: 'PLANNING' });
    menu.push({ id: 'grades', icon: <GraduationCap size={18}/>, label: 'NOTES' });
  } else if (user.role === 'admin') {
    menu.push({ id: 'home', icon: <Home size={18}/>, label: 'DASHBOARD' });
    menu.push({ id: 'admin', icon: <Settings size={18}/>, label: 'GESTION' });
  } else if (user.role === 'super_admin') {
    menu.push({ id: 'super', icon: <ShieldAlert size={18}/>, label: 'REGISTRE CLOUD' });
  }

  return (
    <div className="min-h-screen flex flex-col font-black italic">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            <div className="text-3xl font-black italic text-blue-600 mr-8 tracking-tighter">SKLSIS</div>
            {menu.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all whitespace-nowrap uppercase text-[10px] ${
                  activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'text-slate-400'
                }`}>
                {item.icon} <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl flex items-center justify-center border dark:border-slate-700">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <button onClick={onLogout} className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100"><LogOut size={20}/></button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}