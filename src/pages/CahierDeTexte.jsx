import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Camera, FileText, Calendar, Plus, Trash2, Bookmark, UploadCloud, Search } from 'lucide-react';

export default function CahierDeTexte({ user }) {
  const [entries, setEntries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterClass, setFilterClass] = useState("");
  
  // FORMULAIRE
  const [form, setForm] = useState({ matiere: '', desc: '', classId: '', image: null });

  useEffect(() => {
    fetchInitial();
  }, [user]);

  async function fetchInitial() {
    const { data: cls } = await supabase.from('classes').select('*').eq('ecole_id', user.schoolId);
    setClasses(cls || []);
    fetchEntries();
  }

  async function fetchEntries() {
    let query = supabase.from('hub_cahier').select('*, classes(nom)').eq('ecole_id', user.schoolId);
    if (filterClass) query = query.eq('classe_id', filterClass);
    const { data } = await query.order('date_cours', { ascending: false });
    setEntries(data || []);
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('cahiers').upload(fileName, file);

    if (!error) {
      const { data: urlData } = supabase.storage.from('cahiers').getPublicUrl(fileName);
      setForm({ ...form, image: urlData.publicUrl });
    }
    setLoading(false);
  };

  const saveEntry = async () => {
    if (!form.matiere || !form.classId) return;
    setLoading(true);
    const { error } = await supabase.from('hub_cahier').insert([{
      ecole_id: user.schoolId,
      classe_id: form.classId,
      matiere: form.matiere.toUpperCase(),
      description: form.desc,
      image_url: form.image
    }]);

    if (!error) {
       setShowModal(false);
       setForm({ matiere: '', desc: '', classId: '', image: null });
       fetchEntries();
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-10 animate-fade-in flex flex-col items-center">
      
      {/* HEADER CAHIER */}
      <header className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
           <h1 className="text-6xl font-black italic dark:text-white uppercase tracking-tighter leading-none">CAHIER DE TEXTE</h1>
           <div className="flex items-center gap-4">
              <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Archive Numérique Cloud</p>
           </div>
        </div>

        {(user.role === 'admin' || user.role === 'teacher') && (
           <button onClick={() => setShowModal(true)} className="px-10 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl italic shadow-2xl shadow-blue-600/20 flex items-center gap-4 active:scale-90 transition-all uppercase">
             <Camera size={28}/> Nouvelle Capture
           </button>
        )}
      </header>

      {/* FILTRES PAR CLASSE (HORIZONTAL) */}
      <div className="w-full flex items-center gap-4 overflow-x-auto no-scrollbar py-4 px-2">
         <button onClick={() => {setFilterClass(""); fetchEntries();}} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase italic transition-all ${!filterClass ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-400 border dark:border-slate-800'}`}>Toutes</button>
         {classes.map(c => (
           <button key={c.id} onClick={() => {setFilterClass(c.id); fetchEntries();}} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase italic transition-all whitespace-nowrap ${filterClass === c.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-400 border dark:border-slate-800'}`}>
             {c.nom}
           </button>
         ))}
      </div>

      {/* GRILLE DES ENTRÉES */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl border dark:border-slate-800 group hover:-translate-y-4 transition-all duration-500 relative">
             <div className="h-64 bg-slate-100 dark:bg-black relative overflow-hidden">
                {entry.image_url ? (
                  <img src={entry.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Cours Scan" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <FileText size={48} className="opacity-20 mb-2"/>
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-500">Pas d'image</span>
                  </div>
                )}
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl font-black text-[10px] text-blue-600 uppercase italic shadow-lg border dark:border-slate-700">
                   {entry.classes?.nom}
                </div>
             </div>

             <div className="p-10 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                   <span>{entry.matiere}</span>
                   <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(entry.date_cours).toLocaleDateString('fr-FR')}</span>
                </div>
                <h3 className="text-2xl font-black dark:text-white uppercase italic tracking-tighter leading-none">{entry.description || "Résumé du cours du jour"}</h3>
                <div className="h-1 w-12 bg-blue-600 rounded-full group-hover:w-full transition-all duration-700"></div>
             </div>
             
             {user.role === 'admin' && (
               <button onClick={async () => { if(confirm("Supprimer?")) await supabase.from('hub_cahier').delete().eq('id', entry.id); fetchEntries(); }} className="absolute bottom-10 right-10 p-4 bg-red-50 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20}/></button>
             )}
          </div>
        ))}
      </div>

      {/* MODAL DE SCAN (FULL SCREEN G.O.A.T) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 p-12 rounded-[5rem] shadow-2xl border dark:border-slate-800 space-y-10 animate-in">
             <div className="text-center space-y-2">
                <h2 className="text-4xl font-black italic dark:text-white uppercase tracking-tighter">Synchroniser le Cahier</h2>
                <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest italic">Transfert de données vers le Cloud SKLSIS</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="ml-6 text-[10px] font-black text-slate-400 uppercase italic">Discipline Scolaire</label>
                      <input className="w-full p-6 bg-slate-50 dark:bg-black rounded-3xl outline-none font-black dark:text-white uppercase italic border-2 border-transparent focus:border-blue-600" placeholder="Ex: GEOGRAPHIE" onChange={e => setForm({...form, matiere: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="ml-6 text-[10px] font-black text-slate-400 uppercase italic">Classe Cible</label>
                      <select className="w-full p-6 bg-slate-50 dark:bg-black rounded-3xl font-black dark:text-white uppercase italic outline-none border-2 border-transparent focus:border-blue-600 h-[76px]" onChange={e => setForm({...form, classId: e.target.value})}>
                         <option>-- REGISTRE --</option>
                         {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                      </select>
                   </div>
                   <textarea className="w-full p-6 bg-slate-50 dark:bg-black rounded-[2rem] outline-none font-bold dark:text-white min-h-[120px] uppercase italic text-xs" placeholder="Note additionnelle (Optionnel)" onChange={e => setForm({...form, desc: e.target.value})} />
                </div>

                <div className={`h-full min-h-[300px] border-4 border-dashed rounded-[3.5rem] flex flex-col items-center justify-center relative overflow-hidden transition-all ${form.image ? 'border-green-500' : 'border-slate-200 dark:border-slate-800'}`}>
                   {form.image ? (
                     <img src={form.image} className="w-full h-full object-cover" />
                   ) : (
                     <label className="cursor-pointer flex flex-col items-center gap-4 group">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                           <UploadCloud size={32}/>
                        </div>
                        <span className="font-black italic text-xs uppercase text-slate-400">Capturer / Téléverser Capture</span>
                        <input type="file" capture="environment" accept="image/*" className="hidden" onChange={handleUpload}/>
                     </label>
                   )}
                   {loading && <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center font-black animate-pulse">CHARGEMENT...</div>}
                </div>
             </div>

             <div className="flex gap-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 rounded-3xl font-black italic uppercase tracking-widest dark:text-white active:scale-95 transition-all">Annuller</button>
                <button onClick={saveEntry} disabled={loading} className="flex-[2] py-6 bg-blue-600 text-white rounded-3xl font-black italic text-xl shadow-2xl active:scale-95 transition-all uppercase italic">Valider la publication</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}