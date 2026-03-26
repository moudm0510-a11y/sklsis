import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Layers, UserPlus, Users, Bell, Trash2, CheckCircle, Smartphone } from 'lucide-react';

export default function AdminPanel({ user }) {
  const [subTab, setSubTab] = useState('classes'); 
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fn: '', ln: '', classId: '', name: '', sub: '' });
  const [result, setResult] = useState(null);

  useEffect(() => { fetchClasses(); }, [subTab]);

  async function fetchClasses() {
    const { data } = await supabase.from('classes').select('*').eq('ecole_id', user.schoolId);
    setClasses(data || []);
  }

  const handleAction = async (target) => {
    setLoading(true);
    const pass = Array.from({length: 14}, () => "12345ABCDE"[Math.floor(Math.random()*10)]).join('');
    const id = (form.fn || form.name).toLowerCase().replace(/\s/g, '') + Math.floor(Math.random()*99);
    
    let error;
    if (target === 'classe') {
      const { error: e } = await supabase.from('classes').insert([{ nom: form.name.toUpperCase(), ecole_id: user.schoolId }]);
      error = e;
    } else if (target === 'eleve') {
      const { error: e } = await supabase.from('eleves').insert([{ prenom: form.fn, nom: form.ln.toUpperCase(), identifiant: id, mot_de_passe: pass, classe_id: form.classId, ecole_id: user.schoolId }]);
      error = e;
    } else if (target === 'prof') {
      const { error: e } = await supabase.from('profs').insert([{ nom_complet: form.name, matiere: form.sub, identifiant: id, mot_de_passe: pass, ecole_id: user.schoolId }]);
      error = e;
    }

    if (!error) {
       if (target !== 'classe') setResult({ id, pass });
       setForm({ fn: '', ln: '', classId: '', name: '', sub: '' });
       fetchClasses();
    }
    setLoading(false);
  };

  return (
    <div className="w-full space-y-12 animate-in flex flex-col items-center py-6">
      
      {/* 🟢 TABS INTERNES GESTION */}
      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-xl border dark:border-slate-800 w-full max-w-2xl gap-2">
        <button onClick={() => setSubTab('classes')} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl transition-all font-black text-[10px] uppercase italic ${subTab === 'classes' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400'}`}><Layers size={18}/> Classes</button>
        <button onClick={() => setSubTab('eleves')} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl transition-all font-black text-[10px] uppercase italic ${subTab === 'eleves' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400'}`}><UserPlus size={18}/> Élèves</button>
        <button onClick={() => setSubTab('profs')} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl transition-all font-black text-[10px] uppercase italic ${subTab === 'profs' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400'}`}><Users size={18}/> Profs</button>
      </div>

      <div className="w-full bg-white dark:bg-slate-900 p-12 md:p-20 rounded-[5rem] shadow-2xl border dark:border-slate-800 text-center">
         
         {/* SECTEUR CLASSES */}
         {subTab === 'classes' && (
           <div className="space-y-10">
              <h2 className="text-4xl font-black italic dark:text-white uppercase tracking-tighter">Initialisation des Classes</h2>
              <div className="flex gap-4">
                 <input className="flex-1 p-6 bg-slate-50 dark:bg-black rounded-3xl outline-none font-black dark:text-white text-xl uppercase italic border-4 border-transparent focus:border-blue-600 transition-all" placeholder="Nom de la classe (Ex: 6ème A)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                 <button onClick={() => handleAction('classe')} className="bg-blue-600 text-white px-12 rounded-[1.5rem] font-black italic shadow-xl">CRÉER</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {classes.map(c => (
                   <div key={c.id} className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] border dark:border-slate-800 text-center relative group">
                     <span className="font-black text-blue-600 italic text-xs tracking-widest">{c.nom}</span>
                     <button onClick={async () => { await supabase.from('classes').delete().eq('id', c.id); fetchClasses(); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12}/></button>
                   </div>
                 ))}
              </div>
           </div>
         )}

         {/* SECTEUR ÉLÈVES */}
         {subTab === 'eleves' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <h2 className="md:col-span-2 text-4xl font-black italic dark:text-white uppercase text-center mb-6">Registre Étudiant</h2>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] font-bold dark:text-white uppercase italic outline-none focus:ring-4 ring-blue-600/10" placeholder="Prénom" onChange={e => setForm({...form, fn: e.target.value})}/>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] font-bold dark:text-white uppercase italic outline-none focus:ring-4 ring-blue-600/10" placeholder="Nom" onChange={e => setForm({...form, ln: e.target.value})}/>
              <select className="md:col-span-2 p-6 bg-slate-100 dark:bg-black rounded-[2rem] font-black dark:text-white uppercase italic outline-none border-4 border-transparent focus:border-blue-600 h-[84px]" onChange={e => setForm({...form, classId: e.target.value})}>
                 <option>-- CHOISIR LA CLASSE --</option>
                 {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
              <button onClick={() => handleAction('eleve')} className="md:col-span-2 py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl shadow-xl uppercase italic active:scale-95 transition-all">DÉPLOYER IDENTITÉ CLOUD</button>
           </div>
         )}

         {/* RÉSULTAT GÉNÉRATION */}
         {result && (
           <div className="col-span-full mt-12 p-12 bg-slate-950 border-4 border-dashed border-green-500 rounded-[3rem] animate-bounce">
              <p className="text-green-500 font-black uppercase text-[10px] tracking-[0.5em] mb-4">Compte Activé</p>
              <p className="font-mono font-black text-4xl text-white tracking-widest uppercase italic mb-2 select-all">{result.id}</p>
              <p className="font-mono text-slate-500 tracking-widest select-all">{result.pass}</p>
           </div>
         )}

      </div>
    </div>
  );
}