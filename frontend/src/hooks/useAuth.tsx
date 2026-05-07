"use client";

 import {
   createContext,
   useContext,
   useState,
   useEffect,
   type ReactNode,
 } from "react";
 import { supabase } from "@/lib/supabase";
 import type { Session, User } from "@supabase/supabase-js";

 // ── Context shape ──
 type AuthContextType = {
   user: User | null;
   session: Session | null;
   loading: boolean;
   signOut: () => Promise<void>;
 };

 // ── Create context ──
 const AuthContext = createContext<AuthContextType>({
   user: null,
   session: null,
   loading: true,
   signOut: async () => {},
 });

 // ── Provider ──
 export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     // ── 1. Check for existing session on mount ──
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       setLoading(false);
     });

     // ── 2. Listen for auth state changes ──
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       (_event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
       }
     );

     return () => subscription.unsubscribe();
   }, []);

   const signOut = async () => {
     await supabase.auth.signOut();
     setUser(null);
     setSession(null);
   };

   return (
     <AuthContext.Provider value={{ user, session, loading, signOut }}>
       {children}
     </AuthContext.Provider>
   );
 }

 // ── Hook ──
 export function useAuth() {
   return useContext(AuthContext);
 }
