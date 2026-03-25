import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Plus, Trash2, Bell } from 'lucide-react';

export default function Calendar() {
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events')) || []);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'Examen' });

  useEffect(() => { localStorage.setItem('events', JSON.stringify(events)); }, [events]);

  return (
    <div className="w-full max-w-5xl space-y-10 py-10 animate-in">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black italic dark:text-white uppercase">Calendrier Scolaire</h1>
        <button onClick={() => setShowAdd(true)} className="p-4 bg-[#1a5276] text-white rounded-2xl font-black shadow-xl flex items-center gap-2">
          <Plus size={20}/> AJOUTER ÉVÉNEMENT
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-4 border-dashed border-[#1a5276] grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white font-bold" placeholder="Titre de l'événement" onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
          <input type="date" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white font-bold uppercase text-xs" onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
          <button onClick={() => {setEvents([...events, { ...newEvent, id: Date.now() }]); setShowAdd(false)}} className="bg-green-600 text-white rounded-xl font-black italic uppercase">Confirmer</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <p className="md:col-span-2 text-center text-slate-400 font-bold italic py-10 uppercase">Aucun événement prévu pour le moment.</p>
        ) : (
          events.map(ev => (
            <div key={ev.id} className="flex items-center justify-between p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-xl group transition-all hover:border-blue-500">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center font-black italic">
                    {ev.date.split('-')[2]}
                  </div>
                                    <div>
                                      <h3 className="font-black text-xl dark:text-white uppercase italic">{ev.title}</h3>
                                      <p className="text-xs text-slate-400 font-bold">{ev.date}</p>
                                    </div>
                                 </div>
                                 <button onClick={() => setEvents(events.filter(e => e.id !== ev.id))} className="p-3 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors">
                                    <Trash2 size={20} />
                                 </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  }