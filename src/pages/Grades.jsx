import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Plus, Trash2, GraduationCap, FileText, CheckCircle, 
  Filter, ChevronDown, User, Layers 
} from 'lucide-react';

export default function Grades({ user }) {
  const [grades, setGrades] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [form, setForm] = useState({ eleve_id: '', matiere: '', val: '', remark: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGrades();
    if (user.role === 'admin') fetchRegistry();
  }, [user]);

  async function fetchGrades() {
    let query = supabase.from('notes').select('*, eleves(prenom, nom, classe_id(nom))');
    if (user.role === 'admin') query = query.eq('ecole_id', user.schoolId);
    if (user.role === 'student') query = query.eq('eleve_id', user.id);
    
    const { data } = await query.order('date_note', { ascending: false });
    setGrades(data || []);
  }

  async function fetchRegistry() {
    const { data } = await supabase.from('eleves').select('*').eq('ecole_id', user.schoolId);
    setEleves(data || []);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.eleve_id || !form.val) return;
    setLoading(true);

    const { error } = await supabase.from('notes').insert([{
      eleve_id: form.eleve_id,
      matiere: form.matiere.toUpperCase(),
      valeur: parseFloat(form.val),
      appreciation: form.remark,
      ecole_id: user.schoolId
    }]);

    if (!error) {
       setForm({ eleve_id: '', matiere: '', val: '', remark: '' });
       fetchGrades();
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 py-10 animate-fade-in flex flex-col items-center">
      
      <div className="text-center space-y-2">
         <h1 className="text-6xl font-black italic dark:text-white uppercase tracking-tighter">CENTRE DE NOTES</h1>
         <div className="h-2 w-32 bg-blue-600 rounded-full mx-auto" />
      </div>

      {/* INTERFACE ADMIN : AJOUTER NOTE */}
      {user.role === 'admin' && (
        <div className="w-full bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl border dark:border-slate-800 space-y-10">
          <h2 className="text-2xl font-black dark:text-white italic uppercase flex items-center gap-4 px-4">
             <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-2xl"><Plus/></div> 
             Nouvelle Certification de Compétence
          </h2>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-4">Sélectionner Élève</label>
                <select className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black dark:text-white outline-none focus:ring-4 ring-blue-600/10 h-[76px]" onChange={e => setForm({...form, eleve_id: e.target.value})} value={form.eleve_id}>
                   <option value="">REGISTRE</option>
                   {eleves.map(el => <option key={el.id} value={el.id}>{el.prenom} {el.nom}</option>)}
                </select>
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-4">Matière Académique</label>
                <input className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black dark:text-white uppercase italic h-[76px] px-8" placeholder="Ex: MATHS" onChange={e => setForm({...form, matiere: e.target.value})} value={form.matiere}/>
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest ml-4">Évaluation / 20</label>
                <input className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black dark:text-white text-center text-xl h-[76px]" type="number" placeholder="15.0" onChange={e => setForm({...form, val: e.target.value})} value={form.val}/>
             </div>
             <button disabled={loading} className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black italic shadow-xl shadow-blue-500/30 active:scale-95 transition-all text-sm uppercase">
               {loading ? "TRANSFERT..." : "DÉPLOYER"}
             </button>
          </form>
        </div>
      )}

      {/* TABLEAU DES RÉSULTATS HORIZONTAL */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl border dark:border-slate-800 overflow-hidden relative border-b-[15px] border-slate-100 dark:border-[#0f172a]">
        <table className="w-full text-center">
          <thead className="bg-[#020617] text-white italic font-black uppercase text-[10px] h-24 tracking-[0.3em]">
            <tr>
              <th className="p-8">Identité Étudiante</th>
              <th className="p-8">Discipline</th>
              <th className="p-8">Résultat</th>
              <th className="p-8">Date</th>
              {user.role === 'admin' && <th className="p-8">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800 font-bold dark:text-white italic uppercase tracking-tighter">
            {grades.map(g => (
              <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                <td className="p-8 flex items-center justify-center gap-4">
                   <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[10px]"><User size={18}/></div>
                   <div className="text-left">
                      <p className="text-sm dark:text-white">{g.eleves?.prenom} {g.eleves?.nom}</p>
                      <p className="text-[10px] text-blue-600">{g.eleves?.classe_id?.nom}</p>
                   </div>
                </td>
                <td className="p-8 text-blue-700 dark:text-blue-400 font-black">{g.matiere}</td>
                <td className="p-8">
                   <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl ${g.valeur >= 10 ? 'bg-green-500 text-white animate-pulse' : 'bg-red-500 text-white'}`}>
                      {g.valeur}
                   </div>
                </td>
                <td className="p-8 text-slate-400 text-xs">{new Date(g.date_note).toLocaleDateString()}</td>
                {user.role === 'admin' && (
                  <td className="p-8">
                     <button onClick={async () => { if(confirm("Supprimer la note ?")) await supabase.from('notes').delete().eq('id', g.id); fetchGrades(); }} className="p-4 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                        <Trash2 size={20}/>
                     </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {grades.length === 0 && (
          <div className="p-40 text-center space-y-4">
             <FileText size={100} className="mx-auto opacity-10 dark:text-white" />
             <p className="text-slate-400 font-black italic uppercase tracking-[0.5em]">Aucun enregistrement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}