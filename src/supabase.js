import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aabgskxsriqynspcpecz.supabase.co'
const supabaseAnonKey = 'sb_publishable_BNb05woTxaJ5-tqSprlOYA_ucPrls1f'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)