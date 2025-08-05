import type { Database } from '../types/type.db.extended';
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
