import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://mscnvwehndemutzzcuym.supabase.co";

const supabaseKey = "sb_publishable_IFW4Dggu65oPXgYUWQvp3Q_RodPAP9u";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);