import React from 'react';
import { Home, Calendar, GraduationCap, BookOpen, Settings, ShieldAlert, Moon, Sun, LogOut, zap } from 'lucide-react';

export default function Layout({ children, user, activeTab, setActiveTab, isDarkMode, setIsDarkMode, onLogout }) {
  
  const menu = [];
  
  // DÉFINITION DES DROITS D'ACCÈS (Visible dans le Header)
  if (user.role === 'super_admin') {
    menu.push({ id: 'super', icon: <ShieldAlert size={20}/>, label: 'CONSOLE SUPRÊME' });
  } else {
    menu.push({ id: 'home', icon: <Home size={18}/>, label: 'ACCUEIL' });
    
    // Onglets spécifiques à l'ADMIN D'ÉCOLE
    if (user.role === 'admin') {
      menu.push({ id: 'admin', icon: <Settings size={18}/>, label: 'GESTION HUB' });
    }

    menu.push({ id: 'grades', icon: <GraduationCap size={18}/>, label: 'NOTES' });
    menu.push({ id: 'schedule', icon: <Calendar size={18}/>, label: 'PLANNING' });
    menu.push({ id: 'notebook', icon: <BookOpen size={18}/>, label: 'CAHIER' });
    menu.push({ id: 'calendar', icon: <Calendar size={18}/>, label: 'ÉVÉNEMENTS' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b dark:border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 grow">
            <div className="text-3xl font-black italic text-blue-600 mr-8 tracking-tighter uppercase">SKLSIS</div>
            <div className="flex items-center gap-2">
              {menu.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all whitespace-nowrap font-black text-[10px] uppercase italic tracking-widest ${
                    activeTab === item.id ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-blue-500'
                  }`}>
                  {item.icon} <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pl-4 border-l dark:border-slate-800">
            <div className="hidden lg:block text-right">
               <p className="text-[10px] font-black dark:text-white uppercase leading-none">{user.name}</p>
               <p className="text-[8px] text-blue-600 font-bold uppercase tracking-widest italic">{user.role}</p>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl flex items-center justify-center border dark:border-slate-700">
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