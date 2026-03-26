import React from 'react';
import { Home, Calendar, GraduationCap, BookOpen, Settings, ShieldAlert, Moon, Sun, LogOut, zap } from 'lucide-react';

export default function Layout({ children, user, activeTab, setActiveTab, isDarkMode, setIsDarkMode, onLogout }) {
  
  // On crée le menu dynamiquement selon le rôle
  const menu = [];
  
  if (user.role === 'super_admin') {
    // LE SUPER ADMIN NE VOIT QUE LE REGISTRE GLOBAL
    menu.push({ id: 'super', icon: <ShieldAlert size={20}/>, label: 'REGISTRE SUPRÊME' });
  } else {
    // TOUT LE MONDE SAUF SUPER ADMIN
    menu.push({ id: 'home', icon: <Home size={18}/>, label: 'ACCUEIL' });

    // L'ADMIN D'ÉCOLE VOIT LE HUB DE GESTION
    if (user.role === 'admin') {
      menu.push({ id: 'admin', icon: <Settings size={18}/>, label: 'GESTION HUB' });
    }

    menu.push({ id: 'grades', icon: <GraduationCap size={18}/>, label: 'NOTES' });
    menu.push({ id: 'schedule', icon: <Calendar size={18}/>, label: 'PLANNING' });
    menu.push({ id: 'notebook', icon: <BookOpen size={18}/>, label: 'CAHIER' });
    menu.push({ id: 'calendar', icon: <Calendar size={18}/>, label: 'AGENDA' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] transition-colors duration-500 font-black italic uppercase">
      
      {/* HEADER HORIZONTAL G.O.A.T */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b dark:border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between gap-4">
          
          {/* LOGO & NAV */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 flex-1">
            <div className="text-3xl font-black italic text-blue-600 mr-4 tracking-tighter uppercase select-none">SKLSIS</div>
            <div className="flex items-center gap-2">
              {menu.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all whitespace-nowrap text-[10px] tracking-widest ${
                    activeTab === item.id ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-slate-400 hover:text-blue-500'
                  }`}
                >
                  {item.icon} <span className="hidden lg:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ACTIONS DROITE */}
          <div className="flex items-center gap-3 pl-4 border-l dark:border-slate-800">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center border dark:border-slate-800 text-slate-500 dark:text-slate-100">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <button onClick={onLogout} className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 active:scale-90 transition-all">
              <LogOut size={20}/>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 w-full bg-transparent">{children}</main>
    </div>
  );
}