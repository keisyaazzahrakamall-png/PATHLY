import { createClient } from "@supabase/supabase-js";

// Publishable key memang dirancang untuk dipakai di aplikasi browser.
// Nilai dari .env tetap diprioritaskan agar proyek mudah dipindahkan.
const defaultSupabaseUrl = "https://bolvnsrlwmekjiuhmkqm.supabase.co";
const defaultSupabasePublishableKey =
  "sb_publishable_cUdxaZBuZoh41FTDyh-fCQ_5Jxbh3Nl";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultSupabaseUrl;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || defaultSupabasePublishableKey;

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
