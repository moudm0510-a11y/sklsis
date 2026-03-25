import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Layers, UserPlus, BookOpen, Clock } from 'lucide-react';

export default function AdminPanel() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [studentForm, setStudentForm] = useState({ fn: '', ln: '', classId: '', birth: '', loc: '' });
  const [genResult, setGenResult] = useState(null);

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('*');
    if (data) setClasses(data);
  };

  const createClass = async () => {
    if (!className) return;
    await supabase.from('classes').insert([{ nom: className.toUpperCase() }]);
    setClassName("");
    fetchClasses();
  };

  const createStudent = async () => {
    if (!studentForm.classId || !studentForm.fn) return;
    const user = `${studentForm.fn[0]}${studentForm.ln}`.toLowerCase() + Math.floor(Math.random()*99);
    const pass = Array.from({length: 14}, () => "12345ABCDE"[Math.floor(Math.random()*10)]).join('');
    
    const { error } = await supabase.from('eleves').insert([{
      prenom: studentForm.fn, 
      nom: studentForm.ln.toUpperCase(), 
      classe: studentForm.classId, 
      identifiant: user, 
      mot_de_passe: pass,
      date_naissance: studentForm.birth,
      lieu_naissance: studentForm.loc
    }]);

    if (!error) setGenResult({ user, pass });
  };

  return (
    <div className="w-full max-w-5xl space-y-12 animate-in py-10">
      
      {/* 1. SECTION CLASSES */}
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl border dark:border-slate-800">
        <h2 className="text-2xl font-black italic dark:text-white uppercase mb-8 flex items-center gap-4"><Layers className="text-blue-600"/> 1. Initialisation des Classes</h2>
        <div className="flex gap-4 mb-6">
          <input className="flex-1 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white uppercase italic" placeholder="EX: 6ÈME A" value={className} onChange={e => setClassName(e.target.value)} />
          <button onClick={createClass} className="bg-blue-600 text-white px-10 rounded-2xl font-black shadow-lg">AJOUTER</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {classes.map(c => <span key={c.id} className="px-4 py-2 bg-blue-50 dark:bg-slate-800 text-blue-600 font-black rounded-lg text-[10px] uppercase italic border dark:border-slate-700">{c.nom}</span>)}
        </div>
      </div>

      {/* 2. SECTION ÉLÈVES */}
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl border dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
        <h2 className="md:col-span-2 text-2xl font-black italic dark:text-white uppercase mb-4 flex items-center gap-4"><UserPlus className="text-blue-600"/> 2. Registre des Élèves</h2>
        <input className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white uppercase italic" placeholder="Prénom" onChange={e => setStudentForm({...studentForm, fn: e.target.value})}/>
        <input className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white uppercase italic" placeholder="Nom" onChange={e => setStudentForm({...studentForm, ln: e.target.value})}/>
        <input type="date" className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-slate-400 uppercase text-xs" onChange={e => setStudentForm({...studentForm, birth: e.target.value})}/>
        <input className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white uppercase italic" placeholder="Lieu de naissance" onChange={e => setStudentForm({...studentForm, loc: e.target.value})}/>
        
        <select className="md:col-span-2 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white uppercase italic outline-none" onChange={e => setStudentForm({...studentForm, classId: e.target.value})}>
          <option>-- Sélectionner la Classe --</option>
          {classes.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
        </select>

        <button onClick={createStudent} className="md:col-span-2 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl uppercase italic shadow-xl">Générer Identifiants Cloud</button>

        {genResult && (
          <div className="md:col-span-2 p-10 bg-slate-950 border-4 border-dashed border-blue-600 rounded-[3rem] text-center animate-pulse">
            <p className="font-mono text-2xl text-white tracking-widest uppercase">{genResult.user} / {genResult.pass}</p>
          </div>
        )}
      </div>
    </div>
  );
}