import { createClient } from "@supabase/supabase-js";

// These must be in your .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a single Supabase client instance for the frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);