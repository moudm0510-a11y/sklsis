import React from 'react';
import { Home, Calendar, GraduationCap, BookOpen, Settings, ShieldAlert, Moon, Sun, LogOut } from 'lucide-react';

export default function Layout({ children, user, activeTab, setActiveTab, isDarkMode, setIsDarkMode, onLogout }) {
  
  const menu = [];
  
  // LOGIQUE DE FILTRAGE STRICTE DES ONGLETS
  if (user.role === 'super_admin') {
    menu.push({ id: 'super', icon: <ShieldAlert size={20}/>, label: 'CONSOLE SUPRÊME' });
  } else {
    menu.push({ id: 'home', icon: <Home size={18}/>, label: 'ACCUEIL' });
    menu.push({ id: 'schedule', icon: <Calendar size={18}/>, label: 'PLANNING' });
    menu.push({ id: 'grades', icon: <GraduationCap size={18}/>, label: 'NOTES' });
    menu.push({ id: 'notebook', icon: <BookOpen size={18}/>, label: 'CAHIER' });
    
    if (user.role === 'admin') {
      menu.push({ id: 'admin', icon: <Settings size={18}/>, label: 'GESTION' });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b dark:border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            <div className="text-3xl font-black italic text-blue-600 mr-10 tracking-tighter select-none">SKLSIS</div>
            {menu.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-[1.2rem] transition-all whitespace-nowrap italic font-black text-xs uppercase tracking-widest ${
                  activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-blue-600'
                }`}>
                {item.icon} <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl flex items-center justify-center border dark:border-slate-700 hover:scale-110 transition-transform">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <button onClick={onLogout} className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all">
              <LogOut size={20}/>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 mb-20">{children}</main>
    </div>
  );
}

if (user.role === 'admin') {
  menu.push({ id: 'home', icon: <Home size={18}/>, label: 'ACCUEIL' });
  menu.push({ id: 'admin', icon: <Settings size={18}/>, label: 'GESTION / HUB' });
  menu.push({ id: 'grades', icon: <GraduationCap size={18}/>, label: 'NOTES' });
  menu.push({ id: 'schedule', icon: <Calendar size={18}/>, label: 'PLANNING' });
}