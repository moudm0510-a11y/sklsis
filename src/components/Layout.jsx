import React from 'react';
import { 
  Home, Calendar, GraduationCap, BookOpen, 
  Settings, ShieldAlert, Moon, Sun, LogOut, LayoutGrid 
} from 'lucide-react';

export default function Layout({ children, user, activeTab, setActiveTab, isDarkMode, setIsDarkMode, onLogout }) {
  
  const menu = [];
  
  // FILTRAGE DES RÔLES POUR LE HEADER HORIZONTAL
  if (user.role === 'super_admin') {
    // LE SUPER ADMIN GÈRE LE RÉSEAU MONDIAL SKLSIS
    menu.push({ id: 'super', icon: <ShieldAlert size={18}/>, label: 'REGISTRE CENTRAL' });
  } else {
    // TOUT LE MONDE (ADMIN & ÉLÈVE) VOIT CES ONGLETS
    menu.push({ id: 'home', icon: <Home size={18}/>, label: 'ACCUEIL' });
    
    // ONGLETS SPÉCIFIQUES POUR L'ADMIN D'ÉCOLE
    if (user.role === 'admin') {
      menu.push({ id: 'admin', icon: <Settings size={18}/>, label: 'GESTION HUB' });
    }

    menu.push({ id: 'grades', icon: <GraduationCap size={18}/>, label: 'NOTES' });
    menu.push({ id: 'schedule', icon: <Calendar size={18}/>, label: 'PLANNING' });
    menu.push({ id: 'notebook', icon: <BookOpen size={18}/>, label: 'CAHIER' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] transition-all duration-500 font-black italic uppercase tracking-widest">
      
      {/* 🚀 NAVIGATION HORIZONTALE SKLSIS */}
      <header className="sticky top-0 z-[100] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b-[1px] dark:border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 flex-1">
            <div className="text-4xl font-black italic text-blue-600 mr-10 tracking-tighter select-none">SKLSIS</div>
            <nav className="flex items-center gap-3">
              {menu.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] transition-all whitespace-nowrap text-[10px] ${
                    activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] scale-110 active:scale-95' 
                    : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                  }`}
                >
                  {item.icon} <span className="hidden xl:inline">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* ACTIONS RAPIDES */}
          <div className="flex items-center gap-4 pl-6 border-l dark:border-slate-800">
            <div className="hidden lg:block text-right mr-2 leading-none">
                <p className="text-[10px] text-slate-900 dark:text-white font-black">{user.name}</p>
                <p className="text-[8px] text-blue-600 font-bold mt-1">PROFIL: {user.role}</p>
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center border dark:border-slate-700 shadow-sm active:rotate-180 transition-all duration-500"
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-blue-600"/>}
            </button>
            <button 
              onClick={onLogout} 
              className="w-14 h-14 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-75"
            >
              <LogOut size={20}/>
            </button>
          </div>
        </div>
      </header>

      {/* ZONE DE RENDU DYNAMIQUE */}
      <main className="flex-1 w-full flex flex-col items-center bg-transparent">
        {children}
      </main>

    </div>
  );
}