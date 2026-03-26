import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Lock, Mail, Smartphone, ArrowRight, Zap } from 'lucide-react';
import { supabase } from '../supabase';

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ id: '', pass: '', email: '', phone: '' });

  const finishOnboarding = async () => {
    if (!form.id || !form.pass) return;
    const { error } = await supabase.from('eleves')
      .update({ 
        identifiant: form.id, 
        mot_de_passe: form.pass,
        email_recup: form.email,
        telephone_recup: form.phone,
        premier_login: false 
      })
      .eq('id', user.id);

    if (!error) onComplete();
    else alert("Erreur d'enregistrement.");
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-6">
      
      {/* PROGRESS BAR G.O.A.T */}
      <div className="w-full max-w-xl mb-12 flex items-center justify-between px-10 relative">
         <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
         <div className="absolute top-1/2 left-10 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700" style={{ width: `${(step-1)*50}%` }}></div>
         {[1, 2, 3].map(i => (
           <div key={i} className={`w-12 h-12 rounded-full flex items-center justify-center font-black relative z-10 transition-all duration-500 ${step >= i ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-white dark:bg-slate-900 text-slate-300'}`}>
              {step > i ? '✓' : i}
           </div>
         ))}
      </div>

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[5rem] p-12 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.1)] border dark:border-slate-800 text-center relative overflow-hidden border-b-[20px] border-blue-600">
        
        {step === 1 && (
          <div className="space-y-8 animate-in">
             <div className="space-y-4">
                <h2 className="text-5xl font-black italic dark:text-white uppercase tracking-tighter">NOUVEL IDENTIFIANT</h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Étape 1 : Personnalisez vos Clés d'Accès</p>
             </div>
             <div className="space-y-4 text-left">
                <div className="space-y-2">
                   <label className="ml-6 text-[10px] font-black text-slate-400 uppercase">Pseudo Unique</label>
                   <input className="w-full p-6 bg-slate-50 dark:bg-black rounded-3xl outline-none font-black dark:text-white text-xl border-2 border-transparent focus:border-blue-600" placeholder="Ex: moussa88" onChange={e => setForm({...form, id: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="ml-6 text-[10px] font-black text-slate-400 uppercase">Nouveau Mot de Passe</label>
                   <input type="password" className="w-full p-6 bg-slate-50 dark:bg-black rounded-3xl outline-none font-black dark:text-white text-xl border-2 border-transparent focus:border-blue-600" placeholder="••••••••" onChange={e => setForm({...form, pass: e.target.value})} />
                </div>
             </div>
             <button onClick={() => setStep(2)} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all hover:gap-8 uppercase italic active:scale-90">
                Étape suivante <ArrowRight />
             </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in">
             <div className="space-y-4">
                <h2 className="text-5xl font-black italic dark:text-white uppercase tracking-tighter">RÉCUPÉRATION</h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Étape 2 : Sécurité en Cas d'Oubli</p>
             </div>
             <div className="space-y-4 text-left">
                <input className="w-full p-6 bg-slate-50 dark:bg-black rounded-3xl outline-none font-black dark:text-white" placeholder="Email de secours" onChange={e => setForm({...form, email: e.target.value})} />
                <input className="w-full p-6 bg-slate-50 dark:bg-black rounded-3xl outline-none font-black dark:text-white" placeholder="Téléphone Responsable" onChange={e => setForm({...form, phone: e.target.value})} />
             </div>
             <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 rounded-3xl font-black dark:text-white uppercase">Retour</button>
                <button onClick={() => setStep(3)} className="flex-[2] py-6 bg-blue-600 text-white rounded-3xl font-black text-xl uppercase italic shadow-xl">Finaliser</button>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in text-center">
             <div className="w-32 h-32 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl rotate-3">
                <ShieldCheck size={64}/>
             </div>
             <div>
                <h2 className="text-5xl font-black italic dark:text-white uppercase tracking-tighter mb-2">PROTOCOLE PRÊT</h2>
                <p className="text-slate-400 font-bold text-xs">Vos identifiants Cloud sont désormais actifs et cryptés.</p>
             </div>
             <button onClick={finishOnboarding} className="w-full py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl shadow-2xl active:scale-90 transition-all uppercase italic tracking-widest flex items-center justify-center gap-4">
               <Zap /> DÉMARRER LA SESSION
             </button>
          </div>
        )}

        <ShieldCheck size={300} className="absolute -left-20 bottom-[-50px] opacity-[0.02] dark:opacity-[0.05] pointer-events-none -rotate-45" />
      </motion.div>
    </div>
  );
}