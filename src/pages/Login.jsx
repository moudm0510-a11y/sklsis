import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, LogIn } from 'lucide-react';
import { supabase } from '../supabase';

export default function Login({ onLoginSuccess }) {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 1. VÉRIFICATION SUPER ADMIN (LOCAL)
    if (username === 'superadmin' && password === 'Yassa@guinar1234') {
      onLoginSuccess({ name: 'SUPER ADMIN', role: 'super_admin' });
      return;
    }

    // 2. VÉRIFICATION ADMIN ÉCOLE (CLOUD)
    const { data: school } = await supabase.from('ecoles').select('*').eq('admin_user', username).eq('admin_pass', password).single();
    if (school) {
        onLoginSuccess({ name: school.nom, role: 'admin', schoolId: school.id });
        return;
    }

    // 3. VÉRIFICATION ÉLÈVE (CLOUD)
    const { data: student } = await supabase.from('eleves').select('*').eq('identifiant', username).eq('mot_de_passe', password).single();
    if (student) {
        onLoginSuccess({ name: `${student.prenom} ${student.nom}`, role: 'student', ecoleId: student.ecole_id });
        return;
    }

    setFeedback({ text: 'IDENTIFIANTS INCORRECTS', type: 'error' });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#020617] p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border-b-[12px] border-blue-700 text-center relative overflow-hidden">
        
        <div className="w-20 h-20 bg-blue-700 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-xl rotate-3"><ShieldCheck size={40} /></div>
        <h1 className="text-4xl font-black italic dark:text-white mb-10 tracking-tighter uppercase leading-none">skls<span className="text-blue-700">is</span></h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold text-center dark:text-white border-0"
            placeholder="IDENTIFIANT" onChange={e => setUsername(e.target.value)} />
          
          <div className="relative">
            <input type={showPass ? "text" : "password"} className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold text-center dark:text-white border-0" 
              placeholder="MOT DE PASSE" onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-5 text-slate-400">
              {showPass ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          <div className="h-4">{feedback.text && <p className="text-[10px] font-black text-red-500 animate-bounce uppercase">{feedback.text}</p>}</div>
          <button className="w-full py-5 bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-700/20 active:scale-95 transition-all outline-none italic uppercase">Se Connecter</button>
        </form>
      </motion.div>
    </div>
  );
}