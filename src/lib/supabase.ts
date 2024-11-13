import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/type.db";

export const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
