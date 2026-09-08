import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Trūksta Supabase nustatymų. Patikrinkite .env arba .env.local failą.',
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
