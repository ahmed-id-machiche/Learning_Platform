import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://aglmzbnvmlfqrkpzhbih.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbG16Ym52bWxmcXJrcHpoYmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTg3MzIsImV4cCI6MjA1NjkzNDzczMn0.dummy";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
