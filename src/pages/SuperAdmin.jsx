import React, { useState, useEffect } from 'react';
import { School, Trash2, GraduationCap, Users, Calendar, Clock, ArrowLeft, Plus } from 'lucide-react';
import { supabase } from '../supabase';

export default function SuperAdmin() {
  const [activeMode, setActiveMode] = useState('registry'); // registry | list
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolName, setSchoolName] = useState("");
  const [lastGen, setLastGen] = useState(null);
  const [subTab, setSubTab] = useState('classes');

  useEffect(() => { fetchSchools(); }, []);

  async function fetchSchools() {
    const { data } = await supabase.from('ecoles').select('*');
    if (data) setSchools(data);
  }

  const handleCreate = async () => {
    if (!schoolName) return;
    const user = `admin${Math.floor(1000 + Math.random() * 9000)}`;
    const pass = Array.from({length: 14}, () => "A1B2C3D45EFG6H7J"[Math.floor(Math.random()*16)]).join('');
    
    // BUG FIX: Correction de la requête insert
    const { error } = await supabase.from('ecoles').insert([{ 
      nom: schoolName.toUpperCase(), 
      admin_user: user, 
      admin_pass: pass 
    }]);

    if (!error) {
      setLastGen({ user, pass });
      setSchoolName("");
      fetchSchools();
    } else {
      alert("Erreur de création : " + error.message);
    }
  };

  // --- VUE DRILL-DOWN (QUAND ON CLIQUE SUR UNE ÉCOLE) ---
  if (selectedSchool) {
    return (
      <div className="w-full max-w-6xl space-y-8 animate-in">
        <button onClick={() => setSelectedSchool(null)} className="flex items-center gap-2 text-blue-600 font-black italic uppercase tracking-tighter hover:gap-4 transition-all">
          <ArrowLeft /> Retour à la liste globale
        </button>
        
        <header className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border-b-8 border-blue-600">
           <h1 className="text-4xl font-black italic uppercase dark:text-white">{selectedSchool.nom}</h1>
           <p className="text-xs text-slate-400 font-bold mt-2 uppercase">Identifiant Admin : {selectedSchool.admin_user}</p>
        </header>

        {/* SUBTABS HORIZONTALES */}
        <div className="flex bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border dark:border-slate-800 gap-2 overflow-x-auto no-scrollbar">
           {['classes', 'profs', 'calendrier', 'planning'].map(t => (
             <button key={t} onClick={() => setSubTab(t)} className={`flex-1 py-4 px-6 rounded-xl font-black text-[10px] uppercase italic transition-all ${subTab === t ? 'bg-blue-600 text-white' : 'text-slate-400 opacity-50'}`}>{t}</button>
           ))}
        </div>

        {/* CONTENU SUBTABS */}
        <div className="bg-white dark:bg-slate-900 p-20 rounded-[3.5rem] shadow-2xl border dark:border-slate-800 text-center relative overflow-hidden">
           <p className="text-slate-400 font-black italic uppercase tracking-[0.5em]">Console {subTab} Active</p>
           <School size={200} className="absolute bottom-[-40px] right-[-40px] opacity-[0.03] -rotate-12"/>
        </div>
      </div>
    );
  }

  // --- VUE PRINCIPALE (REGISTRE OU LISTE) ---
  return (
    <div className="w-full max-w-5xl space-y-12 py-10 flex flex-col items-center">
      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-xl w-full max-w-md border dark:border-slate-800">
        <button onClick={() => setActiveMode('registry')} className={`flex-1 py-4 rounded-3xl font-black text-xs uppercase italic transition-all ${activeMode === 'registry' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Registre</button>
        <button onClick={() => setActiveMode('list')} className={`flex-1 py-4 rounded-3xl font-black text-xs uppercase italic transition-all ${activeMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Écoles</button>
      </div>

      {activeMode === 'registry' ? (
        <div className="w-full bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl border dark:border-slate-800 text-center space-y-10">
          <h2 className="text-4xl font-black italic dark:text-white uppercase tracking-tighter">Initialiser École</h2>
          <input className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl outline-none font-black dark:text-white text-2xl text-center border-2 border-transparent focus:border-blue-600" 
            placeholder="NOM DE L'ÉCOLE" value={schoolName} onChange={e => setSchoolName(e.target.value)} />
          <button onClick={handleCreate} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">DÉPLOYER DANS LE CLOUD</button>
          
          {lastGen && (
            <div className="p-10 bg-slate-950 text-white border-4 border-dashed border-green-500 rounded-[3rem] animate-pulse">
              <p className="text-green-500 font-bold uppercase text-[10px] mb-4">Codes de Connection Cloud</p>
              <p className="font-mono text-3xl tracking-widest">{lastGen.user} / {lastGen.pass}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {schools.map(s => (
            <div key={s.id} onClick={() => setSelectedSchool(s)} className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border-b-[12px] border-blue-600 shadow-2xl cursor-pointer group hover:-translate-y-2 transition-all relative overflow-hidden">
               <h3 className="text-3xl font-black dark:text-white uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">{s.nom}</h3>
               <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{s.admin_user}</p>
               <button onClick={(e) => {e.stopPropagation(); supabase.from('ecoles').delete().eq('id', s.id).then(() => fetchSchools())}} className="absolute top-10 right-10 text-red-500 opacity-20 hover:opacity-100 transition-opacity"><Trash2/></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}