import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Layers, UserPlus, Users, Heart, Calendar, Trash2, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminPanel({ user }) {
  const [subTab, setSubTab] = useState('classes'); 
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ fn: '', ln: '', classId: '', name: '', sub: '', parent: '' });
  const [result, setResult] = useState(null);

  useEffect(() => { fetchClasses(); }, [subTab, user]);

  async function fetchClasses() {
    const { data } = await supabase.from('classes').select('*').eq('ecole_id', user.schoolId);
    setClasses(data || []);
  }

  const handleAction = async (target) => {
    // Générateur ID random 14 chars
    const pass = Array.from({length: 14}, () => "A1B2C3D45EFG6H7J"[Math.floor(Math.random()*16)]).join('');
    const id = (form.fn || form.name || "user").toLowerCase().replace(/\s/g, '') + Math.floor(Math.random()*99);
    
    let error;
    if (target === 'classe') {
      const { error: e } = await supabase.from('classes').insert([{ nom: form.name.toUpperCase(), ecole_id: user.schoolId }]);
      error = e;
    } else if (target === 'eleve') {
      const { error: e } = await supabase.from('eleves').insert([{
        prenom: form.fn, nom: form.ln.toUpperCase(), identifiant: id, mot_de_passe: pass, 
        classe_id: form.classId, ecole_id: user.schoolId, parent_nom: form.parent
      }]);
      error = e;
    }

    if (!error) {
       if (target !== 'classe') setResult({ id, pass });
       setForm({ fn: '', ln: '', classId: '', name: '', sub: '', parent: '' });
       fetchClasses();
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-12 py-10 animate-fade-in flex flex-col items-center">
      
      {/* 🟢 TABS INTERNES GESTION ADMIN */}
      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-2xl border dark:border-slate-800 w-full max-w-3xl gap-2">
        <NavBtn id="classes" icon={<Layers/>} label="Classes" act={subTab} set={setSubTab} />
        <NavBtn id="eleves" icon={<UserPlus/>} label="Élèves" act={subTab} set={setSubTab} />
        <NavBtn id="profs" icon={<Users/>} label="Profs" act={subTab} set={setSubTab} />
        <NavBtn id="parents" icon={<Heart/>} label="Parents" act={subTab} set={setSubTab} />
      </div>

      <div className="w-full bg-white dark:bg-slate-900 p-12 md:p-20 rounded-[4rem] shadow-2xl border dark:border-slate-800 text-center">
         
         {subTab === 'classes' && (
           <div className="space-y-10">
              <h2 className="text-4xl font-black italic dark:text-white uppercase tracking-tighter underline decoration-blue-600 underline-offset-8">Structure des Classes</h2>
              <div className="flex gap-4">
                 <input className="flex-1 p-6 bg-slate-50 dark:bg-black rounded-3xl outline-none font-black dark:text-white text-xl uppercase italic border-4 border-transparent focus:border-blue-600 transition-all" placeholder="Nom de la classe (Ex: 6ème A)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                 <button onClick={() => handleAction('classe')} className="bg-blue-600 text-white px-12 rounded-[1.5rem] font-black shadow-xl italic">AJOUTER</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {classes.map(c => (
                   <div key={c.id} className="p-4 bg-slate-50 dark:bg-black rounded-[2rem] border dark:border-slate-800 text-center font-black text-blue-600 italic text-xs uppercase tracking-tighter">{c.nom}</div>
                 ))}
              </div>
           </div>
         )}

         {subTab === 'eleves' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <h2 className="md:col-span-2 text-4xl font-black italic dark:text-white uppercase text-center mb-6 tracking-tighter">Registre Étudiant Cloud</h2>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] font-bold dark:text-white italic uppercase outline-none focus:ring-4 ring-blue-600/10 placeholder:font-normal" placeholder="Prénom" onChange={e => setForm({...form, fn: e.target.value})}/>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] font-bold dark:text-white italic uppercase outline-none focus:ring-4 ring-blue-600/10 placeholder:font-normal" placeholder="Nom" onChange={e => setForm({...form, ln: e.target.value})}/>
              
              <select className="md:col-span-2 p-6 bg-slate-100 dark:bg-black rounded-[2rem] font-black dark:text-white uppercase outline-none border-4 border-transparent focus:border-blue-600 h-[84px] cursor-pointer" onChange={e => setForm({...form, classId: e.target.value})}>
                 <option>-- CHOISIR LA CLASSE --</option>
                 {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>

              <button onClick={() => handleAction('eleve')} className="md:col-span-2 py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl shadow-xl uppercase italic active:scale-95 transition-all">Lancer l'Enregistrement</button>
           </div>
         )}

         {result && (
           <div className="col-span-full mt-12 p-12 bg-slate-950 border-4 border-dashed border-green-500 rounded-[3rem] animate-bounce text-center shadow-2xl">
              <p className="text-green-500 font-black uppercase text-[10px] tracking-[0.5em] mb-4">Accès Opérationnel</p>
              <p className="font-mono font-black text-4xl text-white tracking-widest uppercase italic mb-2 select-all">{result.id}</p>
              <p className="font-mono text-slate-500 text-xl tracking-widest select-all opacity-50">{result.pass}</p>
           </div>
         )}

      </div>
    </div>
  );
}

function NavBtn({ id, icon, label, act, set }) {
  const isAct = act === id;
  return (
    <button onClick={() => set(id)} className={`flex-1 flex items-center justify-center gap-3 py-5 px-8 rounded-3xl transition-all font-black text-[10px] uppercase italic whitespace-nowrap ${isAct ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}