import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Phone, User, Lock, ArrowRight } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ username: '', password: '', email: '', phone: '' });

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full goated-card p-10 rounded-[3rem]">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: `${(step/3)*100}%` }} className="h-full bg-blue-600" />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter">SECURE YOUR PROFILE</h2>
            <p className="text-slate-400 text-sm">Let's personalize your account credentials.</p>
            <div className="space-y-4">
              <div className="relative"><User className="absolute left-4 top-4 text-slate-400" size={20}/><input className="input-field pl-12" placeholder="New Username" onChange={e => setData({...data, username: e.target.value})}/></div>
              <div className="relative"><Lock className="absolute left-4 top-4 text-slate-400" size={20}/><input type="password" className="input-field pl-12" placeholder="New Password" onChange={e => setData({...data, password: e.target.value})}/></div>
            </div>
            <button onClick={nextStep} className="btn-goated w-full">CONTINUE <ArrowRight size={18}/></button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter">RECOVERY DETAILS</h2>
            <p className="text-slate-400 text-sm">In case you forget your GOATED password.</p>
            <div className="space-y-4">
              <div className="relative"><Mail className="absolute left-4 top-4 text-slate-400" size={20}/><input className="input-field pl-12" placeholder="School or Personal Email" onChange={e => setData({...data, email: e.target.value})}/></div>
              <div className="relative"><Phone className="absolute left-4 top-4 text-slate-400" size={20}/><input className="input-field pl-12" placeholder="+221 ..." onChange={e => setData({...data, phone: e.target.value})}/></div>
            </div>
            <button onClick={nextStep} className="btn-goated w-full">FINALIZE SETUP</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white shadow-2xl shadow-green-500/30">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-3xl font-black italic">YOU'RE ALL SET!</h2>
            <p className="text-slate-400">Welcome to the future of your education.</p>
            <button onClick={() => onComplete(data)} className="btn-goated w-full">ENTER DASHBOARD</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}