import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Calendar as CalIcon, Plus, Trash2, Bell, MapPin, Tag, Clock, ChevronRight } from 'lucide-react';

export default function Calendar({ user }) {
  const [events, setEvents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', type: 'Examen', desc: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchEvents(); }, [user]);

  async function fetchEvents() {
    const { data } = await supabase.from('evenements').select('*').eq('ecole_id', user.schoolId).order('date_debut', { ascending: true });
    setEvents(data || []);
  }

  const handleCreate = async () => {
    if (!form.title || !form.date) return;
    setLoading(true);
    const { error } = await supabase.from('evenements').insert([{
      ecole_id: user.schoolId,
      titre: form.title.toUpperCase(),
      description: form.desc,
      date_debut: form.date,
      type: form.type
    }]);
    if (!error) { setShowAdd(false); setForm({ title: '', date: '', type: 'Examen', desc: '' }); fetchEvents(); }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-10 animate-fade-in flex flex-col items-center">
      
      <header className="w-full flex flex-col md:row justify-between items-center gap-6">
        <div className="text-center md:text-left">
           <h1 className="text-6xl font-black italic dark:text-white uppercase tracking-tighter leading-none">AGENDA SKLSIS</h1>
           <p className="text-blue-600 font-bold uppercase tracking-[0.4em] text-[10px] mt-2 italic">Chronologie des Événements</p>
        </div>
        {user.role === 'admin' && (
          <button onClick={() => setShowAdd(true)} className="px-10 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl italic shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all">
            <Plus size={28}/> PROGRAMMER
          </button>
        )}
      </header>

      {/* FORMULAIRE DE CRÉATION (MODAL G.O.A.T) */}
      {showAdd && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-12 rounded-[4rem] border dark:border-slate-800 space-y-8 animate-in">
            <h2 className="text-3xl font-black italic dark:text-white uppercase text-center tracking-tighter underline decoration-blue-600 underline-offset-8">Nouvel Événement</h2>
            <div className="grid grid-cols-1 gap-4">
              <input className="p-5 bg-slate-50 dark:bg-black rounded-2xl font-black dark:text-white uppercase" placeholder="TITRE DE L'ÉVÉNEMENT" onChange={e => setForm({...form, title: e.target.value})}/>
              <div className="grid grid-cols-2 gap-4">
                  <input type="datetime-local" className="p-5 bg-slate-50 dark:bg-black rounded-2xl font-black dark:text-white uppercase text-xs" onChange={e => setForm({...form, date: e.target.value})}/>
                  <select className="p-5 bg-slate-50 dark:bg-black rounded-2xl font-black dark:text-white uppercase italic" onChange={e => setForm({...form, type: e.target.value})}>
                     <option>Examen</option><option>Réunion</option><option>Sport</option><option>Fête</option>
                  </select>
              </div>
              <textarea className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] font-medium dark:text-white min-h-[100px]" placeholder="Précisions de l'événement..." onChange={e => setForm({...form, desc: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 rounded-3xl font-black uppercase tracking-widest dark:text-white">Annuler</button>
              <button onClick={handleCreate} disabled={loading} className="flex-[2] py-5 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-xl uppercase italic tracking-tighter">Confirmer l'inscription Cloud</button>
            </div>
          </div>
        </div>
      )}

      {/* LISTE HORIZONTALE DES ÉVÉNEMENTS */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events.length === 0 ? (
          <div className="col-span-full py-40 bg-white dark:bg-slate-900 rounded-[5rem] border-4 border-dashed border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center opacity-30">
             <CalIcon size={100} className="mb-6 h-20 w-20 text-slate-400" />
             <p className="font-black italic uppercase text-2xl tracking-[0.5em]">Aucun événement programmé</p>
          </div>
        ) : (
          events.map(ev => (
            <div key={ev.id} className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] shadow-2xl border dark:border-slate-800 flex items-center gap-8 relative group overflow-hidden border-b-[15px] border-blue-600 transition-all hover:-translate-y-4">
               <div className="h-24 w-24 bg-blue-50 dark:bg-black rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-blue-600/20">
                  <p className="text-3xl font-black text-blue-600 leading-none">{new Date(ev.date_debut).getDate()}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase italic">{new Date(ev.date_debut).toLocaleDateString('fr-FR', {month: 'short'})}</p>
               </div>
               <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-[8px] font-bold uppercase tracking-widest italic">{ev.type}</span>
                    <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold"><Clock size={12}/> {new Date(ev.date_debut).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}</span>
                  </div>
                  <h3 className="text-3xl font-black dark:text-white uppercase italic tracking-tighter leading-none">{ev.titre}</h3>
                  <p className="text-slate-400 text-xs font-medium italic">{ev.description || "Événement scolaire officiel."}</p>
               </div>
               {user.role === 'admin' && (
                 <button onClick={async() => {await supabase.from('evenements').delete().eq('id', ev.id); fetchEvents();}} className="p-4 bg-red-50 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all"><Trash2/></button>
               )}
               <Bell size={150} className="absolute -right-10 -bottom-10 opacity-[0.02] dark:opacity-[0.04] rotate-12" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}