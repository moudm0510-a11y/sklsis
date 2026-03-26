import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  School, Trash2, RefreshCw, Key, ArrowLeft, GraduationCap, 
  Users, Calendar, Clock, ShieldCheck, Search, pointer 
} from 'lucide-react';

export default function SuperAdmin() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null); 
  const [view, setView] = useState('list'); // list | registry | drilldown
  const [subTab, setSubTab] = useState('classes'); 
  const [schoolName, setSchoolName] = useState("");
  const [drillData, setDrillData] = useState([]); // Pour les données de l'école cliquée

  useEffect(() => { fetchSchools(); }, []);

  // Charger les données quand on entre dans une école spécifique
  useEffect(() => {
    if (selectedSchool) fetchDrillDownData();
  }, [selectedSchool, subTab]);

  async function fetchSchools() {
    const { data } = await supabase.from('ecoles').select('*').order('created_at', { ascending: false });
    setSchools(data || []);
  }

  async function fetchDrillDownData() {
    let table = subTab === 'classes' ? 'classes' : subTab === 'eleves' ? 'eleves' : 'profs';
    const { data } = await supabase.from(table).select('*').eq('ecole_id', selectedSchool.id);
    setDrillData(data || []);
  }

  const handleCreateSchool = async () => {
    if (!schoolName) return;
    const user = `admin${Math.floor(1000 + Math.random() * 9000)}`;
    const pass = Array.from({length: 14}, () => "ABCDE12345FGHIJ"[Math.floor(Math.random()*15)]).join('');
    
    const { error } = await supabase.from('ecoles').insert([{ 
      nom: schoolName.toUpperCase(), admin_user: user, admin_pass: pass 
    }]);

    if (!error) {
      setSchoolName("");
      fetchSchools();
      setView('list');
    }
  };

  const resetSchoolSecrets = async (id) => {
    if (!confirm("Générer de nouveaux accès pour cette école ?")) return;
    const newUser = `admin${Math.floor(1000 + Math.random() * 9000)}`;
    const newPass = Array.from({length: 14}, () => "ZXCVB98765QWERTY"[Math.floor(Math.random()*16)]).join('');
    
    await supabase.from('ecoles').update({ admin_user: newUser, admin_pass: newPass }).eq('id', id);
    fetchSchools();
    alert("ACCÈS RÉINITIALISÉS : " + newUser + " / " + newPass);
  };

  // --- VUE : DRILL-DOWN (DÉTAILS DE L'ÉCOLE) ---
  if (selectedSchool && view === 'drilldown') {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-10 animate-in p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-blue-600 font-black italic uppercase bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-lg hover:gap-4 transition-all">
            <ArrowLeft size={20}/> RETOUR AU REGISTRE
          </button>
          <div className="text-right">
            <h1 className="text-5xl font-black italic dark:text-white uppercase tracking-tighter leading-none">{selectedSchool.nom}</h1>
            <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest italic">Management Global / {subTab}</p>
          </div>
        </div>

        {/* NAVIGATION DRILLDOWN */}
        <div className="flex bg-white/50 dark:bg-slate-900/50 p-2 rounded-[2.5rem] backdrop-blur-xl border dark:border-slate-800 shadow-2xl overflow-x-auto no-scrollbar gap-2">
          <DrillTab id="classes" icon={<GraduationCap/>} label="Classes" act={subTab} set={setSubTab} />
          <DrillTab id="eleves" icon={<Users/>} label="Élèves (Vue Parent)" act={subTab} set={setSubTab} />
          <DrillTab id="profs" icon={<Users/>} label="Professeurs" act={subTab} set={setSubTab} />
          <DrillTab id="planning" icon={<Clock/>} label="Emplois du temps" act={subTab} set={setSubTab} />
        </div>

        {/* AFFICHAGE DES DONNÉES DE L'ÉCOLE */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] shadow-2xl border dark:border-slate-800 min-h-[500px]">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drillData.length === 0 ? (
                <div className="col-span-full text-center py-20 opacity-20 font-black italic uppercase tracking-[0.5em]">Aucune donnée Cloud trouvée</div>
              ) : (
                drillData.map((item, idx) => (
                  <div key={idx} className="p-8 bg-slate-50 dark:bg-[#020617] rounded-[2.5rem] border dark:border-slate-800 flex flex-col justify-between hover:border-blue-600 transition-all group">
                     <h4 className="font-black text-xl dark:text-white uppercase italic">{item.nom || item.prenom + ' ' + item.nom}</h4>
                     <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase">Identifiant interne : {item.id.substring(0,8)}</p>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    );
  }

  // --- VUE : LISTE ET REGISTRE ---
  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 py-10 flex flex-col items-center animate-fade-in">
      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border w-full max-w-md sticky top-28 z-40">
        <button onClick={() => setView('list')} className={`flex-1 py-4 rounded-[1.8rem] font-black uppercase text-xs transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-400'}`}>Toutes les Écoles</button>
        <button onClick={() => setView('registry')} className={`flex-1 py-4 rounded-[1.8rem] font-black uppercase text-xs transition-all ${view === 'registry' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-400'}`}>Nouveau Registre</button>
      </div>

      {view === 'registry' ? (
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 p-16 rounded-[5rem] shadow-2xl border dark:border-slate-800 text-center space-y-12">
          <div className="space-y-2">
            <h2 className="text-5xl font-black italic dark:text-white uppercase tracking-tighter">Initialiser</h2>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Déploiement d'une nouvelle instance SKLSIS</p>
          </div>
          <input className="w-full p-8 bg-slate-50 dark:bg-[#020617] rounded-[2.5rem] outline-none font-black dark:text-white text-3xl text-center border-4 border-transparent focus:border-blue-600 transition-all uppercase italic" 
            placeholder="NOM DE L'INSTITUTION" value={schoolName} onChange={e => setSchoolName(e.target.value)} />
          <button onClick={handleCreateSchool} className="w-full py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all outline-none italic uppercase">
            LANCER LE PROTOCOLE CLOUD
          </button>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 pb-40">
          {schools.map(s => (
            <div key={s.id} onClick={() => { setSelectedSchool(s); setView('drilldown'); }} className="p-10 bg-white dark:bg-slate-900 rounded-[4rem] border-b-[15px] border-blue-600 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] cursor-pointer group relative overflow-hidden transition-all hover:-translate-y-4">
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-20 h-20 bg-blue-50 dark:bg-[#020617] rounded-[2rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                  <School size={40} />
                </div>
                <div className="flex gap-3">
                   <button onClick={(e) => { e.stopPropagation(); resetSchoolSecrets(s.id); }} className="p-4 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-2xl hover:rotate-180 transition-all duration-700 shadow-md" title="Rénitialiser Accès">
                     <RefreshCw size={24}/>
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); if(confirm("Supprimer ?")) supabase.from('ecoles').delete().eq('id', s.id).then(fetchSchools); }} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-md">
                     <Trash2 size={24}/>
                   </button>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-4xl font-black italic dark:text-white uppercase tracking-tighter leading-none mb-6 group-hover:text-blue-600 transition-colors">{s.nom}</h3>
                <div className="p-6 bg-slate-50 dark:bg-black/50 rounded-[2rem] border dark:border-slate-800 backdrop-blur-md">
                   <p className="text-xs font-black text-blue-600 uppercase flex items-center gap-3 mb-2 italic tracking-widest"><Key size={14}/> {s.admin_user}</p>
                   <p className="text-[10px] font-mono text-slate-400 tracking-[0.4em] select-all">{s.admin_pass}</p>
                </div>
              </div>
              <ShieldCheck size={200} className="absolute bottom-[-50px] left-[-50px] opacity-[0.02] dark:opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DrillTab({ id, icon, label, act, set }) {
  const isAct = act === id;
  return (
    <button onClick={() => set(id)} className={`flex-1 flex items-center justify-center gap-3 py-5 px-8 rounded-3xl transition-all font-black text-xs uppercase italic whitespace-nowrap ${isAct ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}