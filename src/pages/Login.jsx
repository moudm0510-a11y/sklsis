import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, Lock, User } from 'lucide-react';
import { supabase } from '../supabase';

export default function Login({ onLoginSuccess }) {
  const [showPass, setShowPass] = useState(false);
  const [ident, setIdent] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. SUPER ADMIN (Identifiants fixes demandés)
    if (ident === 'superadmin' && pass === 'Yassa@guinar1234') {
      onLoginSuccess({ name: 'SUPER ADMIN', role: 'super_admin' });
      return;
    }

    try {
      // 2. TENTER CONNEXION ADMIN ÉCOLE
      const { data: school, error: sErr } = await supabase.from('ecoles').select('*').eq('admin_user', ident).eq('admin_pass', pass).single();
      if (school) {
        onLoginSuccess({ name: school.nom, role: 'admin', schoolId: school.id });
        return;
      }

      // 3. TENTER CONNEXION ÉLÈVE
      const { data: student, error: stErr } = await supabase.from('eleves').select('*').eq('identifiant', ident).eq('mot_de_passe', pass).single();
      if (student) {
        onLoginSuccess({ name: `${student.prenom} ${student.nom}`, role: 'student', id: student.id, schoolId: student.ecole_id });
        return;
      }

      setFeedback({ text: 'IDENTIFIANTS INCORRECTS', type: 'error' });
    } catch (err) {
      setFeedback({ text: 'ERREUR DE RÉSEAU CLOUD', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#020617] p-4 transition-colors duration-500">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 shadow-2xl border-b-[15px] border-blue-700 text-center relative overflow-hidden">
        
        <div className="w-24 h-24 bg-blue-700 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white shadow-2xl rotate-3 animate-pulse">
          <ShieldCheck size={48} />
        </div>
        
        <h1 className="text-5xl font-black italic dark:text-white mb-2 uppercase tracking-tighter">SKLSIS</h1>
        <p className="text-slate-400 font-bold text-[10px] tracking-[0.4em] mb-10 uppercase italic">Protocole de Sécurité V.4</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <User className="absolute left-5 top-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20}/>
            <input className="w-full p-5 pl-14 bg-slate-50 dark:bg-slate-800 rounded-3xl outline-none font-bold dark:text-white border-2 border-transparent focus:border-blue-600/20"
              placeholder="Identifiant" onChange={e => setIdent(e.target.value)} required />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-5 top-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20}/>
            <input type={showPass ? "text" : "password"} className="w-full p-5 pl-14 bg-slate-50 dark:bg-slate-800 rounded-3xl outline-none font-bold dark:text-white border-2 border-transparent focus:border-blue-600/20" 
              placeholder="Mot de passe" onChange={e => setPass(e.target.value)} required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-5 text-slate-400 hover:text-blue-600">
              {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          <div className="h-6 flex justify-center items-center">
            {feedback.text && <p className="text-[10px] font-black text-red-500 animate-bounce uppercase">{feedback.text}</p>}
          </div>

          <button disabled={loading} className="w-full py-6 bg-blue-700 text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all uppercase italic disabled:opacity-50">
            {loading ? "VÉRIFICATION..." : "DÉVERROUILLER"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}