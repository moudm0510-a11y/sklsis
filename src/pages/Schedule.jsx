import React, { useState } from 'react';

export default function Schedule() {
  const [type, setType] = useState('normal'); 
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  return (
    <div className="w-full flex flex-col items-center space-y-12 animate-in mt-10">
      <h1 className="text-5xl font-black italic dark:text-white uppercase tracking-tighter border-b-8 border-blue-700 pb-4">Planning Académique</h1>
      
      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-2xl border dark:border-slate-800 w-full max-w-sm">
        <button onClick={() => setType('normal')} className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-[10px] transition-all ${type === 'normal' ? 'bg-blue-700 text-white shadow-xl' : 'text-slate-400'}`}>COURS NORMAUX</button>
        <button onClick={() => setType('etude')} className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-[10px] transition-all ${type === 'etude' ? 'bg-green-600 text-white shadow-xl' : 'text-slate-400'}`}>ÉTUDE DU SOIR</button>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 mb-20">
        {jours.map(jour => (
          <div key={jour} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-b-[8px] border-blue-700 shadow-xl text-center group transition-all hover:-translate-y-2">
            <h3 className="font-black mb-6 text-xl dark:text-white uppercase italic tracking-tighter">{jour}</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black dark:text-white text-[10px] border dark:border-slate-700 uppercase italic">08:00 - Physique</div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black dark:text-white text-[10px] border dark:border-slate-700 uppercase italic">10:00 - Algèbre</div>
              {type === 'etude' && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-2xl font-black text-[10px] animate-pulse italic uppercase">17:00 - Étude Dirigée</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}