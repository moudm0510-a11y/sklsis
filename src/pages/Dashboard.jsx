import React from 'react';
import { Bell, School, TrendingUp, Clock, BookOpen } from 'lucide-react';

export default function Dashboard({ user }) {
  return (
    <div className="w-full max-w-6xl space-y-10 animate-in p-6">
      <header className="flex justify-between items-center bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border dark:border-slate-800">
        <div>
          <h1 className="text-4xl font-black italic text-slate-900 dark:text-white mb-2">
            Bonjour, {user.name} 👋
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Bienvenue sur votre portail SKLSIS</p>
        </div>
        <div className="w-16 h-16 bg-blue-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-xl">
          <Bell className="animate-bounce" size={28}/>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-xl flex items-center gap-6 group hover:translate-y-[-10px] transition-all">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900 rounded-2xl flex items-center justify-center text-blue-600"><TrendingUp/></div>
          <div><p className="text-xs font-black text-slate-400 uppercase">Moyenne</p><p className="text-2xl font-black text-slate-900 dark:text-white">14.8/20</p></div>
        </div>
        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-xl flex items-center gap-6 group hover:translate-y-[-10px] transition-all">
          <div className="w-14 h-14 bg-green-50 dark:bg-green-900 rounded-2xl flex items-center justify-center text-green-600"><Clock/></div>
          <div><p className="text-xs font-black text-slate-400 uppercase">Prochain Cours</p><p className="text-2xl font-black text-slate-900 dark:text-white italic text-xs uppercase tracking-tighter">Mathématiques</p></div>
        </div>
        <div className="p-8 bg-[#1a5276] rounded-[2.5rem] text-white shadow-xl flex justify-between items-center overflow-hidden relative group">
           <div className="relative z-10">
             <p className="font-black text-xl italic uppercase">Planning</p>
             <p className="text-xs opacity-70">Aujourd'hui : 5 Cours</p>
           </div>
           <School size={100} className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform"/>
        </div>
      </div>
    </div>
  );
}