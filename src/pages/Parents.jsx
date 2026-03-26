import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Heart, GraduationCap, FileText, Calendar, ChevronRight, User, TrendingUp } from 'lucide-react';

export default function Parents({ user }) {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childGrades, setChildGrades] = useState([]);

  useEffect(() => { fetchChildren(); }, [user]);

  async function fetchChildren() {
    // On va chercher les élèves liés au nom ou à l'ID du parent
    const { data } = await supabase.from('eleves').select('*, classes(nom)').eq('parent_nom', user.name);
    setChildren(data || []);
  }

  async function viewGrades(cId) {
    const { data } = await supabase.from('notes').select('*').eq('eleve_id', cId);
    setChildGrades(data || []);
    const child = children.find(x => x.id === cId);
    setSelectedChild(child);
  }

  if (selectedChild) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-12 py-10 animate-fade-in flex flex-col items-center">
         <button onClick={() => setSelectedChild(null)} className="flex items-center gap-2 text-blue-600 font-black italic uppercase"><ChevronRight className="rotate-180"/> Retour aux enfants</button>
         <header className="text-center space-y-2">
            <h1 className="text-6xl font-black italic dark:text-white uppercase tracking-tighter">SUIVI : {selectedChild.prenom}</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">{selectedChild.classes?.nom}</p>
         </header>

         <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl border dark:border-slate-800">
               <h3 className="text-2xl font-black italic dark:text-white uppercase mb-8 flex items-center gap-4"><TrendingUp className="text-blue-600"/> Dernières Notes</h3>
               <div className="space-y-4">
                  {childGrades.map(g => (
                    <div key={g.id} className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] flex justify-between items-center border dark:border-slate-800 transition-all hover:border-blue-600">
                       <span className="font-black dark:text-white italic uppercase">{g.matiere}</span>
                       <span className={`px-5 py-2 rounded-2xl font-black text-white italic ${g.valeur >= 10 ? 'bg-green-600 shadow-green-500/20' : 'bg-red-600 shadow-red-500/20'} shadow-lg`}>
                         {g.valeur} / 20
                       </span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10 bg-[#1a5276] rounded-[4rem] text-white shadow-2xl flex flex-col justify-between overflow-hidden relative group">
               <div className="relative z-10">
                 <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Assiduité</h3>
                 <p className="text-5xl font-black tracking-tighter">R.A.S</p>
                 <p className="text-xs font-bold opacity-60 uppercase mt-2 italic tracking-widest">Aucune absence signalée</p>
               </div>
               <FileText size={200} className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 py-10 animate-in flex flex-col items-center">
      <div className="text-center space-y-2">
         <h1 className="text-6xl font-black italic dark:text-white uppercase tracking-tighter">ESPACE PARENT</h1>
         <div className="h-2 w-32 bg-red-600 rounded-full mx-auto" />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {children.length === 0 ? (
          <div className="col-span-full p-20 bg-slate-100 dark:bg-slate-900/50 rounded-[4rem] border-4 border-dashed dark:border-slate-800 text-center">
            <Heart size={64} className="mx-auto text-red-500 mb-6 opacity-20" />
            <p className="text-slate-400 font-black italic uppercase tracking-[0.3em]">Aucun enfant rattaché à ce profil</p>
          </div>
        ) : (
          children.map(child => (
            <div key={child.id} onClick={() => viewGrades(child.id)} className="p-10 bg-white dark:bg-slate-900 rounded-[4rem] border-b-[15px] border-red-600 shadow-2xl cursor-pointer transition-all hover:-translate-y-4 group">
               <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl">
                  <User size={40} />
               </div>
               <h3 className="text-4xl font-black dark:text-white italic uppercase tracking-tighter leading-none mb-2">{child.prenom} <br/> {child.nom}</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">{child.classes?.nom}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}