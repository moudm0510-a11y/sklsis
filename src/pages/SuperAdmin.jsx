import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { School, Trash2, Key, Lock, RefreshCw, Layers, CheckCircle } from 'lucide-react';

export default function SuperAdmin() {
  const [schools, setSchools] = useState([]);
  const [activeMode, setActiveMode] = useState('list'); 
  const [schoolName, setSchoolName] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => { fetchSchools(); }, []);

  async function fetchSchools() {
    const { data } = await supabase.from('ecoles').select('*').order('created_at', { ascending: false });
    if (data) setSchools(data);
  }

  const handleCreateSchool = async () => {
    if (!schoolName) return;
    
    // GÉNÉRATION CODES PRO
    const adminUser = `admin${Math.floor(1000 + Math.random() * 8999)}`;
    const adminPass = Array.from({length: 14}, () => "A1B2C3D4EFG5H6J7"[Math.floor(Math.random()*16)]).join('');
    
    const { error } = await supabase.from('ecoles').insert([{ 
      nom: schoolName.toUpperCase(), admin_user: adminUser, admin_pass: adminPass 
    }]);

    if (!error) {
      setResult({ user: adminUser, pass: adminPass });
      setSchoolName("");
      fetchSchools();
      setActiveMode('list');
    } else {
      alert("Erreur: " + error.message);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 py-10 animate-fade-in flex flex-col items-center">
      
      {/* SÉLECTEUR HORIZONTAL */}
      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl border dark:border-slate-800 w-full max-w-md sticky top-32 z-50">
         <button onClick={() => setActiveMode('list')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase italic transition-all ${activeMode === 'list' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-400'}`}>Registre</button>
         <button onClick={() => setActiveMode('registry')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase italic transition-all ${activeMode === 'registry' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-400'}`}>Ajouter</button>
      </div>

      {activeMode === 'registry' ? (
        <div className="w-full bg-white dark:bg-slate-900 p-16 rounded-[5rem] shadow-2xl border dark:border-slate-800 text-center space-y-10">
          <h2 className="text-5xl font-black italic dark:text-white uppercase tracking-tighter">Initialiser École Cloud</h2>
          <input className="w-full p-8 bg-slate-50 dark:bg-black rounded-[2.5rem] outline-none font-black dark:text-white text-3xl text-center border-4 border-transparent focus:border-blue-600 transition-all uppercase italic" 
            placeholder="NOM DE L'INSTITUTION" value={schoolName} onChange={e => setSchoolName(e.target.value)} />
          <button onClick={handleCreateSchool} className="w-full py-8 bg-blue-600 hover:bg-blue-700 text-white rounded-[3rem] font-black text-2xl shadow-2xl shadow-blue-500/20 active:scale-90 transition-all italic uppercase">
            Générer l'instance cloud
          </button>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 pb-40">
           {/* BOITE DE RÉSULTAT FLASH (SAVE YOUR PASS) */}
           {result && (
              <div className="col-span-full p-12 bg-slate-950 border-4 border-dashed border-green-500 rounded-[4rem] text-center animate-pulse shadow-2xl relative mb-10">
                <p className="text-green-500 font-black uppercase text-[10px] mb-4 tracking-[0.6em]">IDENTIFIANTS ADMINISTRATEUR GÉNÉRÉS</p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                   <div>
                      <p className="text-slate-400 text-[10px] mb-2 uppercase">Identifiant</p>
                      <p className="font-mono font-black text-4xl text-white select-all">{result.user}</p>
                   </div>
                   <div className="w-px h-20 bg-slate-800 hidden md:block"></div>
                   <div>
                      <p className="text-slate-400 text-[10px] mb-2 uppercase">Mot de Passe Public</p>
                      <p className="font-mono font-black text-4xl text-white select-all">{result.pass}</p>
                   </div>
                </div>
                <button onClick={() => setResult(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><Trash2 size={24}/></button>
              </div>
           )}

           {schools.map(s => (
             <div key={s.id} className="p-10 bg-white dark:bg-slate-900 rounded-[4rem] border-b-[15px] border-blue-600 shadow-2xl relative group transition-all hover:-translate-y-4">
               <h3 className="text-4xl font-black italic dark:text-white uppercase leading-none mb-6 group-hover:text-blue-600 transition-colors">{s.nom}</h3>
               <div className="space-y-3 bg-slate-50 dark:bg-black/50 p-6 rounded-[2.5rem] border dark:border-slate-800">
                  <p className="text-xs font-black text-blue-600 flex items-center gap-3"><Key size={14}/> {s.admin_user}</p>
                  <p className="text-[10px] font-mono text-slate-500 tracking-widest truncate"><Lock size={12} className="inline mr-2"/> {s.admin_pass}</p>
               </div>
               <button onClick={async() => { if(confirm("Supprimer?")) { await supabase.from('ecoles').delete().eq('id', s.id); fetchSchools(); }}} className="absolute top-10 right-10 p-4 bg-red-50 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                  <Trash2 size={24}/>
               </button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}