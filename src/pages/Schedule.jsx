import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Clock, Calendar, Bookmark, Layout, Plus, CheckCircle } from 'lucide-react';

export default function Schedule({ user }) {
  const [type, setType] = useState('normal'); 
  const [schedule, setSchedule] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  
  const jours = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];

  useEffect(() => {
    fetchInitial();
  }, [user]);

  async function fetchInitial() {
     const { data: cls } = await supabase.from('classes').select('*').eq('ecole_id', user.schoolId);
     setClasses(cls || []);
     if (user.role === 'student') {
        const student = await supabase.from('eleves').select('classe_id').eq('id', user.id).single();
        if (student.data) fetchTargetSchedule(student.data.classe_id);
     }
  }

  async function fetchTargetSchedule(cId) {
     const { data } = await supabase.from('plannings').select('*').eq('classe_id', cId);
     setSchedule(data || []);
     setSelectedClass(cId);
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-10 animate-fade-in flex flex-col items-center">
      
      <div className="text-center space-y-2">
         <h1 className="text-6xl font-black italic dark:text-white uppercase tracking-tighter">PLANNING SKLSIS</h1>
         <div className="h-2 w-32 bg-blue-600 rounded-full mx-auto" />
      </div>

      {/* SÉLECTEUR DE CLASSE POUR ADMIN OU INFOS ÉLÈVE */}
      {user.role === 'admin' && (
        <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-2xl border gap-2 w-full max-w-2xl">
          {classes.map(c => (
            <button key={c.id} onClick={() => fetchTargetSchedule(c.id)} className={`flex-1 py-4 rounded-3xl font-black text-[10px] uppercase italic transition-all ${selectedClass === c.id ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-400'}`}>
              {c.nom}
            </button>
          ))}
        </div>
      )}

      {/* TOGGLE NORMAL / ETUDE */}
      <div className="flex bg-slate-100 dark:bg-slate-900/50 p-2 rounded-[2rem] w-full max-w-sm border dark:border-slate-800">
         <button onClick={() => setType('normal')} className={`flex-1 py-4 rounded-[1.5rem] font-black text-xs uppercase italic transition-all ${type === 'normal' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xl' : 'text-slate-400'}`}>Cours</button>
         <button onClick={() => setType('etude')} className={`flex-1 py-4 rounded-[1.5rem] font-black text-xs uppercase italic transition-all ${type === 'etude' ? 'bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 shadow-xl' : 'text-slate-400'}`}>Étude du Soir</button>
      </div>

      {/* GRILLE HORIZONTALE DU PLANNING */}
      <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-8">
        {jours.map(jour => {
          const coursJour = schedule.filter(s => s.jour === jour.charAt(0).toUpperCase() + jour.slice(1).toLowerCase());
          return (
            <div key={jour} className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border-b-[15px] border-blue-600 shadow-2xl transition-all hover:scale-105 hover:border-green-500 duration-500 text-center flex flex-col group">
               <h3 className="font-black mb-10 text-2xl dark:text-white uppercase italic tracking-tighter">{jour}</h3>
               <div className="space-y-6 flex-1">
                  {coursJour.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10">
                       <Clock size={48} className="dark:text-white" />
                    </div>
                  ) : (
                    coursJour.map((c, i) => (
                      <div key={i} className="p-6 bg-slate-50 dark:bg-[#020617] rounded-[2rem] border-2 border-transparent hover:border-blue-600 transition-all shadow-md">
                         <p className="text-xl font-black dark:text-white leading-none mb-2">{c.matiere}</p>
                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{c.heure || '08:00'}</p>
                      </div>
                    ))
                  )}
                  {type === 'etude' && (
                    <div className="p-6 bg-green-50 dark:bg-green-950/20 text-green-600 border-4 border-dashed border-green-200 dark:border-green-900 rounded-[2.5rem] animate-pulse">
                       <p className="text-[10px] font-black uppercase mb-1 underline">Syllabus Étude</p>
                       <p className="text-xs font-bold font-mono">17H - 19H</p>
                    </div>
                  )}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}