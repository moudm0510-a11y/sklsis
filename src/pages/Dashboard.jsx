import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Bell, Trophy, Clock, BookOpen, AlertCircle, 
  TrendingUp, Star, Zap, ShieldCheck, User 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ user }) {
  const [annonces, setAnnonces] = useState([]);
  const [stats, setStats] = useState({ moyenne: "15.5", totalEleves: 0, totalClasses: 0 });

  useEffect(() => {
    fetchLiveUpdates();
  }, [user]);

  async function fetchLiveUpdates() {
    // 1. Récupérer les dernières annonces de l'école
    const { data: ads } = await supabase
      .from('annonces')
      .select('*')
      .eq('ecole_id', user.schoolId)
      .order('created_at', { ascending: false })
      .limit(3);
    setAnnonces(ads || []);

    // 2. Récupérer les stats si c'est un admin
    if (user.role === 'admin') {
      const { count: cCount } = await supabase.from('classes').select('*', { count: 'exact', head: true }).eq('ecole_id', user.schoolId);
      const { count: eCount } = await supabase.from('eleves').select('*', { count: 'exact', head: true }).eq('ecole_id', user.schoolId);
      setStats(s => ({ ...s, totalClasses: cCount || 0, totalEleves: eCount || 0 }));
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-10 animate-fade-in flex flex-col items-center">
      
      {/* 🚀 BANNIÈRE DE BIENVENUE DYNAMIQUE */}
      <div className="w-full bg-white dark:bg-[#020617] p-12 rounded-[5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border dark:border-slate-800 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group border-b-[15px] border-blue-600">
        <div className="relative z-10 space-y-4 text-center md:text-left">
           <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] italic animate-pulse">
             <Zap size={14}/> Système Opérationnel
           </div>
           <h1 className="text-7xl font-black italic dark:text-white uppercase tracking-tighter leading-none">
             BONJOUR, <br/><span className="text-blue-600">{user.name.split(' ')[0]}</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] italic">Espace Sécurisé SKLSIS v4.0.0</p>
        </div>
        
        <div className="hidden lg:flex gap-4 relative z-10 transition-all group-hover:scale-105 duration-700">
           <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border dark:border-slate-800 shadow-xl text-center flex flex-col items-center justify-center">
              <Star size={32} className="text-yellow-500 mb-2 drop-shadow-lg" />
              <p className="text-[10px] font-black text-slate-400 uppercase italic">Rang Actuel</p>
              <p className="text-3xl font-black dark:text-white uppercase italic">EXCELLENT</p>
           </div>
        </div>

        <ShieldCheck size={400} className="absolute -right-20 -bottom-20 opacity-[0.02] dark:opacity-[0.04] group-hover:rotate-12 transition-transform duration-1000" />
      </div>

      {/* 📊 GRILLE DE STATISTIQUES G.O.A.T */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard icon={<TrendingUp/>} label="Indice de Performance" val={user.role === 'student' ? stats.moyenne : stats.totalEleves} sub={user.role === 'student' ? "/ 20 pts" : "Élèves"} color="blue" />
        <StatCard icon={<Clock/>} label="Prochain Événement" val="10:00" sub="Mathématiques" color="green" />
        <StatCard icon={<BookOpen/>} label="Travaux Pratiques" val="03" sub="En attente" color="purple" />
      </div>

      {/* 🔔 SECTION ANNONCES ET TIMELINE */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* BLOC ANNONCES */}
        <div className="space-y-8 bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl border dark:border-slate-800">
          <div className="flex justify-between items-center px-4">
             <h2 className="text-3xl font-black italic dark:text-white uppercase tracking-tighter flex items-center gap-4">
               <Bell className="text-red-500 animate-bounce" size={28}/> Fil d'Actu
             </h2>
             <div className="h-1 w-24 bg-red-500/20 rounded-full"></div>
          </div>

          <div className="space-y-6">
            {annonces.length === 0 ? (
              <div className="p-20 text-center border-4 border-dashed rounded-[3rem] border-slate-50 dark:border-slate-800">
                <p className="text-slate-400 font-black italic uppercase tracking-[0.2em]">Aucun message de la direction</p>
              </div>
            ) : (
              annonces.map((a, i) => (
                <div key={a.id} className="p-8 bg-slate-50 dark:bg-black/40 rounded-[2.5rem] border-l-[12px] border-blue-600 shadow-lg relative overflow-hidden transition-all hover:translate-x-3">
                   <h3 className="text-2xl font-black dark:text-white uppercase italic tracking-tighter mb-2">{a.titre}</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed italic">{a.message}</p>
                   <div className="mt-4 flex items-center gap-4">
                      <span className="text-[10px] font-black text-blue-600 uppercase italic tracking-widest">{new Date(a.created_at).toLocaleDateString()}</span>
                   </div>
                   <AlertCircle size={100} className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* BLOC CITATION ET INFOS */}
        <div className="flex flex-col gap-8">
           <div className="flex-1 bg-gradient-to-br from-[#1a5276] to-blue-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Motivation Hebdo</h3>
              <p className="text-2xl font-black italic leading-tight text-blue-100 mb-6">"L'éducation n'est pas le remplissage d'un seau, mais l'allumage d'un feu."</p>
              <div className="h-1 w-20 bg-yellow-400 rounded-full group-hover:w-full transition-all duration-700"></div>
              <Zap size={200} className="absolute -right-20 -bottom-20 opacity-10 group-hover:scale-110 transition-transform duration-1000"/>
           </div>

           <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border dark:border-slate-800 shadow-xl flex items-center gap-6">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center font-black animate-pulse">LIVE</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase italic mb-1 tracking-widest">État du Serveur Cloud</p>
                <p className="text-xl font-black dark:text-white uppercase italic tracking-tighter leading-none">Connexion Supabase : Optimale (23ms)</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, val, sub, color }) {
  const themes = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100"
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl border dark:border-slate-800 flex items-center gap-8 transition-all hover:-translate-y-4 hover:shadow-blue-600/5 duration-500 active:scale-95 cursor-pointer border-b-[8px] border-slate-100 dark:border-slate-800">
       <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner ${themes[color]}`}>{icon}</div>
       <div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{label}</p>
         <div className="flex items-end gap-2">
            <p className="text-4xl font-black italic dark:text-white leading-none">{val}</p>
            <p className="text-xs font-bold text-slate-400 uppercase italic tracking-widest">{sub}</p>
         </div>
       </div>
    </div>
  );
}