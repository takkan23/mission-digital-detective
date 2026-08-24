/* =========================================================
   SUPABASE CONFIG
   Mission Digital Detective
========================================================= */

const SUPABASE_URL =
  "https://ioipscvitoxbowuacpqu.supabase.co";


const SUPABASE_PUBLISHABLE_KEY ="sb_publishable_8dLwDTXAbWC-IyLtiV62dw_EbAgiGzI";


const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );