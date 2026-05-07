import { supabase } from "./supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function apiGet(path: string) {
  // 1. Get the current supabase session
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("No access token found");
  }

  // 2. Make the request with the bearer token
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  // 3. Handle errors
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  
  // 4. Return the JSON data
  return res.json();
}

