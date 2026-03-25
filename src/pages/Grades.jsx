import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

export default function Grades({ user }) {
  const [grades, setGrades] = useState(() => JSON.parse(localStorage.getItem('grades')) || []);
  const [form, setForm] = useState({ subject: '', student: '', score: '' });

  useEffect(() => { localStorage.setItem('grades', JSON.stringify(grades)); }, [grades]);

  const addGrade = () => {
    if (!form.subject || !form.score) return;
    setGrades([...grades, { ...form, id: Date.now(), date: new Date().toLocaleDateString() }]);
    setForm({ subject: '', student: '', score: '' });
  };

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  return (
    <div className="w-full max-w-5xl space-y-10 py-10 animate-in">
      <h1 className="text-4xl font-black italic dark:text-white uppercase tracking-widest text-center">Registre des Notes</h1>

      {isAdmin && (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 italic font-black">
          <input className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white outline-none" placeholder="ÉLÈVE" onChange={e => setForm({...form, student: e.target.value})} value={form.student} />
          <input className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white outline-none" placeholder="MATIÈRE" onChange={e => setForm({...form, subject: e.target.value})} value={form.subject} />
          <input className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white outline-none" placeholder="NOTE / 20" type="number" onChange={e => setForm({...form, score: e.target.value})} value={form.score} />
          <button onClick={addGrade} className="md:col-span-3 py-4 bg-[#1a5276] text-white rounded-2xl font-black flex items-center justify-center gap-2"><Plus/> AJOUTER LA NOTE</button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border dark:border-slate-800">
        <table className="w-full text-center">
          <thead className="bg-[#1a5276] text-white font-black uppercase text-xs italic">
            <tr><th className="p-6">Matière</th><th className="p-6">Élève</th><th className="p-6">Note</th><th className="p-6">Date</th></tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800 font-bold dark:text-white">
            {grades.length === 0 ? (
              <tr><td colSpan="4" className="p-10 text-slate-400 italic font-medium">Aucune note enregistrée</td></tr>
            ) : (
              grades.map(g => (
                <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-6 uppercase italic text-sm">{g.subject}</td>
                  <td className="p-6 text-slate-400">{g.student}</td>
                  <td className="p-6 italic"><span className={`px-4 py-1 rounded-full ${g.score >= 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{g.score} / 20</span></td>
                  <td className="p-6 text-xs text-slate-300 uppercase">{g.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}