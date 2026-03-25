import React, { useState } from 'react';
import { Camera, BookOpen } from 'lucide-react';

export default function CahierDeTexte() {
  const [photo, setPhoto] = useState(null);

  const capturePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-12 py-10">
      <h1 className="text-4xl font-black italic dark:text-white uppercase tracking-tighter">Cahier de Texte Digit@l</h1>
      
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 p-10 rounded-[4rem] text-center border dark:border-slate-800 shadow-2xl">
        <div className="mb-10 w-full h-80 border-4 border-dashed rounded-[3rem] border-[#1a5276]/20 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden relative">
          {photo ? (
            <img src={photo} className="w-full h-full object-cover" alt="Scan Capture" />
          ) : (
            <div className="text-slate-400 font-black italic uppercase">Aucun scan disponible</div>
          )}
        </div>

        <label className="inline-flex items-center gap-4 bg-[#1a5276] text-white px-10 py-5 rounded-[2.5rem] font-black shadow-xl shadow-[#1a5276]/20 cursor-pointer hover:scale-[1.05] transition-all">
          <Camera size={24}/> {photo ? 'CHANGER LE SCAN' : 'SCANNER UNE PAGE'}
          <input type="file" capture="environment" accept="image/*" className="hidden" onChange={capturePhoto} />
        </label>
      </div>
    </div>
  );
}