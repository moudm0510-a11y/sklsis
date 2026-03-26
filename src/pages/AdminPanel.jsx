import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Layers, UserPlus, Users, Heart, Calendar, Bell, 
  Trash2, RefreshCw, CheckCircle, Smartphone, Save, GraduationCap 
} from 'lucide-react';

export default function AdminPanel({ user }) {
  const [subTab, setSubTab] = useState('classes'); 
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCoreData(); }, [subTab]);

  async function fetchCoreData() {
    const { data: cls } = await supabase.from('classes').select('*').eq('ecole_id', user.schoolId);
    setClasses(cls || []);
    const { data: pars } = await supabase.from('parents').select('*').eq('ecole_id', user.schoolId);
    setParents(pars || []);
  }

  // --- GÉNÉRATEUR DE CRÉDENTIALS 14 CHARS ---
  const genResult = (name) => {
    const id = name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random()*999);
    const pass = Array.from({length: 14}, () => "A1B2C3D45EFG6H7J"[Math.floor(Math.random()*16)]).join('');
    return { id, pass };
  };

  const handleAction = async (target) => {
    setLoading(true);
    const { id, pass } = genResult(form.fn || form.name || "user");
    let error;

    if (target === 'classe') {
      const { error: e } = await supabase.from('classes').insert([{ nom: form.name.toUpperCase(), ecole_id: user.schoolId }]);
      error = e;
    } else if (target === 'eleve') {
      const { error: e } = await supabase.from('eleves').insert([{
        prenom: form.fn, nom: form.ln.toUpperCase(), identifiant: id, mot_de_passe: pass,
        classe_id: form.classId, parent_id: form.parentId, ecole_id: user.schoolId
      }]);
      error = e;
    } else if (target === 'prof') {
      const { error: e } = await supabase.from('profs').insert([{
        nom_complet: form.name, matiere: form.sub, identifiant: id, mot_de_passe: pass, ecole_id: user.schoolId
      }]);
      error = e;
    } else if (target === 'parent') {
      const { error: e } = await supabase.from('parents').insert([{
        nom_complet: form.name, identifiant: id, mot_de_passe: pass, ecole_id: user.schoolId
      }]);
      error = e;
    }

    if (!error) {
       setResult({ id, pass });
       setForm({});
       fetchCoreData();
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-10 animate-fade-in flex flex-col items-center">
      
      {/* HEADER DE NAVIGATION INTERNE */}
      <div className="flex bg-white dark:bg-slate-900 p-3 rounded-[3rem] shadow-2xl border dark:border-slate-800 w-full overflow-x-auto no-scrollbar gap-4">
        <TabItem id="classes" icon={<Layers/>} label="Classes" act={subTab} set={setSubTab} />
        <TabItem id="eleves" icon={<GraduationCap/>} label="Élèves" act={subTab} set={setSubTab} />
        <TabItem id="profs" icon={<Users/>} label="Profs" act={subTab} set={setSubTab} />
        <TabItem id="parents" icon={<Heart/>} label="Parents" act={subTab} set={setSubTab} />
        <TabItem id="notif" icon={<Bell/>} label="Annonces" act={subTab} set={setSubTab} />
      </div>

      <div className="w-full bg-white dark:bg-slate-900 p-12 md:p-20 rounded-[5rem] shadow-2xl border dark:border-slate-800 relative">
        
        {/* ONGLET CLASSES */}
        {subTab === 'classes' && (
          <div className="space-y-10 animate-in">
             <h2 className="text-4xl font-black italic dark:text-white uppercase tracking-tighter text-center">Structure des Classes</h2>
             <div className="flex gap-4">
                <input className="flex-1 p-6 bg-slate-50 dark:bg-black rounded-[2rem] outline-none font-black dark:text-white text-xl uppercase italic border-2 border-transparent focus:border-blue-600" 
                  placeholder="NOM DE LA CLASSE (EX: 6ÈME A)" value={form.name || ""} onChange={e => setForm({name: e.target.value})} />
                <button onClick={() => handleAction('classe')} className="bg-blue-600 text-white px-14 rounded-3xl font-black italic shadow-xl">CRÉER</button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {classes.map(c => (
                  <div key={c.id} className="p-6 bg-slate-100 dark:bg-black rounded-[2rem] border dark:border-slate-800 text-center font-black dark:text-white uppercase italic text-xs tracking-widest">{c.nom}</div>
                ))}
             </div>
          </div>
        )}

        {/* ONGLET ÉLÈVES */}
        {subTab === 'eleves' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in text-left">
              <h2 className="md:col-span-2 text-4xl font-black italic dark:text-white uppercase text-center mb-6">Registre Étudiant</h2>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] font-bold dark:text-white outline-none italic uppercase" placeholder="Prénom" onChange={e => setForm({...form, fn: e.target.value})}/>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] font-bold dark:text-white outline-none italic uppercase" placeholder="Nom" onChange={e => setForm({...form, ln: e.target.value})}/>
              
              <select className="p-6 bg-slate-50 dark:bg-black border-4 border-transparent focus:border-blue-600 rounded-[2rem] font-black dark:text-white italic uppercase h-[84px]" onChange={e => setForm({...form, classId: e.target.value})}>
                 <option>-- CLASSE --</option>
                 {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>

              <select className="p-6 bg-slate-50 dark:bg-black border-4 border-transparent focus:border-blue-600 rounded-[2rem] font-black dark:text-white italic uppercase h-[84px]" onChange={e => setForm({...form, parentId: e.target.value})}>
                 <option>-- PARENT RÉFÉRENT --</option>
                 {parents.map(p => <option key={p.id} value={p.id}>{p.nom_complet}</option>)}
              </select>

              <button onClick={() => handleAction('eleve')} className="md:col-span-2 py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl shadow-xl uppercase italic tracking-tighter">Initialiser l'identité Cloud</button>
           </div>
        )}

        {/* ONGLET PARENTS */}
        {subTab === 'parents' && (
           <div className="grid grid-cols-1 gap-8 animate-in text-left">
              <h2 className="text-4xl font-black italic dark:text-white uppercase text-center mb-6 tracking-tighter">Registre des Familles</h2>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] font-bold dark:text-white outline-none italic uppercase border-2 border-transparent focus:border-blue-600" placeholder="Nom Complet du Responsable Légal" onChange={e => setForm({...form, name: e.target.value})}/>
              <input className="p-6 bg-slate-50 dark:bg-black rounded-[2rem] font-bold dark:text-white outline-none italic uppercase border-2 border-transparent focus:border-blue-600" placeholder="Téléphone / Mobile" onChange={e => setForm({...form, tel: e.target.value})}/>
              <button onClick={() => handleAction('parent')} className="py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl shadow-xl uppercase italic tracking-tighter">Créer l'Espace Famille</button>
           </div>
        )}

        {/* AFFICHAGE DES RÉSULTATS GÉNÉRÉS */}
        {result && (
          <div className="mt-12 p-12 bg-slate-950 border-4 border-dashed border-green-500 rounded-[4rem] text-center animate-bounce shadow-2xl relative">
            <p className="text-green-500 font-black uppercase text-xs mb-6 tracking-[0.5em] italic animate-pulse tracking-widest underline decoration-green-500">Accès Cloud Certifié</p>
            <p className="font-mono font-black text-4xl text-white tracking-widest mb-4 select-all italic uppercase">{result.id}</p>
            <p className="font-mono text-slate-500 text-xl tracking-widest select-all">{result.pass}</p>
            <CheckCircle size={100} className="absolute top-[-50px] left-[-30px] text-green-500 opacity-20" />
          </div>
        )}

      </div>
    </div>
  );
}

function TabItem({ id, icon, label, act, set }) {
  const isAct = act === id;
  return (
    <button onClick={() => set(id)} className={`flex-1 flex items-center justify-center gap-4 py-5 px-10 rounded-[2rem] transition-all font-black text-[10px] uppercase italic whitespace-nowrap ${isAct ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}