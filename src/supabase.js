import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Sécurité pour éviter le crash si tu oublies le .env
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ SKLSIS : Clés de connexion manquantes. Vérifie ton fichier .env !");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)