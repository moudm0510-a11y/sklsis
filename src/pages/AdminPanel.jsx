import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Layers, UserPlus, Users, Heart, Bookmark, Smartphone, Trash2, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminPanel({ user }) {
  const [subTab, setSubTab] = useState('classes'); 
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ fn: '', ln: '', classId: '', pName: '', subName: '' });
  const [result, setResult] = useState(null);

  useEffect(() => { 
    if (user.schoolId) fetchClasses(); 
  }, [user, subTab]);

  async function fetchClasses() {
    const { data } = await supabase.from('classes').select('*').eq('ecole_id', user.schoolId);
    setClasses(data || []);
  }

  const handleAction = async (type) => {
    const id = (form.fn || form.pName || "user").toLowerCase().replace(/\s/g, '') + Math.floor(Math.random()*99);
    const pass = Array.from({length: 14}, () => "AZERTY12345QSDFG"[Math.floor(Math.random()*16)]).join('');
    let error;

    if (type === 'classe') {
      const { error: e } = await supabase.from('classes').insert([{ nom: form.tempClassName.toUpperCase(), ecole_id: user.schoolId }]);
      error = e;
    } else if (type === 'eleve') {
      const { error: e } = await supabase.from('eleves').insert([{
        prenom: form.fn, nom: form.ln.toUpperCase(), identifiant: id, mot_de_passe: pass,
        classe_id: form.classId, ecole_id: user.schoolId
      }]);
      error = e;
    } else if (type === 'prof') {
      const { error: e } = await supabase.from('profs').insert([{
        nom_complet: form.pName, matiere: form.subName, identifiant: id, mot_de_passe: pass, ecole_id: user.schoolId
      }]);
      error = e;
    }

    if (!error) {
       if (type !== 'classe') setResult({ id, pass });
       setForm({ fn: '', ln: '', classId: '', pName: '', subName: '' });
       fetchClasses();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-10 animate-fade-in flex flex-col items-center">
      
      {/* 🟠 NAVIGATION GESTION HUB */}
      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl border dark:border-slate-800 w-full max-w-4xl gap-3">
        <NavB id="classes" icon={<Layers/>} label="Classes" act={subTab} set={setSubTab} />
        <NavB id="eleves" icon={<UserPlus/>} label="Élèves" act={subTab} set={setSubTab} />
        <NavB id="profs" icon={<Users/>} label="Profs" act={subTab} set={setSubTab} />
        <NavB id="parents" icon={<Heart/>} label="Parents" act={subTab} set={setSubTab} />
      </div>

      <div className="w-full bg-white dark:bg-slate-900 p-12 md:p-20 rounded-[5rem] shadow-2xl border dark:border-slate-800 text-center relative transition-all">
         
         {/* SECTEUR CLASSES */}
         {subTab === 'classes' && (
           <div className="space-y-12">
              <h2 className="text-4xl font-black italic dark:text-white uppercase tracking-tighter leading-none underline decoration-blue-600">1. Création des Classes</h2>
              <div className="flex gap-4">
                 <input className="flex-1 p-6 bg-slate-50 dark:bg-black rounded-3xl outline-none font-black dark:text-white text-xl uppercase italic border-2 border-transparent focus:border-blue-600 transition-all" placeholder="Nom (Ex: 6ème B)" value={form.tempClassName || ""} onChange={e => setForm({...form, tempClassName: e.target.value})} />
                 <button onClick={() => handleAction('classe')} className="bg-blue-600 text-white px-14 rounded-2xl font-black italic shadow-xl">CRÉER</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {classes.map(c => (
                  <div key={c.id} className="p-6 bg-slate-50 dark:bg-black border dark:border-slate-800 rounded-[2rem] relative group">
                     <span className="font-black text-blue-600 italic text-xs tracking-widest uppercase">{c.nom}</span>
                     <Trash2 onClick={async() => {await supabase.from('classes').delete().eq('id',c.id); fetchClasses();}} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer" size={14}/>
                  </div>
                ))}
              </div>
           </div>
         )}

         {/* SECTEUR ÉLÈVES */}
         {subTab === 'eleves' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <h2 className="md:col-span-2 text-4xl font-black italic dark:text-white uppercase text-center mb-6 tracking-tighter">2. Enregistrement Étudiant</h2>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-3xl font-bold dark:text-white outline-none focus:ring-4 ring-blue-600/10 uppercase italic" placeholder="Prénom" onChange={e => setForm({...form, fn: e.target.value})}/>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-3xl font-bold dark:text-white outline-none focus:ring-4 ring-blue-600/10 uppercase italic" placeholder="Nom" onChange={e => setForm({...form, ln: e.target.value})}/>
              <select className="md:col-span-2 p-6 bg-slate-50 dark:bg-black border-4 border-transparent focus:border-blue-600 rounded-3xl font-black dark:text-white uppercase italic h-[84px]" onChange={e => setForm({...form, classId: e.target.value})}>
                 <option>-- SÉLECTIONNEZ LA CLASSE --</option>
                 {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
              <button onClick={() => handleAction('eleve')} className="md:col-span-2 py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl shadow-xl uppercase italic active:scale-90 transition-all">GÉNÉRER IDENTITÉ CLOUD</button>
           </div>
         )}

         {/* RÉSULTAT GÉNÉRATION */}
         {result && (
           <div className="col-span-full mt-12 p-12 bg-slate-950 border-4 border-dashed border-green-500 rounded-[4rem] text-center animate-bounce shadow-2xl">
              <p className="text-green-500 font-black uppercase text-[10px] mb-4 italic tracking-widest">Identité numérique déployée</p>
              <p className="font-mono font-black text-4xl text-white tracking-widest uppercase italic mb-2 select-all">{result.id}</p>
              <p className="font-mono text-slate-500 tracking-widest select-all opacity-50">{result.pass}</p>
           </div>
         )}

      </div>
    </div>
  );
}

function NavB({ id, icon, label, act, set }) {
  const isAct = act === id;
  return (
    <button onClick={() => set(id)} className={`flex-1 flex items-center justify-center gap-3 py-5 px-6 rounded-2xl transition-all font-black text-[10px] uppercase italic whitespace-nowrap ${isAct ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-slate-400 hover:bg-slate-50'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}